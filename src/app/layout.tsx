import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EDUHUB - AI Powered Exam Preparation | UPSC NEET JEE NDA SSC',
  description: 'India\'s smartest exam prep platform. Unlimited AI-generated questions for UPSC, NEET, JEE, NDA, SSC. Personal AI teacher, mock tests, battle mode. Free forever.',
  keywords: 'UPSC preparation, NEET preparation, JEE preparation, NDA preparation, SSC preparation, AI exam prep, mock test, free exam preparation India, online study',
  authors: [{ name: 'EDUHUB' }],
  openGraph: {
    title: 'EDUHUB - AI Powered Exam Preparation',
    description: 'Unlimited AI questions for UPSC, NEET, JEE, NDA, SSC. Free forever.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'EDUHUB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EDUHUB - AI Powered Exam Preparation',
    description: 'Unlimited AI questions for UPSC, NEET, JEE, NDA, SSC. Free forever.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
