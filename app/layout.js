import './globals.css';

export const metadata = {
  title: 'Propkee Onboarding Portal',
  description: 'Internal onboarding knowledge portal for Propkee teams.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
