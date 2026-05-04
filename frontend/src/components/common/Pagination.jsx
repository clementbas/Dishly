import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Pagination({ pagination, onPageChange }) {
  const { t } = useTranslation();
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const renderPages = [];
  let prev = null;
  for (const p of pages) {
    if (prev && p - prev > 1) renderPages.push('...');
    renderPages.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="btn-secondary text-xs px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← {t('pagination.previous')}
      </button>

      {renderPages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1" style={{ color: 'var(--color-text-muted)' }}>…</span>
        ) : (
          <motion.button
            key={p}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPageChange(p)}
            className="w-9 h-9 rounded-xl text-sm font-medium transition-colors duration-150"
            style={{
              backgroundColor: p === page ? 'var(--color-primary)' : 'var(--color-surface)',
              color: p === page ? '#fff' : 'var(--color-text)',
              border: `1px solid ${p === page ? 'var(--color-primary)' : 'var(--color-border)'}`,
            }}
          >
            {p}
          </motion.button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="btn-secondary text-xs px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('pagination.next')} →
      </button>
    </div>
  );
}
