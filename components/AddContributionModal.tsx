
import React, { useState, Fragment } from 'react';
import { Contribution, ContributionType } from '../types';

interface AddContributionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (contribution: Omit<Contribution, 'id' | 'upvotes' | 'createdAt'>) => void;
}

const AddContributionModal: React.FC<AddContributionModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [type, setType] = useState<ContributionType>(ContributionType.Code);
    const [author, setAuthor] = useState('');
    const [question, setQuestion] = useState('');
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const contributionData: Omit<Contribution, 'id' | 'upvotes' | 'createdAt'> = {
            author: author || 'Anonymous',
            type,
            content,
            question: type === ContributionType.Viva ? question : undefined,
            language: type === ContributionType.Code ? language : undefined,
            imageUrl: type === ContributionType.Diagram ? imageUrl : undefined,
        };
        onSubmit(contributionData);
        // Reset form and close
        setAuthor('');
        setQuestion('');
        setContent('');
        setImageUrl('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col dark:bg-gray-800">
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Add a New Contribution</h2>
                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Share your knowledge with the community.</p>
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
                        
                         {type === ContributionType.Code && (
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
                                <input
                                    type="text"
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    placeholder="e.g., C++, Python, Java"
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

                        {type !== ContributionType.Diagram && (
                             <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {type === ContributionType.Code ? 'Code Snippet' : type === ContributionType.Viva ? 'Answer' : 'Content'}
                                </label>
                                <textarea
                                    id="content"
                                    rows={type === ContributionType.Code ? 10 : 5}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={`Enter the ${type.toLowerCase()} here...`}
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                />
                            </div>
                        )}

                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3 dark:bg-gray-800/50 dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Submit Contribution
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContributionModal;