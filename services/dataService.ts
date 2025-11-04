import { Department } from '../types';
import { MOCK_DATA } from '../constants';

// --- IMPORTANT SETUP INSTRUCTIONS ---
// This service uses jsonbin.io to provide a simple, free backend for sharing data.
// You need to create your own bin to make this work.
//
// 1. Go to https://jsonbin.io/ and sign up for a free account.
// 2. After logging in, find your API Key on the dashboard. It's a long string.
// 3. Paste your API key into the `JSONBIN_API_KEY` constant below.
// 4. Go to the "Collection" page and create a new private collection.
// 5. Inside the collection, create a new JSON record (bin). Leave it empty for now (just `{}`).
// 6. After creating the bin, copy the ID from the URL. The URL will look like:
//    https://jsonbin.io/app/bins/YOUR_BIN_ID
// 7. Paste that ID into the `JSONBIN_BIN_ID` constant below.
//
// The app will automatically populate your bin with the initial data on the first run.
const JSONBIN_API_KEY = 'PASTE_YOUR_API_KEY_HERE'; // e.g., '$2a$10$8.Q.g2V2.y9.1/2B...'
const JSONBIN_BIN_ID = 'PASTE_YOUR_BIN_ID_HERE';  // e.g., '66a1b2c3e41b4d34e413XXXX'
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// Utility to recursively parse date strings into Date objects
const parseDates = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    for (const key of Object.keys(obj)) {
        if (key === 'createdAt' && typeof obj[key] === 'string') {
            obj[key] = new Date(obj[key]);
        } else if (typeof obj[key] === 'object') {
            parseDates(obj[key]);
        }
    }
    return obj;
};

export const getData = async (): Promise<Department[]> => {
    if (JSONBIN_API_KEY === 'PASTE_YOUR_API_KEY_HERE' || JSONBIN_BIN_ID === 'PASTE_YOUR_BIN_ID_HERE') {
        console.warn("Using local mock data. Please configure your jsonbin.io API Key and Bin ID in `services/dataService.ts` to enable shared data persistence.");
        return MOCK_DATA;
    }

    try {
        const response = await fetch(`${JSONBIN_URL}/latest`, {
            headers: { 'X-Master-Key': JSONBIN_API_KEY },
        });

        if (!response.ok) {
            if (response.status === 404) {
                 console.error("JSONBin not found. It seems the Bin ID is incorrect. Falling back to mock data.");
                 return MOCK_DATA;
            }
             if (response.status === 401) {
                 console.error("JSONBin authentication failed. It seems the API Key is incorrect. Falling back to mock data.");
                 return MOCK_DATA;
            }
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();

        // If the bin is brand new and empty, seed it with initial data.
        if (Object.keys(data.record).length === 0) {
            console.log("Remote data store is empty. Seeding with initial data and returning it.");
            await saveData(MOCK_DATA);
            return MOCK_DATA;
        }

        // Recursively parse date strings back to Date objects
        return parseDates(data.record);

    } catch (error) {
        console.error('Error fetching data from backend, falling back to mock data:', error);
        return MOCK_DATA;
    }
};

export const saveData = async (data: Department[]): Promise<void> => {
     if (JSONBIN_API_KEY === 'PASTE_YOUR_API_KEY_HERE' || JSONBIN_BIN_ID === 'PASTE_YOUR_BIN_ID_HERE') {
        console.warn("Data not saved. Please configure your jsonbin.io API Key and Bin ID.");
        return;
    }

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
