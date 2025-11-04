import React, { useState, useEffect } from 'react';
import { Department, Experiment } from '../types';

interface AdminDashboardProps {
    departments: Department[];
    onCreateExperiment: (subjectId: string, newExperiment: Omit<Experiment, 'id' | 'contributions'>) => void;
    onDeleteExperiment: (subjectId: string, experimentId: string) => void;
    onClose: () => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.028-2.124H9.028c-1.12 0-2.029.944-2.029 2.124v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ departments, onCreateExperiment, onDeleteExperiment, onClose }) => {
    const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || '');
    const [selectedSubjId, setSelectedSubjId] = useState(departments[0]?.subjects[0]?.id || '');
    const [title, setTitle] = useState('');
    const [objective, setObjective] = useState('');

    const availableSubjects = departments.find(d => d.id === selectedDeptId)?.subjects || [];

    useEffect(() => {
        if (availableSubjects.length > 0) {
            setSelectedSubjId(availableSubjects[0].id);
        } else {
            setSelectedSubjId('');
        }
    }, [selectedDeptId, departments]);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !objective.trim() || !selectedSubjId) {
            alert('Please fill out all fields to create an experiment.');
            return;
        }
        onCreateExperiment(selectedSubjId, { title, objective });
        setTitle('');
        setObjective('');
    };

    const handleDeleteClick = (subjectId: string, experimentId: string, experimentTitle: string) => {
        if (window.confirm(`Are you sure you want to delete the experiment "${experimentTitle}"? This action cannot be undone.`)) {
            onDeleteExperiment(subjectId, experimentId);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg dark:bg-gray-900">
                 <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Admin Panel</h1>
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>

                {/* Create Experiment Section */}
                <section>
                    <form onSubmit={handleCreateSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Create New Experiment</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Department</label>
                                <select
                                    id="department"
                                    value={selectedDeptId}
                                    onChange={(e) => setSelectedDeptId(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                >
                                    {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Subject</label>
                                <select
                                    id="subject"
                                    value={selectedSubjId}
                                    onChange={(e) => setSelectedSubjId(e.target.value)}
                                    disabled={availableSubjects.length === 0}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:disabled:bg-gray-800"
                                >
                                    {availableSubjects.map(subj => <option key={subj.id} value={subj.id}>{subj.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Experiment Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Implement a Singly Linked List"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Objective</label>
                            <textarea
                                id="objective"
                                rows={4}
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                placeholder="Describe the main goal of this experiment..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            />
                        </div>
                        
                        <div className="flex justify-end pt-4">
                             <button 
                                type="submit"
                                className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                Create Experiment
                            </button>
                        </div>
                    </form>
                </section>

                {/* Manage Experiments Section */}
                <section className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Manage Existing Experiments</h2>
                    <div className="mt-6 space-y-6">
                        {departments.map(dept => (
                            <div key={dept.id}>
                                <h3 className="text-lg font-semibold text-gray-700 bg-gray-100 p-2 rounded-md dark:bg-gray-800 dark:text-gray-300">{dept.name}</h3>
                                <div className="mt-4 space-y-4 pl-4">
                                    {dept.subjects.map(subj => (
                                        <div key={subj.id}>
                                            <h4 className="text-md font-medium text-gray-600 dark:text-gray-400">{subj.name}</h4>
                                            <ul className="mt-2 space-y-2">
                                                {subj.experiments.length > 0 ? (
                                                    subj.experiments.map(exp => (
                                                        <li key={exp.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800">
                                                            <span className="text-gray-800 text-sm dark:text-gray-200">{exp.title}</span>
                                                            <button
                                                                onClick={() => handleDeleteClick(subj.id, exp.id, exp.title)}
                                                                className="flex items-center space-x-2 text-red-600 hover:text-red-800 font-medium text-sm p-2 -m-2 rounded-md transition-colors"
                                                                aria-label={`Delete ${exp.title}`}
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                                <span>Delete</span>
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-gray-500 italic text-sm px-3 dark:text-gray-500">No experiments in this subject.</li>
                                                )}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;