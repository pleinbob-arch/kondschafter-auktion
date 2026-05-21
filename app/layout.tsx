export const metadata = {
  title: "Kondschafter Auktion",
  description: "Online Auktion Weinfest Grevenmacher",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lb">
      <body>{children}</body>
    </html>
  );
}
