
import React from 'react';
import { Subject, Experiment } from '../types';

interface DashboardProps {
  subject: Subject;
  onSelectExperiment: (experiment: Experiment) => void;
}

const BeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c.251.042.502.098.75.162l4.5 1.636M14.25 3.104c.251.042.502.098.75.162l4.5 1.636m-6.75 1.252-4.5 1.636m0 0-4.5 1.636m4.5-1.636 4.5 1.636m-4.5-1.636v5.714a2.25 2.25 0 0 0 .659 1.591L14.25 14.5m-4.5 0v5.714a2.25 2.25 0 0 0 1.5 2.121l4.5 1.636 4.5-1.636a2.25 2.25 0 0 0 1.5-2.121v-5.714m-4.5 0L9.75 9.141m4.5 5.359L5 14.5" />
  </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ subject, onSelectExperiment }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900">{subject.name}</h2>
        <p className="mt-1 text-md text-gray-500">Subject Code: {subject.code}</p>
      </div>
      {subject.experiments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subject.experiments.map((exp, index) => (
            <div
              key={exp.id}
              onClick={() => onSelectExperiment(exp)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                  <BeakerIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary-600">Experiment {index + 1}</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-800">{exp.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{exp.objective}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border border-gray-200">
            <BeakerIcon className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-xl font-semibold text-gray-700">No Experiments Found</h3>
            <p className="mt-2 text-gray-500">There are no experiments for this subject yet. An admin can add them from the Admin Panel.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;