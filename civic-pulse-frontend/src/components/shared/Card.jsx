import React from 'react'

function Card({ className = '', children }) {
  return (
    <div
      className={
        'bg-white/80 backdrop-blur-sm border border-primary-100 shadow-[0_18px_60px_rgba(11,31,59,0.08)] rounded-2xl ' +
        className
      }
    >
      {children}
    </div>
  )
}

export default Card

