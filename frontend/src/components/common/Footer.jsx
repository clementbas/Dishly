import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="mt-auto border-t py-8"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="font-display text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
          Dishly
        </Link>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} Dishly. Fait avec ♡ pour les passionnés de cuisine.
        </p>
      </div>
    </footer>
  );
}
