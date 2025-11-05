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
        driveLink: 'https://drive.google.com/drive/u/0/folders/1L2X0y_i-gY8F-wJ9_vK0_zD7_A6bC5dE',
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
            },
            {
                id: 'exp-dv-8',
                title: 'Editing, Formatting, and Pivoting Data in Tableau',
                objective: 'Learn to edit and format axes, manipulate data within Tableau, and utilize pivoting functionality for data transformation.',
                contributions: [],
            },
            {
                id: 'exp-dv-9',
                title: 'Data Structuring and Filtering in Tableau',
                objective: 'Master the techniques for structuring, sorting, filtering, and pivoting data to prepare it for effective visualization in Tableau.',
                contributions: [],
            },
            {
                id: 'exp-dv-10',
                title: 'Advanced Visualization Tools in Tableau',
                objective: 'Explore advanced visualization tools, including using filters, detail panels, size panels, customizing filters with tooltips, and applying color formatting to data.',
                contributions: [],
            },
            {
                id: 'exp-dv-11',
                title: 'Dashboards and Storytelling in Tableau',
                objective: 'Learn to create and design different interactive displays, and how to distribute and publish data using Tableau dashboards and storytelling features.',
                contributions: [],
            },
            {
                id: 'exp-dv-12',
                title: 'Creating Custom and Advanced Charts in Tableau',
                objective: 'Develop skills in creating custom charts, working with cyclical data, and implementing circular area charts and dual-axis charts for complex data representation.',
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