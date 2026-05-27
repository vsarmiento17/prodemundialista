'use client'

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-3 font-semibold transition-all border-b-4 ${
            activeTab === tab
              ? 'border-[#00A3E0] text-[#00A3E0]'
              : 'border-transparent text-gray-600 hover:text-[#001D4A]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
