import './globals.css';

export const metadata = {
  title: 'Internal HR CRM',
  description: 'Attendance, leave management, events, and employee operations dashboard.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
