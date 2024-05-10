import { Inter } from 'next/font/google';

import { Header } from '@/shared/components/Header/header.component';

import '@/shared/styles/globals.scss';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Range Input | MCA',
  description:
    'Custom range input component without input html tags. Made for a technical interview for MCA Spain by Sergio Cerdá Hervás.',
};

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
