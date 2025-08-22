const { chai, app, request, expect } = require('./setup');
const User = require('../models/User');
const Expense = require('../models/Expense');

describe('💰 Expenses Endpoints', function() {
  this.timeout(5000);
  let authToken;
  let userId;

  beforeEach(function(done) {
    // Limpar dados existentes
    const User = require('../models/User');
    const Expense = require('../models/Expense');
    User.UserModel.findAll().length = 0; // Limpar array de usuários
    Expense.ExpenseModel.findAll().length = 0; // Limpar array de despesas
    
    // Registrar usuário para testes
    const userData = {
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com',
      password: 'Test1234',
      confirmPassword: 'Test1234'
    };

    request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        authToken = res.body.token;
        userId = res.body.user.id;
        done();
      });
  });

  describe('POST /api/expenses', function() {
    it('should create a new expense successfully', function(done) {
      const expenseData = {
        description: 'Test Expense',
        amount: 100.50,
        category: 'Food',
        dueDate: '2024-01-15',
        isPaid: false,
        isRecurring: false
      };

      request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer ' + authToken)
        .send(expenseData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('expense');
          expect(res.body.expense).to.have.property('id');
          expect(res.body.expense).to.have.property('description', expenseData.description);
          expect(res.body.expense).to.have.property('amount', expenseData.amount);
          done();
        });
    });

    it('should return 400 for invalid expense data', function(done) {
      const expenseData = {
        description: '',
        amount: -50,
        category: '',
        date: 'invalid-date'
      };

      request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer ' + authToken)
        .send(expenseData)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/expenses', function() {
    beforeEach(function(done) {
      // Criar algumas despesas para teste
      const expenses = [
        {
          description: 'Expense 1',
          amount: 50,
          category: 'Food',
          date: '2024-01-15',
          type: 'expense'
        },
        {
          description: 'Expense 2',
          amount: 75,
          category: 'Transport',
          date: '2024-01-16',
          type: 'expense'
        }
      ];

      let completed = 0;
      expenses.forEach(expense => {
        request(app)
          .post('/api/expenses')
          .set('Authorization', 'Bearer ' + authToken)
          .send(expense)
          .end(() => {
            completed++;
            if (completed === expenses.length) done();
          });
      });
    });

    it('should get all expenses for authenticated user', function(done) {
      request(app)
        .get('/api/expenses')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('expenses');
          expect(res.body.expenses).to.be.an('array');
          expect(res.body.expenses).to.have.length.at.least(2);
          done();
        });
    });

    it('should return 401 without authentication', function(done) {
      request(app)
        .get('/api/expenses')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/expenses/:id', function() {
    let expenseId;

    beforeEach(function(done) {
      const expenseData = {
        description: 'Single Expense',
        amount: 25.75,
        category: 'Entertainment',
        date: '2024-01-17',
        type: 'expense'
      };

      request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer ' + authToken)
        .send(expenseData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          if (res.body && res.body.expense && res.body.expense.id) {
            expenseId = res.body.expense.id;
            done();
          } else {
            done(new Error('Failed to create expense or get expense ID'));
          }
        });
    });

    it('should get expense by id', function(done) {
      request(app)
        .get('/api/expenses/' + expenseId)
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('expense');
          expect(res.body.expense).to.have.property('id', expenseId);
          expect(res.body.expense).to.have.property('description', 'Single Expense');
          done();
        });
    });

    it('should return 404 for non-existent expense', function(done) {
      request(app)
        .get('/api/expenses/999999')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('PUT /api/expenses/:id', function() {
    let expenseId;

    beforeEach(function(done) {
      const expenseData = {
        description: 'Update Expense',
        amount: 30,
        category: 'Shopping',
        date: '2024-01-18',
        type: 'expense'
      };

      request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer ' + authToken)
        .send(expenseData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          if (res.body && res.body.expense && res.body.expense.id) {
            expenseId = res.body.expense.id;
            done();
          } else {
            done(new Error('Failed to create expense or get expense ID'));
          }
        });
    });

    it('should update expense successfully', function(done) {
      const updateData = {
        description: 'Updated Expense',
        amount: 45.25,
        category: 'Updated Category'
      };

      request(app)
        .put('/api/expenses/' + expenseId)
        .set('Authorization', 'Bearer ' + authToken)
        .send(updateData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('expense');
          expect(res.body.expense).to.have.property('description', updateData.description);
          expect(res.body.expense).to.have.property('amount', updateData.amount);
          done();
        });
    });
  });

  describe('DELETE /api/expenses/:id', function() {
    let expenseId;

    beforeEach(function(done) {
      const expenseData = {
        description: 'Delete Expense',
        amount: 20,
        category: 'Test',
        date: '2024-01-19',
        type: 'expense'
      };

      request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer ' + authToken)
        .send(expenseData)
        .end((err, res) => {
          if (err) return done(err);
          expenseId = res.body.expense.id;
          done();
        });
    });

    it('should delete expense successfully', function(done) {
      request(app)
        .delete('/api/expenses/' + expenseId)
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          
          // Verificar se foi realmente deletado
          request(app)
            .get('/api/expenses/' + expenseId)
            .set('Authorization', 'Bearer ' + authToken)
            .expect(404)
            .end((err, res) => {
              if (err) return done(err);
              done();
            });
        });
    });
  });
});
