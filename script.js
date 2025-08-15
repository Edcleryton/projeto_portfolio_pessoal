// Gerenciador de Assinaturas - JavaScript Vanilla

// Classe para gerenciar autenticação
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.bindAuthEvents();
        this.checkAuthState();
    }

    bindAuthEvents() {
        // Login form
        document.getElementById('login-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form
        document.getElementById('register-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Forgot password form
        document.getElementById('forgot-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Auth navigation links
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthForm('register');
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthForm('login');
        });

        document.getElementById('show-forgot').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthForm('forgot');
        });

        document.getElementById('back-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthForm('login');
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });
    }

    showAuthForm(formType) {
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${formType}-form`).classList.add('active');
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showApp();
            this.showToast('Login realizado com sucesso!', 'success');
        } else {
            this.showToast('E-mail ou senha incorretos!', 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // Validações
        if (password !== confirmPassword) {
            this.showToast('As senhas não coincidem!', 'error');
            return;
        }

        if (password.length < 6) {
            this.showToast('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            this.showToast('Este e-mail já está cadastrado!', 'error');
            return;
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        this.showToast('Conta criada com sucesso! Faça login para continuar.', 'success');
        this.showAuthForm('login');
        
        // Limpar formulário
        document.getElementById('register-form-element').reset();
    }

    handleForgotPassword() {
        const email = document.getElementById('forgot-email').value;
        
        const user = this.users.find(u => u.email === email);
        
        if (user) {
            // Simular envio de e-mail
            this.showToast(`Instruções enviadas para ${email}. Verifique sua caixa de entrada.`, 'success');
            setTimeout(() => {
                this.showAuthForm('login');
            }, 2000);
        } else {
            this.showToast('E-mail não encontrado!', 'error');
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showAuth();
        this.showToast('Logout realizado com sucesso!', 'success');
    }

    checkAuthState() {
        if (this.currentUser) {
            this.showApp();
        } else {
            this.showAuth();
        }
    }

    showAuth() {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
    }

    showApp() {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        document.getElementById('user-name').textContent = this.currentUser.name;
        
        // Inicializar o gerenciador de assinaturas
        if (!window.subscriptionManager) {
            window.subscriptionManager = new SubscriptionManager();
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

class SubscriptionManager {
    constructor() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userId = currentUser ? currentUser.id : null;
        this.subscriptions = JSON.parse(localStorage.getItem(`subscriptions_${this.userId}`)) || [];
        this.currentDate = new Date();
        this.editingId = null;
        
        this.init();
        this.loadSampleDataIfNeeded();
    }

    init() {
        this.bindEvents();
        this.renderDashboard();
        this.renderSubscriptions();
        this.renderCalendar();
        this.showSection('dashboard');
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.updateActiveNav(link);
            });
        });

        // Modal events
        document.getElementById('add-subscription-btn').addEventListener('click', () => {
            this.openModal();
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submission
        document.getElementById('subscription-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSubscription();
        });

        // Filters
        document.getElementById('category-filter').addEventListener('change', () => {
            this.renderSubscriptions();
        });

        document.getElementById('status-filter').addEventListener('change', () => {
            this.renderSubscriptions();
        });

        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Close modal on outside click
        document.getElementById('subscription-modal').addEventListener('click', (e) => {
            if (e.target.id === 'subscription-modal') {
                this.closeModal();
            }
        });
    }

    showSection(sectionName) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        // Update data when switching sections
        if (sectionName === 'dashboard') {
            this.renderDashboard();
        } else if (sectionName === 'subscriptions') {
            this.renderSubscriptions();
        } else if (sectionName === 'calendar') {
            this.renderCalendar();
        }
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    openModal(subscription = null) {
        const modal = document.getElementById('subscription-modal');
        const form = document.getElementById('subscription-form');
        const title = document.getElementById('modal-title');

        if (subscription) {
            title.textContent = 'Editar Assinatura';
            this.editingId = subscription.id;
            this.populateForm(subscription);
        } else {
            title.textContent = 'Adicionar Assinatura';
            this.editingId = null;
            form.reset();
            // Set default next payment date to today
            document.getElementById('next-payment').value = new Date().toISOString().split('T')[0];
        }

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('subscription-modal');
        modal.classList.remove('active');
        this.editingId = null;
    }

    populateForm(subscription) {
        document.getElementById('service-name').value = subscription.name;
        document.getElementById('service-price').value = subscription.price;
        document.getElementById('service-category').value = subscription.category;
        document.getElementById('billing-cycle').value = subscription.billingCycle;
        document.getElementById('next-payment').value = subscription.nextPayment;
        document.getElementById('service-status').value = subscription.status;
    }

    saveSubscription() {
        const formData = {
            name: document.getElementById('service-name').value,
            price: parseFloat(document.getElementById('service-price').value),
            category: document.getElementById('service-category').value,
            billingCycle: document.getElementById('billing-cycle').value,
            nextPayment: document.getElementById('next-payment').value,
            status: document.getElementById('service-status').value
        };

        if (this.editingId) {
            // Edit existing subscription
            const index = this.subscriptions.findIndex(sub => sub.id === this.editingId);
            if (index !== -1) {
                this.subscriptions[index] = { ...formData, id: this.editingId };
                this.showToast('Assinatura atualizada com sucesso!', 'success');
            }
        } else {
            // Add new subscription
            const newSubscription = {
                ...formData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            this.subscriptions.push(newSubscription);
            this.showToast('Assinatura adicionada com sucesso!', 'success');
        }

        this.saveToStorage();
        this.closeModal();
        this.renderDashboard();
        this.renderSubscriptions();
        this.renderCalendar();
    }

    deleteSubscription(id) {
        if (confirm('Tem certeza que deseja excluir esta assinatura?')) {
            this.subscriptions = this.subscriptions.filter(sub => sub.id !== id);
            this.saveToStorage();
            this.renderDashboard();
            this.renderSubscriptions();
            this.renderCalendar();
            this.showToast('Assinatura excluída com sucesso!', 'success');
        }
    }

    toggleStatus(id) {
        const subscription = this.subscriptions.find(sub => sub.id === id);
        if (subscription) {
            subscription.status = subscription.status === 'active' ? 'inactive' : 'active';
            this.saveToStorage();
            this.renderDashboard();
            this.renderSubscriptions();
            this.showToast(`Assinatura ${subscription.status === 'active' ? 'ativada' : 'desativada'}!`, 'success');
        }
    }

    saveToStorage() {
        localStorage.setItem(`subscriptions_${this.userId}`, JSON.stringify(this.subscriptions));
    }

    loadSampleDataIfNeeded() {
        if (this.subscriptions.length === 0) {
            const sampleData = [
                {
                    id: '1',
                    name: 'Netflix',
                    price: 29.90,
                    category: 'streaming',
                    billingCycle: 'monthly',
                    nextPayment: '2024-02-15',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    name: 'Spotify',
                    price: 19.90,
                    category: 'music',
                    billingCycle: 'monthly',
                    nextPayment: '2024-02-10',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '3',
                    name: 'Adobe Creative Cloud',
                    price: 239.88,
                    category: 'software',
                    billingCycle: 'yearly',
                    nextPayment: '2024-06-15',
                    status: 'active',
                    createdAt: new Date().toISOString()
                }
            ];
            
            this.subscriptions = sampleData;
            this.saveToStorage();
            this.renderDashboard();
            this.renderSubscriptions();
            this.renderCalendar();
        }
    }

    renderDashboard() {
        const activeSubscriptions = this.subscriptions.filter(sub => sub.status === 'active');
        
        // Calculate totals
        const monthlyTotal = activeSubscriptions.reduce((total, sub) => {
            return total + (sub.billingCycle === 'monthly' ? sub.price : sub.price / 12);
        }, 0);
        
        const yearlyTotal = activeSubscriptions.reduce((total, sub) => {
            return total + (sub.billingCycle === 'yearly' ? sub.price : sub.price * 12);
        }, 0);

        // Update stats
        document.getElementById('total-monthly').textContent = this.formatCurrency(monthlyTotal);
        document.getElementById('total-yearly').textContent = this.formatCurrency(yearlyTotal);
        document.getElementById('active-subs').textContent = activeSubscriptions.length;
        
        // Calculate upcoming payments (next 7 days)
        const upcomingPayments = this.getUpcomingPayments(7);
        document.getElementById('upcoming-payments').textContent = upcomingPayments.length;
        
        // Render upcoming payments list
        this.renderUpcomingPayments();
        
        // Render category chart
        this.renderCategoryChart();
    }

    renderUpcomingPayments() {
        const upcomingList = document.getElementById('upcoming-list');
        const upcomingPayments = this.getUpcomingPayments(30); // Next 30 days
        
        if (upcomingPayments.length === 0) {
            upcomingList.innerHTML = '<p class="empty-state">Nenhum pagamento próximo</p>';
            return;
        }
        
        upcomingList.innerHTML = upcomingPayments.map(payment => `
            <div class="upcoming-item">
                <div class="upcoming-item-info">
                    <h5>${payment.name}</h5>
                    <p>${this.formatDate(payment.nextPayment)}</p>
                </div>
                <div class="upcoming-item-price">${this.formatCurrency(payment.price)}</div>
            </div>
        `).join('');
    }

    renderCategoryChart() {
        const categoryChart = document.getElementById('category-chart');
        const activeSubscriptions = this.subscriptions.filter(sub => sub.status === 'active');
        
        if (activeSubscriptions.length === 0) {
            categoryChart.innerHTML = '<p class="empty-state">Adicione assinaturas para ver o gráfico</p>';
            return;
        }
        
        const categoryTotals = {};
        const categoryColors = {
            streaming: '#ef4444',
            software: '#3b82f6',
            music: '#10b981',
            fitness: '#f59e0b',
            news: '#8b5cf6',
            other: '#6b7280'
        };
        
        activeSubscriptions.forEach(sub => {
            const monthlyPrice = sub.billingCycle === 'monthly' ? sub.price : sub.price / 12;
            categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyPrice;
        });
        
        categoryChart.innerHTML = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)
            .map(([category, total]) => `
                <div class="category-item">
                    <div class="category-info">
                        <div class="category-color" style="background-color: ${categoryColors[category]}"></div>
                        <span class="category-name">${this.getCategoryName(category)}</span>
                    </div>
                    <div class="category-amount">${this.formatCurrency(total)}</div>
                </div>
            `).join('');
    }

    renderSubscriptions() {
        const subscriptionsList = document.getElementById('subscriptions-list');
        const categoryFilter = document.getElementById('category-filter').value;
        const statusFilter = document.getElementById('status-filter').value;
        
        let filteredSubscriptions = this.subscriptions;
        
        if (categoryFilter) {
            filteredSubscriptions = filteredSubscriptions.filter(sub => sub.category === categoryFilter);
        }
        
        if (statusFilter) {
            filteredSubscriptions = filteredSubscriptions.filter(sub => sub.status === statusFilter);
        }
        
        if (filteredSubscriptions.length === 0) {
            subscriptionsList.innerHTML = '<p class="empty-state">Nenhuma assinatura encontrada. Adicione sua primeira assinatura!</p>';
            return;
        }
        
        subscriptionsList.innerHTML = filteredSubscriptions.map(sub => `
            <div class="subscription-item">
                <div class="subscription-info">
                    <div class="subscription-icon">
                        <i class="${this.getCategoryIcon(sub.category)}"></i>
                    </div>
                    <div class="subscription-details">
                        <h4>${sub.name}</h4>
                        <p>${this.getCategoryName(sub.category)} • ${sub.billingCycle === 'monthly' ? 'Mensal' : 'Anual'}</p>
                        <p>Próximo pagamento: ${this.formatDate(sub.nextPayment)}</p>
                        <span class="status-badge status-${sub.status}">${sub.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                    </div>
                </div>
                <div class="subscription-price">${this.formatCurrency(sub.price)}</div>
                <div class="subscription-actions">
                    <button class="btn btn-secondary btn-small" onclick="app.toggleStatus('${sub.id}')">
                        <i class="fas fa-${sub.status === 'active' ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="btn btn-primary btn-small" onclick="app.openModal(${JSON.stringify(sub).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="app.deleteSubscription('${sub.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const currentMonth = document.getElementById('current-month');
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        currentMonth.textContent = new Intl.DateTimeFormat('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
        }).format(this.currentDate);
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days = [];
        const today = new Date();
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const payments = this.getPaymentsForDate(date);
            
            days.push({
                date,
                isCurrentMonth,
                isToday,
                payments
            });
        }
        
        calendarGrid.innerHTML = days.map(day => `
            <div class="calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}">
                <div class="calendar-day-number">${day.date.getDate()}</div>
                ${day.payments.map(payment => `
                    <div class="calendar-payment" title="${payment.name} - ${this.formatCurrency(payment.price)}">
                        ${payment.name}
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    getUpcomingPayments(days) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        
        return this.subscriptions
            .filter(sub => sub.status === 'active')
            .filter(sub => {
                const paymentDate = new Date(sub.nextPayment);
                return paymentDate >= today && paymentDate <= futureDate;
            })
            .sort((a, b) => new Date(a.nextPayment) - new Date(b.nextPayment));
    }

    getPaymentsForDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return this.subscriptions
            .filter(sub => sub.status === 'active')
            .filter(sub => sub.nextPayment === dateString);
    }

    getCategoryName(category) {
        const categories = {
            streaming: 'Streaming',
            software: 'Software',
            music: 'Música',
            fitness: 'Fitness',
            news: 'Notícias',
            other: 'Outros'
        };
        return categories[category] || category;
    }

    getCategoryIcon(category) {
        const icons = {
            streaming: 'fas fa-play',
            software: 'fas fa-laptop-code',
            music: 'fas fa-music',
            fitness: 'fas fa-dumbbell',
            news: 'fas fa-newspaper',
            other: 'fas fa-star'
        };
        return icons[category] || 'fas fa-star';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        }[type];
        
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

// Initialize the authentication manager
const authManager = new AuthManager();

// Create sample user if no users exist
if (authManager.users.length === 0) {
    const sampleUser = {
        id: '1',
        name: 'Usuário Demo',
        email: 'demo@subsmanager.com',
        password: '123456',
        createdAt: new Date().toISOString()
    };
    
    authManager.users.push(sampleUser);
    localStorage.setItem('users', JSON.stringify(authManager.users));
}