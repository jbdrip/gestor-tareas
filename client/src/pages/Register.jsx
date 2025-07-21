import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useUserData } from "../hooks/useAuth"
import { toast } from "react-toastify" 

export default function Register() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const navigate = useNavigate()
  const password = watch("password")
  const { register: registerUser } = useUserData()

  const onSubmit = async (data) => {
    try {
      clearErrors("root")
      const result = await registerUser(data)
      if (result.error === null) {
        navigate("/login")
        toast.success("Registro exitoso. Por favor, inicia sesión.")
      } else {
        toast.error(result.error.message || "Error en el registro.")
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Error al registrar usuario.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-12 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-6 text-center">Crear cuenta</h2>

        {errors.root && (
          <div className="mb-4">
            <p className="text-red-500 text-sm">{errors.root.message}</p>
          </div>
        )}

        {/* Nombre completo */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            {...register("full_name", {
              required: "El nombre completo es requerido",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres"
              }
            })}
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.full_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            {...register("email", {
              required: "El correo electrónico es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Ingresa un correo electrónico válido"
              }
            })}
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "Debe tener al menos 6 caracteres"
              }
            })}
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>


        {/* Confirmar contraseña */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Confirmar contraseña
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: (value) =>
                value === password || "Las contraseñas no coinciden"
            })}
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white font-medium ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSubmitting ? "Registrando..." : "Crear cuenta"}
        </button>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
