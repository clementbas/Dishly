import { motion } from 'framer-motion';
import RecipeCard from './RecipeCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function RecipeGrid({ recipes, loading, error, emptyMessage }) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!recipes?.length) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🍽️</p>
        <p style={{ color: 'var(--color-text-muted)' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {recipes.map((recipe) => (
        <motion.div key={recipe._id} variants={itemVariants}>
          <RecipeCard recipe={recipe} />
        </motion.div>
      ))}
    </motion.div>
  );
}
