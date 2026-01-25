'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'

import { useTheme, type Theme } from '..'

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const onThemeChange = (value: string) => {
    setTheme(value as Theme)
  }

  return (
    <Select onValueChange={onThemeChange} value={theme}>
      <SelectTrigger
        aria-label="Select a theme"
        className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none"
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="system">Auto</SelectItem>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  )
}
