import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';
import ErrorMessage from '../components/common/ErrorMessage';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function ResetPassword() {
  const { token } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return setError(t('errors.required'));
    if (password.length < 6) return setError(t('errors.passwordMin'));
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(token, password);
      toast.success(t('auth.resetSuccess'));
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message ? t('auth.resetError') : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="min-h-screen flex items-center justify-center px-4"
      style={{ paddingTop: 'var(--navbar-height)', backgroundColor: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            {t('auth.resetPasswordTitle')}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('auth.resetPasswordSubtitle')}</p>
        </div>

        <div className="card p-8">
          {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('auth.newPassword')}</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                autoComplete="new-password"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? t('auth.resettingPassword') : t('auth.resetPassword')}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-secondary)' }}>
            <Link to="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              ← {t('auth.backToLogin')}
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
