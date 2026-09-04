import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { RouteScrollManager } from '@/components/route-scroll-manager';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'AI Career Scout',
  description: 'AI-powered job matching, Career Passport, CV tailoring, and application tracking for African job seekers.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>
        <RouteScrollManager />
        {children}
      </body>
    </html>
  );
}
