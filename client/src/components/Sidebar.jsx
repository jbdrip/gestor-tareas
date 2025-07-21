import { NavLink } from 'react-router-dom'
import { FaBars, FaUsers, FaShoppingCart } from 'react-icons/fa'
import { useUserData } from '../hooks/useAuth'
import routes from '../components/auth/routes'

export default function Sidebar({ isCollapsed, toggle, isMobileOpen, toggleMobile }) {

  const { userRole } = useUserData()


  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col bg-white shadow-lg transition-all duration-500 ease-in-out relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        
        {/* Toggle Button */}
        <div className="relative h-16 border-b border-gray-200 overflow-hidden">
          {/* Toggle Button - Fijo al lado izquierdo */}
          <button
            className="absolute left-5 top-4 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 z-20"
            onClick={toggle}
          >
            <FaBars className="text-gray-700 text-lg" />
          </button>
          
          {/* Logo/Brand - Se desliza desde la derecha con límite visual */}
          <div className={`absolute top-4 left-16 right-4 flex items-center space-x-2 transition-all duration-500 ease-in-out ${
            isCollapsed 
              ? 'opacity-0 transform translate-x-8' 
              : 'opacity-100 transform translate-x-0'
          }`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            <span className="font-semibold text-gray-800 whitespace-nowrap">Gestión-Pro</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {routes && routes
            .map(({ path, icon, name }, index) => {
              const Icon = icon || FaBars; // Default icon if none provided
              return (
                <NavLink
                  key={index}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center py-3 rounded-lg transition-all duration-300 group relative ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  {/* Icono - Fijo al lado izquierdo */}
                  <div className="w-12 flex justify-center flex-shrink-0">
                    <Icon className='text-xl'/>
                  </div>
                  
                  {/* Texto - Se desliza desde la derecha */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isCollapsed 
                      ? 'opacity-0 max-w-0 transform translate-x-4' 
                      : 'opacity-100 max-w-xs transform translate-x-0'
                  }`}>
                    <span className="font-medium whitespace-nowrap">
                      {name}
                    </span>
                  </div>
                  
                  {/* Tooltip para modo colapsado */}
                  {isCollapsed && (
                    <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                      {name}
                    </div>
                  )}
                </NavLink>
              )
            })
          }
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 relative">
          <div className="transition-all duration-500 ease-in-out h-16">
            {/* Versión expandida */}
            <div className={`p-4 text-xs text-gray-500 text-center transition-all duration-500 ease-in-out ${
              isCollapsed 
                ? 'opacity-0 transform translate-x-4 h-0 py-0 overflow-hidden' 
                : 'opacity-100 transform translate-x-0 h-auto py-4'
            }`}>
              <p>© 2025 Gestión-Pro</p>
              <p>Versión 1.0.0</p>
            </div>
            
            {/* Versión colapsada */}
            <div className={`flex items-center justify-center transition-all duration-500 ease-in-out ${
              isCollapsed 
                ? 'opacity-100 p-4' 
                : 'opacity-0 h-0 p-0 overflow-hidden'
            }`}>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-500">v1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            <span className="font-semibold text-gray-800">Gestión-Pro</span>
          </div>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMobile}
          >
            <FaBars className="text-gray-700 text-lg" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {routes && routes
            .map(({ path, icon, name }, index) => {
              const Icon = icon || FaBars; // Default icon if none provided
              return (
                <NavLink
                  key={index}
                  to={path}
                  onClick={toggle} // Close sidebar on navigation
                  className={({ isActive }) =>
                    `flex items-center py-3 px-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  {/* Icon */}
                  <Icon className='text-xl flex-shrink-0' />
                  {/* Text */}
                  <span className="ml-3 font-medium">{name}</span>
                </NavLink>
              )
            })
          }
        </nav>

        {/* Mobile Footer */}
        <div className="p-4 border-t border-gray-200 relative">
          <div className="text-xs text-gray-500 text-center">
            <p>© 2025 Gestión-Pro</p>
            <p>Versión 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  )
}