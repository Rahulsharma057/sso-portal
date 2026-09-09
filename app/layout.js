import Providers from "./providers";

export const metadata = {
  title: "Sleepwell Foundation — Portal",
  description: "Single sign-on portal for Exam ERP and Task/Report Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
