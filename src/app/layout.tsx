import './globals.scss';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ImConv',
  description:
    'Convert your image to efficient webp format for faster performance',
  openGraph: {
    title: 'Conver Image to Webp',
    type: 'website',
    siteName: 'ImConv',
    description:
      'Convert your image to efficient webp format for faster performance',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
