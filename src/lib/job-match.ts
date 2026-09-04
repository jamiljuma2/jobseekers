type CareerProfile = {
  headline?: string | null;
  summary?: string | null;
  target_roles?: string[] | null;
  target_locations?: string[] | null;
  employment_preferences?: Record<string, unknown> | null;
  skills?: Array<{ name?: string | null } | string>;
  experiences?: Array<{ title?: string | null; description?: string | null; achievements?: string[] | null }>;
  education?: Array<{ degree?: string | null; field_of_study?: string | null; institution?: string | null }>;
  certifications?: Array<{ name?: string | null; issuer?: string | null }>;
};

type JobRecord = {
  id: string;
  title?: string | null;
  location?: string | null;
  remote_type?: string | null;
  employment_type?: string | null;
  industry?: string | null;
  description?: string | null;
  requirements?: unknown;
  responsibilities?: unknown;
  salary_min?: number | null;
  salary_max?: number | null;
};

type MatchBreakdown = {
  match_score: number;
  breakdown: {
    skills: number;
    experience: number;
    titleSimilarity: number;
    education: number;
    location: number;
    preference: number;
    salary: number;
  };
  strengths: string[];
  gaps: string[];
  recommendations: string[];
};

const stopWords = new Set(['and', 'or', 'the', 'a', 'an', 'to', 'of', 'for', 'with', 'in', 'on', 'by', 'from', 'is', 'are', 'as', 'at', 'be', 'this', 'that', 'your']);

function toText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => toText(item)).filter(Boolean).join(' ');
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).map((item) => toText(item)).filter(Boolean).join(' ');
  }

  return '';
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function tokens(value: unknown): string[] {
  return normalizeText(toText(value))
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function uniqueTokens(values: Array<unknown>): string[] {
  return Array.from(new Set(values.flatMap((value) => tokens(value))));
}

function overlapScore(left: Array<unknown>, right: Array<unknown>, maxScore: number) {
  const leftTokens = new Set(uniqueTokens(left));
  const rightTokens = new Set(uniqueTokens(right));
  let matches = 0;

  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) {
      matches += 1;
    }
  });

  if (!leftTokens.size || !rightTokens.size) {
    return 0;
  }

  return Math.round(Math.min(maxScore, (matches / Math.max(leftTokens.size, rightTokens.size)) * maxScore));
}

function pickSkills(profile: CareerProfile) {
  return (profile.skills ?? []).map((skill) => (typeof skill === 'string' ? skill : skill.name ?? '')).filter(Boolean);
}

export function calculateJobMatch(profile: CareerProfile, job: JobRecord): MatchBreakdown {
  const profileSkills = pickSkills(profile);
  const profileRoles = profile.target_roles ?? [];
  const profileLocations = profile.target_locations ?? [];
  const preferences = (profile.employment_preferences ?? {}) as Record<string, unknown>;
  const jobText = [job.title, job.location, job.employment_type, job.industry, job.description, job.requirements, job.responsibilities];

  const skillsScore = overlapScore(profileSkills, jobText, 35);
  const experienceScore = overlapScore(
    (profile.experiences ?? []).map((experience) => [experience.title, experience.description, experience.achievements?.join(' ') ?? ''].join(' ')),
    jobText,
    20
  );
  const titleSimilarityScore = overlapScore([...profileRoles, profile.headline ?? '', profile.summary ?? ''], [job.title ?? ''], 15);
  const educationText = [
    ...(profile.education ?? []).map((item) => [item.degree, item.field_of_study, item.institution].join(' ')),
    ...(profile.certifications ?? []).map((item) => [item.name, item.issuer].join(' '))
  ];
  const educationScore = overlapScore(educationText, jobText, 10);

  const normalizedJobLocation = normalizeText(job.location ?? '');
  const normalizedRemote = normalizeText(job.remote_type ?? '');
  const locationMatches = profileLocations.some((location) => {
    const normalizedLocation = normalizeText(location);
    return normalizedLocation && (normalizedJobLocation.includes(normalizedLocation) || normalizedLocation.includes(normalizedJobLocation));
  });
  const locationScore = locationMatches || normalizedRemote.includes('remote') ? 10 : 0;

  const desiredWorkType = normalizeText(String(preferences.workType ?? preferences.work_type ?? preferences.employmentType ?? preferences.employment_type ?? ''));
  const jobWorkType = normalizeText(job.employment_type ?? '');
  const remotePreference = normalizeText(String(preferences.remotePreference ?? preferences.remote_preference ?? preferences.remoteOnly ?? preferences.remote_only ?? ''));
  const preferenceScore = (desiredWorkType && jobWorkType.includes(desiredWorkType)) || (remotePreference && normalizedRemote.includes(remotePreference)) ? 5 : 0;

  const expectedSalary = Number(preferences.expectedSalary ?? preferences.expected_salary ?? 0);
  const salaryScore = expectedSalary > 0 && job.salary_max ? (expectedSalary <= job.salary_max ? 5 : 0) : 0;

  const matchScore = Math.max(0, Math.min(100, skillsScore + experienceScore + titleSimilarityScore + educationScore + locationScore + preferenceScore + salaryScore));

  return {
    match_score: matchScore,
    breakdown: {
      skills: skillsScore,
      experience: experienceScore,
      titleSimilarity: titleSimilarityScore,
      education: educationScore,
      location: locationScore,
      preference: preferenceScore,
      salary: salaryScore
    },
    strengths: [
      skillsScore >= 20 ? 'Your profile skills overlap with the role.' : '',
      experienceScore >= 10 ? 'Your experience signals relevant delivery in similar work.' : '',
      locationScore >= 10 ? 'Your location or remote preference matches the role.' : ''
    ].filter(Boolean),
    gaps: [
      skillsScore < 15 ? 'Add more role-specific skills to your Career Passport.' : '',
      experienceScore < 10 ? 'Strengthen quantified experience bullets for this role.' : '',
      educationScore < 5 ? 'Add certifications or education details that support the job requirements.' : ''
    ].filter(Boolean),
    recommendations: [
      titleSimilarityScore < 8 ? 'Align your professional summary with the job title and core responsibilities.' : '',
      skillsScore < 20 ? 'Tailor your CV with the most relevant keywords from the posting.' : '',
      locationScore === 0 && normalizedRemote.includes('remote') ? 'Mark your remote preference clearly if you want global opportunities.' : ''
    ].filter(Boolean)
  };
}
