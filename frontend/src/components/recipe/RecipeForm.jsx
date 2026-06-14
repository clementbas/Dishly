import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../hooks/useCategories';
import ErrorMessage from '../common/ErrorMessage';

const EMPTY_INGREDIENT = { name: '', quantity: '', unit: '' };
const EMPTY_FORM = {
  title: '', description: '', category: '', difficulty: '',
  prepTime: '', cookTime: '', servings: '',
  ingredients: [{ ...EMPTY_INGREDIENT }],
  steps: [''],
  tags: '',
  isPublic: true,
};

const validate = (data, t) => {
  const errs = {};
  if (!data.title.trim()) errs.title = t('errors.required');
  else if (data.title.trim().length < 3) errs.title = t('errors.min3');
  if (!data.description.trim()) errs.description = t('errors.required');
  else if (data.description.trim().length < 10) errs.description = 'Minimum 10 caractères';
  if (!data.category) errs.category = t('errors.required');
  if (!data.difficulty) errs.difficulty = t('errors.required');
  if (!data.prepTime || Number(data.prepTime) < 1) errs.prepTime = t('errors.required');
  if (data.cookTime === '' || Number(data.cookTime) < 0) errs.cookTime = t('errors.required');
  if (!data.servings || Number(data.servings) < 1) errs.servings = t('errors.required');
  if (data.ingredients.some((i) => !i.name.trim() || !i.quantity.trim())) errs.ingredients = t('errors.ingredientRequired');
  if (data.steps.some((s) => !s.trim())) errs.steps = t('errors.stepRequired');
  return errs;
};

export default function RecipeForm({ initialData = null, onSubmit, loading = false, submitLabel }) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title ?? '',
        description: initialData.description ?? '',
        category: initialData.category?._id ?? initialData.category ?? '',
        difficulty: initialData.difficulty ?? '',
        prepTime: initialData.prepTime ?? '',
        cookTime: initialData.cookTime ?? '',
        servings: initialData.servings ?? '',
        ingredients: initialData.ingredients?.length ? initialData.ingredients : [{ ...EMPTY_INGREDIENT }],
        steps: initialData.steps?.length ? initialData.steps : [''],
        tags: initialData.tags?.join(', ') ?? '',
        isPublic: initialData.isPublic ?? true,
      });
      if (initialData.image) setImagePreview(initialData.image);
    }
  }, [initialData]);

  useEffect(() => {
    const errs = validate(form, t);
    const visibleErrs = {};
    Object.keys(errs).forEach((k) => { if (touched[k]) visibleErrs[k] = errs[k]; });
    setErrors(visibleErrs);
  }, [form, touched, t]);

  const touch = (field) => setTouched((p) => ({ ...p, [field]: true }));
  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: value }));
  };

  const setIngredient = (idx, field, value) => {
    setForm((p) => {
      const ingredients = [...p.ingredients];
      ingredients[idx] = { ...ingredients[idx], [field]: value };
      return { ...p, ingredients };
    });
  };

  const addIngredient = () => setForm((p) => ({ ...p, ingredients: [...p.ingredients, { ...EMPTY_INGREDIENT }] }));
  const removeIngredient = (idx) => setForm((p) => ({
    ...p, ingredients: p.ingredients.filter((_, i) => i !== idx)
  }));

  const setStep = (idx, value) => {
    setForm((p) => { const steps = [...p.steps]; steps[idx] = value; return { ...p, steps }; });
  };
  const addStep = () => setForm((p) => ({ ...p, steps: [...p.steps, ''] }));
  const removeStep = (idx) => setForm((p) => ({ ...p, steps: p.steps.filter((_, i) => i !== idx) }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const allTouched = Object.fromEntries(
      ['title','description','category','difficulty','prepTime','cookTime','servings','ingredients','steps']
        .map((k) => [k, true])
    );
    setTouched(allTouched);
    const errs = validate(form, t);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      ...form,
      prepTime: Number(form.prepTime),
      cookTime: Number(form.cookTime),
      servings: Number(form.servings),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      await onSubmit(payload, imageFile);
    } catch (err) {
      setServerError(err.response?.data?.message ?? t('common.error'));
    }
  };

  const inputClass = (field) => `input${errors[field] ? ' error' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && <ErrorMessage message={serverError} />}

      {/* Title */}
      <div>
        <label className="label">{t('recipe.title')} *</label>
        <input type="text" className={inputClass('title')} value={form.title}
          onChange={set('title')} onBlur={() => touch('title')} />
        {errors.title && <p className="text-xs mt-1" style={{ color: '#e23923' }}>{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="label">{t('recipe.description')} *</label>
        <textarea rows={4} className={inputClass('description')} value={form.description}
          onChange={set('description')} onBlur={() => touch('description')}
          style={{ resize: 'vertical' }} />
        {errors.description && <p className="text-xs mt-1" style={{ color: '#e23923' }}>{errors.description}</p>}
      </div>

      {/* Category + Difficulty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">{t('recipe.category')} *</label>
          <select className={inputClass('category')} value={form.category}
            onChange={set('category')} onBlur={() => touch('category')}>
            <option value="">{t('recipe.selectCategory')}</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          {errors.category && <p className="text-xs mt-1" style={{ color: '#e23923' }}>{errors.category}</p>}
        </div>
        <div>
          <label className="label">{t('recipe.difficulty')} *</label>
          <select className={inputClass('difficulty')} value={form.difficulty}
            onChange={set('difficulty')} onBlur={() => touch('difficulty')}>
            <option value="">{t('recipe.selectDifficulty')}</option>
            <option value="easy">{t('recipe.easy')}</option>
            <option value="medium">{t('recipe.medium')}</option>
            <option value="hard">{t('recipe.hard')}</option>
          </select>
          {errors.difficulty && <p className="text-xs mt-1" style={{ color: '#e23923' }}>{errors.difficulty}</p>}
        </div>
      </div>

      {/* Times + Servings */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { field: 'prepTime', label: t('recipe.prepTime') },
          { field: 'cookTime', label: t('recipe.cookTime') },
          { field: 'servings', label: t('recipe.servings') },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="label">{label} *</label>
            <input type="number" min="0" className={inputClass(field)} value={form[field]}
              onChange={set(field)} onBlur={() => touch(field)} />
            {errors[field] && <p className="text-xs mt-1" style={{ color: '#e23923' }}>{errors[field]}</p>}
          </div>
        ))}
      </div>

      {/* Ingredients */}
      <div>
        <label className="label">{t('recipe.ingredients')} *</label>
        {errors.ingredients && <p className="text-xs mb-2" style={{ color: '#e23923' }}>{errors.ingredients}</p>}
        <div className="space-y-2">
          {form.ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <input type="text" placeholder={t('recipe.ingredientName')} className="input flex-[2]"
                value={ing.name} onChange={(e) => setIngredient(idx, 'name', e.target.value)}
                onBlur={() => touch('ingredients')} />
              <input type="text" placeholder={t('recipe.ingredientQty')} className="input flex-1"
                value={ing.quantity} onChange={(e) => setIngredient(idx, 'quantity', e.target.value)} />
              <input type="text" placeholder={t('recipe.ingredientUnit')} className="input flex-1"
                value={ing.unit} onChange={(e) => setIngredient(idx, 'unit', e.target.value)} />
              {form.ingredients.length > 1 && (
                <button type="button" onClick={() => removeIngredient(idx)}
                  className="p-2.5 rounded-xl transition-colors flex-shrink-0"
                  style={{ color: '#e23923', backgroundColor: '#fde8e4' }}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addIngredient}
          className="mt-2 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
          {t('recipe.addIngredient')}
        </button>
      </div>

      {/* Steps */}
      <div>
        <label className="label">{t('recipe.steps')} *</label>
        {errors.steps && <p className="text-xs mb-2" style={{ color: '#e23923' }}>{errors.steps}</p>}
        <div className="space-y-2">
          {form.steps.map((step, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="flex-shrink-0 w-7 h-7 mt-2 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                {idx + 1}
              </span>
              <textarea rows={2} placeholder={t('recipe.stepPlaceholder')} className="input flex-1"
                value={step} onChange={(e) => setStep(idx, e.target.value)}
                onBlur={() => touch('steps')} style={{ resize: 'vertical' }} />
              {form.steps.length > 1 && (
                <button type="button" onClick={() => removeStep(idx)}
                  className="p-2.5 rounded-xl mt-1 flex-shrink-0"
                  style={{ color: '#e23923', backgroundColor: '#fde8e4' }}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addStep}
          className="mt-2 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
          {t('recipe.addStep')}
        </button>
      </div>

      {/* Tags */}
      <div>
        <label className="label">{t('recipe.tags')}</label>
        <input type="text" className="input" value={form.tags} onChange={set('tags')}
          placeholder="italiano, pasta, rapide..." />
      </div>

      {/* Image upload */}
      <div>
        <label className="label">{t('recipe.image')}</label>
        {imagePreview && (
          <img src={imagePreview} alt="preview" className="w-full max-h-48 object-cover rounded-xl mb-3" />
        )}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage}
          className="text-sm" style={{ color: 'var(--color-text-secondary)' }} />
      </div>

      {/* Public toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.isPublic} onChange={set('isPublic')}
          className="w-4 h-4 accent-primary" />
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {t('recipe.isPublic')}
        </span>
      </label>

      {/* Submit */}
      <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
        {loading ? t('recipe.saving') : (submitLabel ?? t('recipe.save'))}
      </button>
    </form>
  );
}
