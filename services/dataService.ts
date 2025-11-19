import { Department } from '../types';
import { getSupabaseClient } from './supabaseClient'; // Import the function to get the supabase client

const LOCAL_STORAGE_KEY = 'lablink_app_data';

// Utility to recursively parse date strings into Date objects
const parseDates = (data: any): any => {
    if (data === null || typeof data !== 'object') {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(item => parseDates(item));
    }

    const newData: { [key: string]: any } = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) { // Use hasOwnProperty for safety
            if (key === 'createdAt' && typeof data[key] === 'string') {
                const date = new Date(data[key]);
                if (!isNaN(date.getTime())) {
                    newData[key] = date;
                } else {
                    console.warn(`Invalid date string encountered and skipped: ${data[key]}`);
                    newData[key] = data[key]; // Keep original malformed string if conversion fails
                }
            } else if (typeof data[key] === 'object') {
                newData[key] = parseDates(data[key]);
            } else {
                newData[key] = data[key];
            }
        }
    }
    return newData;
};

// Defensive programming: Ensure nested arrays exist and filter out any invalid (null/undefined) entries to prevent crashes.
const sanitizeData = (departments: Department[]): Department[] => {
    if (!Array.isArray(departments)) return [];
    
    return departments.filter(Boolean).map(dept => {
        const sanitizedDept = { ...dept };
        
        // Process subjects within this department
        sanitizedDept.subjects = (Array.isArray(dept.subjects) ? dept.subjects : [])
            .filter(Boolean)
            .map(subj => {
                const sanitizedSubj = { ...subj };
                
                // Process experiments within this subject
                sanitizedSubj.experiments = (Array.isArray(subj.experiments) ? subj.experiments : [])
                    .filter(Boolean)
                    .map(exp => {
                        const sanitizedExp = { ...exp };
                        
                        // Process contributions within this experiment
                        sanitizedExp.contributions = (Array.isArray(exp.contributions) ? exp.contributions : [])
                            .filter(Boolean); // Filter contributions
                        return sanitizedExp;
                    });
                return sanitizedSubj;
            });
        return sanitizedDept;
    });
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
        const parsedData = parseDates(data); // Parse dates first
        cachedMockData = parsedData; // Cache the parsed data
        return cachedMockData!;
    } catch (e) {
        console.error("CRITICAL: Failed to load MOCK_DATA.json. Fallback data will be empty.", e);
        cachedMockData = []; // Set to empty array to prevent repeated fetch attempts
        return cachedMockData; 
    }
}

export const getData = async (): Promise<Department[]> => {
    const supabase = getSupabaseClient();
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('app_data')
                .select('json_data')
                .eq('id', 1)
                .single();

            if (error) {
                console.warn("Supabase data fetch failed, checking local storage:", error.message);
                // Fall through to check localStorage
            } else if (data && data.json_data) {
                console.log("Data loaded successfully from Supabase.");
                // Sync latest data from Supabase to localStorage
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.json_data));
                return sanitizeData(parseDates(data.json_data));
            }
        } catch (e) {
            console.error("Supabase client error during fetch, checking local storage:", e);
            // Fall through
        }
    } else {
         console.warn("Supabase client not available, checking local storage.");
    }

    // Fallback 1: Try loading from localStorage
    try {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            console.log("Data loaded from localStorage (offline mode).");
            return sanitizeData(parseDates(JSON.parse(localData)));
        }
    } catch (e) {
        console.error("Failed to read or parse data from localStorage:", e);
    }

    // Fallback 2: Load initial mock data if nothing else is available
    console.log("No Supabase or localStorage data found, loading initial mock data.");
    const rawData = await getMockData();
    return sanitizeData(rawData);
};


export const saveData = async (data: Department[]): Promise<void> => {
    const supabase = getSupabaseClient();
    let savedToSupabase = false;

    if (supabase) {
        try {
            const { error } = await supabase
                .from('app_data')
                .upsert({ id: 1, json_data: data });

            if (error) {
                console.error("Supabase data save operation failed:", error.message);
            } else {
                console.log("Data saved successfully to Supabase.");
                savedToSupabase = true;
            }
        } catch (e) {
            console.error("Supabase client error during data save operation:", e);
        }
    }

    // If Supabase is not available or the save failed, persist to localStorage as a fallback.
    if (!savedToSupabase) {
        try {
            // JSON.stringify will automatically convert Date objects to ISO 8601 strings,
            // which our parseDates function can handle on load.
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            console.log("Data saved to localStorage (offline mode).");
        } catch (e) {
            console.error("Failed to save data to localStorage:", e);
        }
    }
};