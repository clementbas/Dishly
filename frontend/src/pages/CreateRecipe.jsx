import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { recipeService } from '../services/recipeService';
import { useToast } from '../hooks/useToast';
import RecipeForm from '../components/recipe/RecipeForm';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function CreateRecipe() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data, imageFile) => {
    setLoading(true);
    try {
      const recipe = await recipeService.create(data);
      if (imageFile) {
        await recipeService.uploadImage(recipe._id, imageFile);
      }
      toast.success(t('recipe.created'));
      navigate(`/recipes/${recipe._id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="page-container max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
        {t('recipe.create')}
      </h1>
      <div className="card p-8">
        <RecipeForm onSubmit={handleSubmit} loading={loading} submitLabel={t('recipe.save')} />
      </div>
    </motion.div>
  );
}
