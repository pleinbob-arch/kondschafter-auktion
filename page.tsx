import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'Kondschafter Auction',
  description: 'Auction page for Kondschafter by André Scholtes at the Grevenmacher Wine Festival',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lb">
      <body>{children}</body>
    </html>
  )
}
