import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';
import ErrorMessage from '../components/common/ErrorMessage';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError(t('errors.required'));
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      setError(t('common.error'));
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
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            {t('auth.forgotPasswordTitle')}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('auth.forgotPasswordSubtitle')}</p>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">✉️</div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                {t('auth.forgotPasswordSuccess')}
              </p>
              <Link to="/login" className="btn-primary w-full py-3 block text-center">
                {t('auth.backToLogin')}
              </Link>
            </div>
          ) : (
            <>
              {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">{t('auth.email')}</label>
                  <input
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
                  {loading ? t('auth.sendingLink') : t('auth.sendResetLink')}
                </button>
              </form>
              <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-secondary)' }}>
                <Link to="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                  ← {t('auth.backToLogin')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
