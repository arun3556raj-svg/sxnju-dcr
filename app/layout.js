import { Syne, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Sxnju DCR — Filmmaker · Hyderabad',
  description:
    'Sxnju DCR — Cinematic filmmaker in Hyderabad. Car deliveries, housewarmings, weddings, festivals, birthdays, events and reels. Book a shoot today.',
};

export const viewport = {
  themeColor: '#050505',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
