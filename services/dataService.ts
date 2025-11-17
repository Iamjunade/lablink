import { Department } from '../types';
import { supabase } from './supabaseClient';

const TABLE_NAME = 'lab_data';
const ROW_ID = 'main_data'; // The single row ID to store our JSON blob

// Utility to debounce function calls
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    const debounced = (...args: Parameters<F>) => {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => func(...args), waitFor);
    };
  
    return debounced as (...args: Parameters<F>) => void;
};

// Utility to recursively parse date strings into Date objects
const parseDates = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    for (const key of Object.keys(obj)) {
        if (key === 'createdAt' && typeof obj[key] === 'string') {
            const date = new Date(obj[key]);
            if (!isNaN(date.getTime())) {
                obj[key] = date;
            } else {
                 console.warn(`Invalid date string encountered and skipped: ${obj[key]}`);
            }
        } else if (typeof obj[key] === 'object') {
            parseDates(obj[key]);
        }
    }
    return obj;
};

let cachedMockData: Department[] | null = null;
const getMockData = async (): Promise<Department[]> => {
    if (cachedMockData) {
        return cachedMockData;
    }
    try {
        const response = await fetch('./MOCK_DATA.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        cachedMockData = parseDates(data);
        return cachedMockData!;
    } catch (e) {
        console.error("CRITICAL: Failed to load MOCK_DATA.json. Fallback data will be empty.", e);
        cachedMockData = []; // Set to empty array to prevent repeated fetch attempts
        return cachedMockData; 
    }
}

const performSave = async (data: Department[]): Promise<void> => {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .upsert({ id: ROW_ID, data: data });

        if (error) {
            throw error;
        }
        console.log('Data saved successfully to Supabase.');
    } catch (error) {
        console.error('Error saving data to Supabase:', error);
    }
};

export const getData = async (): Promise<Department[]> => {
    const MOCK_DATA = await getMockData();
    
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('data')
            .eq('id', ROW_ID)
            .maybeSingle();

        if (error) {
            throw error;
        }

        // Scenario 1: Database is empty. Initialize with MOCK_DATA.
        if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
             console.warn("Supabase data not found. Initializing with local data.");
             await performSave(MOCK_DATA);
             return MOCK_DATA;
        }
        
        // Scenario 2: Database has data. Merge to ensure it's up-to-date without overwriting user content.
        let remoteData: Department[] = JSON.parse(JSON.stringify(data.data)); // Deep copy
        let needsUpdate = false;

        MOCK_DATA.forEach(mockDept => {
            let remoteDept = remoteData.find(d => d.id === mockDept.id);
            if (!remoteDept) {
                remoteData.push(mockDept);
                needsUpdate = true;
            } else {
                mockDept.subjects.forEach(mockSubj => {
                    let remoteSubj = remoteDept.subjects.find(s => s.id === mockSubj.id);
                    if (!remoteSubj) {
                        remoteDept.subjects.push(mockSubj);
                        needsUpdate = true;
                    } else {
                        // Update subject metadata
                        if (remoteSubj.name !== mockSubj.name) { remoteSubj.name = mockSubj.name; needsUpdate = true; }
                        if (remoteSubj.code !== mockSubj.code) { remoteSubj.code = mockSubj.code; needsUpdate = true; }
                        if (remoteSubj.driveLink !== mockSubj.driveLink) { remoteSubj.driveLink = mockSubj.driveLink; needsUpdate = true; }
                        if (remoteSubj.githubLink !== mockSubj.githubLink) { remoteSubj.githubLink = mockSubj.githubLink; needsUpdate = true; }

                        mockSubj.experiments.forEach(mockExp => {
                            let remoteExp = remoteSubj.experiments.find(e => e.id === mockExp.id);
                            if (!remoteExp) {
                                remoteSubj.experiments.push(mockExp);
                                needsUpdate = true;
                            } else {
                                // Update experiment metadata, but NEVER overwrite contributions.
                                if (remoteExp.title !== mockExp.title) { remoteExp.title = mockExp.title; needsUpdate = true; }
                                if (remoteExp.objective !== mockExp.objective) { remoteExp.objective = mockExp.objective; needsUpdate = true; }
                            }
                        });
                    }
                });
            }
        });

        if (needsUpdate) {
            console.log("Local data structure is newer. Merging and updating Supabase.");
            saveData(remoteData);
        }

        console.log("Successfully fetched and merged data from Supabase.");
        return parseDates(remoteData);

    } catch (error) {
        console.error('Could not fetch/process data from Supabase, falling back to local mock data:', (error as Error).message);
        return MOCK_DATA;
    }
};

const debouncedSave = debounce(performSave, 1500);

export const saveData = (data: Department[]): void => {
    debouncedSave(data);
};