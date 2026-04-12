'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface CompetitionColors {
  primaryColor: string
  secondaryColor: string
}

const DEFAULT: CompetitionColors = {
  primaryColor: '',
  secondaryColor: '',
}

const CompetitionColorsContext = createContext<CompetitionColors>(DEFAULT)

export function CompetitionColorsProvider({
  primaryColor,
  secondaryColor,
  children,
}: CompetitionColors & { children: ReactNode }) {
  return (
    <CompetitionColorsContext.Provider value={{ primaryColor, secondaryColor }}>
      {children}
    </CompetitionColorsContext.Provider>
  )
}

export function useCompetitionColors(): CompetitionColors {
  return useContext(CompetitionColorsContext)
}

/** Returns effective primary color: global (from root) wins, component prop is fallback. */
export function usePrimaryColor(propColor?: string): string {
  const { primaryColor } = useCompetitionColors()
  return primaryColor || propColor || ''
}

/** Returns the color to use for tints: secondaryColor if set, otherwise primaryColor. */
export function useTintColor(propColor?: string): string {
  const { primaryColor, secondaryColor } = useCompetitionColors()
  return secondaryColor || primaryColor || propColor || ''
}
