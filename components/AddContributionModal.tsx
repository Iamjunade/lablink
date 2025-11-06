
import React, { useState, Fragment, useEffect } from 'react';
import { Contribution, ContributionType, CodeSnippet } from '../types';

interface AddContributionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (contribution: Omit<Contribution, 'id' | 'upvotes' | 'createdAt'>) => void;
    contributionToEdit?: Contribution | null;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.028-2.124H9.028c-1.12 0-2.029.944-2.029 2.124v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);


const AddContributionModal: React.FC<AddContributionModalProps> = ({ isOpen, onClose, onSubmit, contributionToEdit }) => {
    const [type, setType] = useState<ContributionType>(ContributionType.Code);
    const [author, setAuthor] = useState('');
    const [question, setQuestion] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [snippets, setSnippets] = useState<CodeSnippet[]>([{ language: 'javascript', code: '' }]);

    const isEditing = !!contributionToEdit;

    const resetForm = () => {
        setAuthor('');
        setQuestion('');
        setContent('');
        setImageUrl('');
        setSnippets([{ language: 'javascript', code: '' }]);
        setType(ContributionType.Code);
    };

    useEffect(() => {
        if (!isOpen) return;

        if (contributionToEdit) {
            // Pre-fill form for editing
            setAuthor(contributionToEdit.author);
            setType(contributionToEdit.type);
            setContent(contributionToEdit.content || '');
            setQuestion(contributionToEdit.question || '');
            setImageUrl(contributionToEdit.imageUrl || '');
            
            if (contributionToEdit.codeSnippets && contributionToEdit.codeSnippets.length > 0) {
                 setSnippets(contributionToEdit.codeSnippets);
            } else {
                 setSnippets([{ language: 'javascript', code: '' }]);
            }
        } else {
            // This is a new contribution, ensure form is in its default state
            resetForm();
        }
    }, [isOpen, contributionToEdit]);


    const handleAddSnippet = () => {
        setSnippets([...snippets, { language: 'python', code: '' }]);
    };

    const handleRemoveSnippet = (index: number) => {
        setSnippets(snippets.filter((_, i) => i !== index));
    };

    const handleSnippetChange = (index: number, field: keyof CodeSnippet, value: string) => {
        const newSnippets = [...snippets];
        newSnippets[index][field] = value;
        setSnippets(newSnippets);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let contributionData: Omit<Contribution, 'id' | 'upvotes' | 'createdAt'>;
        
        if (type === ContributionType.Code) {
            contributionData = {
                author,
                type,
                content, // Description for code snippets
                codeSnippets: snippets.filter(s => s.code.trim() !== ''), // Only add non-empty snippets
            };
        } else {
             contributionData = {
                author,
                type,
                content,
                question: type === ContributionType.Viva ? question : undefined,
                imageUrl: type === ContributionType.Diagram ? imageUrl : undefined,
            };
        }
        
        onSubmit(contributionData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col dark:bg-gray-800">
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{isEditing ? 'Edit Contribution' : 'Add a New Contribution'}</h2>
                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{isEditing ? 'Update the details for this contribution.' : 'Share your knowledge with the community.'}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name (Optional)</label>
                            <input
                                type="text"
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="e.g., John Doe"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contribution Type</label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value as ContributionType)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            >
                                {Object.values(ContributionType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        {type === ContributionType.Viva && (
                            <div>
                                <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Viva Question</label>
                                <input
                                    type="text"
                                    id="question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Enter the viva question"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                />
                            </div>
                        )}
                        
                        {type === ContributionType.Diagram && (
                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                                <input
                                    type="url"
                                    id="imageUrl"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/diagram.png"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                />
                                 <label htmlFor="content" className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">Caption</label>
                                 <input
                                    type="text"
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="A brief description of the diagram"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                />
                            </div>
                        )}

                        {type === ContributionType.Code && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                                    <textarea
                                        id="content"
                                        rows={2}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Add a brief description for your code snippets..."
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                    />
                                </div>
                                {snippets.map((snippet, index) => (
                                    <div key={index} className="p-4 border rounded-md space-y-3 bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code Snippet {index + 1}</label>
                                            {snippets.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveSnippet(index)} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={snippet.language}
                                            onChange={(e) => handleSnippetChange(index, 'language', e.target.value)}
                                            placeholder="Language (e.g., Python, C++)"
                                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                        />
                                        <textarea
                                            rows={8}
                                            value={snippet.code}
                                            onChange={(e) => handleSnippetChange(index, 'code', e.target.value)}
                                            placeholder={`Enter code here...`}
                                            required={snippets.length === 1}
                                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddSnippet} className="w-full px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 border border-transparent rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-900/50 dark:text-primary-300 dark:hover:bg-primary-900">
                                    + Add Another Snippet
                                </button>
                            </div>
                        )}

                        {type !== ContributionType.Diagram && type !== ContributionType.Code && (
                             <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {type === ContributionType.Viva ? 'Answer' : 'Content'}
                                </label>
                                <textarea
                                    id="content"
                                    rows={5}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={`Enter the ${type.toLowerCase()} here...`}
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                />
                            </div>
                        )}

                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3 dark:bg-gray-800/50 dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            {isEditing ? 'Update Contribution' : 'Submit Contribution'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContributionModal;
