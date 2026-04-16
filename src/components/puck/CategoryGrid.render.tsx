/**
 * CategoryGrid — render function and types.
 * Server-safe: no client-only imports.
 *
 * Grid of selectable category cards with optional background images.
 * Reference: docs/reference/webflow/harvard-quiz-bowl.html section.section-88
 * Source CSS: .section-88, .link-block-34, .heading-137, .text-block-174
 */
import type { MediaReference } from '@delmaredigital/payload-puck/fields'
import { SURFACE_GREY } from './shared'

export interface CategoryItem {
  name: string
  link: string
  backgroundImage: MediaReference | null
}

export interface CategoryGridProps {
  heading: string
  categories: CategoryItem[]
}

export const defaultProps: CategoryGridProps = {
  heading: 'Choose Category',
  categories: [
    { name: 'Economics & Business', link: '#', backgroundImage: null },
    { name: 'World History', link: '#', backgroundImage: null },
    { name: 'Math', link: '#', backgroundImage: null },
    { name: 'Biology', link: '#', backgroundImage: null },
    { name: 'Physics', link: '#', backgroundImage: null },
    { name: 'Chemistry', link: '#', backgroundImage: null },
  ],
}

export function CategoryGridRender({
  heading, categories,
}: CategoryGridProps) {
  return (
    <section className="py-5 md:py-10 px-3 md:px-5">
      <div className="max-w-6xl mx-auto">
        <h2
          className="font-bold text-center text-2xl md:text-3xl leading-tight mb-5 md:mb-10"
        >
          {heading}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-items-center">
          {categories.map((cat, i) => (
            <a
              key={i}
              href={cat.link}
              className="no-underline rounded-[15px] flex justify-center items-center text-center"
              style={{
                backgroundColor: SURFACE_GREY,
                backgroundImage: cat.backgroundImage?.url ? `url("${cat.backgroundImage.url}")` : 'url(/competition-assets/category-card-bg.png)',
                backgroundSize: 'auto',
                backgroundPosition: '100% 100%',
                backgroundRepeat: 'no-repeat',
                boxShadow: '5px 5px 8px #0003',
                padding: '20px 23px',
                width: '100%',
                height: '80px',
                color: '#000',
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: '22px',
              }}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
