import { Department } from '../types';
import { MOCK_DATA } from '../constants';

const JSONBIN_API_KEY = '$2a$10$NITf03hkADNuaYku6mKMKurdhZeaSL6Eqxc9HinKo4pZ3e5iQZEO.';
const JSONBIN_BIN_ID = '690a38dd43b1c97be998af1d';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

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
        const response = await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to save data: ${response.statusText}`);
        }
        console.log('Data saved successfully to the backend.');
    } catch (error) {
        console.error('Error saving data to backend:', error);
    }
};

export const getData = async (): Promise<Department[]> => {
    try {
        const response = await fetch(`${JSONBIN_URL}/latest`, {
            headers: { 'X-Master-Key': JSONBIN_API_KEY },
        });

        if (!response.ok) {
            if (response.status === 404) {
                 console.warn("JSONBin not found. Falling back to local data.");
            } else if (response.status === 401) {
                 console.warn("JSONBin authentication failed. Falling back to local data.");
            }
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Basic validation for structure
        if (!data?.record || !Array.isArray(data.record) || data.record.length === 0) {
            console.warn("Backend data is empty or malformed. Falling back to local data.");
            return MOCK_DATA;
        }
        
        const remoteData: Department[] = data.record;

        // Check if content is outdated
        const csDept = remoteData.find((d) => d.id === 'dept-cs');
        const dvLab = csDept?.subjects.find((s) => s.id === 'subj-dv');
        
        if (!dvLab || dvLab.experiments.length < 12) {
            console.warn("Backend data is outdated. Using up-to-date local data instead.");
            return MOCK_DATA;
        }

        console.log("Successfully fetched and validated data from backend.");
        return parseDates(remoteData);

    } catch (error) {
        console.warn('Could not fetch data from backend, falling back to local mock data:', (error as Error).message);
        return MOCK_DATA;
    }
};


// Create a debounced version of the save function to avoid rapid-fire API calls.
const debouncedSave = debounce(performSave, 1500);

export const saveData = (data: Department[]): void => {
    debouncedSave(data);
};