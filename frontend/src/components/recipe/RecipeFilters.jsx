import { useTranslation } from 'react-i18next';
import { useCategories } from '../../hooks/useCategories';

export default function RecipeFilters({ filters, onChange, onReset }) {
  const { t } = useTranslation();
  const { categories } = useCategories();

  const handle = (key) => (e) => {
    onChange({ ...filters, [key]: e.target.value });
  };

  return (
    <div className="card p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder={t('filters.search')}
          value={filters.search || ''}
          onChange={handle('search')}
          className="input lg:col-span-1"
        />

        {/* Category */}
        <select value={filters.category || ''} onChange={handle('category')} className="input">
          <option value="">{t('filters.allCategories')}</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        {/* Difficulty */}
        <select value={filters.difficulty || ''} onChange={handle('difficulty')} className="input">
          <option value="">{t('filters.allDifficulties')}</option>
          <option value="easy">{t('recipe.easy')}</option>
          <option value="medium">{t('recipe.medium')}</option>
          <option value="hard">{t('recipe.hard')}</option>
        </select>

        {/* Max prep time */}
        <input
          type="number"
          placeholder={t('filters.maxPrepTime')}
          value={filters.maxPrepTime || ''}
          onChange={handle('maxPrepTime')}
          min="1"
          className="input"
        />
      </div>

      <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
        {/* Sort */}
        <select value={filters.sort || '-createdAt'} onChange={handle('sort')} className="input max-w-xs text-sm">
          <option value="-createdAt">{t('filters.newest')}</option>
          <option value="createdAt">{t('filters.oldest')}</option>
          <option value="prepTime">{t('filters.quickest')}</option>
        </select>

        <button onClick={onReset} className="btn-ghost text-sm">
          ✕ {t('filters.reset')}
        </button>
      </div>
    </div>
  );
}
