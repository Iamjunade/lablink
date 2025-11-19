import React, { useState } from 'react';
import { Experiment, Contribution, ContributionType } from '../types';
import { generateVivaQuestions } from '../services/geminiService';
import AddContributionModal from './AddContributionModal';
import ContributionCard from './ContributionCard';
import { 
    BackIcon, 
    CodeIcon, 
    VivaIcon, 
    TheoryIcon, 
    DiagramIcon, 
    SparklesIcon, 
    SpinnerIcon 
} from './common/Icons';

interface ExperimentViewProps {
  experiment: Experiment;
  onBack: () => void;
  onAddContribution: (experimentId: string, contribution: Contribution) => void;
  onUpdateContribution: (experimentId: string, contribution: Contribution) => void;
  isAdminAuthenticated: boolean;
  onDeleteContribution: (experimentId: string, contributionId: string) => void;
  onUpvoteContribution: (experimentId: string, contributionId: string) => void;
}

const ExperimentView: React.FC<ExperimentViewProps> = ({ experiment, onBack, onAddContribution, onUpdateContribution, isAdminAuthenticated, onDeleteContribution, onUpvoteContribution }) => {
  const TABS = [
    { name: ContributionType.Code, icon: CodeIcon },
    { name: ContributionType.Viva, icon: VivaIcon },
    { name: ContributionType.Theory, icon: TheoryIcon },
    { name: ContributionType.Diagram, icon: DiagramIcon },
  ];
  
  const [activeTab, setActiveTab] = useState<ContributionType>(TABS[0].name);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const filteredContributions = experiment.contributions
    .filter(c => c.type === activeTab)
    .sort((a, b) => b.upvotes - a.upvotes);

  const handleGenerateViva = async () => {
    setIsGenerating(true);
    const newQuestions = await generateVivaQuestions(experiment.title, experiment.objective);
    if (newQuestions.length > 0) {
      newQuestions.forEach(q => onAddContribution(experiment.id, q));
    }
    setIsGenerating(false);
  };

  const handleOpenEditModal = (contribution: Contribution) => {
    setEditingContribution(contribution);
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingContribution(null);
  };

  const handleModalSubmit = (contributionData: Omit<Contribution, 'id' | 'upvotes' | 'createdAt'>) => {
    if (editingContribution) {
        // Update existing contribution
        const updatedContribution: Contribution = {
            ...editingContribution,
            ...contributionData,
            author: contributionData.author || 'Anonymous', // Ensure author is not empty
        };
        onUpdateContribution(experiment.id, updatedContribution);
    } else {
        // Add new contribution
        const newContribution: Contribution = {
            ...contributionData,
            id: `user-${Date.now()}`,
            upvotes: 0,
            createdAt: new Date(),
            author: contributionData.author || 'Anonymous',
        };
        onAddContribution(experiment.id, newContribution);
    }
    handleModalClose();
  };


  return (
    <div className="max-w-7xl mx-auto">
        <AddContributionModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleModalSubmit}
            contributionToEdit={editingContribution}
        />
      <button onClick={onBack} className="flex items-center space-x-2 text-sm font-semibold text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mb-6" aria-label="Back to experiments">
        <BackIcon className="w-5 h-5" />
        <span>Back to Experiments</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 dark:bg-gray-900">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{experiment.title}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{experiment.objective}</p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Contribution types">
                    {TABS.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`${activeTab === tab.name ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'} flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            aria-selected={activeTab === tab.name}
                            role="tab"
                        >
                            <tab.icon className="w-5 h-5 mr-2" />
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
             <button
                onClick={() => { setEditingContribution(null); setIsModalOpen(true); }}
                className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                aria-label="Add new contribution"
            >
                Add Contribution
            </button>
        </div>

        <div className="mt-6">
            {activeTab === ContributionType.Viva && (
                <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 dark:bg-primary-950/50 dark:border-primary-900">
                    <p className="text-sm text-primary-800 dark:text-primary-200 flex-1">Stuck on what to prepare? Let AI help you generate potential viva questions!</p>
                    <button
                        onClick={handleGenerateViva}
                        disabled={isGenerating}
                        className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-white text-primary-600 border border-primary-300 font-semibold rounded-lg shadow-sm hover:bg-primary-100 disabled:opacity-75 disabled:cursor-not-allowed transition-colors dark:bg-primary-800/50 dark:text-primary-200 dark:border-primary-700 dark:hover:bg-primary-800"
                        aria-label={isGenerating ? 'Generating viva questions' : 'Suggest viva questions with AI'}
                    >
                        {isGenerating ? (
                            <SpinnerIcon className="w-5 h-5 animate-spin" />
                        ) : (
                            <SparklesIcon className="w-5 h-5" />
                        )}
                        <span>{isGenerating ? 'Generating...' : 'Suggest Questions'}</span>
                    </button>
                </div>
            )}

            {filteredContributions.length > 0 ? (
                <div className="space-y-6">
                    {filteredContributions.map(c => (
                        <ContributionCard 
                            key={c.id} 
                            contribution={c} 
                            isAdminAuthenticated={isAdminAuthenticated} 
                            onDelete={() => onDeleteContribution(experiment.id, c.id)}
                            onUpvote={() => onUpvoteContribution(experiment.id, c.id)}
                            onEdit={handleOpenEditModal}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Contributions Yet</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Be the first to share a {activeTab.toLowerCase()} for this experiment!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ExperimentView;