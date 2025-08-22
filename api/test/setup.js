const chai = require('chai');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Expense = require('../models/Expense');

// Exportar para uso nos testes
module.exports = {
  chai,
  app,
  request,
  expect: chai.expect
};

// Configurações globais para os testes
before(function() {
  console.log('🧪 Iniciando suite de testes da API Gerir.me');
});

after(function() {
  console.log('✅ Testes concluídos');
});

// Limpar dados entre os testes
beforeEach(function() {
  // Reset dos dados para cada teste
  User.users = [];
  Expense.expenses = [];
});
