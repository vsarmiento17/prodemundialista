'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

type Lang = 'ES' | 'EN'

export const dict = {
  ES: { 
    title: 'Quiniela Mundialista', matches: 'Partidos', dashboard: 'Líderes', logout: 'Salir', pts: 'pts',
    matchesTitle: 'Partidos y Pronósticos', loading: 'Cargando partidos...', closed: 'Cerrado', save: 'Guardar', saving: '...',
    myPoints: 'Mi Puntuación Actual', errorIncomplete: 'Debes ingresar ambos marcadores', errorClosed: 'El pronóstico está cerrado', successSave: 'Pronóstico guardado exitosamente', realScore: 'Marcador Real'
  },
  EN: { 
    title: 'World Cup Pool', matches: 'Matches', dashboard: 'Leaderboard', logout: 'Logout', pts: 'pts',
    matchesTitle: 'Matches & Predictions', loading: 'Loading matches...', closed: 'Closed', save: 'Save', saving: '...',
    myPoints: 'My Current Score', errorIncomplete: 'You must enter both scores', errorClosed: 'Predictions are closed for this match', successSave: 'Prediction saved successfully', realScore: 'Real Score'
  }
}

interface LangContextProps { lang: Lang; setLang: (l: Lang) => void; t: typeof dict.ES }

const LanguageContext = createContext<LangContextProps | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>('ES')

  useEffect(() => {
    const saved = localStorage.getItem('app_lang') as Lang
    if (saved) setLang(saved)
  }, [])

  const handleSetLang = (l: Lang) => {
    setLang(l)
    localStorage.setItem('app_lang', l)
  }

  return <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t: dict[lang] }}>{children}</LanguageContext.Provider>
}

export const useLang = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLang debe usarse dentro de LanguageProvider")
  return context
}