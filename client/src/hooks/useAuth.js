import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase.service'

export const useUserData = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener el usuario activo
  const fetchUser = async () => {
    setLoading(true)
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Error al obtener usuario:', error.message)
      setError(error)
      setUserData(null)
    } else {
      setUserData(user)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchUser()

    // Suscribirse a cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser()
    })

    // Cleanup
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // Registro de usuario
  const register = async ({ email, password, full_name }) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name }
      }
    })
    if (error) {
      setError(error)
    }
    setLoading(false)
    return { data, error }
  }

  // Login
  const login = async (email, password) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      setError(error)
    }
    setLoading(false)
    return { data, error }
  }

  // Logout
  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error)
    } else {
      setUserData(null)
    }
    setLoading(false)
  }

  return {
    userData,
    loading,
    error,
    userId: userData?.id || null,
    userEmail: userData?.email || '- - - - - -',
    isAuthenticated: !!userData,
    login,
    register,
    logout
  }
}
