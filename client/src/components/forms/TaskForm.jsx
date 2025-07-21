import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, Info, Loader2 } from 'lucide-react'
import Modal from '../Modal'

export default function TaskFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task = null, 
  isLoading = false 
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const isEditing = !!task

  const modalTitle = isEditing ? 'Editar Tarea' : 'Nueva Tarea'
  const modalSubtitle = isEditing 
    ? 'Actualiza la información de la tarea' 
    : 'Completa los datos para registrar una nueva tarea'

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        reset({
          titulo: task.titulo,
          descripcion: task.descripcion,
          fecha_vencimiento: task.fecha_vencimiento
        })
      } else {
        reset({
          titulo: '',
          descripcion: '',
          fecha_vencimiento: ''
        })
      }
    }
  }, [isOpen, task, isEditing, reset])

  const handleFormSubmit = (data) => {
    onSubmit(data)
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      maxWidth="max-w-3xl"
      isLoading={isLoading}
    >
      <form id="task-form" onSubmit={handleSubmit(handleFormSubmit)} className=" space-y-6">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          {/* Sección: Información Personal */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Información General</h3>
                <p className="text-sm text-gray-600">Datos básicos de la tarea</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  {...register('titulo', { 
                    required: 'El título es requerido',
                    minLength: {
                      value: 2,
                      message: 'El título debe tener al menos 2 caracteres'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ingrese el título de la tarea"
                  disabled={isLoading}
                />
                {errors.titulo && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    {errors.titulo.message}
                  </p>
                )}
              </div>

              {/* Fecha de Vencimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  {...register('fecha_vencimiento', {
                    required: 'La fecha de vencimiento es requerida'
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                {errors.fecha_vencimiento && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    {errors.fecha_vencimiento.message}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  {...register('descripcion', {
                    minLength: {
                      value: 10,
                      message: 'La descripción debe tener al menos 10 caracteres'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ingrese la descripción de la tarea"
                  disabled={isLoading}
                />
                {errors.descripcion && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    {errors.descripcion.message}
                  </p>
                )}
              </div>

            </div>
          </div>
          
        </div>

        {/* Botones de acción */}
        <div className="flex-shrink-0 border-t border-gray-200 p-5">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="task-form"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Guardando...
                </div>
              ) : (
                isEditing ? 'Actualizar Tarea' : 'Crear Tarea'
              )}
            </button>
          </div>
        </div>

      </form>
    </Modal>
  )
}