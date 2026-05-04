export default function Avatar({ user, size = 36 }) {
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? '?';

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.username}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 600,
        fontFamily: '"DM Sans", sans-serif',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
