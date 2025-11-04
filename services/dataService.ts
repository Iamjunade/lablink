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
                 console.error("JSONBin not found. Bin ID may be incorrect. Falling back to mock data.");
                 return MOCK_DATA;
            }
             if (response.status === 401) {
                 console.error("JSONBin authentication failed. API Key may be incorrect. Falling back to mock data.");
                 return MOCK_DATA;
            }
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Stricter Validation: Check for the exact expected format { record: [...] } with content.
        const isValidData = data &&
            typeof data === 'object' &&
            !Array.isArray(data) &&
            data.record &&
            Array.isArray(data.record) &&
            data.record.length > 0;


        if (isValidData) {
            // Happy path: Data is valid.
            console.log("Successfully fetched and validated data from backend.");
            return parseDates(data.record);
        } else {
            // Self-healing: Data is invalid for any other reason. Restore from default.
            console.error(
                "Backend data is empty, malformed, or not in the expected { record: [...] } format. Restoring from default data. Received:",
                JSON.stringify(data, null, 2) // Log the problematic data structure
            );
            try {
                await performSave(MOCK_DATA);
                console.log("Backend data successfully restored.");
            } catch (saveError) {
                console.error("Failed to restore backend data:", saveError);
            }
            // Return the fresh mock data for the current session.
            return MOCK_DATA;
        }

    } catch (error) {
        console.error('Error fetching/parsing data from backend, falling back to mock data:', error);
        return MOCK_DATA;
    }
};


// Create a debounced version of the save function to avoid rapid-fire API calls.
const debouncedSave = debounce(performSave, 1500);

export const saveData = (data: Department[]): void => {
    debouncedSave(data);
};