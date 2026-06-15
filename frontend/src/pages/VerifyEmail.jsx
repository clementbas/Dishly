import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function VerifyEmail() {
  const { token } = useParams();
  const { t } = useTranslation();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  if (status === 'loading') return <LoadingSpinner fullscreen />;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="min-h-screen flex items-center justify-center px-4"
      style={{ paddingTop: 'var(--navbar-height)', backgroundColor: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-md text-center">
        <div className="card p-10">
          {status === 'success' ? (
            <>
              <div className="text-6xl mb-6">✅</div>
              <h1 className="font-display text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                {t('auth.verifyTitle')}
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                {t('auth.verifySuccess')}
              </p>
              <Link to="/login" className="btn-primary w-full py-3 block text-center">
                {t('auth.signIn')}
              </Link>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="font-display text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                {t('auth.verifyTitle')}
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                {t('auth.verifyError')}
              </p>
              <Link to="/register" className="btn-secondary w-full py-3 block text-center">
                {t('auth.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
