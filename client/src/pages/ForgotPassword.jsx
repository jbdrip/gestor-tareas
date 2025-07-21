import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { forgotPassword } from "../services/auth.service"
import { toast } from "react-toastify"
import logo from "../assets/gestion-pro-logo.webp"

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: ""
    }
  })

  const navigate = useNavigate()
  const [emailSent, setEmailSent] = useState(false)

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data.email)
      if(response && response.status === 'success') {
        setEmailSent(true)
      } else {
        toast.error(response.detail || "Error al enviar el correo.")
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || "Error al enviar el correo.")
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-12 rounded-lg shadow-md w-full max-w-sm text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Instrucciones enviadas
            </h2>
            <p className="text-gray-600 my-3">
              Si el correo electrónico está registrado, recibirás un mensaje con instrucciones para restablecer tu contraseña.
            </p>
          </div>
          
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700 underline text-sm mb-3"
          >
            Volver al inicio de sesión
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
          Recuperar contraseña
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Correo electrónico</label>
          <input
            type="email"
            {...register("email", {
              required: "El correo electrónico es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Ingresa un correo electrónico válido"
              }
            })}
            className={`w-full border px-3 py-2 rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="ejemplo@empresa.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
        </button>

        <div className="text-center mt-6 mb-3">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700 text-sm underline"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </form>
    </div>
  )
}