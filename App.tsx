import React, { useState, useCallback, useEffect } from 'react';
import { Department, Subject, Experiment, Contribution } from './types';
import { getData, saveData } from './services/dataService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExperimentView from './components/ExperimentView';
import AdminDashboard from './components/AdminDashboard';
import PasswordModal from './components/PasswordModal';

const App: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
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

  // Fetch initial data from the backend service
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const data = await getData();
      setDepartments(data);
      const initialDept = data[0] || null;
      setSelectedDepartment(initialDept);
      setSelectedSubject(initialDept?.subjects[0] || null);
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);
  
  // Helper function to update state and persist data
  const updateAndSaveData = (newDepartments: Department[]) => {
    setDepartments(newDepartments);
    saveData(newDepartments);
  };
  
  const handleSelectSubject = useCallback((subject: Subject) => {
    const parentDept = departments.find(dept => dept.subjects.some(s => s.id === subject.id)) || null;
    setSelectedDepartment(parentDept);
    setSelectedSubject(subject);
    setSelectedExperiment(null);
    setAdminViewActive(false);
    setSidebarOpen(false); // Close sidebar on selection (mobile)
  }, [departments]);
  
  const handleSelectExperiment = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setAdminViewActive(false);
  };
  
  const handleBackToDashboard = () => {
    setSelectedExperiment(null);
  };

  const handleAddContribution = (experimentId: string, contribution: Contribution) => {
    const newDepartments = departments.map(dept => ({
      ...dept,
      subjects: dept.subjects.map(subj => ({
        ...subj,
        experiments: subj.experiments.map(exp => {
          if (exp.id === experimentId) {
            return { ...exp, contributions: [...exp.contributions, contribution] };
          }
          return exp;
        }),
      })),
    }));
    updateAndSaveData(newDepartments);
    // Also update the selected experiment in state to see the change immediately
     if (selectedExperiment?.id === experimentId) {
        setSelectedExperiment(prev => prev ? {...prev, contributions: [...prev.contributions, contribution]} : null);
    }
  };
  
  const handleDeleteContribution = (experimentId: string, contributionId: string) => {
     const newDepartments = departments.map(dept => ({
      ...dept,
      subjects: dept.subjects.map(subj => ({
        ...subj,
        experiments: subj.experiments.map(exp => {
          if (exp.id === experimentId) {
            return { ...exp, contributions: exp.contributions.filter(c => c.id !== contributionId) };
          }
          return exp;
        }),
      })),
    }));
    updateAndSaveData(newDepartments);
     // Also update the selected experiment in state to see the change immediately
    if (selectedExperiment?.id === experimentId) {
        setSelectedExperiment(prev => prev ? {...prev, contributions: prev.contributions.filter(c => c.id !== contributionId)} : null);
    }
  };

  const handleUpvoteContribution = (experimentId: string, contributionId: string) => {
    const newDepartments = departments.map(dept => ({
        ...dept,
        subjects: dept.subjects.map(subj => ({
            ...subj,
            experiments: subj.experiments.map(exp => {
                if (exp.id === experimentId) {
                    return {
                        ...exp,
                        contributions: exp.contributions.map(c => 
                            c.id === contributionId ? { ...c, upvotes: c.upvotes + 1 } : c
                        ),
                    };
                }
                return exp;
            }),
        })),
    }));
    updateAndSaveData(newDepartments);
    // Update the selected experiment in state to see the change immediately
    if (selectedExperiment?.id === experimentId) {
        setSelectedExperiment(prev => prev ? {
            ...prev,
            contributions: prev.contributions.map(c =>
                c.id === contributionId ? { ...c, upvotes: c.upvotes + 1 } : c
            )
        } : null);
    }
  };
  
  const handleCreateExperiment = (subjectId: string, newExperimentData: Omit<Experiment, 'id' | 'contributions'>) => {
    const newExperiment: Experiment = {
        ...newExperimentData,
        id: `exp-${Date.now()}`,
        contributions: [],
    };
    const newDepartments = departments.map(dept => ({
      ...dept,
      subjects: dept.subjects.map(subj => {
        if (subj.id === subjectId) {
          return { ...subj, experiments: [...subj.experiments, newExperiment] };
        }
        return subj;
      }),
    }));
    updateAndSaveData(newDepartments);
  };
  
  const handleDeleteExperiment = (subjectId: string, experimentId: string) => {
    const newDepartments = departments.map(dept => ({
      ...dept,
      subjects: dept.subjects.map(subj => {
        if (subj.id === subjectId) {
          return { ...subj, experiments: subj.experiments.filter(exp => exp.id !== experimentId) };
        }
        return subj;
      }),
    }));
    updateAndSaveData(newDepartments);
    // If the deleted experiment was the selected one, go back to dashboard
    if(selectedExperiment?.id === experimentId) {
        setSelectedExperiment(null);
    }
  };
  
  const handlePasswordSubmit = (password: string) => {
    // In a real app, this would be a secure check.
    if (password === 'admin123') {
        setAdminAuthenticated(true);
        setPasswordModalOpen(false);
        setAdminViewActive(true);
        setSelectedExperiment(null); // Exit experiment view if open
        return true;
    }
    return false;
  };
  
  const handleToggleAdminView = () => {
    if (!isAdminAuthenticated) {
        setPasswordModalOpen(true);
    } else {
        setAdminViewActive(prev => !prev);
        if(!adminViewActive) { // If we are opening it
             setSelectedExperiment(null);
        }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-600 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading Lab Portal...</h2>
            <p className="text-gray-500">Fetching the latest contributions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
        <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)} onSubmit={handlePasswordSubmit} />
        <Sidebar 
            departments={departments} 
            selectedSubject={selectedSubject} 
            onSelectSubject={handleSelectSubject} 
            isOpen={isSidebarOpen}
            setIsOpen={setSidebarOpen}
        />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            subjectName={selectedSubject?.name || 'LabLINK Dashboard'} 
            onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
            isAdmin={isAdmin || isAdminAuthenticated}
            onToggleAdminView={handleToggleAdminView}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
            {adminViewActive && isAdminAuthenticated ? (
                <AdminDashboard 
                    departments={departments}
                    onCreateExperiment={handleCreateExperiment}
                    onDeleteExperiment={handleDeleteExperiment}
                    onClose={() => setAdminViewActive(false)}
                />
            ) : selectedSubject && !selectedExperiment ? (
                <Dashboard subject={selectedSubject} onSelectExperiment={handleSelectExperiment} />
            ) : selectedExperiment ? (
                <ExperimentView 
                    experiment={selectedExperiment} 
                    onBack={handleBackToDashboard} 
                    onAddContribution={handleAddContribution}
                    isAdminAuthenticated={isAdminAuthenticated}
                    onDeleteContribution={handleDeleteContribution}
                    onUpvoteContribution={handleUpvoteContribution}
                />
            ) : (
                 <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-700">Welcome to LabLINK</h2>
                        <p className="mt-2 text-gray-500">Please select a subject from the sidebar to view experiments.</p>
                    </div>
                 </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;