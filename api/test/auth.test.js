const { chai, app, request, expect } = require('./setup');
const User = require('../models/User');

describe('🔐 Authentication Endpoints', function() {
  this.timeout(5000);

  describe('POST /api/auth/register', function() {
    it('should register a new user successfully', function(done) {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };

      request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('id');
          expect(res.body.user).to.have.property('name', userData.name);
          expect(res.body.user).to.have.property('email', userData.email);
          expect(res.body.user).to.not.have.property('password');
          done();
        });
    });

    it('should return 400 for invalid email', function(done) {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };

      request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should return 400 for weak password', function(done) {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        confirmPassword: '123'
      };

      request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('POST /api/auth/login', function() {
    beforeEach(function(done) {
      // Criar usuário para testes de login
      const userData = {
        name: 'Login User',
        email: 'login@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };

      request(app)
        .post('/api/auth/register')
        .send(userData)
        .end(() => done());
    });

    it('should login successfully with valid credentials', function(done) {
      const loginData = {
        email: 'login@example.com',
        password: 'Password123!'
      };

      request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('email', loginData.email);
          done();
        });
    });

    it('should return 401 for invalid password', function(done) {
      const loginData = {
        email: 'login@example.com',
        password: 'WrongPassword'
      };

      request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/auth/profile', function() {
    let authToken;

    beforeEach(function(done) {
      // Registrar e fazer login para obter token
      const userData = {
        name: 'Profile User',
        email: 'profile@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };

      request(app)
        .post('/api/auth/register')
        .send(userData)
        .end((err, res) => {
          authToken = res.body.token;
          done();
        });
    });

    it('should return user profile with valid token', function(done) {
      request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('email', 'profile@example.com');
          expect(res.body.user).to.not.have.property('password');
          done();
        });
    });

    it('should return 401 without token', function(done) {
      request(app)
        .get('/api/auth/profile')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});
