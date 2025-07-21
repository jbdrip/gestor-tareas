import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { resetPassword } from "../services/auth.service"
import { toast } from "react-toastify"
import logo from "../assets/gestion-pro-logo.webp"

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [passwordReset, setPasswordReset] = useState(false)
  const [token, setToken] = useState("")
  const password = watch('password')

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (!urlToken) {
      toast.error("Token de restablecimiento no encontrado.")
      return navigate("/login")
    }
    setToken(urlToken)
  }, [searchParams, navigate])

  const onSubmit = async (data) => {
    if (!token)
      return toast.error("Token de restablecimiento no válido")

    try {
      const response = await resetPassword(token, data.password)
      if(response && response.status === 'success') {
        setPasswordReset(true)
      } else {
        toast.error(response.detail || "Error al restablecer la contraseña.")
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || "Error al restablecer la contraseña.")
    }
  }

  if (passwordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-12 rounded-lg shadow-md w-full max-w-sm text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Contraseña restablecida
            </h2>
            <p className="text-gray-600">
              Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
          </div>
          
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-12 rounded-lg shadow-md w-full max-w-sm"
      >
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-24 w-24 rounded-xl" />
        </div>
        <h2 className="text-2xl mb-2 text-center font-semibold">
          Restablecer contraseña
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Ingresa tu nueva contraseña para completar el restablecimiento.
        </p>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nueva contraseña</label>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres"
              }
            })}
            className={`w-full border px-3 py-2 rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ingresa tu nueva contraseña"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Confirmar contraseña</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: value => 
                value === password || "Las contraseñas no coinciden"
            })}
            className={`w-full border px-3 py-2 rounded ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Confirma tu nueva contraseña"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !token}
          className={`w-full py-2 rounded text-white ${
            isSubmitting || !token
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Restableciendo..." : "Restablecer contraseña"}
        </button>

        <div className="text-center mt-6 mb-3">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </form>
    </div>
  )
}