// API Configuration with CORS handling
const API_CONFIG = {
    // Primary backend URL
    PRIMARY_BACKEND: 'https://taran-contact-directory-backend.vercel.app',
    
    // Fallback URLs (if needed)
    FALLBACK_BACKENDS: [
        'https://taran-contact-directory-backend.vercel.app',
        // Add other fallback URLs here if needed
    ],
    
    // CORS proxy options (for development/testing)
    CORS_PROXIES: [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://cors.bridged.cc/'
    ],
    
    // Request timeout
    TIMEOUT: 10000,
    
    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
};

// Function to get backend URL with fallback
export const getBackendUrl = () => {
    return process.env.REACT_APP_BACKEND_URL || API_CONFIG.PRIMARY_BACKEND;
};

// Function to create axios config with CORS headers
export const createAxiosConfig = (endpoint, data = null, method = 'GET') => {
    const baseConfig = {
        method: method.toLowerCase(),
        url: `${getBackendUrl()}${endpoint}`,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        timeout: API_CONFIG.TIMEOUT,
        withCredentials: false
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        baseConfig.data = data;
    }
    
    return baseConfig;
};

// Function to handle CORS errors with retry logic
export const handleCorsRequest = async (endpoint, data = null, method = 'POST') => {
    let lastError;
    
    // Try primary backend first
    try {
        const config = createAxiosConfig(endpoint, data, method);
        const response = await fetch(config.url, {
            method: config.method,
            headers: config.headers,
            body: data ? JSON.stringify(data) : undefined
        });
        
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        lastError = error;
        console.warn('Primary backend request failed:', error);
    }
    
    // If primary fails, try CORS proxy as fallback
    for (const proxy of API_CONFIG.CORS_PROXIES) {
        try {
            const proxyUrl = `${proxy}${getBackendUrl()}${endpoint}`;
            const response = await fetch(proxyUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data ? JSON.stringify(data) : undefined
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn(`CORS proxy ${proxy} failed:`, error);
            lastError = error;
        }
    }
    
    throw lastError || new Error('All backend attempts failed');
};

export default API_CONFIG;
