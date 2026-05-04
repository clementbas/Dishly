import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import RecipeGrid from '../components/recipe/RecipeGrid';
import RecipeFilters from '../components/recipe/RecipeFilters';
import Pagination from '../components/common/Pagination';

const DEFAULT_FILTERS = { search: '', category: '', difficulty: '', maxPrepTime: '', sort: '-createdAt' };

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

export default function Home() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [heroSearch, setHeroSearch] = useState('');
  const debouncedSearch = useDebounce(filters.search, 400);
  const debouncedHero = useDebounce(heroSearch, 400);
  const { page, limit, goToPage, reset } = usePagination(12);

  const activeSearch = heroSearch ? debouncedHero : debouncedSearch;

  const params = {
    page,
    limit,
    ...(activeSearch && { search: activeSearch }),
    ...(filters.category && { category: filters.category }),
    ...(filters.difficulty && { difficulty: filters.difficulty }),
    ...(filters.maxPrepTime && { maxPrepTime: filters.maxPrepTime }),
    sort: filters.sort,
  };

  const { recipes, pagination, loading, error } = useRecipes(params, [
    page, activeSearch, filters.category, filters.difficulty, filters.maxPrepTime, filters.sort,
  ]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setHeroSearch('');
    reset();
  }, [reset]);

  const handleHeroSearch = (e) => {
    setHeroSearch(e.target.value);
    setFilters(DEFAULT_FILTERS);
    reset();
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setHeroSearch('');
    reset();
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-secondary)', paddingTop: 'calc(var(--navbar-height) + 4rem)', paddingBottom: '5rem' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--color-accent) 0%, transparent 40%)',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            {t('home.hero.title')}{' '}
            <em style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>
              {t('home.hero.titleHighlight')}
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg mb-10 max-w-xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t('home.hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative max-w-xl mx-auto"
          >
            <input
              type="text"
              placeholder={t('home.hero.searchPlaceholder')}
              value={heroSearch}
              onChange={handleHeroSearch}
              className="input pr-12 py-4 text-base shadow-card"
              style={{ borderRadius: '1.25rem' }}
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
            {t('home.latest')}
          </h2>
          <Link to="/recipes/new" className="btn-primary text-sm hidden sm:inline-flex">
            + {t('nav.newRecipe')}
          </Link>
        </div>

        <RecipeFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />

        <RecipeGrid
          recipes={recipes}
          loading={loading}
          error={error}
          emptyMessage={t('home.noResults')}
        />

        <Pagination pagination={pagination} onPageChange={(p) => goToPage(p)} />
      </div>
    </motion.div>
  );
}
