/**
 * API Configuration and Service Layer
 * Handles all communication with the Gerir.me API backend
 */

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:3000';
        this.token = localStorage.getItem('gerirme_token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('gerirme_token', token);
    }

    // Remove authentication token
    removeToken() {
        this.token = null;
        localStorage.removeItem('gerirme_token');
    }

    // Get headers for API requests
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async register(userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async logout() {
        try {
            await this.request('/api/auth/logout', {
                method: 'POST'
            });
        } finally {
            this.removeToken();
        }
    }

    async getProfile() {
        return this.request('/api/auth/profile');
    }

    // Expense methods
    async getExpenses(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/api/expenses?${queryParams}` : '/api/expenses';
        return this.request(endpoint);
    }

    async createExpense(expenseData) {
        return this.request('/api/expenses', {
            method: 'POST',
            body: JSON.stringify(expenseData)
        });
    }

    async updateExpense(id, expenseData) {
        return this.request(`/api/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(expenseData)
        });
    }

    async deleteExpense(id) {
        return this.request(`/api/expenses/${id}`, {
            method: 'DELETE'
        });
    }

    async getExpense(id) {
        return this.request(`/api/expenses/${id}`);
    }

    async markExpenseAsPaid(id) {
        return this.request(`/api/expenses/${id}/pay`, {
            method: 'PATCH'
        });
    }

    async markExpenseAsUnpaid(id) {
        return this.request(`/api/expenses/${id}/unpay`, {
            method: 'PATCH'
        });
    }

    // Dashboard methods
    async getDashboardOverview() {
        return this.request('/api/dashboard/overview');
    }

    async getMonthlyStats(year, month) {
        const params = new URLSearchParams({ year, month }).toString();
        return this.request(`/api/dashboard/monthly-stats?${params}`);
    }

    async getCategoryAnalysis(year, month) {
        const params = new URLSearchParams({ year, month }).toString();
        return this.request(`/api/dashboard/category-analysis?${params}`);
    }

    // Calendar methods
    async getMonthlyCalendar(year, month) {
        const params = new URLSearchParams({ year, month }).toString();
        return this.request(`/api/calendar/month?${params}`);
    }

    async getUpcomingPayments(days = 7) {
        return this.request(`/api/calendar/upcoming?days=${days}`);
    }

    async getOverdueExpenses() {
        return this.request('/api/calendar/overdue');
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Create global API instance
window.apiService = new ApiService();