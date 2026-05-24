import React, { createContext, useState, useContext } from 'react'

const RoleContext = createContext()

export function RoleProvider({ children }) {
    const [role, setRole] = useState(() => {
        return localStorage.getItem('civicpulse_role') || 'citizen'
    })
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('civicpulse_logged_in') === 'true'
    })
    const [user, setUser] = useState(() => {
        const data = localStorage.getItem('civicpulse_user')
        return data ? JSON.parse(data) : null
    })

    const login = (userData, userRole, token) => {
        setRole(userRole)
        setIsLoggedIn(true)
        setUser(userData)
        localStorage.setItem('civicpulse_role', userRole)
        localStorage.setItem('civicpulse_logged_in', 'true')
        localStorage.setItem('civicpulse_user', JSON.stringify(userData))
        if (token) {
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(userData))
        }
    }

    const logout = () => {
        setRole('citizen')
        setIsLoggedIn(false)
        setUser(null)
        localStorage.removeItem('civicpulse_role')
        localStorage.removeItem('civicpulse_logged_in')
        localStorage.removeItem('civicpulse_user')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminData')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <RoleContext.Provider value={{ role, isLoggedIn, user, login,  logout }}>
            {children}
        </RoleContext.Provider>
    )
}

export function useRole() {
    const context = useContext(RoleContext)
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider')
    }
    return context
}
