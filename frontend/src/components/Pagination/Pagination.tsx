import styles from './styles.module.css'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const visiblePages = (page: number, totalPages: number) => {
  const pages: (number | 'gap')[] = []

  for (let item = 1; item <= totalPages; item++) {
    const isEdge = item === 1 || item === totalPages
    const isNear = Math.abs(item - page) <= 1

    if (isEdge || isNear) pages.push(item)
    else if (pages[pages.length - 1] !== 'gap') pages.push('gap')
  }

  return pages
}

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <nav className={styles.pagination} aria-label="Paginação">
      <button type="button" className={styles.arrow} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Página anterior">
        <i className="fa-solid fa-angle-left"></i>
      </button>

      {visiblePages(page, totalPages).map((item, index) => item === 'gap'
        ? <span key={`gap-${index}`} className={styles.gap}>…</span>
        : (
          <button
            key={item}
            type="button"
            className={item === page ? styles.active : undefined}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ))}

      <button type="button" className={styles.arrow} disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Próxima página">
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </nav>
  )
}

export default Pagination
