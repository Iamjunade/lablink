import { Department } from '../types';
import { MOCK_DATA } from '../constants';
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
            // Only assign if the date is valid. Otherwise, log a warning and leave the original string.
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

const performSave = async (data: Department[]): Promise<void> => {
    try {
        // Upsert ensures the row is created if it doesn't exist, or updated if it does.
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
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('data')
            .eq('id', ROW_ID)
            .maybeSingle(); // Use maybeSingle to avoid an error if no rows are found.

        if (error) {
            throw error;
        }

        // If data is null or malformed, it means no data in DB or it's corrupted.
        if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
             console.warn("Supabase data not found or is malformed. Falling back to local MOCK_DATA.");
             // Try to save the mock data to initialize the DB for the next load.
             saveData(MOCK_DATA);
             return MOCK_DATA;
        }
        
        const remoteData: Department[] = data.data;

        // Check if content is outdated (using a heuristic from previous implementation)
        const csDept = remoteData.find((d) => d.id === 'dept-cs');
        const dvLab = csDept?.subjects.find((s) => s.id === 'subj-dv');
        
        if (!dvLab || dvLab.experiments.length < 12 || !dvLab.driveLink || !dvLab.githubLink) {
            console.warn("Supabase data is outdated or missing required fields. Using up-to-date local data and saving it.");
            saveData(MOCK_DATA); // Overwrite outdated remote data
            return MOCK_DATA;
        }

        console.log("Successfully fetched and validated data from Supabase.");
        return parseDates(remoteData);

    } catch (error) {
        console.error('Could not fetch data from Supabase, falling back to local mock data:', (error as Error).message);
        return MOCK_DATA;
    }
};


// Create a debounced version of the save function to avoid rapid-fire API calls.
const debouncedSave = debounce(performSave, 1500);

export const saveData = (data: Department[]): void => {
    debouncedSave(data);
};