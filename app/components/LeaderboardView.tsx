'use client'

import { Award } from 'lucide-react'

interface Leader {
  id: string
  email: string
  display_name?: string
  points: number
}

export function LeaderboardView({ leaders, title }: { leaders: Leader[]; title: string }) {
  const getMedalIcon = (position: number) => {
    if (position === 1) return '🥇'
    if (position === 2) return '🥈'
    if (position === 3) return '🥉'
    return position
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#001D4A] to-[#00A3E0] p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {title}
          {leaders && leaders.length > 0 && (
            <span className="ml-4 flex items-center gap-1 bg-[#FFD700] text-[#001D4A] px-3 py-1 rounded-full font-bold animate-pulse-slow">
              🥇 Líder actual: {leaders[0].display_name || leaders[0].email.split('@')[0]}
            </span>
          )}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-[#00A3E0]">
              <th className="p-4 font-bold text-[#001D4A]">Pos.</th>
              <th className="p-4 font-bold text-[#001D4A]">Colaborador</th>
              <th className="p-4 font-bold text-[#001D4A] text-right">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {leaders && leaders.length > 0 ? (
              leaders.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b transition-colors ${
                    index === 0 ? 'bg-yellow-100' : index < 3 ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="p-4 text-center font-bold text-2xl">
                    {getMedalIcon(index + 1)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#001D4A]">{user.display_name || user.email.split('@')[0]}</p>
                      {index === 0 && (
                        <span className="bg-[#FFD700] text-[#001D4A] px-2 py-1 rounded-full text-xs font-bold ml-2">Líder</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-block bg-[#00A3E0] text-white px-4 py-2 rounded-full font-bold">
                      {user.points || 0}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No hay datos aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
