const { chai, app, request, expect } = require('./setup');
const User = require('../models/User');
const Expense = require('../models/Expense');

describe('📊 Dashboard Endpoints', function() {
  let authToken;
  let userId;
  let testExpenseIds = [];

  before(async function() {
    // Limpar dados existentes
    const User = require('../models/User');
    const Expense = require('../models/Expense');
    User.UserModel.findAll().length = 0;
    Expense.ExpenseModel.findAll().length = 0;
    
    // Criar usuário de teste
    const userData = {
      name: 'Dashboard Test User',
      email: 'dashboard' + Date.now() + '@test.com',
      password: 'Test1234',
      confirmPassword: 'Test1234'
    };

    const registerRes = await new Promise((resolve, reject) => {
      request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)
        .end((err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
    });

    authToken = registerRes.body.token;
    userId = registerRes.body.user.id;

    // Criar despesas de teste para o dashboard
    const currentDate = new Date();
    const testExpenses = [
      {
        description: 'Aluguel',
        amount: 1200.00,
        category: 'Moradia',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5).toISOString().split('T')[0],
        isPaid: true,
        isRecurring: true,
        recurringType: 'monthly'
      },
      {
        description: 'Conta de Luz',
        amount: 150.00,
        category: 'Utilidades',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10).toISOString().split('T')[0],
        isPaid: false,
        isRecurring: true,
        recurringType: 'monthly'
      },
      {
        description: 'Supermercado',
        amount: 350.00,
        category: 'Alimentação',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15).toISOString().split('T')[0],
        isPaid: false,
        isRecurring: false
      },
      {
        description: 'Academia',
        amount: 80.00,
        category: 'Saúde',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20).toISOString().split('T')[0],
        isPaid: true,
        isRecurring: true,
        recurringType: 'monthly'
      },
      {
        description: 'Cartão de Crédito',
        amount: 450.00,
        category: 'Financeiro',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 28).toISOString().split('T')[0],
        isPaid: false,
        isRecurring: false
      }
    ];

    for (const expenseData of testExpenses) {
      const expenseRes = await new Promise((resolve, reject) => {
        request(app)
          .post('/api/expenses')
          .set('Authorization', 'Bearer ' + authToken)
          .send(expenseData)
          .expect(201)
          .end((err, res) => {
            if (err) return reject(err);
            resolve(res);
          });
      });
      
      testExpenseIds.push(expenseRes.body.expense.id);
    }
  });

  after(function() {
    // Limpar dados após os testes
    User.users = [];
    Expense.expenses = [];
  });

  describe('GET /api/dashboard/overview', function() {
    it('should return dashboard overview with financial summary', function(done) {
      request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('overview');
          
          const overview = res.body.overview;
          expect(overview).to.have.property('totalExpenses');
          expect(overview).to.have.property('totalAmount');
          expect(overview).to.have.property('paidExpenses');
          expect(overview).to.have.property('unpaidExpenses');
          expect(overview).to.have.property('paidAmount');
          expect(overview).to.have.property('unpaidAmount');
          expect(overview).to.have.property('overdueExpenses');
          expect(overview).to.have.property('overdueAmount');
          expect(overview).to.have.property('upcomingExpenses');
          
          done();
        });
    });

    it('should return 401 without authentication token', function(done) {
      request(app)
        .get('/api/dashboard/overview')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/dashboard/monthly-summary', function() {
    it('should return monthly summary for current month', function(done) {
      request(app)
        .get('/api/dashboard/monthly-summary')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('monthlySummary');
          
          const summary = res.body.monthlySummary;
          expect(summary).to.have.property('month');
          expect(summary).to.have.property('year');
          expect(summary).to.have.property('totalExpenses');
          expect(summary).to.have.property('totalAmount');
          expect(summary).to.have.property('paidAmount');
          expect(summary).to.have.property('unpaidAmount');
          expect(summary).to.have.property('categoryBreakdown');
          expect(summary.categoryBreakdown).to.be.an('array');
          
          done();
        });
    });

    it('should return monthly summary for specific month', function(done) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      request(app)
        .get('/api/dashboard/monthly-summary?year=' + year + '&month=' + month)
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.monthlySummary).to.have.property('year', year);
          expect(res.body.monthlySummary).to.have.property('month', month);
          done();
        });
    });

    it('should return empty summary for month without expenses', function(done) {
      request(app)
        .get('/api/dashboard/monthly-summary?year=2020&month=1')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.monthlySummary).to.have.property('totalExpenses', 0);
          expect(res.body.monthlySummary).to.have.property('totalAmount', 0);
          done();
        });
    });

    it('should return 400 for invalid month parameter', function(done) {
      request(app)
        .get('/api/dashboard/monthly-summary?month=13')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/dashboard/category-analysis', function() {
    it('should return category analysis', function(done) {
      request(app)
        .get('/api/dashboard/category-analysis')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('categoryAnalysis');
          
          const analysis = res.body.categoryAnalysis;
          expect(analysis).to.have.property('totalCategories');
          expect(analysis).to.have.property('categories');
          expect(analysis.categories).to.be.an('array');
          
          if (analysis.categories.length > 0) {
            const category = analysis.categories[0];
            expect(category).to.have.property('name');
            expect(category).to.have.property('totalAmount');
            expect(category).to.have.property('expenseCount');
            expect(category).to.have.property('percentage');
            expect(category).to.have.property('averageAmount');
          }
          
          done();
        });
    });

    it('should return category analysis for specific period', function(done) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      request(app)
        .get('/api/dashboard/category-analysis?year=' + year + '&month=' + month)
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('categoryAnalysis');
          done();
        });
    });
  });

  describe('GET /api/dashboard/payment-trends', function() {
    it('should return payment trends analysis', function(done) {
      request(app)
        .get('/api/dashboard/payment-trends')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('paymentTrends');
          
          const trends = res.body.paymentTrends;
          expect(trends).to.have.property('monthlyTrends');
          expect(trends).to.have.property('paymentPatterns');
          expect(trends).to.have.property('averageMonthlyExpense');
          expect(trends).to.have.property('totalPaidThisMonth');
          expect(trends).to.have.property('totalUnpaidThisMonth');
          
          expect(trends.monthlyTrends).to.be.an('array');
          
          done();
        });
    });

    it('should return payment trends for specific period', function(done) {
      request(app)
        .get('/api/dashboard/payment-trends?months=6')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('paymentTrends');
          done();
        });
    });
  });

  describe('GET /api/dashboard/upcoming-payments', function() {
    it('should return upcoming payments', function(done) {
      request(app)
        .get('/api/dashboard/upcoming-payments')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('upcomingPayments');
          
          const payments = res.body.upcomingPayments;
          expect(payments).to.have.property('next7Days');
          expect(payments).to.have.property('next30Days');
          expect(payments).to.have.property('overdue');
          expect(payments).to.have.property('summary');
          
          expect(payments.next7Days).to.be.an('array');
          expect(payments.next30Days).to.be.an('array');
          expect(payments.overdue).to.be.an('array');
          
          expect(payments.summary).to.have.property('totalNext7Days');
          expect(payments.summary).to.have.property('totalNext30Days');
          expect(payments.summary).to.have.property('totalOverdue');
          
          done();
        });
    });

    it('should return upcoming payments with custom days limit', function(done) {
      request(app)
        .get('/api/dashboard/upcoming-payments?days=14')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('upcomingPayments');
          done();
        });
    });
  });

  describe('GET /api/dashboard/financial-health', function() {
    it('should return financial health metrics', function(done) {
      request(app)
        .get('/api/dashboard/financial-health')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('financialHealth');
          
          const health = res.body.financialHealth;
          expect(health).to.have.property('paymentScore');
          expect(health).to.have.property('onTimePaymentRate');
          expect(health).to.have.property('overdueRate');
          expect(health).to.have.property('averagePaymentDelay');
          expect(health).to.have.property('monthlyConsistency');
          expect(health).to.have.property('recommendations');
          
          expect(health.recommendations).to.be.an('array');
          
          done();
        });
    });
  });

  describe('GET /api/dashboard/budget-analysis', function() {
    it('should return budget analysis', function(done) {
      request(app)
        .get('/api/dashboard/budget-analysis')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('budgetAnalysis');
          
          const analysis = res.body.budgetAnalysis;
          expect(analysis).to.have.property('currentMonth');
          expect(analysis).to.have.property('previousMonth');
          expect(analysis).to.have.property('comparison');
          expect(analysis).to.have.property('projections');
          
          expect(analysis.currentMonth).to.have.property('totalExpenses');
          expect(analysis.currentMonth).to.have.property('totalAmount');
          expect(analysis.currentMonth).to.have.property('categoryBreakdown');
          
          done();
        });
    });

    it('should return budget analysis for specific period', function(done) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      request(app)
        .get('/api/dashboard/budget-analysis?year=' + year + '&month=' + month)
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('budgetAnalysis');
          done();
        });
    });
  });

  describe('GET /api/dashboard/expense-statistics', function() {
    it('should return comprehensive expense statistics', function(done) {
      request(app)
        .get('/api/dashboard/expense-statistics')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('statistics');
          
          const stats = res.body.statistics;
          expect(stats).to.have.property('overview');
          expect(stats).to.have.property('monthlyBreakdown');
          expect(stats).to.have.property('categoryDistribution');
          expect(stats).to.have.property('paymentStatus');
          expect(stats).to.have.property('trends');
          
          expect(stats.overview).to.have.property('totalExpenses');
          expect(stats.overview).to.have.property('totalAmount');
          expect(stats.overview).to.have.property('averageExpense');
          
          done();
        });
    });

    it('should return statistics for specific time range', function(done) {
      request(app)
        .get('/api/dashboard/expense-statistics?timeRange=6months')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('statistics');
          done();
        });
    });
  });

  describe('GET /api/dashboard/alerts', function() {
    it('should return dashboard alerts and notifications', function(done) {
      request(app)
        .get('/api/dashboard/alerts')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('alerts');
          
          const alerts = res.body.alerts;
          expect(alerts).to.have.property('overdue');
          expect(alerts).to.have.property('dueSoon');
          expect(alerts).to.have.property('budgetWarnings');
          expect(alerts).to.have.property('summary');
          
          expect(alerts.overdue).to.be.an('array');
          expect(alerts.dueSoon).to.be.an('array');
          expect(alerts.budgetWarnings).to.be.an('array');
          
          expect(alerts.summary).to.have.property('totalAlerts');
          expect(alerts.summary).to.have.property('highPriority');
          expect(alerts.summary).to.have.property('mediumPriority');
          expect(alerts.summary).to.have.property('lowPriority');
          
          done();
        });
    });
  });
});
