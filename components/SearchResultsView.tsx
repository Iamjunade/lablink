import React from 'react';
import { Contribution, Experiment, Subject, Department, ContributionType } from '../types';
import { SearchIcon } from './common/Icons';

export interface SearchResult {
    contribution: Contribution;
    experiment: Pick<Experiment, 'id' | 'title'>;
    subject: Pick<Subject, 'id' | 'name'>;
    department: Pick<Department, 'name'>;
}

interface SearchResultsViewProps {
    query: string;
    results: SearchResult[];
    onResultClick: (result: SearchResult) => void;
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({ query, results, onResultClick }) => {

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) {
            return <span>{text}</span>;
        }
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={i} className="bg-yellow-200 dark:bg-yellow-600/50 rounded-sm">
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Search results for "<span className="text-primary-600 dark:text-primary-400">{query}</span>"
            </h1>
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{results.length} results found.</p>

            {results.length > 0 ? (
                <div className="space-y-4 mt-6">
                    {results.map((result, index) => (
                        <div
                            key={`${result.contribution.id}-${index}`}
                            onClick={() => onResultClick(result)}
                            className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 cursor-pointer dark:bg-gray-900 dark:border-gray-800"
                            role="button"
                            tabIndex={0}
                            aria-label={`View ${result.contribution.type} for ${result.experiment.title}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    onResultClick(result);
                                }
                            }}
                        >
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {result.department.name} &gt; {result.subject.name} &gt; <span className="font-semibold">{highlightText(result.experiment.title, query)}</span>
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {result.contribution.type === ContributionType.Viva && result.contribution.question
                                    ? highlightText(result.contribution.question, query)
                                    : highlightText(`${result.contribution.type} by ${result.contribution.author}`, query)
                                }
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {highlightText(result.contribution.content, query)}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 mt-6 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                    <SearchIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">No Results Found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">We couldn't find any contributions matching your search. Try another keyword.</p>
                </div>
            )}
        </div>
    );
};

export default SearchResultsView;