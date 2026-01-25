'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data?: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data: initialData }) => {
  const [data, setData] = useState<Header | null>(initialData || null)
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  // Fetch data client-side if not provided (e.g., in Puck editor iframe)
  useEffect(() => {
    if (!initialData) {
      fetch('/api/globals/header')
        .then((res) => res.json())
        .then((fetchedData) => setData(fetchedData))
        .catch((err) => console.error('Failed to fetch header data:', err))
    }
  }, [initialData])

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  if (!data) {
    return null
  }

  return (
    <header className={`container relative z-20 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="py-8 flex justify-between">
        <Link href="/">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
