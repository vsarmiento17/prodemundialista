'use client'

import Link from 'next/link'
import { Trophy, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001D4A] via-[#0A2E6E] to-[#001D4A] text-white">
      {/* Navigation */}
      <nav className="px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">🏆 MILLICOM</h1>
        <Link href="/login" className="text-[#00A3E0] hover:underline">
          Inicia Sesión
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-20 text-center">
        <div className="mb-6">
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            ⚽ Quiniela Mundialista <span className="text-[#00A3E0]">2026</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Compite con tus colegas de Millicom. Haz tus pronósticos, gana puntos y <br />
            <span className="text-[#00A3E0] font-bold">sé el campeón global.</span>
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/login"
          className="inline-block bg-gradient-to-r from-[#00A3E0] to-[#0089C1] hover:from-[#0089C1] hover:to-[#006FA0] text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transform transition hover:scale-105"
        >
          🚀 Únete Ahora
        </Link>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-[#00A3E0]/30">
            <Trophy className="w-12 h-12 text-[#00A3E0] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Compite Globalmente</h3>
            <p className="text-gray-300">
              Sé el líder del ranking mundial y gana premios especiales.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-[#00A3E0]/30">
            <Users className="w-12 h-12 text-[#00FF00] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Vistas Temporales</h3>
            <p className="text-gray-300">
              Compite por semana, mes o día. Cada período ofrece nuevas oportunidades.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-[#00A3E0]/30">
            <Zap className="w-12 h-12 text-[#FF00FF] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Predicciones Rápidas</h3>
            <p className="text-gray-300">
              Haz tus pronósticos hasta 24 horas antes de cada partido.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-8 py-10 mt-10 border-t border-[#00A3E0]/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-[#00A3E0] mb-2">📋 Requisitos</h4>
            <p className="text-sm text-gray-300">
              Solo colaboradores de Millicom con correo @millicom.com pueden participar.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#00A3E0] mb-2">🎯 Sistema de Puntos</h4>
            <p className="text-sm text-gray-300">
              Gana puntos acertando en los resultados de los partidos del mundial.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#00A3E0] mb-2">🏅 Premios</h4>
            <p className="text-sm text-gray-300">
              Los ganadores recibirán reconocimiento y premios especiales.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}