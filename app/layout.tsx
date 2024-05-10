import { Inter } from 'next/font/google';

import { Header } from '@/shared/components/Header/header.component';

import '@/shared/styles/globals.scss';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Header />

        {children}
      </body>
    </html>
  );
}
