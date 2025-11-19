import React, { useState, useEffect, useRef } from 'react';
import { Contribution, ContributionType, CodeSnippet } from '../types';
import { SparklesIcon, TrashIcon, UpvoteIcon, CopyIcon, EditIcon } from './common/Icons';

// Add Prism to the window object for TypeScript
declare global {
    interface Window {
        Prism: {
            highlightAllUnder: (element: Element) => void;
            highlightElement: (element: Element) => void;
        };
    }
}

const CodeBlock: React.FC<{ language: string, code: string }> = ({ language, code }) => {
    const [copyStatus, setCopyStatus] = useState('Copy');
    const codeRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (codeRef.current && window.Prism) {
            window.Prism.highlightElement(codeRef.current);
        }
    }, [language, code]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        }, () => {
            setCopyStatus('Failed!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        });
    };

    return (
        <div className="bg-gray-900 rounded-md text-sm dark:bg-black/50">
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700 dark:border-gray-800">
                <span className="text-xs font-semibold text-gray-400 uppercase">{language || 'Code'}</span>
                <button onClick={handleCopy} className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white dark:hover:text-gray-200" aria-label="Copy code to clipboard">
                    <CopyIcon className="w-4 h-4" />
                    <span>{copyStatus}</span>
                </button>
            </div>
            <pre className="p-4 overflow-x-auto"><code ref={codeRef} className={`language-${(language || 'javascript').toLowerCase()}`}>{code}</code></pre>
        </div>
    );
};


const ContributionCard: React.FC<{
    contribution: Contribution;
    isAdminAuthenticated: boolean;
    onDelete: () => void;
    onUpvote: () => void;
    onEdit: (contribution: Contribution) => void;
}> = ({ contribution, isAdminAuthenticated, onDelete, onUpvote, onEdit }) => {
    
    const upvotedStorageKey = 'lablink_upvoted';
    const [isUpvoted, setIsUpvoted] = useState(false);
    
    useEffect(() => {
        try {
            const upvotedItems = JSON.parse(localStorage.getItem(upvotedStorageKey) || '[]');
            setIsUpvoted(upvotedItems.includes(contribution.id));
        } catch (e) {
            setIsUpvoted(false);
        }
    }, [contribution.id]);

    const handleUpvote = () => {
        if (isUpvoted) return;

        try {
            const upvotedItems = JSON.parse(localStorage.getItem(upvotedStorageKey) || '[]');
            upvotedItems.push(contribution.id);
            localStorage.setItem(upvotedStorageKey, JSON.stringify(upvotedItems));
            setIsUpvoted(true);
            onUpvote();
        } catch (e) {
            console.error("Could not save upvote status.", e);
        }
    };


    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 transition-shadow hover:shadow-md dark:bg-gray-900/70 dark:border-gray-800 dark:hover:border-primary-900">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-3">
                       <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{contribution.author}</p>
                       {contribution.isAiGenerated && (
                           <span className="flex items-center text-xs font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full dark:bg-purple-900/50 dark:text-purple-300">
                               <SparklesIcon className="w-3 h-3 mr-1" />
                               AI Generated
                           </span>
                       )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{new Date(contribution.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={handleUpvote}
                        disabled={isUpvoted}
                        className={`flex items-center space-x-2 text-sm font-medium p-2 -m-2 rounded-md transition-colors ${
                            isUpvoted 
                            ? 'text-primary-600 dark:text-primary-400 cursor-default' 
                            : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800'
                        }`}
                        aria-pressed={isUpvoted}
                        aria-label={isUpvoted ? `Upvoted, ${contribution.upvotes} votes` : `Upvote, ${contribution.upvotes} votes`}
                    >
                        <UpvoteIcon className="w-4 h-4" />
                        <span>{contribution.upvotes}</span>
                    </button>
                    {isAdminAuthenticated && (
                        <>
                            <button onClick={() => onEdit(contribution)} className="p-2 -m-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-800" aria-label="Edit contribution">
                                <EditIcon className="w-4 h-4" />
                            </button>
                            <button onClick={onDelete} className="p-2 -m-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-gray-800" aria-label="Delete contribution">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-4 space-y-4">
                {contribution.type === ContributionType.Viva && (
                    <div className="space-y-2">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{contribution.question}</p>
                        <p className="text-gray-600 whitespace-pre-wrap dark:text-gray-300">{contribution.content}</p>
                    </div>
                )}

                {contribution.type === ContributionType.Theory && (
                    <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">{contribution.content}</p>
                )}
                
                {contribution.type === ContributionType.Diagram && (
                    <div>
                        {contribution.imageUrl && (
                             <img src={contribution.imageUrl} alt={contribution.content} className="max-w-full rounded-md border dark:border-gray-700" />
                        )}
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{contribution.content}</p>
                    </div>
                )}

                {contribution.type === ContributionType.Code && (
                    <div className="space-y-4">
                        {contribution.content && <p className="text-gray-700 dark:text-gray-300">{contribution.content}</p>}
                        
                        {contribution.codeSnippets && contribution.codeSnippets.map((snippet, index) => (
                            <CodeBlock key={index} language={snippet.language} code={snippet.code} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContributionCard;