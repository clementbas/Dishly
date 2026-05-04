import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import RecipeForm from '../components/recipe/RecipeForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function EditRecipe() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    recipeService.getById(id)
      .then((r) => {
        if (r.author?._id !== user?._id) {
          navigate('/dashboard');
          return;
        }
        setRecipe(r);
      })
      .catch((err) => setError(err.response?.data?.message ?? t('common.error')))
      .finally(() => setLoading(false));
  }, [id, user, navigate, t]);

  const handleSubmit = async (data, imageFile) => {
    setSaving(true);
    try {
      const updated = await recipeService.update(id, data);
      if (imageFile) await recipeService.uploadImage(id, imageFile);
      toast.success(t('recipe.updated'));
      navigate(`/recipes/${updated._id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullscreen />;
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="page-container max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
        {t('recipe.edit')} — {recipe?.title}
      </h1>
      <div className="card p-8">
        <RecipeForm
          initialData={recipe}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel={t('recipe.save')}
        />
      </div>
    </motion.div>
  );
}
