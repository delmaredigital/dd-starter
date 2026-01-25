'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

interface FooterClientProps {
  data?: Footer
}

export const FooterClient: React.FC<FooterClientProps> = ({ data: initialData }) => {
  const [data, setData] = useState<Footer | null>(initialData || null)

  // Fetch data client-side if not provided (e.g., in Puck editor iframe)
  useEffect(() => {
    if (!initialData) {
      fetch('/api/globals/footer')
        .then((res) => res.json())
        .then((fetchedData) => setData(fetchedData))
        .catch((err) => console.error('Failed to fetch footer data:', err))
    }
  }, [initialData])

  if (!data) {
    return null
  }

  const navItems = data?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
