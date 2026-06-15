import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import GlobalBackground from '@/components/GlobalBackground';

export const metadata: Metadata = {
  title: 'VoltStore | Premium Tech & Peripherals Store',
  description: 'Shop the finest selection of mechanical keyboards, ergonomic mouse devices, spatial headphones, and premium desk setups at VoltStore.',
  keywords: 'e-commerce, mechanical keyboard, desk setup, tech store, gaming mouse, headphones',
  authors: [{ name: 'VoltStore Team' }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Fixed LaserFlow WebGL background — sits behind everything */}
        <GlobalBackground />

        {/* Page content stacks above the global background */}
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <footer className="footer">
              <div className="container">
                <p>&copy; {new Date().getFullYear()} VoltStore. All rights reserved. Designed for elite developers and enthusiasts.</p>
              </div>
            </footer>
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
