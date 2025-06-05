import { auth } from '../api/firebase.js';

export class AuthProxy {
    constructor(baseUrl, authConfig) {
        this.baseUrl = baseUrl;
        this.authConfig = authConfig;
        this.requestQueue = [];
        this.rateLimit = {
        maxRequests: 10,
        perMilliseconds: 60000,
        count: 0,
        lastReset: Date.now()
        };
    }

    async request(endpoint, options = {}) {
        this._checkRateLimit();
        
        const authHeaders = await this._getAuthHeaders();
        const headers = {
            ...options.headers,
            ...authHeaders
        };

        try {
            console.log(`[Proxy] ${options.method || 'GET'} ${endpoint}`);
            
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers
            });

            if (response.status === 401 && this.authConfig.type === 'jwt') {
                console.warn('Token expired, refreshing...');
                await auth.currentUser.getIdToken(true);
                return this.request(endpoint, options);
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('[Proxy] Request failed:', error);
            throw error;
        }
    }

    async _getAuthHeaders() {
        switch (this.authConfig.type) {
            case 'jwt':
                const user = auth.currentUser;
                if (!user) throw new Error('JWT: User not authenticated');
                return { 'Authorization': `Bearer ${await user.getIdToken()}` };
            
            case 'apiKey':
                return { 'X-API-Key': this.authConfig.key };
            
            case 'oauth':
                if (!this.authConfig.accessToken) throw new Error('OAuth: Access token missing');
                return { 'Authorization': `Bearer ${this.authConfig.accessToken}` };
            
            default:
                throw new Error(`Unsupported auth type: ${this.authConfig.type}`);
            }
    }

    _checkRateLimit() {
        const now = Date.now();
        
        if (now - this.rateLimit.lastReset > this.rateLimit.perMilliseconds) {
            this.rateLimit.count = 0;
            this.rateLimit.lastReset = now;
        }

        if (this.rateLimit.count >= this.rateLimit.maxRequests) {
            const waitTime = this.rateLimit.perMilliseconds - (now - this.rateLimit.lastReset);
            throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(waitTime/1000)} seconds`);
        }

        this.rateLimit.count++;
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
    }
}