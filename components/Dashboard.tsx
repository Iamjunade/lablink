import React from 'react';
import { Subject, Experiment } from '../types';
import { BeakerIcon, DriveIcon, GitHubIcon } from './common/Icons';

interface DashboardProps {
  subject: Subject;
  onSelectExperiment: (experiment: Experiment) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ subject, onSelectExperiment }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{subject.name}</h2>
        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Subject Code: {subject.code}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
            {subject.driveLink && (
                <a
                    href={subject.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <DriveIcon className="w-5 h-5" />
                    <span>View Lab Resources</span>
                </a>
            )}
            {subject.githubLink && (
                <a
                    href={subject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white transition-colors"
                >
                    <GitHubIcon className="w-5 h-5" />
                    <span>View on GitHub</span>
                </a>
            )}
        </div>
      </div>
      {subject.experiments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subject.experiments.map((exp, index) => (
            <div
              key={exp.id}
              onClick={() => onSelectExperiment(exp)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-primary-800"
              role="button"
              tabIndex={0}
              aria-label={`Select experiment ${exp.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectExperiment(exp);
                }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center dark:bg-primary-950/50 dark:text-primary-400">
                  <BeakerIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">Experiment {index + 1}</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-800 dark:text-gray-200">{exp.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{exp.objective}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            <BeakerIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">No Experiments Found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">There are no experiments for this subject yet. An admin can add them from the Admin Panel.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;