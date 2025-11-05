
export enum ContributionType {
  Code = 'Code Snippet',
  Viva = 'Viva Q&A',
  Theory = 'Theory/Concept',
  Diagram = 'Diagram/Flowchart',
}

export interface Contribution {
  id: string;
  author: string;
  type: ContributionType;
  content: string; 
  imageUrl?: string;
  language?: string;
  question?: string;
  upvotes: number;
  createdAt: Date;
  isAiGenerated?: boolean;
}

export interface Experiment {
  id: string;
  title: string;
  objective: string;
  contributions: Contribution[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  experiments: Experiment[];
  driveLink?: string;
}

export interface Department {
  id: string;
  name: string;
  subjects: Subject[];
}