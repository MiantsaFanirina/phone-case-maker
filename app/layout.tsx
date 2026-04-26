import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'iPhone Case Maker | Custom Phone Case Designer',
  description: 'Upload your image and apply it to a phone case in real-time 3D. Export PNG or STL for 3D printing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}