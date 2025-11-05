import React, { useState, useEffect } from 'react';
import { Department, Experiment, Subject } from '../types';

interface AdminDashboardProps {
    departments: Department[];
    onCreateExperiment: (subjectId: string, newExperiment: Omit<Experiment, 'id' | 'contributions'>) => void;
    onDeleteExperiment: (subjectId: string, experimentId: string) => void;
    onCreateDepartment: (name: string) => void;
    onDeleteDepartment: (departmentId: string) => void;
    onCreateSubject: (departmentId: string, subjectData: Omit<Subject, 'id' | 'experiments'>) => void;
    onDeleteSubject: (departmentId: string, subjectId: string) => void;
    onClose: () => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.028-2.124H9.028c-1.12 0-2.029.944-2.029 2.124v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

type AdminTab = 'experiments' | 'subjects' | 'departments';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    departments, 
    onCreateExperiment, 
    onDeleteExperiment,
    onCreateDepartment,
    onDeleteDepartment,
    onCreateSubject,
    onDeleteSubject, 
    onClose 
}) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('experiments');
    
    // State for creating experiments
    const [expDeptId, setExpDeptId] = useState(departments[0]?.id || '');
    const [expSubjId, setExpSubjId] = useState(departments[0]?.subjects[0]?.id || '');
    const [expTitle, setExpTitle] = useState('');
    const [expObjective, setExpObjective] = useState('');

    // State for creating subjects
    const [subjDeptId, setSubjDeptId] = useState(departments[0]?.id || '');
    const [subjName, setSubjName] = useState('');
    const [subjCode, setSubjCode] = useState('');
    const [subjDrive, setSubjDrive] = useState('');
    const [subjGithub, setSubjGithub] = useState('');

    // State for creating departments
    const [deptName, setDeptName] = useState('');

    const availableSubjects = departments.find(d => d.id === expDeptId)?.subjects || [];

    useEffect(() => {
        if (availableSubjects.length > 0) {
            if (!availableSubjects.find(s => s.id === expSubjId)) {
                setExpSubjId(availableSubjects[0].id);
            }
        } else {
            setExpSubjId('');
        }
    }, [expDeptId, departments]);

    const handleCreateExperimentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!expTitle.trim() || !expObjective.trim() || !expSubjId) {
            alert('Please fill out all fields to create an experiment.');
            return;
        }
        onCreateExperiment(expSubjId, { title: expTitle, objective: expObjective });
        setExpTitle('');
        setExpObjective('');
    };

    const handleCreateSubjectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!subjName.trim() || !subjCode.trim() || !subjDeptId) {
            alert('Please select a department and provide a name and code for the subject.');
            return;
        }
        onCreateSubject(subjDeptId, {name: subjName, code: subjCode, driveLink: subjDrive, githubLink: subjGithub });
        setSubjName('');
        setSubjCode('');
        setSubjDrive('');
        setSubjGithub('');
    };
    
    const handleCreateDepartmentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!deptName.trim()){
            alert('Please provide a name for the new department.');
            return;
        }
        onCreateDepartment(deptName);
        setDeptName('');
    };

    const confirmDelete = (message: string, action: () => void) => {
        if(window.confirm(message)) {
            action();
        }
    };
    
    const TABS: { id: AdminTab, name: string }[] = [
        { id: 'experiments', name: 'Manage Experiments' },
        { id: 'subjects', name: 'Manage Subjects' },
        { id: 'departments', name: 'Manage Departments' },
    ];

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
                
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-8">
                    {/* MANAGE EXPERIMENTS TAB */}
                    {activeTab === 'experiments' && (
                         <section>
                            <form onSubmit={handleCreateExperimentSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Create New Experiment</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="exp_department" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Department</label>
                                        <select id="exp_department" value={expDeptId} onChange={(e) => setExpDeptId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                                            {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="exp_subject" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Subject</label>
                                        <select id="exp_subject" value={expSubjId} onChange={(e) => setExpSubjId(e.target.value)} disabled={availableSubjects.length === 0} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:disabled:bg-gray-800">
                                            {availableSubjects.map(subj => <option key={subj.id} value={subj.id}>{subj.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Experiment Title</label>
                                    <input type="text" id="title" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} placeholder="e.g., Implement a Singly Linked List" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                                </div>
                                <div>
                                    <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Objective</label>
                                    <textarea id="objective" rows={3} value={expObjective} onChange={(e) => setExpObjective(e.target.value)} placeholder="Describe the main goal of this experiment..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                                </div>
                                <div className="flex justify-end pt-2"><button type="submit" className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">Create Experiment</button></div>
                            </form>
                            <div className="mt-8 pt-6 border-t dark:border-gray-700"><h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Existing Experiments</h3>
                                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-2">{departments.map(dept => dept.subjects.map(subj => subj.experiments.map(exp => (
                                    <div key={exp.id} className="flex justify-between items-center p-3 bg-gray-50/50 border rounded-lg dark:bg-gray-800/50 dark:border-gray-700">
                                        <div>
                                            <p className="text-gray-800 text-sm font-semibold dark:text-gray-200">{exp.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{dept.name} / {subj.name}</p>
                                        </div>
                                        <button onClick={() => confirmDelete(`Are you sure you want to delete the experiment "${exp.title}"?`, () => onDeleteExperiment(subj.id, exp.id))} className="flex items-center space-x-1 text-red-600 hover:text-red-800 font-medium text-sm p-1 -m-1 rounded-md transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                ))))}</div>
                            </div>
                        </section>
                    )}

                    {/* MANAGE SUBJECTS TAB */}
                    {activeTab === 'subjects' && (
                         <section>
                            <form onSubmit={handleCreateSubjectSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Create New Subject (Lab)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="subj_department" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Department</label>
                                        <select id="subj_department" value={subjDeptId} onChange={(e) => setSubjDeptId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                                            {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="subj_name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Subject Name</label>
                                        <input type="text" id="subj_name" value={subjName} onChange={(e) => setSubjName(e.target.value)} placeholder="e.g., Data Structures Lab" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                                    </div>
                                    <div>
                                        <label htmlFor="subj_code" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Subject Code</label>
                                        <input type="text" id="subj_code" value={subjCode} onChange={(e) => setSubjCode(e.target.value)} placeholder="e.g., CS201L" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="subj_drive" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Google Drive Link (Optional)</label>
                                        <input type="url" id="subj_drive" value={subjDrive} onChange={(e) => setSubjDrive(e.target.value)} placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                                    </div>
                                    <div>
                                        <label htmlFor="subj_github" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">GitHub Link (Optional)</label>
                                        <input type="url" id="subj_github" value={subjGithub} onChange={(e) => setSubjGithub(e.target.value)} placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2"><button type="submit" className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">Create Subject</button></div>
                            </form>
                            <div className="mt-8 pt-6 border-t dark:border-gray-700"><h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Existing Subjects</h3>
                                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-2">{departments.map(dept => dept.subjects.map(subj => (
                                    <div key={subj.id} className="flex justify-between items-center p-3 bg-gray-50/50 border rounded-lg dark:bg-gray-800/50 dark:border-gray-700">
                                        <div>
                                            <p className="text-gray-800 text-sm font-semibold dark:text-gray-200">{subj.name} ({subj.code})</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{dept.name}</p>
                                        </div>
                                        <button onClick={() => confirmDelete(`Are you sure you want to delete the subject "${subj.name}"? This will also delete all experiments within it.`, () => onDeleteSubject(dept.id, subj.id))} className="flex items-center space-x-1 text-red-600 hover:text-red-800 font-medium text-sm p-1 -m-1 rounded-md transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                )))}</div>
                            </div>
                        </section>
                    )}

                    {/* MANAGE DEPARTMENTS TAB */}
                    {activeTab === 'departments' && (
                         <section>
                            <form onSubmit={handleCreateDepartmentSubmit} className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Create New Department</h2>
                                <div>
                                    <label htmlFor="dept_name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Department Name</label>
                                    <input type="text" id="dept_name" value={deptName} onChange={(e) => setDeptName(e.target.value)} placeholder="e.g., Mechanical Engineering" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                                </div>
                                <div className="flex justify-end pt-2"><button type="submit" className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">Create Department</button></div>
                            </form>
                            <div className="mt-8 pt-6 border-t dark:border-gray-700"><h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Existing Departments</h3>
                                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-2">{departments.map(dept => (
                                    <div key={dept.id} className="flex justify-between items-center p-3 bg-gray-50/50 border rounded-lg dark:bg-gray-800/50 dark:border-gray-700">
                                        <p className="text-gray-800 text-sm font-semibold dark:text-gray-200">{dept.name}</p>
                                        <button onClick={() => confirmDelete(`Are you sure you want to delete the department "${dept.name}"? This will delete all subjects and experiments within it.`, () => onDeleteDepartment(dept.id))} className="flex items-center space-x-1 text-red-600 hover:text-red-800 font-medium text-sm p-1 -m-1 rounded-md transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                ))}</div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;