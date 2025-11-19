import React from 'react';
import { 
    MenuIcon, 
    UserIcon, 
    MoonIcon, 
    SunIcon, 
    SearchIcon, 
    XCircleIcon, 
    EnterFullScreenIcon, 
    ExitFullScreenIcon 
} from './common/Icons';

interface HeaderProps {
  subjectName: string;
  onToggleSidebar: () => void;
  isAdmin: boolean;
  onToggleAdminView: () => void;
  theme: string;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
}

const Header: React.FC<HeaderProps> = ({ subjectName, onToggleSidebar, isAdmin, onToggleAdminView, theme, onToggleTheme, searchQuery, onSearchChange, isFullScreen, onToggleFullScreen }) => {
  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between p-4 h-16">
        <div className="flex items-center">
          <button onClick={onToggleSidebar} className="text-gray-500 md:hidden mr-4 dark:text-gray-400" aria-label="Toggle sidebar">
             <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden sm:block">{subjectName}</h1>
        </div>
        
        <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                    type="search"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                    placeholder="Search contributions, experiments..."
                    aria-label="Search contributions, experiments"
                />
                 {searchQuery && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button onClick={() => onSearchChange('')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" aria-label="Clear search query">
                            <XCircleIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
            {isAdmin && (
                <button
                    onClick={onToggleAdminView}
                    className="px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label="Toggle Admin Panel"
                >
                   <span className="hidden sm:inline">Admin Panel</span>
                   <span className="sm:hidden">Admin</span>
                </button>
            )}
             <button
                onClick={onToggleFullScreen}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
            >
                {isFullScreen ? <ExitFullScreenIcon className="h-6 w-6" /> : <EnterFullScreenIcon className="h-6 w-6" />}
            </button>
            <button
                onClick={onToggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 dark:bg-gray-700 dark:text-gray-400" aria-label="User profile icon">
                <UserIcon className="w-6 h-6" />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;