import React from 'react';

interface HeaderProps {
  subjectName: string;
  onToggleSidebar: () => void;
  isAdmin: boolean;
  onToggleAdminView: () => void;
}

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);


const Header: React.FC<HeaderProps> = ({ subjectName, onToggleSidebar, isAdmin, onToggleAdminView }) => {
  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between p-4 h-16">
        <div className="flex items-center">
          <button onClick={onToggleSidebar} className="text-gray-500 md:hidden mr-4">
             <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{subjectName}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
            {isAdmin && (
                <button
                    onClick={onToggleAdminView}
                    className="px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label="Toggle Admin Panel"
                >
                    Admin Panel
                </button>
            )}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                U
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
