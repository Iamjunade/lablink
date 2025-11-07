
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Department, Subject, Experiment, Contribution } from './types';
import { getData, saveData } from './services/dataService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExperimentView from './components/ExperimentView';
import AdminDashboard from './components/AdminDashboard';
import PasswordModal from './components/PasswordModal';
import SearchResultsView, { SearchResult } from './components/SearchResultsView';
import FocusModeOverlay from './components/FocusModeOverlay';

const App: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminViewActive, setAdminViewActive] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isAdminAuthenticated, setAdminAuthenticated] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
    }
  }, []);
  
  // Focus Mode key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement;
        const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;

        if (isTyping) {
            return;
        }

        if (event.code === 'Space') {
            event.preventDefault();
            setIsFocusMode(prev => !prev);
        }

        if (event.code === 'Escape' && isFocusMode) {
            setIsFocusMode(false);
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocusMode]);

  // Derive the selected experiment object from the ID and the main departments array.
  // This ensures the displayed data is always in sync with the source of truth.
  const selectedExperiment = useMemo(() => {
    if (!selectedExperimentId) return null;
    for (const dept of departments) {
      for (const subj of dept.subjects) {
        const exp = subj.experiments.find(e => e.id === selectedExperimentId);
        if (exp) return exp;
      }
    }
    return null;
  }, [departments, selectedExperimentId]);

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

    // Perform search when searchQuery changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const results: SearchResult[] = [];
        const lowerCaseQuery = searchQuery.toLowerCase();

        departments.forEach(dept => {
            dept.subjects.forEach(subj => {
                subj.experiments.forEach(exp => {
                    const experimentTitleMatch = exp.title.toLowerCase().includes(lowerCaseQuery);

                    exp.contributions.forEach(contrib => {
                        let contentMatch = contrib.content.toLowerCase().includes(lowerCaseQuery);
                        if (contrib.type === 'Code Snippet' && contrib.codeSnippets) {
                            if (!contentMatch) { // Only search snippets if description didn't match
                                contentMatch = contrib.codeSnippets.some(snippet => snippet.code.toLowerCase().includes(lowerCaseQuery));
                            }
                        }

                        const questionMatch = contrib.question?.toLowerCase().includes(lowerCaseQuery);
                        const authorMatch = contrib.author.toLowerCase().includes(lowerCaseQuery);

                        if (contentMatch || questionMatch || authorMatch || experimentTitleMatch) {
                            if (!results.some(r => r.contribution.id === contrib.id)) {
                                results.push({
                                    contribution: contrib,
                                    experiment: { id: exp.id, title: exp.title },
                                    subject: { id: subj.id, name: subj.name },
                                    department: { name: dept.name },
                                });
                            }
                        }
                    });
                });
            });
        });
        setSearchResults(results);
    }, [searchQuery, departments]);
  
  // Helper function to update state and persist data
  const updateAndSaveData = (newDepartments: Department[]) => {
    setDepartments(newDepartments);
    saveData(newDepartments);
  };
  
  const handleSelectSubject = useCallback((subject: Subject) => {
    const parentDept = departments.find(dept => dept.subjects.some(s => s.id === subject.id)) || null;
    setSelectedDepartment(parentDept);
    setSelectedSubject(subject);
    setSelectedExperimentId(null);
    setAdminViewActive(false);
    setSidebarOpen(false); // Close sidebar on selection (mobile)
  }, [departments]);
  
  const handleSelectExperiment = (experiment: Experiment) => {
    setSelectedExperimentId(experiment.id);
    setAdminViewActive(false);
  };
  
  const handleBackToDashboard = () => {
    setSelectedExperimentId(null);
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
  };

  const handleUpdateContribution = (experimentId: string, updatedContribution: Contribution) => {
    const newDepartments = departments.map(dept => ({
      ...dept,
      subjects: dept.subjects.map(subj => ({
        ...subj,
        experiments: subj.experiments.map(exp => {
          if (exp.id === experimentId) {
            return {
              ...exp,
              contributions: exp.contributions.map(c =>
                c.id === updatedContribution.id ? updatedContribution : c
              ),
            };
          }
          return exp;
        }),
      })),
    }));
    updateAndSaveData(newDepartments);
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
    if(selectedExperimentId === experimentId) {
        setSelectedExperimentId(null);
    }
  };

  const handleCreateDepartment = (name: string) => {
    const newDepartment: Department = {
      id: `dept-${Date.now()}`,
      name,
      subjects: [],
    };
    updateAndSaveData([...departments, newDepartment]);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    const newDepartments = departments.filter(d => d.id !== departmentId);
    // If we deleted the currently selected department, reset selection
    if (selectedDepartment?.id === departmentId) {
        const firstDept = newDepartments[0] || null;
        setSelectedDepartment(firstDept);
        setSelectedSubject(firstDept?.subjects[0] || null);
    }
    updateAndSaveData(newDepartments);
  };

  const handleCreateSubject = (departmentId: string, subjectData: Omit<Subject, 'id' | 'experiments'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `subj-${Date.now()}`,
      experiments: [],
    };
    const newDepartments = departments.map(dept => {
      if (dept.id === departmentId) {
        return { ...dept, subjects: [...dept.subjects, newSubject] };
      }
      return dept;
    });
    updateAndSaveData(newDepartments);
  };

  const handleDeleteSubject = (departmentId: string, subjectId: string) => {
    const newDepartments = departments.map(dept => {
      if (dept.id === departmentId) {
        const updatedSubjects = dept.subjects.filter(s => s.id !== subjectId);
        // If we deleted the currently selected subject, deselect it
        if (selectedSubject?.id === subjectId) {
            setSelectedSubject(null);
        }
        return { ...dept, subjects: updatedSubjects };
      }
      return dept;
    });
    updateAndSaveData(newDepartments);
  };
  
  const handlePasswordSubmit = (password: string) => {
    // In a real app, this would be a secure check.
    if (password === 'admin123') {
        setAdminAuthenticated(true);
        setPasswordModalOpen(false);
        setAdminViewActive(true);
        setSelectedExperimentId(null); // Exit experiment view if open
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
             setSelectedExperimentId(null);
        }
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    let subjectToSelect: Subject | null = null;
    let experimentToSelect: Experiment | null = null;

    for (const dept of departments) {
        const foundSubject = dept.subjects.find(s => s.id === result.subject.id);
        if (foundSubject) {
            subjectToSelect = foundSubject;
            experimentToSelect = foundSubject.experiments.find(e => e.id === result.experiment.id) || null;
            break;
        }
    }

    if (subjectToSelect && experimentToSelect) {
        handleSelectSubject(subjectToSelect);
        setSelectedExperimentId(experimentToSelect.id);
        setSearchQuery('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-600 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Lab Portal...</h2>
            <p className="text-gray-500 dark:text-gray-400">Fetching the latest contributions.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (searchQuery.trim().length > 0) {
        return <SearchResultsView 
                    query={searchQuery} 
                    results={searchResults} 
                    onResultClick={handleSearchResultClick} 
                />;
    }
    if (adminViewActive && isAdminAuthenticated) {
        return <AdminDashboard 
                    departments={departments}
                    onCreateExperiment={handleCreateExperiment}
                    onDeleteExperiment={handleDeleteExperiment}
                    onCreateDepartment={handleCreateDepartment}
                    onDeleteDepartment={handleDeleteDepartment}
                    onCreateSubject={handleCreateSubject}
                    onDeleteSubject={handleDeleteSubject}
                    onClose={() => setAdminViewActive(false)}
                />;
    }
    if (selectedSubject && !selectedExperiment) {
        return <Dashboard subject={selectedSubject} onSelectExperiment={handleSelectExperiment} />;
    }
    if (selectedExperiment) {
        return <ExperimentView 
                    experiment={selectedExperiment} 
                    onBack={handleBackToDashboard} 
                    onAddContribution={handleAddContribution}
                    onUpdateContribution={handleUpdateContribution}
                    isAdminAuthenticated={isAdminAuthenticated}
                    onDeleteContribution={handleDeleteContribution}
                    onUpvoteContribution={handleUpvoteContribution}
                />;
    }
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Welcome to LabLINK</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Please select a subject from the sidebar to view experiments.</p>
            </div>
        </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans dark:bg-gray-950">
        {isFocusMode && <FocusModeOverlay onClose={() => setIsFocusMode(false)} />}
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
            theme={theme}
            onToggleTheme={toggleTheme}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-950 p-4 md:p-8">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;