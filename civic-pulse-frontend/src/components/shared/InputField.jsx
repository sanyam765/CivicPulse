import React from 'react'

function InputField({
  label,
  required = false,
  badge,
  helper,
  error,
  as = 'input',
  className = '',
  ...props
}) {
  const Component = as

  const baseClasses =
    'block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm md:text-base text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 focus-visible:border-primary-500'

  const errorClasses = error
    ? 'border-red-400 bg-red-50 focus-visible:ring-red-500/70 focus-visible:border-red-500'
    : ''

  const composedClassName = [baseClasses, errorClasses, className].filter(Boolean).join(' ')

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
          {badge && (
            <span className="inline-flex items-center rounded-full bg-mint-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
              {badge}
            </span>
          )}
        </div>
      )}

      <Component className={composedClassName} {...props} />

      {helper && !error && (
        <p className="text-[11px] text-slate-500 leading-snug">{helper}</p>
      )}

      {error && (
        <p className="text-[11px] font-medium text-red-600 leading-snug flex items-center gap-1.5">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

export default InputField

