'use client'
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#001D4A] text-white">
      <h1 className="text-5xl font-bold mb-8">Quiniela Mundialista 2026</h1>
      <p className="mb-8 text-xl">Bienvenido, colaborador Millicom.</p>
      <Link href="/login" className="bg-[#00A3E0] px-8 py-3 rounded-full font-bold hover:bg-[#0089C1] transition">
        Ingresar a mi Quiniela
      </Link>
    </div>
  )
}