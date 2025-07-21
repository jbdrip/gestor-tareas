import { useState, useEffect, useRef } from 'react'
import DataTable from '../components/DataTable'
import TaskFormModal from '../components/forms/TaskForm'
import Tooltip from '../components/Tooltip'
import { getTasks, createTask, updateTask, deleteTask } from '../services/task.service'
import { Edit, ClipboardPlus, Trash } from 'lucide-react';
import { toast } from 'react-toastify'
import useConfirmDialog from '../components/ConfirmDialog'
import { useUserData } from '../hooks/useAuth'

export default function Tasks() {
  // State variables
  const [tasks, setTasks] = useState([])
  const [totalTasks, setTotalTasks] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const itemsPerPage = 10

  // Ref para evitar múltiples llamadas simultáneas
  const fetchingRef = useRef(false)

  const { showDialog, ConfirmDialogComponent } = useConfirmDialog()
  const { userId } = useUserData()

  const fetchTasks = async (page = currentPage, search = searchTerm) => {
    // Prevenir múltiples llamadas simultáneas
    if (fetchingRef.current) return
    fetchingRef.current = true
    setIsLoading(true)
    try {
      const response = await getTasks(page, itemsPerPage, search)
      if (response.count && response.data) {
        setTasks(response.data || [])
        setTotalTasks(response.count || 0)
      } else {
        console.error('Error fetching tasks:', response.message)
        setTasks([])
        setTotalTasks(0)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
      setTotalTasks(0)
    } finally {
      setIsLoading(false)
      fetchingRef.current = false
    }
  }

  // Efecto para cargar las tareas inicialmente
  useEffect(() => {
    fetchTasks()
  }, []) // Solo se ejecuta una vez al montar el componente

  // Efecto separado para cuando cambian la página o búsqueda
  useEffect(() => {
    fetchTasks(currentPage, searchTerm)
  }, [currentPage, searchTerm])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSearch = search => {
    setSearchTerm(search)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = task => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (task) => {
    showDialog({
      title: "Eliminar Tarea",
      message: `¿Estás seguro de que deseas eliminar la tarea "${task.titulo}"?\n Una vez eliminada, no podrá recuperarse.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await deleteTask(task.id)
          if (response === true) {
            fetchTasks() // Refresh the list
            toast.success(`Tarea "${task.titulo}" eliminada exitosamente.`)
          } else {
            console.error('Error eliminando tarea:', response.message)
            toast.error(`Error al eliminar tarea: ${response.message}`)
          }
        } catch (error) {
          console.error('Error eliminando tarea:', error)
          toast.error('Error al eliminar tarea.')
        }
      }
    });
  }

  const handleFormSubmit = async formData => {
    setIsSubmitting(true)
    try {
      let response
      const task = {...formData, user_id: userId }
      if (selectedTask) {
        // Editing existing task
        response = await updateTask(selectedTask.id, task)
      } else {
        // Creating new task
        response = await createTask(task)
      }

      if (response.id) {
        setIsModalOpen(false)
        fetchTasks() // Refresh the list
        toast.success(`Tarea ${selectedTask ? 'actualizada' : 'creada'} exitosamente.`)
      } else {
        console.error('Error submitting form:', response.message)
        toast.error(`Error al ${selectedTask ? 'actualizar' : 'crear'} tarea: ${response.message}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(`Error al ${selectedTask ? 'actualizar' : 'crear'} tarea: ${error.message || 'Error desconocido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      header: 'ID',
      key: 'id',
      width: 'w-16', // Fixed width for ID
      render: (task) => (
        <span className="text-gray-500">{task.id}</span>
      )
    },
    {
      header: 'Título',
      key: 'titulo',
      width: 'min-w-32', // Minimum width, can grow
    },
    {
      header: 'Descripción',
      key: 'descripcion',
      width: 'min-w-48', // Minimum width, can grow
    },
    {
      header: 'Vencimiento',
      key: 'fecha_vencimiento',
      width: 'w-32',
      render: (user) => {
        const dueStr = user.fecha_vencimiento; // "YYYY-MM-DD"

        // Convertimos a objeto Date y sumamos un día para corregir desfase
        const dueDate = new Date(dueStr);

        // Obtenemos la fecha de hoy sin hora, para comparar solo la fecha
        const today = new Date();
        today.setDate(today.getDate() + 1); // Ajustamos hoy para que coincida con el formato de vencimiento
        const todayStr = today.toISOString().split('T')[0];

        // Convertimos la fecha ajustada a string "YYYY-MM-DD" para comparación
        const adjustedDueStr = dueDate.toISOString().split('T')[0];

        // Elegimos el color según el estado
        let badgeColor = 'bg-green-100 text-green-700';
        let badgeText = 'Vigente';
        let badgeIcon = '🟢';
        if (adjustedDueStr < todayStr) {
          badgeColor = 'bg-red-100 text-red-700'; // Ya venció
          badgeText = 'Vencida';
          badgeIcon = '❌';
        } else if (adjustedDueStr === todayStr) {
          badgeColor = 'bg-yellow-100 text-yellow-800'; // Se vence hoy
          badgeText = 'Vence hoy';
          badgeIcon = '⚠️';
        }

        // Mostramos la fecha con un badge
        dueDate.setDate(dueDate.getDate() + 1); // Ajustamos la fecha para mostrar el día siguiente
        const dueStr_ = dueDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
        const formattedDate = new Date(dueStr_).toLocaleDateString('es-ES');
        
        return (
          <span
            title={badgeText}
            className={`px-2 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${badgeColor}`}
          >
            {formattedDate}
            <span>{badgeIcon}</span>
          </span>
        );
      }
    },
    {
      header: 'Acciones',
      key: 'actions',
      width: 'w-40', // Fixed width for actions
      render: (task) => (
        <div className="flex space-x-2 whitespace-nowrap">
          <Tooltip text="Editar tarea">
            <button
              onClick={() => handleEditTask(task)}
              className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Editar tarea"
            >
              <Edit size={16} />
            </button>
          </Tooltip>
          <Tooltip text="Eliminar tarea">
            <button
              onClick={() => handleDeleteTask(task)}
              className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              aria-label="Eliminar tarea"
            >
              <Trash size={16} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed height */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Tareas</h1>
        <button
          onClick={handleCreateTask}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
        >
          <ClipboardPlus size={16} />
          <span>Crear Tarea</span>
          
        </button>
      </div>

      {/* Table Container - Flexible height */}
      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={tasks}
          totalItems={totalTasks}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          searchPlaceholder="Buscar tareas..."
          isLoading={isLoading}
        />
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        task={selectedTask}
        isLoading={isSubmitting}
      />

      <ConfirmDialogComponent />
    </div>
  )
}