import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMyRecipes } from '../hooks/useRecipes';
import { usePagination } from '../hooks/usePagination';
import { useToast } from '../hooks/useToast';
import { recipeService } from '../services/recipeService';
import RecipeGrid from '../components/recipe/RecipeGrid';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { page, limit, goToPage } = usePagination(9);
  const { recipes, pagination, loading, error, refetch } = useMyRecipes({ page, limit }, [page]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await recipeService.delete(deleteTarget);
      toast.success(t('recipe.deleted'));
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message ?? t('common.error'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="page-container">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
            {t('dashboard.title')}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('dashboard.subtitle')}</p>
        </div>
        <Link to="/recipes/new" className="btn-primary">
          + {t('nav.newRecipe')}
        </Link>
      </div>

      {recipes.length === 0 && !loading ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">👨‍🍳</p>
          <h3 className="font-display text-2xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            {t('dashboard.empty')}
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>{t('dashboard.emptyHint')}</p>
          <Link to="/recipes/new" className="btn-primary">{t('dashboard.createFirst')}</Link>
        </div>
      ) : (
        <>
          <RecipeGrid
            recipes={recipes}
            loading={loading}
            error={error}
            emptyMessage={t('dashboard.empty')}
          />
          <Pagination pagination={pagination} onPageChange={goToPage} />
        </>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('recipe.deleteConfirm')}
        message={t('recipe.deleteMessage')}
        danger
        loading={deleting}
      />
    </motion.div>
  );
}
