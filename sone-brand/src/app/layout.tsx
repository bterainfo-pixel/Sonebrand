'use client';
import './globals.css';
import localFont from 'next/font/local';
import { Poppins, Montserrat } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


import { usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import { StoreProvider, useStore } from '@/context/StoreContext';

const audex = localFont({
  src: '../../public/Audex.ttf',
  variable: '--font-display',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const montserrat = Montserrat({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <head>
        <title>SONE BRAND</title>
        <meta name="description" content="Sone Brand - Mongolian Streetwear Store" />
        <meta name="google-site-verification" content="FSW9hOW_If8MHkAnLw3RbaAT4e7TMoi1dmXRt3TMes4" />
        <link rel="icon" href="/sonelogo.jpg" type="image/jpeg" />
      </head>
      <body className={`${audex.variable} ${poppins.variable} ${montserrat.variable} antialiased`}>
        <StoreProvider>
          <CartProvider>
            <RootContent>{children}</RootContent>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

function RootContent({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useStore();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (!isLoaded) return null;

  return (
    <>


      {!isAdmin && <Navbar />}
      <main style={{ paddingTop: isAdmin ? '0' : '90px' }}>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
