import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';
import Avatar from '../user/Avatar';

const SunIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 12h18M3 6h18M3 18h18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success(t('auth.logoutSuccess'));
    navigate('/');
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const toggleLang = () => {
    const next = i18n.language.startsWith('fr') ? 'en' : 'fr';
    i18n.changeLanguage(next);
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
    fontWeight: isActive ? 600 : 400,
    fontSize: '0.875rem',
    transition: 'color 0.15s',
  });

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 border-b"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        height: 'var(--navbar-height)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
          Dishly
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" style={navLinkStyle} end>{t('nav.home')}</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" style={navLinkStyle}>{t('nav.dashboard')}</NavLink>
              <NavLink to="/favorites" style={navLinkStyle}>{t('nav.favorites')}</NavLink>
            </>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="btn-ghost text-xs font-semibold uppercase tracking-wide"
          >
            {i18n.language.startsWith('fr') ? 'EN' : 'FR'}
          </button>

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="btn-ghost p-2" aria-label="Toggle theme">
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex items-center gap-2 btn-ghost px-3 py-1.5"
              >
                <Avatar user={user} size={28} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {user?.username}
                </span>
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-text-muted)' }}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 card py-1 z-50"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-bg-secondary transition-colors"
                      style={{ color: 'var(--color-text)' }}>
                      {t('nav.profile')}
                    </Link>
                    <Link to="/recipes/new" onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-bg-secondary transition-colors"
                      style={{ color: 'var(--color-text)' }}>
                      {t('nav.newRecipe')}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm hover:bg-bg-secondary transition-colors"
                        style={{ color: 'var(--color-primary)' }}>
                        🛡️ Administration
                      </Link>
                    )}
                    <hr style={{ borderColor: 'var(--color-border)', margin: '4px 0' }} />
                    <button onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm hover:bg-bg-secondary transition-colors"
                      style={{ color: '#e23923' }}>
                      {t('nav.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm">{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary text-sm">{t('nav.register')}</Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen((p) => !p)} className="btn-ghost p-2 md:hidden">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              <NavLink to="/" style={navLinkStyle} end onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-bg-secondary">
                {t('nav.home')}
              </NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" style={navLinkStyle} onClick={() => setMobileOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-bg-secondary">
                    {t('nav.dashboard')}
                  </NavLink>
                  <NavLink to="/favorites" style={navLinkStyle} onClick={() => setMobileOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-bg-secondary">
                    {t('nav.favorites')}
                  </NavLink>
                  <NavLink to="/profile" style={navLinkStyle} onClick={() => setMobileOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-bg-secondary">
                    {t('nav.profile')}
                  </NavLink>
                  <NavLink to="/recipes/new" style={navLinkStyle} onClick={() => setMobileOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-bg-secondary">
                    {t('nav.newRecipe')}
                  </NavLink>
                  <button onClick={handleLogout} className="text-left py-2 px-3 rounded-lg text-sm font-medium"
                    style={{ color: '#e23923' }}>
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link to="/login" className="btn-secondary flex-1 text-center text-sm" onClick={() => setMobileOpen(false)}>
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn-primary flex-1 text-center text-sm" onClick={() => setMobileOpen(false)}>
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
