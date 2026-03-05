import React from 'react'

function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-2xl font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 disabled:opacity-60 disabled:cursor-not-allowed'

  const variantClasses = {
    primary:
      'bg-primary-700 hover:bg-primary-800 text-white shadow-sm hover:shadow-md hover:-translate-y-px',
    outline:
      'border border-primary-200 text-primary-700 bg-white hover:bg-primary-50 hover:border-primary-300',
    ghost: 'text-primary-700 hover:bg-primary-50',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm md:text-base',
  }

  const widthClasses = fullWidth ? 'w-full' : ''

  const composedClassName = [
    baseClasses,
    variantClasses[variant] ?? variantClasses.primary,
    sizeClasses[size] ?? sizeClasses.md,
    widthClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={composedClassName} {...props}>
      {children}
    </button>
  )
}

export default Button

