'use client'
import type { RefObject } from 'react'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

interface Props {
  external?: boolean
  newTab?: boolean
  scroll?: boolean
}

function useClickableCard<T extends HTMLElement>({
  external = false,
  newTab = false,
  scroll = true,
}: Props): {
  cardRef: RefObject<T | null>
  linkRef: RefObject<HTMLAnchorElement | null>
} {
  const router = useRouter()
  const cardRef = useRef<T>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const timeDown = useRef<number>(0)
  const hasActiveParent = useRef<boolean>(false)
  const pressedButton = useRef<number>(0)

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.target) {
      const target = e.target as Element

      const timeNow = +new Date()
      const parent = target?.closest('a')

      pressedButton.current = e.button

      if (!parent) {
        hasActiveParent.current = false
        timeDown.current = timeNow
      } else {
        hasActiveParent.current = true
      }
    }
  }, [])

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (linkRef.current?.href) {
        const timeNow = +new Date()
        const difference = timeNow - timeDown.current

        if (linkRef.current?.href && difference <= 250) {
          if (!hasActiveParent.current && pressedButton.current === 0 && !e.ctrlKey) {
            if (external) {
              const target = newTab ? '_blank' : '_self'
              window.open(linkRef.current.href, target)
            } else {
              router.push(linkRef.current.href, { scroll })
            }
          }
        }
      }
    },
    [router, external, newTab, scroll],
  )

  useEffect(() => {
    const cardNode = cardRef.current

    const abortController = new AbortController()

    if (cardNode) {
      cardNode.addEventListener('mousedown', handleMouseDown, {
        signal: abortController.signal,
      })
      cardNode.addEventListener('mouseup', handleMouseUp, {
        signal: abortController.signal,
      })
    }

    return () => {
      abortController.abort()
    }
  }, [handleMouseDown, handleMouseUp])

  return {
    cardRef,
    linkRef,
  }
}

export default useClickableCard
