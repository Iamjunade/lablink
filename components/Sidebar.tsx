import React, { useState } from 'react';
import { Department, Subject } from '../types';

interface SidebarProps {
  departments: Department[];
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAdminAccess: () => void;
}

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ departments, selectedSubject, onSelectSubject, isOpen, setIsOpen, onAdminAccess }) => {
  const [openDepartment, setOpenDepartment] = useState<string | null>(departments[0]?.id || null);

  const toggleDepartment = (deptId: string) => {
    setOpenDepartment(openDepartment === deptId ? null : deptId);
  };
  
  const sidebarContent = (
    <div className="flex flex-col h-full bg-primary-950 text-gray-200">
        <div className="p-4 border-b border-primary-900 flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-white">L</div>
            <h1 className="text-xl font-bold text-white">LabLINK</h1>
        </div>
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
            {departments.map((dept) => (
                <div key={dept.id}>
                    <button
                        onClick={() => toggleDepartment(dept.id)}
                        className="w-full flex justify-between items-center p-3 text-left text-sm font-semibold rounded-md hover:bg-primary-900 transition-colors duration-200"
                    >
                        <span>{dept.name}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${openDepartment === dept.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openDepartment === dept.id && (
                        <div className="pl-4 mt-1 space-y-1">
                            {dept.subjects.map((subj) => (
                                <button
                                    key={subj.id}
                                    onClick={() => onSelectSubject(subj)}
                                    className={`w-full text-left p-3 text-sm rounded-md transition-colors duration-200 ${selectedSubject?.id === subj.id ? 'bg-primary-700 text-white' : 'hover:bg-primary-900 text-gray-400'}`}
                                >
                                    {subj.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </nav>
        <div className="p-4 border-t border-primary-900">
            <button 
                onClick={onAdminAccess}
                className="block w-full text-center px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Access admin panel"
            >
                Admin Access
            </button>
        </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-30 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-64 h-full">
            {sidebarContent}
        </div>
      </div>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setIsOpen(false)}></div>}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0">
          <div className="w-64">
              {sidebarContent}
          </div>
      </aside>
    </>
  );
};

export default Sidebar;