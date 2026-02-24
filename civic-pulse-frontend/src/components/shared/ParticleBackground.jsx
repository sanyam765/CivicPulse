import React, { useState, useEffect } from 'react'

export default function ParticleBackground() {
    const [particles] = useState(() =>
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 20 + 15,
            delay: Math.random() * 20,
            opacity: Math.random() * 0.4 + 0.1,
            drift: (Math.random() - 0.5) * 200,
            type: Math.random() > 0.7 ? 'circle' : Math.random() > 0.5 ? 'diamond' : 'dot',
        }))
    )

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Aurora Gradient Overlay */}
            <div
                className="absolute inset-0 aurora-bg opacity-60"
                style={{
                    background: 'linear-gradient(-45deg, rgba(16,185,129,0.06), rgba(20,184,166,0.04), rgba(6,182,212,0.06), rgba(52,211,153,0.04))',
                    backgroundSize: '400% 400%',
                    animation: 'aurora 15s ease-in-out infinite',
                }}
            />

            {/* Gradient Orbs */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent 70%)',
                    top: '10%',
                    left: '10%',
                    animation: 'float-smooth 20s ease-in-out infinite',
                }}
            />
            <div
                className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(20,184,166,0.4), transparent 70%)',
                    bottom: '20%',
                    right: '15%',
                    animation: 'float-smooth 25s ease-in-out infinite reverse',
                }}
            />
            <div
                className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-10"
                style={{
                    background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'float-smooth 18s ease-in-out 5s infinite',
                }}
            />

            {/* Floating Particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute"
                    style={{
                        left: `${p.x}%`,
                        bottom: '-20px',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        opacity: 0,
                        animation: `particle-float ${p.duration}s linear ${p.delay}s infinite`,
                    }}
                >
                    {p.type === 'circle' ? (
                        <div
                            className="w-full h-full rounded-full"
                            style={{
                                background: `rgba(16, 185, 129, ${p.opacity})`,
                                boxShadow: `0 0 ${p.size * 2}px rgba(16, 185, 129, ${p.opacity * 0.5})`,
                            }}
                        />
                    ) : p.type === 'diamond' ? (
                        <div
                            className="w-full h-full rotate-45"
                            style={{
                                background: `rgba(20, 184, 166, ${p.opacity})`,
                                boxShadow: `0 0 ${p.size * 2}px rgba(20, 184, 166, ${p.opacity * 0.5})`,
                            }}
                        />
                    ) : (
                        <div
                            className="w-full h-full rounded-full"
                            style={{
                                background: `rgba(6, 182, 212, ${p.opacity})`,
                            }}
                        />
                    )}
                </div>
            ))}

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 1px 1px, rgba(16,185,129,1) 1px, transparent 0)',
                    backgroundSize: '48px 48px',
                }}
            />

            {/* Rim light at top */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), rgba(20,184,166,0.3), transparent)',
                }}
            />
        </div>
    )
}
