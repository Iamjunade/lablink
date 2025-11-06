
import React, { useState, useEffect, useRef } from 'react';
import { Contribution, ContributionType, CodeSnippet } from '../types';

// Add Prism to the window object for TypeScript
declare global {
    interface Window {
        Prism: {
            highlightAllUnder: (element: Element) => void;
            highlightElement: (element: Element) => void;
        };
    }
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.028-2.124H9.028c-1.12 0-2.029.944-2.029 2.124v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);
const UpvoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
    </svg>
);
const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375v-3.375c0-.621-.504-1.125-1.125-1.125h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h1.5a1.125 1.125 0 0 1 1.125 1.125v3.375m-6.375-10.375a1.125 1.125 0 0 0-1.125-1.125H6.75c-.621 0-1.125.504-1.125 1.125v9.75c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V15.75m-6.375-10.375a1.125 1.125 0 0 0-1.125-1.125H6.75" />
    </svg>
);
const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

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
                <button onClick={handleCopy} className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white dark:hover:text-gray-200">
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
    const cardRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        try {
            const upvotedItems = JSON.parse(localStorage.getItem(upvotedStorageKey) || '[]');
            setIsUpvoted(upvotedItems.includes(contribution.id));
        } catch (e) {
            setIsUpvoted(false);
        }
    }, [contribution.id]);

    useEffect(() => {
        if (contribution.type === ContributionType.Code && cardRef.current && window.Prism) {
            // Re-run prism on the whole card when contribution changes to catch all code blocks
            window.Prism.highlightAllUnder(cardRef.current);
        }
    }, [contribution]);

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
        <div ref={cardRef} className="bg-white border border-gray-200 rounded-lg p-5 transition-shadow hover:shadow-md dark:bg-gray-900/70 dark:border-gray-800 dark:hover:border-primary-900">
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
                    >
                        <UpvoteIcon className="w-4 h-4" />
                        <span>{contribution.upvotes}</span>
                    </button>
                    {isAdminAuthenticated && (
                        <>
                            <button 
                                onClick={() => onEdit(contribution)}
                                className="p-2 -m-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 rounded-md transition-colors"
                                aria-label="Edit contribution"
                            >
                                <EditIcon className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={onDelete}
                                className="p-2 -m-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 rounded-md transition-colors"
                                aria-label="Delete contribution"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="mt-4">
                {contribution.type === ContributionType.Code && (
                    <div>
                        {contribution.content && <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4 dark:text-gray-300">{contribution.content}</p>}
                        
                        {contribution.codeSnippets && contribution.codeSnippets.length > 0 ? (
                            <div className="space-y-4">
                                {contribution.codeSnippets.map((snippet, index) => (
                                    <CodeBlock key={index} language={snippet.language} code={snippet.code} />
                                ))}
                            </div>
                        ) : (
                            // Fallback for old data format
                            <CodeBlock language={contribution.language || 'text'} code={contribution.content} />
                        )}
                    </div>
                )}
                 {contribution.type === ContributionType.Viva && (
                    <div className="space-y-2">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{contribution.question}</p>
                        <p className="text-gray-600 dark:text-gray-400">{contribution.content}</p>
                    </div>
                )}
                {contribution.type === ContributionType.Theory && (
                     <p className="text-gray-700 leading-relaxed whitespace-pre-wrap dark:text-gray-300">{contribution.content}</p>
                )}
                {contribution.type === ContributionType.Diagram && (
                    <div>
                        <img src={contribution.imageUrl} alt={contribution.content} className="rounded-lg max-w-full h-auto border dark:border-gray-700"/>
                        <p className="text-center mt-2 text-sm text-gray-600 italic dark:text-gray-400">{contribution.content}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ContributionCard;
