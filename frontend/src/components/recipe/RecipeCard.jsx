import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { useToast } from '../../hooks/useToast';
import { useAuthContext } from '../../context/AuthContext';
import Avatar from '../user/Avatar';

const ClockIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="17" height="17" fill={filled ? '#e23923' : 'none'} stroke={filled ? '#e23923' : 'currentColor'} strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const difficultyClass = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' };

export default function RecipeCard({ recipe, onDelete }) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { updateUser, user } = useAuthContext();
  const { isFavorite, toggle, loadingId } = useFavorites();
  const toast = useToast();

  const favorite = isFavorite(recipe._id);
  const isLoading = loadingId === recipe._id;

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(recipe._id);
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error(t('errors.loginToFavorite'));
    await toggle(recipe._id, (action) => {
      toast.success(action === 'added' ? t('favorites.added') : t('favorites.removed'));
      const favorites = action === 'added'
        ? [...(user?.favorites ?? []), recipe._id]
        : (user?.favorites ?? []).filter((f) => (f._id || f) !== recipe._id);
      updateUser({ ...user, favorites });
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card group cursor-pointer h-full flex flex-col"
      style={{ boxShadow: '0 2px 12px var(--color-shadow)' }}
    >
      <Link to={`/recipes/${recipe._id}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl"
              style={{ backgroundColor: 'var(--color-primary-light)' }}>
              🍽️
            </div>
          )}
          {/* Difficulty badge */}
          <span className={`badge ${difficultyClass[recipe.difficulty]} absolute top-3 left-3`}>
            {t(`recipe.${recipe.difficulty}`)}
          </span>
          {/* Favorite button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleFavorite}
            disabled={isLoading}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-opacity"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: favorite ? '#e23923' : 'var(--color-text-secondary)' }}
          >
            <HeartIcon filled={favorite} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* Category */}
          {recipe.category && (
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
              {recipe.category.name}
            </span>
          )}
          {/* Title */}
          <h3 className="font-display text-lg font-semibold leading-snug line-clamp-2" style={{ color: 'var(--color-text)' }}>
            {recipe.title}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-auto pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <ClockIcon /> {recipe.prepTime + recipe.cookTime} {t('recipe.minutes')}
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <PeopleIcon /> {recipe.servings} {t('recipe.serves')}
            </span>
          </div>

          {/* Author */}
          {recipe.author && (
            <div className="flex items-center gap-2">
              <Avatar user={recipe.author} size={22} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {t('recipe.byAuthor', { name: recipe.author.username })}
              </span>
            </div>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              className="mt-1 text-xs font-medium self-start"
              style={{ color: '#e23923' }}
            >
              {t('recipe.delete')}
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
