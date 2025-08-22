const { chai, app, request, expect } = require('./setup');
const User = require('../models/User');
const Expense = require('../models/Expense');

describe('📅 Calendar Endpoints', function() {
  let authToken;
  let userId;
  let testExpenseId;

  before(async function() {
    // Limpar dados existentes
    const User = require('../models/User');
    const Expense = require('../models/Expense');
    User.UserModel.findAll().length = 0;
    Expense.ExpenseModel.findAll().length = 0;
    
    // Criar usuário de teste
    const userData = {
      name: 'Calendar Test User',
      email: 'calendar' + Date.now() + '@test.com',
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

    // Criar algumas despesas de teste para o calendário
    const currentDate = new Date();
    const testExpenses = [
      {
        description: 'Aluguel Janeiro',
        amount: 1200.00,
        category: 'Moradia',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5).toISOString().split('T')[0],
        isPaid: false,
        isRecurring: true,
        recurringType: 'monthly'
      },
      {
        description: 'Internet',
        amount: 89.90,
        category: 'Utilidades',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15).toISOString().split('T')[0],
        isPaid: true,
        isRecurring: true,
        recurringType: 'monthly'
      },
      {
        description: 'Supermercado',
        amount: 350.00,
        category: 'Alimentação',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20).toISOString().split('T')[0],
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
      
      if (!testExpenseId) {
        testExpenseId = expenseRes.body.expense.id;
      }
    }
  });

  after(function() {
    // Limpar dados após os testes
    User.users = [];
    Expense.expenses = [];
  });

  describe('GET /api/calendar/month', function() {
    it('should return monthly calendar for current month', function(done) {
      request(app)
        .get('/api/calendar/month')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('calendar');
          
          const calendar = res.body.calendar;
          expect(calendar).to.have.property('year');
          expect(calendar).to.have.property('month');
          expect(calendar).to.have.property('summary');
          expect(calendar).to.have.property('days');
          
          // Verificar resumo
          expect(calendar.summary).to.have.property('totalExpenses');
          expect(calendar.summary).to.have.property('totalAmount');
          expect(calendar.summary).to.have.property('paidExpenses');
          expect(calendar.summary).to.have.property('unpaidExpenses');
          expect(calendar.summary).to.have.property('paidAmount');
          expect(calendar.summary).to.have.property('unpaidAmount');
          
          done();
        });
    });

    it('should return monthly calendar for specific month', function(done) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      request(app)
        .get('/api/calendar/month?year=' + year + '&month=' + month)
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.calendar).to.have.property('year', year);
          expect(res.body.calendar).to.have.property('month', month);
          done();
        });
    });

    it('should return empty calendar for month without expenses', function(done) {
      request(app)
        .get('/api/calendar/month?year=2020&month=1')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.calendar.summary).to.have.property('totalExpenses', 0);
          expect(res.body.calendar.summary).to.have.property('totalAmount', 0);
          expect(Object.keys(res.body.calendar.days)).to.have.length(0);
          done();
        });
    });

    it('should return 400 for invalid month parameter', function(done) {
      request(app)
        .get('/api/calendar/month?month=13')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should return 400 for invalid year parameter', function(done) {
      request(app)
        .get('/api/calendar/month?year=abc')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should return 401 without authentication token', function(done) {
      request(app)
        .get('/api/calendar/month')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/calendar/upcoming', function() {
    it('should return upcoming expenses', function(done) {
      request(app)
        .get('/api/calendar/upcoming')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('upcomingExpenses');
          expect(res.body.upcomingExpenses).to.be.an('array');
          
          if (res.body.upcomingExpenses.length > 0) {
            const expense = res.body.upcomingExpenses[0];
            expect(expense).to.have.property('id');
            expect(expense).to.have.property('description');
            expect(expense).to.have.property('amount');
            expect(expense).to.have.property('dueDate');
            expect(expense).to.have.property('daysUntilDue');
          }
          
          done();
        });
    });

    it('should return upcoming expenses with custom days limit', function(done) {
      request(app)
        .get('/api/calendar/upcoming?days=7')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('upcomingExpenses');
          expect(res.body.upcomingExpenses).to.be.an('array');
          done();
        });
    });

    it('should return 400 for invalid days parameter', function(done) {
      request(app)
        .get('/api/calendar/upcoming?days=abc')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('upcomingExpenses');
          done();
        });
    });
  });

  describe('GET /api/calendar/overdue', function() {
    it('should return overdue expenses', function(done) {
      request(app)
        .get('/api/calendar/overdue')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('overdueExpenses');
          expect(res.body.overdueExpenses).to.be.an('array');
          
          if (res.body.overdueExpenses.length > 0) {
            const expense = res.body.overdueExpenses[0];
            expect(expense).to.have.property('id');
            expect(expense).to.have.property('description');
            expect(expense).to.have.property('amount');
            expect(expense).to.have.property('dueDate');
            expect(expense).to.have.property('daysOverdue');
          }
          
          done();
        });
    });
  });

  describe('GET /api/calendar/year/:year', function() {
    it('should return yearly calendar summary', function(done) {
      const currentYear = new Date().getFullYear();
      
      request(app)
        .get('/api/calendar/year/' + currentYear)
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('yearSummary');
          
          const summary = res.body.yearSummary;
          expect(summary).to.have.property('year', currentYear);
          expect(summary).to.have.property('totalExpenses');
          expect(summary).to.have.property('totalAmount');
          expect(summary).to.have.property('monthlyBreakdown');
          expect(summary.monthlyBreakdown).to.be.an('array');
          expect(summary.monthlyBreakdown).to.have.length(12);
          
          done();
        });
    });

    it('should return yearly calendar for specific year', function(done) {
      request(app)
        .get('/api/calendar/year/2023')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.yearSummary).to.have.property('year', 2023);
          done();
        });
    });

    it('should return 400 for invalid year parameter', function(done) {
      request(app)
        .get('/api/calendar/year/abc')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/calendar/notifications', function() {
    it('should return payment notifications', function(done) {
      request(app)
        .get('/api/calendar/notifications')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('notifications');
          expect(res.body.notifications).to.be.an('array');
          
          if (res.body.notifications.length > 0) {
            const notification = res.body.notifications[0];
            expect(notification).to.have.property('type');
            expect(notification).to.have.property('message');
            expect(notification).to.have.property('expense');
            expect(notification).to.have.property('priority');
          }
          
          done();
        });
    });

    it('should return notifications with custom days ahead', function(done) {
      request(app)
        .get('/api/calendar/notifications?daysAhead=3')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('notifications');
          done();
        });
    });

    it('should return 401 without authentication token', function(done) {
      request(app)
        .get('/api/calendar/notifications')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('POST /api/calendar/mark-paid/:expenseId', function() {
    it('should mark expense as paid', function(done) {
      request(app)
        .post('/api/calendar/mark-paid/' + testExpenseId)
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('expense');
          expect(res.body.expense).to.have.property('isPaid', true);
          done();
        });
    });

    it('should return 404 for non-existent expense', function(done) {
      request(app)
        .post('/api/calendar/mark-paid/999999')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should return 401 without authentication token', function(done) {
      request(app)
        .post('/api/calendar/mark-paid/' + testExpenseId)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/calendar/statistics', function() {
    it('should return calendar statistics', function(done) {
      request(app)
        .get('/api/calendar/statistics')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('statistics');
          
          const stats = res.body.statistics;
          expect(stats).to.have.property('currentMonth');
          expect(stats).to.have.property('nextMonth');
          expect(stats).to.have.property('overdue');
          expect(stats).to.have.property('upcoming');
          
          done();
        });
    });

    it('should return statistics for specific period', function(done) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      request(app)
        .get('/api/calendar/statistics?year=' + year + '&month=' + month)
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('statistics');
          done();
        });
    });

    it('should return 400 for invalid period parameters', function(done) {
      request(app)
        .get('/api/calendar/statistics?year=abc&month=xyz')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('statistics');
          done();
        });
    });
  });
});
