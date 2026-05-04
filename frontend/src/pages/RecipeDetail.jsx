import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../hooks/useToast';
import { useAuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Avatar from '../components/user/Avatar';
import Modal from '../components/common/Modal';

const difficultyClass = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' };

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function RecipeDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { updateUser } = useAuthContext();
  const { isFavorite, toggle, loadingId } = useFavorites();
  const toast = useToast();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    recipeService.getById(id)
      .then(setRecipe)
      .catch((err) => setError(err.response?.data?.message ?? t('common.error')))
      .finally(() => setLoading(false));
  }, [id, t]);

  const isOwner = user && recipe && recipe.author?._id === user._id;
  const favorite = isFavorite(recipe?._id);

  const handleFavorite = async () => {
    if (!isAuthenticated) return toast.error('Connectez-vous pour ajouter aux favoris');
    await toggle(recipe._id, (action) => {
      toast.success(action === 'added' ? t('favorites.added') : t('favorites.removed'));
      const favorites = action === 'added'
        ? [...(user?.favorites ?? []), recipe._id]
        : (user?.favorites ?? []).filter((f) => (f._id || f) !== recipe._id);
      updateUser({ ...user, favorites });
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await recipeService.delete(id);
      toast.success(t('recipe.deleted'));
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message ?? t('common.error'));
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  if (loading) return <LoadingSpinner fullscreen />;
  if (error) return (
    <div className="page-container"><ErrorMessage message={error} /></div>
  );
  if (!recipe) return null;

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Hero image */}
      <div
        className="w-full relative overflow-hidden"
        style={{ height: 360, marginTop: 'var(--navbar-height)', backgroundColor: 'var(--color-bg-secondary)' }}
      >
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">🍽️</div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
        {/* Badge */}
        {recipe.category && (
          <span className="absolute top-5 left-5 badge" style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            {recipe.category.name}
          </span>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`badge ${difficultyClass[recipe.difficulty]}`}>
                {t(`recipe.${recipe.difficulty}`)}
              </span>
              {!recipe.isPublic && (
                <span className="badge" style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}>
                  Privée
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight mb-3" style={{ color: 'var(--color-text)' }}>
              {recipe.title}
            </h1>
            <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>{recipe.description}</p>

            {recipe.author && (
              <div className="flex items-center gap-2 mt-4">
                <Avatar user={recipe.author} size={32} />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('recipe.byAuthor', { name: recipe.author.username })}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleFavorite}
              disabled={loadingId === recipe._id}
              className="btn-secondary gap-2"
              style={{ color: favorite ? '#e23923' : undefined }}
            >
              <svg width="18" height="18" fill={favorite ? '#e23923' : 'none'} stroke={favorite ? '#e23923' : 'currentColor'} strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              {favorite ? t('favorites.removed').split(' ')[0] : t('favorites.added').split(' ')[0]}
            </motion.button>

            {isOwner && (
              <>
                <Link to={`/recipes/${recipe._id}/edit`} className="btn-secondary">
                  {t('common.edit')}
                </Link>
                <button onClick={() => setDeleteModal(true)} className="btn-danger">
                  {t('recipe.delete')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: t('recipe.prepTimeShort'), value: `${recipe.prepTime} ${t('recipe.minutes')}` },
            { label: t('recipe.cookTimeShort'), value: `${recipe.cookTime} ${t('recipe.minutes')}` },
            { label: t('recipe.totalTime'), value: `${totalTime} ${t('recipe.minutes')}` },
            { label: t('recipe.servings'), value: `${recipe.servings} ${t('recipe.serves')}` },
          ].map(({ label, value }) => (
            <div key={label} className="card p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
              <p className="font-display text-lg font-bold" style={{ color: 'var(--color-text)' }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-2xl font-semibold mb-5" style={{ color: 'var(--color-text)' }}>
              {t('recipe.ingredients')}
            </h2>
            <div className="card p-5 space-y-3">
              {recipe.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center justify-between py-2"
                  style={{ borderBottom: idx < recipe.ingredients.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <span style={{ color: 'var(--color-text)' }}>{ing.name}</span>
                  <span className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>
                    {ing.quantity} {ing.unit}
                  </span>
                </div>
              ))}
            </div>

            {recipe.tags?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs"
                      style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold mb-5" style={{ color: 'var(--color-text)' }}>
              {t('recipe.steps')}
            </h2>
            <div className="space-y-4">
              {recipe.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  className="card p-5 flex gap-4"
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                  >
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title={t('recipe.deleteConfirm')}
        message={t('recipe.deleteMessage')}
        danger
        loading={deleting}
      />
    </motion.div>
  );
}
