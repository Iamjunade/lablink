import React, { useState, useCallback, useEffect } from 'react';
import { MOCK_DATA } from './constants';
import { Department, Subject, Experiment, Contribution } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExperimentView from './components/ExperimentView';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(MOCK_DATA);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(departments[0] || null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(selectedDepartment?.subjects[0] || null);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminViewActive, setAdminViewActive] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
    }
  }, []);

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
    const updateExperimentContributions = (exp: Experiment) => {
      if (exp.id === experimentId) {
        return {
          ...exp,
          contributions: [contribution, ...exp.contributions]
        };
      }
      return exp;
    };
    
    setDepartments(prevDepts => prevDepts.map(dept => ({
      ...dept,
      subjects: dept.subjects.map(subj => ({
        ...subj,
        experiments: subj.experiments.map(updateExperimentContributions)
      }))
    })));

    if (selectedExperiment && selectedExperiment.id === experimentId) {
      setSelectedExperiment(prev => prev ? updateExperimentContributions(prev) : null);
    }
  }, [departments, selectedExperiment]);

  const handleDeleteContribution = useCallback((experimentId: string, contributionId: string) => {
    if (!isAdmin) return;
    
    const updateExperimentContributions = (exp: Experiment) => {
        if (exp.id === experimentId) {
            return {
                ...exp,
                contributions: exp.contributions.filter(c => c.id !== contributionId)
            };
        }
        return exp;
    };

    setDepartments(prevDepts => prevDepts.map(dept => ({
      ...dept,
      subjects: dept.subjects.map(subj => ({
        ...subj,
        experiments: subj.experiments.map(updateExperimentContributions)
      }))
    })));

    if (selectedExperiment && selectedExperiment.id === experimentId) {
      setSelectedExperiment(prev => prev ? updateExperimentContributions(prev) : null);
    }
  }, [isAdmin, selectedExperiment]);
  
  const handleCreateExperiment = useCallback((subjectId: string, newExperimentData: Omit<Experiment, 'id' | 'contributions'>) => {
    if (!isAdmin) return;

    const experimentToAdd: Experiment = {
        ...newExperimentData,
        id: `exp-admin-${Date.now()}`,
        contributions: [],
    };

    setDepartments(prevDepts => prevDepts.map(dept => ({
        ...dept,
        subjects: dept.subjects.map(subj => {
            if (subj.id === subjectId) {
                // To reflect the change in the dashboard, we also need to update the selected subject if it's the one being modified
                if (selectedSubject?.id === subjectId) {
                    setSelectedSubject(prevSubj => prevSubj ? { ...prevSubj, experiments: [...prevSubj.experiments, experimentToAdd]} : null);
                }
                return {
                    ...subj,
                    experiments: [...subj.experiments, experimentToAdd]
                };
            }
            return subj;
        })
    })));
    setAdminViewActive(false); // Close admin panel after creating
  }, [isAdmin, selectedSubject]);

  const handleToggleAdminView = () => {
    setAdminViewActive(prev => !prev);
    setSelectedExperiment(null);
  };


  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      <Sidebar 
        departments={departments}
        selectedSubject={selectedSubject}
        onSelectSubject={handleSelectSubject}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
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
                onClose={() => setAdminViewActive(false)}
            />
           ) : selectedExperiment ? (
            <ExperimentView 
              experiment={selectedExperiment} 
              onBack={handleBackToList}
              onAddContribution={addContribution}
              isAdmin={isAdmin}
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
  );
};

export default App;
