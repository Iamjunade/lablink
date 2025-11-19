import React, { useState, useEffect } from 'react';
import { Department, Subject } from '../types';
import { ChevronDownIcon } from './common/Icons';

interface SidebarProps {
  departments: Department[];
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ departments, selectedSubject, onSelectSubject, isOpen, setIsOpen }) => {
  const [openDepartment, setOpenDepartment] = useState<string | null>(departments[0]?.id || null);

  // Effect to automatically open the department of the selected subject
  useEffect(() => {
    if (selectedSubject) {
      for (const dept of departments) {
        if (dept.subjects.some(subj => subj.id === selectedSubject.id)) {
          setOpenDepartment(dept.id);
          break; // Found the department, no need to continue
        }
      }
    }
  }, [selectedSubject, departments]);

  const toggleDepartment = (deptId: string) => {
    setOpenDepartment(openDepartment === deptId ? null : deptId);
  };
  
  const sidebarContent = (
    <div className="flex flex-col h-full bg-primary-950 text-gray-200">
        <div className="p-4 border-b border-primary-900 flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-white">L</div>
            <h1 className="text-xl font-bold text-white">LabLINK</h1>
        </div>
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto" aria-label="Main Navigation">
            {departments.map((dept) => (
                <div key={dept.id}>
                    <button
                        onClick={() => toggleDepartment(dept.id)}
                        className="w-full flex justify-between items-center p-3 text-left text-sm font-semibold rounded-md hover:bg-primary-900 transition-colors duration-200"
                        aria-expanded={openDepartment === dept.id}
                        aria-controls={`department-subjects-${dept.id}`}
                    >
                        <span>{dept.name}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${openDepartment === dept.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openDepartment === dept.id && (
                        <div id={`department-subjects-${dept.id}`} role="region" className="pl-4 mt-1 space-y-1">
                            {dept.subjects.map((subj) => (
                                <button
                                    key={subj.id}
                                    onClick={() => onSelectSubject(subj)}
                                    className={`w-full text-left p-3 text-sm rounded-md transition-colors duration-200 ${selectedSubject?.id === subj.id ? 'bg-primary-700 text-white' : 'hover:bg-primary-900 text-gray-400'}`}
                                    aria-current={selectedSubject?.id === subj.id ? 'page' : undefined}
                                >
                                    {subj.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </nav>
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
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setIsOpen(false)} aria-hidden="true"></div>}

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