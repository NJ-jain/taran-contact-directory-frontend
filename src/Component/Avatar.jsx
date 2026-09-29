import React, { useState } from 'react';

// Generates consistent, aesthetic gradients based on name
const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-purple-600',
  'from-violet-500 to-purple-700',
];

const getGradientForName = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
};

const getInitials = (firstName = '', lastName = '') => {
  const f = firstName?.trim()?.charAt(0)?.toUpperCase() || '';
  const l = lastName?.trim()?.charAt(0)?.toUpperCase() || '';
  if (f && l) return `${f}${l}`;
  if (f) return f;
  return '?';
};

const SIZE_MAP = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
  '2xl': 'w-32 h-32 sm:w-40 sm:h-40 text-3xl sm:text-4xl',
};

const Avatar = ({
  src,
  firstName = '',
  lastName = '',
  name,
  size = 'md',
  className = '',
  alt,
}) => {
  const [imageError, setImageError] = useState(false);

  const fullName = name || `${firstName} ${lastName}`.trim();
  const initials = getInitials(firstName || fullName.split(' ')[0], lastName || fullName.split(' ')[1]);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;
  const gradient = getGradientForName(fullName || 'User');

  if (src && !imageError) {
    return (
      <div className={`relative flex-shrink-0 rounded-full overflow-hidden ${sizeClasses} ${className}`}>
        <img
          src={src}
          alt={alt || fullName || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center font-semibold text-white bg-gradient-to-br ${gradient} shadow-inner select-none ${sizeClasses} ${className}`}
      title={fullName}
      aria-label={fullName}
    >
      <span>{initials}</span>
    </div>
  );
};

export default Avatar;
