
import React, { useState, useCallback, useEffect } from 'react';
import { MOCK_DATA } from './constants';
import { Department, Subject, Experiment, Contribution } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExperimentView from './components/ExperimentView';
import AdminDashboard from './components/AdminDashboard';
import PasswordModal from './components/PasswordModal';

const LABLINK_DATA_KEY = 'lablink_data';

// Helper to restore Date objects from JSON, since they are stored as strings
const reviveDates = (departments: Department[]): Department[] => {
  return departments.map(dept => ({
    ...dept,
    subjects: dept.subjects.map(subj => ({
      ...subj,
      experiments: subj.experiments.map(exp => ({
        ...exp,
        contributions: exp.contributions.map(c => ({
          ...c,
          createdAt: new Date(c.createdAt)
        }))
      }))
    }))
  }));
};


const App: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const savedData = localStorage.getItem(LABLINK_DATA_KEY);
      if (savedData) {
        return reviveDates(JSON.parse(savedData));
      }
      return MOCK_DATA;
    } catch (error) {
      console.error("Could not load data from local storage", error);
      return MOCK_DATA;
    }
  });
  
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(departments[0] || null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(selectedDepartment?.subjects[0] || null);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminViewActive, setAdminViewActive] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isAdminAuthenticated, setAdminAuthenticated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Persist data to localStorage whenever departments change
  useEffect(() => {
    try {
      localStorage.setItem(LABLINK_DATA_KEY, JSON.stringify(departments));
    } catch (error) {
      console.error("Could not save data to local storage", error);
    }
  }, [departments]);

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedExperiment(null);
    setAdminViewActive(false);
    if(window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSelectExperiment = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setAdminViewActive(false);
  };
  
  const handleBackToList = () => {
    setSelectedExperiment(null);
  };

  const addContribution = useCallback((experimentId: string, contribution: Contribution) => {
    setDepartments(currentDepts => {
      const newDepartments = currentDepts.map(dept => ({
        ...dept,
        subjects: dept.subjects.map(subj => ({
          ...subj,
          experiments: subj.experiments.map(exp => {
            if (exp.id === experimentId) {
              return { ...exp, contributions: [contribution, ...exp.contributions] };
            }
            return exp;
          })
        }))
      }));

      setSelectedExperiment(currentExp => {
        if (currentExp?.id === experimentId) {
          return newDepartments
            .flatMap(d => d.subjects)
            .flatMap(s => s.experiments)
            .find(e => e.id === experimentId) || null;
        }
        return currentExp;
      });

      return newDepartments;
    });
  }, []);

  const handleDeleteContribution = useCallback((experimentId: string, contributionId: string) => {
    if (!isAdminAuthenticated) return;
    
    setDepartments(currentDepts => {
      const newDepartments = currentDepts.map(dept => ({
        ...dept,
        subjects: dept.subjects.map(subj => ({
          ...subj,
          experiments: subj.experiments.map(exp => {
            if (exp.id === experimentId) {
              return { ...exp, contributions: exp.contributions.filter(c => c.id !== contributionId) };
            }
            return exp;
          })
        }))
      }));
      
      setSelectedExperiment(currentExp => {
        if (currentExp?.id === experimentId) {
          return newDepartments
            .flatMap(d => d.subjects)
            .flatMap(s => s.experiments)
            .find(e => e.id === experimentId) || null;
        }
        return currentExp;
      });

      return newDepartments;
    });
  }, [isAdminAuthenticated]);
  
  const handleCreateExperiment = useCallback((subjectId: string, newExperimentData: Omit<Experiment, 'id' | 'contributions'>) => {
    if (!isAdminAuthenticated) return;

    const experimentToAdd: Experiment = {
        ...newExperimentData,
        id: `exp-admin-${Date.now()}`,
        contributions: [],
    };
    
    setDepartments(currentDepts => {
      const newDepartments = currentDepts.map(dept => ({
          ...dept,
          subjects: dept.subjects.map(subj => {
              if (subj.id === subjectId) {
                  return { ...subj, experiments: [...subj.experiments, experimentToAdd] };
              }
              return subj;
          })
      }));

      setSelectedSubject(currentSubj => {
        if (currentSubj?.id === subjectId) {
            return newDepartments
              .flatMap(d => d.subjects)
              .find(s => s.id === subjectId) || null;
        }
        return currentSubj;
      });

      return newDepartments;
    });
    
    setAdminViewActive(true); 
  }, [isAdminAuthenticated]);

  const handleDeleteExperiment = useCallback((subjectId: string, experimentId: string) => {
    if (!isAdminAuthenticated) return;
    
    setDepartments(currentDepts => {
      const newDepartments = currentDepts.map(dept => ({
          ...dept,
          subjects: dept.subjects.map(subj => {
              if (subj.id === subjectId) {
                  return { ...subj, experiments: subj.experiments.filter(exp => exp.id !== experimentId) };
              }
              return subj;
          })
      }));

      setSelectedSubject(currentSubj => {
        if (currentSubj?.id === subjectId) {
          return newDepartments
            .flatMap(d => d.subjects)
            .find(s => s.id === subjectId) || null;
        }
        return currentSubj;
      });

      setSelectedExperiment(currentExp => {
        if (currentExp?.id === experimentId) {
            return null;
        }
        return currentExp;
      });

      return newDepartments;
    });
  }, [isAdminAuthenticated]);

  const promptForPassword = () => {
    setPasswordModalOpen(true);
  };

  const handleToggleAdminView = () => {
    if (isAdminAuthenticated) {
      setAdminViewActive(prev => !prev);
      setSelectedExperiment(null);
    } else {
      promptForPassword();
    }
  };

  const handleAdminAccess = () => {
    if (!isAdmin) {
      setIsAdmin(true);
      const url = new URL(window.location.href);
      if (url.searchParams.get('admin') !== 'true') {
        url.searchParams.set('admin', 'true');
        window.history.pushState({}, '', url);
      }
    }
    
    if (isAdminAuthenticated) {
      setAdminViewActive(true);
    } else {
      promptForPassword();
    }

    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    // In a real app, this would be a secure API call.
    if (password === 'admin123') {
      setAdminAuthenticated(true);
      setPasswordModalOpen(false);
      setAdminViewActive(true);
      setSelectedExperiment(null);
      return true;
    }
    return false;
  };


  return (
    <>
      <PasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
      />
      <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
        <Sidebar 
          departments={departments}
          selectedSubject={selectedSubject}
          onSelectSubject={handleSelectSubject}
          isOpen={isSidebarOpen}
          setIsOpen={setSidebarOpen}
          onAdminAccess={handleAdminAccess}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            subjectName={adminViewActive ? 'Admin Panel' : selectedSubject?.name || 'Dashboard'}
            onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
            isAdmin={isAdmin}
            onToggleAdminView={handleToggleAdminView}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
            {adminViewActive ? (
              <AdminDashboard 
                  departments={departments}
                  onCreateExperiment={handleCreateExperiment}
                  onDeleteExperiment={handleDeleteExperiment}
                  onClose={() => setAdminViewActive(false)}
              />
            ) : selectedExperiment ? (
              <ExperimentView 
                experiment={selectedExperiment} 
                onBack={handleBackToList}
                onAddContribution={addContribution}
                isAdminAuthenticated={isAdminAuthenticated}
                onDeleteContribution={handleDeleteContribution}
              />
            ) : selectedSubject ? (
              <Dashboard 
                subject={selectedSubject} 
                onSelectExperiment={handleSelectExperiment} 
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                      <h2 className="text-2xl font-semibold text-gray-600">Welcome to LabLINK</h2>
                      <p className="mt-2 text-gray-500">Select a subject from the sidebar to get started.</p>
                  </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
