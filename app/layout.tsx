import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '🏆 Quiniela Mundialista 2026 - Millicom',
  description: 'Plataforma de quiniela del mundial para colaboradores de Millicom. Compite, gana y sé el líder.',
  keywords: ['quiniela', 'mundial', 'millicom', '2026', 'gamificación'],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Quiniela Mundialista 2026',
    description: 'Compite con tus colegas de Millicom',
    type: 'website',
    url: 'https://prodemundialista.vercel.app',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#001D4A" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  )
}
