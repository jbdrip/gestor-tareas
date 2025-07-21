import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

// Componente de diálogo de confirmación
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger", // "danger", "warning", "info"
  width = "max-w-md", // Nuevo atributo para manejar el ancho
  height = "max-h-96" // Nuevo atributo para manejar la altura
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: "text-red-500",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      border: "border-red-200"
    },
    warning: {
      icon: "text-yellow-500",
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      border: "border-yellow-200"
    },
    info: {
      icon: "text-blue-500",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      border: "border-blue-200"
    }
  };

  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl ${width} w-full mx-4`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <AlertCircle className={`w-6 h-6 ${styles.icon}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className={`text-gray-700 ${height} overflow-y-auto pr-2`}>{message}</div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook personalizado para manejar el diálogo
const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'danger',
    width: 'max-w-md', // Nuevo estado para el ancho
    height: 'max-h-96' // Nuevo estado para la altura
  });

  const showDialog = ({ title, message, onConfirm, confirmText, cancelText, type, width, height }) => {
    setDialogState({
      isOpen: true,
      title: title || 'Confirmar acción',
      message,
      onConfirm,
      confirmText: confirmText || 'Confirmar',
      cancelText: cancelText || 'Cancelar',
      type: type || 'danger',
      width: width || 'max-w-md', // Agregar el ancho al estado
      height: height || 'max-h-96' // Mantener la altura por defecto
    });
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (dialogState.onConfirm) {
      dialogState.onConfirm();
    }
    closeDialog();
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={closeDialog}
      onConfirm={handleConfirm}
      title={dialogState.title}
      message={dialogState.message}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      type={dialogState.type}
      width={dialogState.width} // Pasar el ancho al componente
      height={dialogState.height} // Pasar la altura al componente
    />
  );

  return { showDialog, ConfirmDialogComponent };
};

export default useConfirmDialog;