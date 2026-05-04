import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { userService } from '../services/userService';
import Avatar from '../components/user/Avatar';
import ErrorMessage from '../components/common/ErrorMessage';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const fileRef = useRef();

  const [form, setForm] = useState({ username: user?.username ?? '', bio: user?.bio ?? '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = t('errors.required');
    else if (form.username.trim().length < 3) errs.username = t('errors.usernameMin');
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
    setSaving(true);
    try {
      const updated = await userService.updateProfile(form);
      updateUser(updated);
      toast.success(t('profile.saved'));
    } catch (err) {
      setServerError(err.response?.data?.message ?? t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const { user: updated } = await userService.uploadAvatar(file);
      updateUser(updated);
      toast.success(t('profile.saved'));
    } catch (err) {
      toast.error(err.response?.data?.message ?? t('common.error'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    : '';

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="page-container max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          {t('profile.title')}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('profile.subtitle')}</p>
      </div>

      {/* Avatar section */}
      <div className="card p-6 mb-6 flex items-center gap-6">
        <div className="relative">
          <Avatar user={user} size={72} />
          {uploadingAvatar && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{user?.username}</p>
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
            {t('profile.memberSince')} {memberSince}
          </p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="btn-secondary text-xs" disabled={uploadingAvatar}>
            {t('profile.changeAvatar')}
          </button>
        </div>
      </div>

      {/* Profile form */}
      <div className="card p-8">
        {serverError && <div className="mb-4"><ErrorMessage message={serverError} /></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">{t('auth.username')}</label>
            <input type="text" className={`input${errors.username ? ' error' : ''}`}
              value={form.username} onChange={set('username')} />
            {errors.username && <p className="text-xs mt-1" style={{ color: '#e23923' }}>{errors.username}</p>}
          </div>

          <div>
            <label className="label">{t('profile.bio')}</label>
            <textarea rows={4} className="input" value={form.bio} onChange={set('bio')}
              placeholder={t('profile.bioPlaceholder')} style={{ resize: 'vertical' }} />
          </div>

          <div>
            <label className="label">{t('auth.email')}</label>
            <input type="email" className="input opacity-60 cursor-not-allowed" value={user?.email ?? ''} disabled />
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>L'email ne peut pas être modifié.</p>
          </div>

          <button type="submit" className="btn-primary w-full py-3" disabled={saving}>
            {saving ? `${t('common.loading')}` : t('profile.save')}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
