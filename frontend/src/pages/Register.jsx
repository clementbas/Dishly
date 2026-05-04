import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import ErrorMessage from '../components/common/ErrorMessage';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Register() {
  const { t } = useTranslation();
  const { register, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = t('errors.required');
    else if (form.username.length < 3) errs.username = t('errors.usernameMin');
    if (!form.email) errs.email = t('errors.required');
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = t('errors.emailInvalid');
    if (!form.password) errs.password = t('errors.required');
    else if (form.password.length < 6) errs.password = t('errors.passwordMin');
    return errs;
  };

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      await register(form);
      toast.success(t('auth.registerSuccess'));
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message ?? t('common.error'));
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
            {t('auth.registerTitle')}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('auth.registerSubtitle')}</p>
        </div>

        <div className="card p-8">
          {serverError && <div className="mb-4"><ErrorMessage message={serverError} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('auth.username')}</label>
              <input type="text" className={`input${errors.username ? ' error' : ''}`}
                value={form.username} onChange={set('username')} autoComplete="username" />
              {errors.username && <p className="text-xs mt-1" style={{ color: '#e23923' }}>{errors.username}</p>}
            </div>

            <div>
              <label className="label">{t('auth.email')}</label>
              <input type="email" className={`input${errors.email ? ' error' : ''}`}
                value={form.email} onChange={set('email')} autoComplete="email" />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#e23923' }}>{errors.email}</p>}
            </div>

            <div>
              <label className="label">{t('auth.password')}</label>
              <input type="password" className={`input${errors.password ? ' error' : ''}`}
                value={form.password} onChange={set('password')} autoComplete="new-password" />
              {errors.password && <p className="text-xs mt-1" style={{ color: '#e23923' }}>{errors.password}</p>}
            </div>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? t('auth.registering') : t('auth.register')}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-secondary)' }}>
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
