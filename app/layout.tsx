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


import Link from 'next/link'
import { ToastProvider } from './components/ToastProvider'

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
      <body className="min-h-full flex flex-col bg-gray-50">
        <ToastProvider>
          <nav className="w-full bg-[#001D4A] text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6 items-center">
              <Link href="/dashboard" className="font-bold text-lg hover:text-[#00A3E0] transition">🏆 Dashboard</Link>
              <Link href="/matches" className="font-bold text-lg hover:text-[#00A3E0] transition">⚽ Partidos & Pronósticos</Link>
            </div>
          </nav>
          <main className="flex-1">{children}</main>
        </ToastProvider>
      </body>
    </html>
  )
}
