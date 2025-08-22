class GerirMe {
    constructor() {
        this.currentUser = null;
        this.expenses = [];
        this.currentExpenseId = null;
        this.currentDate = new Date();
        this.loginAttempts = {};
        this.notificationsSent = {};
        
        this.init();
    }

    async init() {
        console.log('🚀 [Gerir.me] Iniciando aplicação...');
        
        // Verificar localStorage
        this.checkLocalStorageAvailability();
        
        // Criar usuário padrão e verificar
        this.ensureDefaultUser();
        this.verifyDefaultUser();
        
        await this.loadUserData();
        this.initTheme();
        this.setupEventListeners();
        this.setupInitialRouting();
        await this.checkAuthentication();
        this.requestNotificationPermission();
        this.startNotificationCheck();
        
        console.log('✅ [Gerir.me] Aplicação inicializada com sucesso!');
    }
    
    checkLocalStorageAvailability() {
        try {
            localStorage.setItem('gerirme_test', 'test');
            localStorage.removeItem('gerirme_test');
            console.log('✅ [Gerir.me] LocalStorage disponível');
        } catch (e) {
            console.error('❌ [Gerir.me] LocalStorage não disponível:', e.message);
            alert('Erro: LocalStorage não está disponível. A aplicação pode não funcionar corretamente.');
        }
    }
    
    verifyDefaultUser() {
        const users = this.getUsers();
        console.log(`📊 [Gerir.me] Total de usuários: ${users.length}`);
        
        const defaultUser = users.find(u => u.email === 'eddie@gerir.me');
        if (defaultUser) {
            console.log('✅ [Gerir.me] Usuário padrão encontrado:', defaultUser.email);
            
            // Testar credenciais
            const loginTest = users.find(u => u.email === 'eddie@gerir.me' && u.password === 'Eddie@123');
            if (loginTest) {
                console.log('✅ [Gerir.me] Credenciais do usuário padrão válidas');
            } else {
                console.error('❌ [Gerir.me] Credenciais do usuário padrão inválidas!');
            }
        } else {
            console.error('❌ [Gerir.me] Usuário padrão não encontrado!');
        }
    }

    // ==================== AUTENTICAÇÃO ====================
    
    setupEventListeners() {
        // Auth form toggles
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
        
        // Auth forms
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            console.log('🔍 [Debug] Evento de submit interceptado');
            e.preventDefault();
            this.handleLogin(e);
        });
        
        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        
        // Password toggles
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', () => {
                this.togglePasswordVisibility(btn.dataset.target);
            });
        });
        
        // Dashboard navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(item.dataset.section);
            });
        });
        
        // User menu
        document.getElementById('userMenuBtn')?.addEventListener('click', () => {
            this.toggleUserMenu();
        });
        
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });
        
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Expense management
        document.getElementById('addExpenseBtn')?.addEventListener('click', () => {
            this.showExpenseModal();
        });
        
        document.getElementById('expenseForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleExpenseSubmit(e);
        });
        
        document.getElementById('expenseType')?.addEventListener('change', (e) => {
            this.toggleExpenseFields(e.target.value);
        });
        
        // Modal controls
        document.getElementById('closeModal')?.addEventListener('click', () => {
            this.hideExpenseModal();
        });
        
        document.getElementById('cancelBtn')?.addEventListener('click', () => {
            this.hideExpenseModal();
        });
        
        // Category filter
        document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
            this.filterExpensesByCategory(e.target.value);
        });
        
        // Calendar navigation
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            this.navigateMonth(-1);
        });
        
        document.getElementById('nextMonth')?.addEventListener('click', () => {
            this.navigateMonth(1);
        });
        
        // Confirmation modal
        document.getElementById('confirmOk')?.addEventListener('click', () => {
            this.executeConfirmedAction();
        });
        
        document.getElementById('confirmCancel')?.addEventListener('click', () => {
            this.hideConfirmModal();
        });
        
        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                if (e.target.id === 'expenseModal') {
                    this.hideExpenseModal();
                } else if (e.target.id === 'confirmModal') {
                    this.hideConfirmModal();
                }
            }
        });
        
        // Close user menu on outside click
        document.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.user-menu');
            const dropdown = document.getElementById('userDropdown');
            if (userMenu && !userMenu.contains(e.target)) {
                dropdown?.classList.remove('show');
            }
        });
    }
    
    showRegisterForm(updateURL = true) {
        document.getElementById('login-form').classList.remove('active');
        document.getElementById('register-form').classList.add('active');
        this.clearFormErrors();
        if (updateURL) {
            window.history.pushState({ page: 'register' }, '', '/register');
        }
    }
    
    showLoginForm(updateURL = true) {
        document.getElementById('register-form').classList.remove('active');
        document.getElementById('login-form').classList.add('active');
        this.clearFormErrors();
        if (updateURL) {
            window.history.pushState({ page: 'login' }, '', '/login');
        }
    }
    
    togglePasswordVisibility(targetId) {
        const input = document.getElementById(targetId);
        const button = document.querySelector(`[data-target="${targetId}"]`);
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
    
    async handleLogin(e) {
        console.log('🔍 [Debug] handleLogin chamado');
        const formData = new FormData(e.target);
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        console.log('🔐 [Gerir.me] Tentativa de login:', email);
        
        this.clearFormErrors();
        
        // Verificar bloqueio por tentativas (RN-USU-003)
        if (this.isAccountBlocked(email)) {
            console.log('🚫 [Gerir.me] Conta bloqueada:', email);
            this.showError('loginEmailError', 'Conta bloqueada por 15 minutos devido a tentativas excessivas.');
            return;
        }
        
        // Validações básicas
        if (!email || !password) {
            console.log('❌ [Gerir.me] Campos obrigatórios não preenchidos');
            
            if (!email) {
                this.showError('loginEmailError', 'E-mail é obrigatório.');
            }
            if (!password) {
                this.showError('loginPasswordError', 'Senha é obrigatória.');
            }
            return;
        }
        
        // Validar limite de caracteres
        if (email.length > 255) {
            console.log('❌ [Gerir.me] Email muito longo:', email.length);
            this.showError('loginEmailError', 'E-mail deve ter no máximo 255 caracteres.');
            return;
        }
        
        if (password.length > 128) {
            console.log('❌ [Gerir.me] Senha muito longa:', password.length);
            this.showError('loginPasswordError', 'Senha deve ter no máximo 128 caracteres.');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            console.log('❌ [Gerir.me] Email inválido:', email);
            this.showError('loginEmailError', 'E-mail inválido.');
            return;
        }
        
        try {
            // Fazer login via API
            const response = await apiService.login({ email, password });
            
            if (response.token) {
                // Login bem-sucedido
                console.log('✅ [Gerir.me] Login bem-sucedido via API');
                apiService.setToken(response.token);
                this.currentUser = response.user;
                this.saveUserSession();
                this.resetLoginAttempts(email);
                await this.showDashboard();
                this.showToast('success', 'Login realizado', 'Bem-vindo de volta!');
            }
        } catch (error) {
            // Login falhou
            console.log('❌ [Gerir.me] Erro no login via API:', error.message);
            
            this.incrementLoginAttempts(email);
            const attempts = this.getLoginAttempts(email);
            
            if (attempts >= 3) {
                this.blockAccount(email);
                this.showError('loginPasswordError', 'Conta bloqueada por 15 minutos devido a tentativas excessivas.');
            } else {
                this.showError('loginPasswordError', `Credenciais inválidas. Tentativas restantes: ${3 - attempts}`);
            }
        }
    }
    
    async handleRegister(e) {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        this.clearFormErrors();
        
        // Validações (RN-USU-001, RN-USU-002)
        let hasErrors = false;
        
        if (!this.isValidName(name)) {
            if (!name || name.trim().length === 0) {
                this.showError('registerNameError', 'Nome é obrigatório.');
            } else if (name.length > 100) {
                this.showError('registerNameError', 'Nome deve ter no máximo 100 caracteres.');
            }
            hasErrors = true;
        }
        
        if (!email) {
            this.showError('registerEmailError', 'E-mail é obrigatório.');
            hasErrors = true;
        } else if (email.length > 255) {
            this.showError('registerEmailError', 'E-mail deve ter no máximo 255 caracteres.');
            hasErrors = true;
        } else if (!this.isValidEmail(email)) {
            this.showError('registerEmailError', 'E-mail inválido.');
            hasErrors = true;
        }
        
        if (!password) {
            this.showError('registerPasswordError', 'Senha é obrigatória.');
            hasErrors = true;
        } else if (password.length > 128) {
            this.showError('registerPasswordError', 'Senha deve ter no máximo 128 caracteres.');
            hasErrors = true;
        } else if (!this.isValidPassword(password)) {
            this.showError('registerPasswordError', 'Senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos.');
            hasErrors = true;
        }
        
        if (!confirmPassword) {
            this.showError('confirmPasswordError', 'Confirmação de senha é obrigatória.');
            hasErrors = true;
        } else if (confirmPassword.length > 128) {
            this.showError('confirmPasswordError', 'Confirmação de senha deve ter no máximo 128 caracteres.');
            hasErrors = true;
        } else if (password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Senhas não coincidem.');
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        try {
            // Registrar usuário via API
            const response = await apiService.register({ name, email, password });
            
            if (response.token) {
                console.log('✅ [Gerir.me] Registro bem-sucedido via API');
                apiService.setToken(response.token);
                this.currentUser = response.user;
                this.saveUserSession();
                await this.showDashboard();
                this.showToast('success', 'Conta criada com sucesso!', 'Bem-vindo ao Gerir.me!');
            }
        } catch (error) {
            console.log('❌ [Gerir.me] Erro no registro via API:', error.message);
            
            if (error.message.includes('já existe') || error.message.includes('already exists')) {
                this.showError('registerEmailError', 'E-mail já cadastrado.');
            } else {
                this.showError('registerEmailError', 'Erro ao criar conta. Tente novamente.');
            }
        }
    }
    
    // ==================== VALIDAÇÕES ====================
    
    isValidEmail(email) {
        // Validar limite de caracteres
        if (email.length > 255) {
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPassword(password) {
        // Validar limite de caracteres
        if (password.length > 128) {
            return false;
        }
        // RN-USU-002: Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return minLength && hasUpper && hasLower && hasNumber && hasSymbol;
    }
    
    isValidName(name) {
        // Validar limite de caracteres para nome
        if (!name || name.trim().length === 0) {
            return false;
        }
        if (name.length > 100) {
            return false;
        }
        return true;
    }
    
    isValidExpenseName(name) {
        // Validar limite de caracteres para nome de despesa
        if (!name || name.trim().length === 0) {
            return false;
        }
        if (name.length > 100) {
            return false;
        }
        return name.trim().length >= 3;
    }
    
    emailExists(email) {
        const users = this.getUsers();
        return users.some(user => user.email === email);
    }
    
    // ==================== CONTROLE DE LOGIN ====================
    
    getLoginAttempts(email) {
        const attempts = this.loginAttempts[email];
        if (!attempts) return 0;
        
        // Verificar se o bloqueio expirou
        if (attempts.blockedUntil && new Date() > new Date(attempts.blockedUntil)) {
            delete this.loginAttempts[email];
            return 0;
        }
        
        return attempts.count || 0;
    }
    
    incrementLoginAttempts(email) {
        if (!this.loginAttempts[email]) {
            this.loginAttempts[email] = { count: 0 };
        }
        this.loginAttempts[email].count++;
    }
    
    resetLoginAttempts(email) {
        delete this.loginAttempts[email];
    }
    
    blockAccount(email) {
        const blockUntil = new Date();
        blockUntil.setMinutes(blockUntil.getMinutes() + 15); // 15 minutos
        
        this.loginAttempts[email] = {
            count: 3,
            blockedUntil: blockUntil.toISOString()
        };
    }
    
    isAccountBlocked(email) {
        const attempts = this.loginAttempts[email];
        if (!attempts || !attempts.blockedUntil) return false;
        
        return new Date() < new Date(attempts.blockedUntil);
    }
    
    // ==================== USUÁRIO PADRÃO ====================
    
    ensureDefaultUser() {
        const users = this.getUsers();
        console.log(`🔍 [Gerir.me] Verificando usuários existentes: ${users.length}`);
        
        // Se não há usuários, criar o usuário padrão
        if (users.length === 0) {
            console.log('➕ [Gerir.me] Nenhum usuário encontrado. Criando usuário padrão...');
            
            const defaultUser = {
                id: 'default-user-001',
                name: 'Edcleryton Silva',
                email: 'eddie@gerir.me',
                password: 'Eddie@123',
                createdAt: new Date().toISOString()
            };
            
            try {
                this.saveUser(defaultUser);
                console.log('✅ [Gerir.me] Usuário padrão criado com sucesso!');
                console.log('📧 [Gerir.me] Email: eddie@gerir.me');
                console.log('🔑 [Gerir.me] Senha: Eddie@123');
            } catch (error) {
                console.error('❌ [Gerir.me] Erro ao criar usuário padrão:', error);
            }
        } else {
            console.log('ℹ️ [Gerir.me] Usuários já existem no sistema');
            users.forEach((user, index) => {
                console.log(`👤 [Gerir.me] Usuário ${index + 1}: ${user.email}`);
            });
        }
    }
    
    // ==================== ARMAZENAMENTO ====================
    
    getUsers() {
        const users = localStorage.getItem('gerirme_users');
        return users ? JSON.parse(users) : [];
    }
    
    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('gerirme_users', JSON.stringify(users));
    }
    
    saveUserSession() {
        localStorage.setItem('gerirme_current_user', JSON.stringify(this.currentUser));
    }
    
    async loadUserData() {
        const userData = localStorage.getItem('gerirme_current_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            await this.loadExpenses();
        }
    }
    
    async checkAuthentication() {
        if (this.currentUser) {
            await this.showDashboard();
        } else {
            this.showAuth();
        }
    }
    
    async logout() {
        try {
            await apiService.logout();
        } catch (error) {
            console.log('Erro no logout via API:', error.message);
        } finally {
            this.currentUser = null;
            this.expenses = [];
            localStorage.removeItem('gerirme_current_user');
            this.showAuth();
            this.showToast('info', 'Logout realizado', 'Até logo!');
        }
    }
    
    // ==================== INTERFACE ====================
    
    showAuth() {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('dashboard-container').classList.add('hidden');
    }
    
    async showDashboard() {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('dashboard-container').classList.remove('hidden');
        
        // Atualizar nome do usuário
        document.getElementById('userName').textContent = this.currentUser.name;
        
        // Configurar roteamento
        this.setupRouting();
        
        // Carregar dados
        await this.loadExpenses();
        await this.updateDashboard();
        this.renderCalendar();
        
        // Navegar para a seção correta baseada na URL
        this.handleRouting();
    }
    
    showSection(sectionName) {
        // Atualizar URL
        this.updateURL(sectionName);
        
        // Atualizar navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Mostrar seção
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        // Ações específicas por seção
        if (sectionName === 'expenses') {
            this.renderExpensesTable();
        } else if (sectionName === 'calendar') {
            this.renderCalendar();
        } else if (sectionName === 'overview') {
            this.updateDashboard();
        }
    }
    
    // Funções de Roteamento com URLs
    updateURL(section) {
        const routes = {
            'overview': '/dashboard',
            'expenses': '/expenses', 
            'calendar': '/calendar'
        };
        
        const newPath = routes[section] || '/dashboard';
        window.history.pushState({ section }, '', newPath);
    }
    
    handleRouting() {
        const path = window.location.pathname;
        const routes = {
            '/': 'overview',
            '/dashboard': 'overview',
            '/expenses': 'expenses',
            '/calendar': 'calendar'
        };
        
        const section = routes[path] || 'overview';
        
        // Navegar para a seção sem atualizar a URL novamente
        this.navigateToSection(section);
    }
    
    navigateToSection(sectionName) {
        // Atualizar navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Mostrar seção
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        // Atualizar dados específicos da seção
        if (sectionName === 'overview') {
            this.updateDashboard();
        } else if (sectionName === 'calendar') {
            this.renderCalendar();
        }
    }
    
    setupRouting() {
        // Listener para o botão voltar/avançar do navegador
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.section) {
                this.navigateToSection(event.state.section);
            } else {
                this.handleRouting();
            }
        });
        
        // Configurar estado inicial
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '') {
            window.history.replaceState({ section: 'overview' }, '', '/dashboard');
        }
     }
     
     setupInitialRouting() {
         const path = window.location.pathname;
         
         // Listener para o botão voltar/avançar do navegador na tela de autenticação
         window.addEventListener('popstate', (event) => {
             if (!this.isAuthenticated) {
                 this.handleAuthRouting();
             }
         });
         
         // Configurar URL inicial se estiver na raiz
         if (path === '/' || path === '') {
             window.history.replaceState({ page: 'login' }, '', '/login');
         }
     }
     
     handleAuthRouting() {
          const path = window.location.pathname;
          
          if (path === '/register') {
              this.showRegisterForm(false);
          } else {
              this.showLoginForm(false);
          }
      }
     
     toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.toggle('show');
        
        // Auto-fechar menu após 3 segundos se estiver aberto
        if (dropdown.classList.contains('show')) {
            setTimeout(() => {
                dropdown.classList.remove('show');
            }, 3000);
        }
    }
    
    clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }
    
    showError(elementId, message) {
        console.log(`🔍 [Debug] Tentando exibir erro para elemento: ${elementId}, mensagem: ${message}`);
        const errorElement = document.getElementById(elementId);
        
        if (!errorElement) {
            console.error(`❌ [Debug] Elemento não encontrado: ${elementId}`);
            return;
        }
        
        console.log(`✅ [Debug] Elemento encontrado, definindo texto: ${message}`);
        errorElement.textContent = message;
        
        // Auto-remover mensagem de erro após 10 segundos (aumentado para facilitar testes)
        setTimeout(() => {
            if (errorElement.textContent === message) {
                errorElement.textContent = '';
            }
        }, 10000);
    }
    
    // ==================== TEMA ====================
    
    initTheme() {
        const savedTheme = localStorage.getItem('gerirme_theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('gerirme_theme', theme);
        
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle?.querySelector('i');
        
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                themeToggle.title = 'Alternar para modo claro';
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                themeToggle.title = 'Alternar para modo escuro';
            }
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        const themeName = newTheme === 'dark' ? 'escuro' : 'claro';
        this.showToast('info', 'Tema alterado', `Modo ${themeName} ativado`);
    }
    
    // ==================== DESPESAS ====================
    
    async loadExpenses() {
        if (!this.currentUser) return;
        
        try {
            const response = await apiService.getExpenses();
            this.expenses = response.expenses || [];
        } catch (error) {
            console.log('Erro ao carregar despesas via API:', error.message);
            this.expenses = [];
        }
    }
    
    saveExpenses() {
        if (!this.currentUser) return;
        
        const key = `gerirme_expenses_${this.currentUser.id}`;
        localStorage.setItem(key, JSON.stringify(this.expenses));
    }
    
    showExpenseModal(expense = null) {
        const modal = document.getElementById('expenseModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('expenseForm');
        
        if (expense) {
            // Editando despesa existente
            title.textContent = 'Editar Despesa';
            this.currentExpenseId = expense.id;
            this.populateExpenseForm(expense);
        } else {
            // Nova despesa
            title.textContent = 'Nova Despesa';
            this.currentExpenseId = null;
            form.reset();
            this.toggleExpenseFields('');
        }
        
        this.clearFormErrors();
        modal.classList.add('show');
    }
    
    hideExpenseModal() {
        const modal = document.getElementById('expenseModal');
        modal.classList.remove('show');
        this.currentExpenseId = null;
    }
    
    populateExpenseForm(expense) {
        document.getElementById('expenseName').value = expense.name;
        document.getElementById('expenseValue').value = expense.value;
        document.getElementById('expenseCategory').value = expense.category;
        document.getElementById('expenseType').value = expense.type;
        
        this.toggleExpenseFields(expense.type);
        
        if (expense.type === 'unique') {
            document.getElementById('expenseDate').value = expense.date;
        } else {
            document.getElementById('expenseCycle').value = expense.cycle;
            document.getElementById('nextPayment').value = expense.nextPayment;
        }
    }
    
    toggleExpenseFields(type) {
        const uniqueFields = document.getElementById('uniqueFields');
        const recurringFields = document.getElementById('recurringFields');
        
        uniqueFields.classList.remove('show');
        recurringFields.classList.remove('show');
        
        if (type === 'unique') {
            uniqueFields.classList.add('show');
        } else if (type === 'recurring') {
            recurringFields.classList.add('show');
        }
    }
    
    async handleExpenseSubmit(e) {
        const name = document.getElementById('expenseName').value.trim();
        const value = parseFloat(document.getElementById('expenseValue').value);
        const category = document.getElementById('expenseCategory').value;
        const type = document.getElementById('expenseType').value;
        
        this.clearFormErrors();
        
        // Validações básicas (RN-DES-002, RN-DES-003)
        let hasErrors = false;
        
        if (!this.isValidExpenseName(name)) {
            if (!name || name.trim().length === 0) {
                this.showError('expenseNameError', 'Nome da despesa é obrigatório.');
            } else if (name.length > 100) {
                this.showError('expenseNameError', 'Nome da despesa deve ter no máximo 100 caracteres.');
            } else if (name.trim().length < 3) {
                this.showError('expenseNameError', 'Nome da despesa deve ter pelo menos 3 caracteres.');
            }
            hasErrors = true;
        }
        
        if (!value || value <= 0) {
            this.showError('expenseValueError', 'Valor deve ser maior que zero.');
            hasErrors = true;
        }
        
        if (!category) {
            this.showError('expenseCategoryError', 'Categoria é obrigatória.');
            hasErrors = true;
        }
        
        if (!type) {
            this.showError('expenseTypeError', 'Tipo é obrigatório.');
            hasErrors = true;
        }
        
        // Validações específicas por tipo (RN-DES-004, RN-DES-004A, RN-DES-005)
        let date, cycle, nextPayment;
        
        if (type === 'unique') {
            date = document.getElementById('expenseDate').value;
            if (!date) {
                this.showError('expenseDateError', 'Data da despesa é obrigatória.');
                hasErrors = true;
            }
            // Removida a validação que impedia datas passadas para permitir registro de despesas históricas
        } else if (type === 'recurring') {
            cycle = document.getElementById('expenseCycle').value;
            nextPayment = document.getElementById('nextPayment').value;
            
            if (!cycle) {
                this.showError('expenseCycleError', 'Ciclo de cobrança é obrigatório.');
                hasErrors = true;
            }
            
            if (!nextPayment) {
                this.showError('nextPaymentError', 'Próxima data de cobrança é obrigatória.');
                hasErrors = true;
            }
        }
        
        if (hasErrors) return;
        
        // Criar ou atualizar despesa
        const expense = {
            id: this.currentExpenseId || Date.now().toString(),
            name,
            value,
            category,
            type,
            createdAt: new Date().toISOString()
        };
        
        if (type === 'unique') {
            expense.date = date;
        } else {
            expense.cycle = cycle;
            expense.nextPayment = nextPayment;
        }
        
        try {
            let response;
            if (this.currentExpenseId) {
                // Atualizar despesa existente
                const existingExpense = this.expenses.find(e => e.id === this.currentExpenseId);
                if (existingExpense) {
                    expense.createdAt = existingExpense.createdAt; // Manter data original
                }
                response = await apiService.updateExpense(this.currentExpenseId, expense);
            } else {
                // Nova despesa
                response = await apiService.createExpense(expense);
            }
            
            // Recarregar despesas da API
            await this.loadExpenses();
            
            this.hideExpenseModal();
            this.updateDashboard();
            this.renderExpensesTable();
            this.renderCalendar();
            
            const action = this.currentExpenseId ? 'atualizada' : 'adicionada';
            this.showToast('success', 'Despesa salva', `Despesa ${action} com sucesso!`);
        } catch (error) {
            console.error('Erro ao salvar despesa:', error);
            this.showToast('error', 'Erro', 'Erro ao salvar despesa. Tente novamente.');
        }
    }
    
    editExpense(id) {
        const expense = this.expenses.find(e => e.id === id);
        if (expense) {
            this.showExpenseModal(expense);
        }
    }
    
    deleteExpense(id) {
        const expense = this.expenses.find(e => e.id === id);
        if (expense) {
            this.showConfirmModal(
                `Tem certeza que deseja excluir a despesa "${expense.name}"?`,
                async () => {
                    try {
                        await apiService.deleteExpense(id);
                        
                        // Recarregar despesas da API
                        await this.loadExpenses();
                        
                        this.updateDashboard();
                        this.renderExpensesTable();
                        this.renderCalendar();
                        this.showToast('success', 'Despesa excluída', 'Despesa removida com sucesso!');
                    } catch (error) {
                        console.error('Erro ao excluir despesa:', error);
                        this.showToast('error', 'Erro', 'Erro ao excluir despesa. Tente novamente.');
                    }
                }
            );
        }
    }
    
    filterExpensesByCategory(category) {
        this.renderExpensesTable(category);
    }
    
    renderExpensesTable(categoryFilter = '') {
        const tbody = document.getElementById('expensesTableBody');
        let filteredExpenses = this.expenses;
        
        // Aplicar filtro de categoria (HU09)
        if (categoryFilter) {
            filteredExpenses = this.expenses.filter(e => e.category === categoryFilter);
        }
        
        if (filteredExpenses.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="6">
                        <div class="empty-state">
                            <i class="fas fa-receipt"></i>
                            <p>${categoryFilter ? 'Nenhuma despesa encontrada nesta categoria' : 'Nenhuma despesa cadastrada'}</p>
                            <small>${categoryFilter ? 'Tente selecionar outra categoria' : 'Clique em "Nova Despesa" para começar'}</small>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = filteredExpenses.map(expense => {
            const displayDate = expense.type === 'unique' 
                ? this.formatDate(expense.date)
                : this.formatDate(expense.nextPayment);
            
            return `
                <tr data-testid="expense-row" data-expense-id="${expense.id}">
                    <td data-testid="expense-name">${expense.name}</td>
                    <td data-testid="expense-value">${this.formatCurrency(expense.value)}</td>
                    <td data-testid="expense-category">${expense.category}</td>
                    <td>
                        <span class="expense-type ${expense.type}" data-testid="expense-type">
                            ${expense.type === 'unique' ? 'Única' : 'Recorrente'}
                        </span>
                    </td>
                    <td data-testid="expense-date">${displayDate}</td>
                    <td>
                        <div class="expense-actions" data-testid="expense-actions">
                            <button class="btn-icon" onclick="app.editExpense('${expense.id}')" title="Editar" data-testid="edit-expense-btn">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" onclick="app.deleteExpense('${expense.id}')" title="Excluir" data-testid="delete-expense-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    // ==================== DASHBOARD ====================
    
    async updateDashboard() {
        try {
            const dashboardData = await apiService.getDashboardOverview();
            
            // Atualizar cards de resumo
            document.getElementById('monthlyTotal').textContent = this.formatCurrency(dashboardData.monthlyTotal || 0);
            document.getElementById('recurringTotal').textContent = this.formatCurrency(dashboardData.recurringTotal || 0);
            document.getElementById('uniqueTotal').textContent = this.formatCurrency(dashboardData.uniqueTotal || 0);
            
            // Atualizar próximos pagamentos
            this.renderUpcomingPayments();
        } catch (error) {
            console.log('Erro ao carregar dados do dashboard via API:', error.message);
            // Fallback para cálculo local
            const calculations = this.calculateMonthlyTotals();
            
            document.getElementById('monthlyTotal').textContent = this.formatCurrency(calculations.monthlyTotal);
            document.getElementById('recurringTotal').textContent = this.formatCurrency(calculations.recurringTotal);
            document.getElementById('uniqueTotal').textContent = this.formatCurrency(calculations.uniqueTotal);
            
            this.renderUpcomingPayments();
        }
    }
    
    calculateMonthlyTotals() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        let recurringMonthly = 0;
        let recurringYearly = 0;
        let uniqueThisMonth = 0;
        
        this.expenses.forEach(expense => {
            if (expense.type === 'recurring') {
                if (expense.cycle === 'monthly') {
                    recurringMonthly += expense.value;
                } else if (expense.cycle === 'yearly') {
                    recurringYearly += expense.value;
                }
            } else if (expense.type === 'unique') {
                const expenseDate = new Date(expense.date);
                if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
                    uniqueThisMonth += expense.value;
                }
            }
        });
        
        const recurringTotal = recurringMonthly + (recurringYearly / 12);
        const monthlyTotal = recurringTotal + uniqueThisMonth;
        
        return {
            monthlyTotal,
            recurringTotal,
            uniqueTotal: uniqueThisMonth
        };
    }
    
    renderUpcomingPayments() {
        const container = document.getElementById('upcomingPayments');
        const upcomingPayments = this.getUpcomingPayments();
        
        if (upcomingPayments.length === 0) {
            container.innerHTML = `
                <div class="empty-state" data-testid="no-upcoming-payments">
                    <i class="fas fa-calendar-check"></i>
                    <p>Nenhum pagamento próximo</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = upcomingPayments.map(payment => `
            <div class="payment-item" data-testid="payment-item" data-payment-id="${payment.id}">
                <div class="payment-info" data-testid="payment-info">
                    <h4 data-testid="payment-name">${payment.name}</h4>
                    <small data-testid="payment-details">${this.formatDate(payment.date)} - ${payment.category}</small>
                </div>
                <div class="payment-value" data-testid="payment-value">
                    ${this.formatCurrency(payment.value)}
                </div>
            </div>
        `).join('');
    }
    
    getUpcomingPayments() {
        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);
        
        return this.expenses
            .filter(expense => {
                if (expense.type !== 'recurring') return false;
                
                const paymentDate = new Date(expense.nextPayment);
                return paymentDate >= now && paymentDate <= sevenDaysFromNow;
            })
            .map(expense => ({
                id: expense.id,
                name: expense.name,
                value: expense.value,
                category: expense.category,
                date: expense.nextPayment
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    // ==================== CALENDÁRIO ====================
    
    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }
    
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Atualizar título
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
        
        // Gerar calendário
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const calendarGrid = document.getElementById('calendarGrid');
        let calendarHTML = '';
        
        // Cabeçalho dos dias da semana
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        calendarHTML += '<div class="calendar-header-row" data-testid="calendar-header-row">';
        dayNames.forEach(day => {
            calendarHTML += `<div class="calendar-header-cell" data-testid="calendar-header-cell">${day}</div>`;
        });
        calendarHTML += '</div>';
        
        // Dias do calendário
        const today = new Date();
        const currentDate = new Date(startDate);
        
        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const dayNumber = currentDate.getDate();
                const isCurrentMonth = currentDate.getMonth() === month;
                const isToday = currentDate.toDateString() === today.toDateString();
                const hasPayment = this.hasPaymentOnDate(currentDate);
                
                let classes = 'calendar-day';
                if (!isCurrentMonth) classes += ' other-month';
                if (isToday) classes += ' today';
                if (hasPayment) classes += ' has-payment';
                
                calendarHTML += `<div class="${classes}" data-date="${currentDate.toISOString().split('T')[0]}" data-testid="calendar-day">${dayNumber}</div>`;
                
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        
        calendarGrid.innerHTML = calendarHTML;
        
        // Adicionar tooltips para dias com pagamentos
        this.addCalendarTooltips();
    }
    
    hasPaymentOnDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return this.expenses.some(expense => {
            if (expense.type !== 'recurring') return false;
            return expense.nextPayment === dateString;
        });
    }
    
    addCalendarTooltips() {
        document.querySelectorAll('.calendar-day.has-payment').forEach(dayElement => {
            const date = dayElement.dataset.date;
            const payments = this.expenses.filter(expense => 
                expense.type === 'recurring' && expense.nextPayment === date
            );
            
            if (payments.length > 0) {
                const tooltipText = payments.map(p => `${p.name} - ${this.formatCurrency(p.value)}`).join('\n');
                dayElement.title = tooltipText;
            }
        });
    }
    
    // ==================== NOTIFICAÇÕES ====================
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    startNotificationCheck() {
        // Verificar notificações a cada 30 minutos
        setInterval(() => {
            this.checkUpcomingPayments();
        }, 30 * 60 * 1000);
        
        // Verificar imediatamente
        setTimeout(() => {
            this.checkUpcomingPayments();
        }, 5000);
    }
    
    checkUpcomingPayments() {
        if (!this.currentUser || Notification.permission !== 'granted') return;
        
        const now = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);
        
        const upcomingPayments = this.expenses.filter(expense => {
            if (expense.type !== 'recurring') return false;
            
            const paymentDate = new Date(expense.nextPayment);
            return paymentDate >= now && paymentDate <= threeDaysFromNow;
        });
        
        upcomingPayments.forEach(expense => {
            const notificationKey = `${expense.id}_${expense.nextPayment}`;
            const today = now.toISOString().split('T')[0];
            
            // Verificar se já foi enviada hoje (RN-NOT-003)
            if (this.notificationsSent[notificationKey] === today) return;
            
            const daysUntil = Math.ceil((new Date(expense.nextPayment) - now) / (1000 * 60 * 60 * 24));
            let message;
            
            if (daysUntil === 0) {
                message = `Vence hoje: ${expense.name} - ${this.formatCurrency(expense.value)}`;
            } else if (daysUntil === 1) {
                message = `Vence amanhã: ${expense.name} - ${this.formatCurrency(expense.value)}`;
            } else {
                message = `Vence em ${daysUntil} dias: ${expense.name} - ${this.formatCurrency(expense.value)}`;
            }
            
            new Notification('Gerir.me - Pagamento próximo', {
                body: message,
                icon: '/favicon.ico'
            });
            
            // Marcar como enviada
            this.notificationsSent[notificationKey] = today;
        });
    }
    
    // ==================== MODAIS ====================
    
    showConfirmModal(message, onConfirm) {
        document.getElementById('confirmMessage').textContent = message;
        this.confirmAction = onConfirm;
        document.getElementById('confirmModal').classList.add('show');
    }
    
    hideConfirmModal() {
        document.getElementById('confirmModal').classList.remove('show');
        this.confirmAction = null;
    }
    
    executeConfirmedAction() {
        if (this.confirmAction) {
            this.confirmAction();
            this.confirmAction = null;
        }
        this.hideConfirmModal();
    }
    
    // ==================== TOAST NOTIFICATIONS ====================
    
    showToast(type, title, message) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Auto-remover após 3 segundos
        setTimeout(() => {
            this.removeToast(toast);
        }, 3000);
        
        // Botão de fechar
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });
    }
    
    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
    
    // ==================== UTILITÁRIOS ====================
    
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const app = new GerirMe();
    // Expor a aplicação globalmente para testes
    window.app = app;
});