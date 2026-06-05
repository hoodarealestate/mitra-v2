import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mitra — Canadian Hindu Community',
  description: 'Your Vedic friend & guide. Connect, certify, and thrive with the Dharmic community across Canada.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=Noto+Serif+Devanagari:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
