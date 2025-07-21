import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useUserData } from "../hooks/useAuth"
import { toast } from "react-toastify" 

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const navigate = useNavigate()
  const { login } = useUserData()

  const onSubmit = async (data) => {
    try {
      const { data: loginData, error } = await login(data.email, data.password)

      if (error) {
        toast.error(error.message || "Error al iniciar sesión.")
        return
      }

      if (!loginData.session) {
        toast.error("No se pudo iniciar sesión. ¿Ya confirmaste tu correo?")
        return
      }

      toast.success("Inicio de sesión exitoso")
      navigate("/tasks")
    } catch (err) {
      console.error(err)
      toast.error("Error inesperado al iniciar sesión.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-12 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-6 text-center font-semibold">Iniciar sesión</h2>
        
        <div className="my-4">
          <label className="block text-gray-700">Correo electrónico</label>
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
              errors.email ? "border-red-500" : ""
            }`}
            placeholder="ejemplo@empresa.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Contraseña</label>
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
              errors.password ? "border-red-500" : ""
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
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
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
