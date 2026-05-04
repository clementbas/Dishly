import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { userService } from '../services/userService';
import { usePagination } from '../hooks/usePagination';
import RecipeGrid from '../components/recipe/RecipeGrid';
import Pagination from '../components/common/Pagination';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Favorites() {
  const { t } = useTranslation();
  const { page, limit, goToPage } = usePagination(12);
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    userService
      .getFavorites({ page, limit })
      .then((data) => {
        setRecipes(data.recipes);
        setPagination(data.pagination);
      })
      .catch((err) => setError(err.response?.data?.message ?? t('common.error')))
      .finally(() => setLoading(false));
  }, [page, limit, t]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="page-container">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          {t('favorites.title')}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('favorites.subtitle')}</p>
      </div>

      {!loading && recipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">♡</p>
          <h3 className="font-display text-2xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            {t('favorites.empty')}
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>{t('favorites.emptyHint')}</p>
          <Link to="/" className="btn-primary">{t('common.explore')}</Link>
        </div>
      ) : (
        <>
          <RecipeGrid recipes={recipes} loading={loading} error={error} emptyMessage={t('favorites.empty')} />
          <Pagination pagination={pagination} onPageChange={goToPage} />
        </>
      )}
    </motion.div>
  );
}
