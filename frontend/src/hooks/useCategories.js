import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    categoryService
      .getAll()
      .then(setCategories)
      .catch((err) => setError(err.response?.data?.message || 'Error'))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
};
