import React, { useState, useEffect } from 'react';
import { Department, Experiment } from '../types';

interface AdminDashboardProps {
    departments: Department[];
    onCreateExperiment: (subjectId: string, newExperiment: Omit<Experiment, 'id' | 'contributions'>) => void;
    onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ departments, onCreateExperiment, onClose }) => {
    const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || '');
    const [selectedSubjId, setSelectedSubjId] = useState(departments[0]?.subjects[0]?.id || '');
    const [title, setTitle] = useState('');
    const [objective, setObjective] = useState('');

    const availableSubjects = departments.find(d => d.id === selectedDeptId)?.subjects || [];

    useEffect(() => {
        // When department changes, update subject to the first available one
        if (availableSubjects.length > 0) {
            setSelectedSubjId(availableSubjects[0].id);
        } else {
            setSelectedSubjId('');
        }
    }, [selectedDeptId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !objective.trim() || !selectedSubjId) {
            // A simple validation alert
            alert('Please fill out all fields to create an experiment.');
            return;
        }
        onCreateExperiment(selectedSubjId, { title, objective });
        // Reset form for next entry
        setTitle('');
        setObjective('');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                 <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h1 className="text-3xl font-extrabold text-gray-900">Admin Panel</h1>
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Create New Experiment</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                                id="department"
                                value={selectedDeptId}
                                onChange={(e) => setSelectedDeptId(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            >
                                {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select
                                id="subject"
                                value={selectedSubjId}
                                onChange={(e) => setSelectedSubjId(e.target.value)}
                                disabled={availableSubjects.length === 0}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md disabled:bg-gray-100"
                            >
                                {availableSubjects.map(subj => <option key={subj.id} value={subj.id}>{subj.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Experiment Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Implement a Singly Linked List"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                        <textarea
                            id="objective"
                            rows={4}
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            placeholder="Describe the main goal of this experiment..."
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
            </div>
        </div>
    );
};

export default AdminDashboard;
