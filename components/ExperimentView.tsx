import React, { useState } from 'react';
import { Experiment, Contribution, ContributionType } from '../types';
import { generateVivaQuestions } from '../services/geminiService';
import AddContributionModal from './AddContributionModal';
import ContributionCard from './ContributionCard';

// Icon Components
const BackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);
const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
);
const VivaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5a6 6 0 0 0-6-6v-1.5a6 6 0 0 0-6 6v1.5a6 6 0 0 0 6 6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V18.75" />
    </svg>
);
const TheoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);
const DiagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

interface ExperimentViewProps {
  experiment: Experiment;
  onBack: () => void;
  onAddContribution: (experimentId: string, contribution: Contribution) => void;
  isAdminAuthenticated: boolean;
  onDeleteContribution: (experimentId: string, contributionId: string) => void;
  onUpvoteContribution: (experimentId: string, contributionId: string) => void;
}

const ExperimentView: React.FC<ExperimentViewProps> = ({ experiment, onBack, onAddContribution, isAdminAuthenticated, onDeleteContribution, onUpvoteContribution }) => {
  const TABS = [
    { name: ContributionType.Code, icon: CodeIcon },
    { name: ContributionType.Viva, icon: VivaIcon },
    { name: ContributionType.Theory, icon: TheoryIcon },
    { name: ContributionType.Diagram, icon: DiagramIcon },
  ];
  
  const [activeTab, setActiveTab] = useState<ContributionType>(TABS[0].name);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  
  const handleAddContribution = (contribution: Omit<Contribution, 'id' | 'upvotes' | 'createdAt'>) => {
    const newContribution: Contribution = {
        ...contribution,
        id: `user-${Date.now()}`,
        upvotes: 0,
        createdAt: new Date(),
    };
    onAddContribution(experiment.id, newContribution);
  };

  return (
    <div className="max-w-7xl mx-auto">
        <AddContributionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddContribution}
        />
      <button onClick={onBack} className="flex items-center space-x-2 text-sm font-semibold text-primary-600 hover:text-primary-800 mb-6">
        <BackIcon className="w-5 h-5" />
        <span>Back to Experiments</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-extrabold text-gray-900">{experiment.title}</h2>
        <p className="mt-2 text-gray-600">{experiment.objective}</p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`${activeTab === tab.name ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <tab.icon className="w-5 h-5 mr-2" />
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
             <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
                Add Contribution
            </button>
        </div>

        <div className="mt-6">
            {activeTab === ContributionType.Viva && (
                <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-between">
                    <p className="text-sm text-primary-800">Stuck on what to prepare? Let AI help you!</p>
                    <button
                        onClick={handleGenerateViva}
                        disabled={isGenerating}
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-primary-600 border border-primary-300 font-semibold rounded-lg shadow-sm hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <SparklesIcon className="w-5 h-5" />
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
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700">No Contributions Yet</h3>
                    <p className="mt-2 text-gray-500">Be the first to share a {activeTab.toLowerCase()} for this experiment!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ExperimentView;