import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmLabel, danger = false, loading = false }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                {title}
              </h3>
              {message && (
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                  {message}
                </p>
              )}
              <div className="flex gap-3 justify-end">
                <button onClick={onClose} className="btn-secondary" disabled={loading}>
                  {t('confirm.cancel')}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={danger ? 'btn-danger' : 'btn-primary'}
                >
                  {loading ? '...' : (confirmLabel || t('confirm.delete'))}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
