import { Department, ContributionType } from './types';

export const MOCK_DATA: Department[] = [
  {
    id: 'dept-cs',
    name: 'Computer Science',
    subjects: [
      {
        id: 'subj-dv',
        name: 'Data Exploration and Visualization Lab',
        code: 'CS405L',
        experiments: [
            {
                id: 'exp-dv-1',
                title: 'Data Understanding and Preprocessing',
                objective: 'Understand, find, explore, and clean up data. This includes handling formatting issues, outliers, duplicates, and performing normalization and standardization.',
                contributions: [],
            },
            {
                id: 'exp-dv-2',
                title: 'Parsing PDF Files with Python',
                objective: 'Develop a Python script to parse and extract data from PDF files using the pdfminer library.',
                contributions: [],
            },
            {
                id: 'exp-dv-3',
                title: 'Data Cleanup on a Real-World Dataset',
                objective: "Develop a Python script for data cleanup on the 'child labour and marriage data.xlsx' dataset. Focus on checking for duplicates and missing data, and cleaning line breaks, spaces, and special characters.",
                contributions: [],
            },
            {
                id: 'exp-dv-4',
                title: 'Correlation Visualization with Matplotlib',
                objective: 'Draw a chart to visualize the relationship between perceived corruption scores and child labour percentages using the Matplotlib library.',
                contributions: [],
            },
            {
                id: 'exp-dv-5',
                title: 'Web Scraping for robots.txt',
                objective: 'Write a Python script to download and display the content of the robots.txt file from en.wikipedia.org.',
                contributions: [],
            },
            {
                id: 'exp-dv-6',
                title: 'Introduction to Tableau Visualizations',
                objective: "Create a first visualization with Tableau software for various data file formats. Learn to create basic charts like line charts, bar charts, and tree maps using the 'Show Me' panel.",
                contributions: [],
            },
            {
                id: 'exp-dv-7',
                title: 'Advanced Tableau Calculations and Formatting',
                objective: 'Perform Tableau calculations like sum, average, and aggregate. Create custom calculations and fields. Explore advanced visualization formatting, tools, and menus for specific data calculations.',
                contributions: [],
            }
        ],
      },
    ],
  },
  {
    id: 'dept-ec',
    name: 'Electronics & Communication',
    subjects: [
      {
        id: 'subj-dld',
        name: 'Digital Logic Design Lab',
        code: 'EC201L',
        experiments: [
            {
                id: 'exp-dld-1',
                title: 'Implementation of Logic Gates',
                objective: 'To verify the truth tables of basic logic gates (AND, OR, NOT, NAND, NOR, XOR) using integrated circuits (ICs).',
                contributions: [],
            }
        ],
      },
    ],
  },
];