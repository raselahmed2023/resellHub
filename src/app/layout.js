import "./globals.css";

export const metadata = {
  title: "ReSell Hub",
  description: "Second-hand marketplace platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}