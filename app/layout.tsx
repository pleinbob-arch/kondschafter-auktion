import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Kondschafter Auktioun',
  description: '76. Gréiwemaacher Drauwen- A Wäifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="lb">
      <body style={{
        margin: 0,
        padding: 0
      }}>
        {children}

        <Analytics />
      </body>
    </html>
  )
}
