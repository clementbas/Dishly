import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { adminService } from '../services/adminService';
import Modal from '../components/common/Modal';
import Avatar from '../components/user/Avatar';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Admin() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers({ page, limit: 15, search: debouncedSearch });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const handleToggleRole = async (u) => {
    setTogglingId(u._id);
    try {
      const newRole = u.role === 'admin' ? 'user' : 'admin';
      const updated = await adminService.updateUserRole(u._id, newRole);
      setUsers((prev) => prev.map((x) => x._id === u._id ? { ...x, role: updated.role } : x));
      toast.success(t('admin.roleUpdated'));
    } catch {
      toast.error(t('common.error'));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteUser(deleteTarget);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget));
      toast.success(t('admin.userDeleted'));
      setDeleteTarget(null);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="page-container">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🛡️</span>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
            {t('admin.title')}
          </h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('admin.subtitle')}</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          className="input max-w-sm"
          placeholder={t('admin.searchUsers')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                  {['Utilisateur', 'Email', t('admin.role'), 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide"
                      style={{ color: 'var(--color-text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
                      {t('admin.noUsers')}
                    </td>
                  </tr>
                ) : users.map((u, i) => (
                  <tr key={u._id}
                    style={{
                      borderBottom: i < users.length - 1 ? '1px solid var(--color-border)' : 'none',
                      backgroundColor: u._id === user._id ? 'var(--color-primary-light)' : 'transparent',
                    }}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar user={u} size={32} />
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                            {u.username}
                            {u._id === user._id && (
                              <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>(vous)</span>
                            )}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {t('admin.joinedAt')} {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>
                      {u.email}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: u.role === 'admin' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
                          color: u.role === 'admin' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        }}
                      >
                        {u.role === 'admin' ? '🛡️ Admin' : 'User'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {u._id !== user._id && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleRole(u)}
                            disabled={togglingId === u._id}
                            className="btn-secondary text-xs px-3 py-1.5"
                          >
                            {togglingId === u._id ? '...' : (
                              u.role === 'admin' ? t('admin.makeUser') : t('admin.makeAdmin')
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u._id)}
                            className="btn-danger text-xs px-3 py-1.5"
                          >
                            {t('admin.deleteUser')}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('admin.deleteUserConfirm')}
        message={t('admin.deleteUserMessage')}
        danger
        loading={deleting}
      />
    </motion.div>
  );
}
