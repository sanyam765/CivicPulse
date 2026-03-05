import React from 'react'

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  statusBadge,
  className = '',
}) {
  const alignmentClasses =
    align === 'left'
      ? 'items-start text-left'
      : align === 'right'
      ? 'items-end text-right'
      : 'items-center text-center'

  return (
    <div className={['flex flex-col gap-3', alignmentClasses, className].filter(Boolean).join(' ')}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-700">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-300" />
          <span>{eyebrow}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {title && (
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
        )}
        {statusBadge && (
          <span className="inline-flex items-center rounded-full bg-mint-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-800">
            {statusBadge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

export default SectionHeader

