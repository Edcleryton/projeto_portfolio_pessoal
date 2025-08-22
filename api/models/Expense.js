const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class Expense {
  constructor(userId, description, amount, category, dueDate, isRecurring = false, recurrenceType = null) {
    this.id = uuidv4();
    this.userId = userId;
    this.description = description;
    this.amount = parseFloat(amount);
    this.category = category;
    this.dueDate = new Date(dueDate);
    this.isPaid = false;
    this.paidDate = null;
    this.isRecurring = isRecurring;
    this.recurrenceType = recurrenceType; // 'monthly', 'weekly', 'yearly'
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.tags = [];
    this.notes = '';
  }

  markAsPaid() {
    this.isPaid = true;
    this.paidDate = new Date();
    this.updatedAt = new Date();
  }

  markAsUnpaid() {
    this.isPaid = false;
    this.paidDate = null;
    this.updatedAt = new Date();
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    this.updatedAt = new Date();
  }

  isOverdue() {
    return !this.isPaid && new Date() > this.dueDate;
  }

  getDaysUntilDue() {
    const today = moment();
    const due = moment(this.dueDate);
    return due.diff(today, 'days');
  }

  generateNextRecurrence() {
    if (!this.isRecurring || !this.recurrenceType) return null;

    const nextDueDate = moment(this.dueDate);
    
    switch (this.recurrenceType) {
      case 'weekly':
        nextDueDate.add(1, 'week');
        break;
      case 'monthly':
        nextDueDate.add(1, 'month');
        break;
      case 'yearly':
        nextDueDate.add(1, 'year');
        break;
      default:
        return null;
    }

    return new Expense(
      this.userId,
      this.description,
      this.amount,
      this.category,
      nextDueDate.toDate(),
      this.isRecurring,
      this.recurrenceType
    );
  }
}

// In-memory storage
const expenses = [];

class ExpenseModel {
  static create(expenseData) {
    const expense = new Expense(
      expenseData.userId,
      expenseData.description,
      expenseData.amount,
      expenseData.category,
      expenseData.dueDate,
      expenseData.isRecurring,
      expenseData.recurrenceType
    );
    
    if (expenseData.tags) {
      expense.tags = expenseData.tags;
    }
    
    if (expenseData.notes) {
      expense.notes = expenseData.notes;
    }
    
    expenses.push(expense);
    return expense;
  }

  static findById(id) {
    return expenses.find(expense => expense.id === id);
  }

  static findByUserId(userId) {
    return expenses.filter(expense => expense.userId === userId);
  }

  static findAll() {
    return expenses;
  }

  static update(id, updateData) {
    const expenseIndex = expenses.findIndex(expense => expense.id === id);
    if (expenseIndex === -1) return null;

    const expense = expenses[expenseIndex];
    Object.assign(expense, updateData);
    expense.updatedAt = new Date();
    return expense;
  }

  static delete(id) {
    const expenseIndex = expenses.findIndex(expense => expense.id === id);
    if (expenseIndex === -1) return false;

    expenses.splice(expenseIndex, 1);
    return true;
  }

  static findByCategory(userId, category) {
    return expenses.filter(expense => 
      expense.userId === userId && expense.category === category
    );
  }

  static findOverdue(userId) {
    return expenses.filter(expense => 
      expense.userId === userId && expense.isOverdue()
    );
  }

  static findUpcoming(userId, days = 7) {
    const futureDate = moment().add(days, 'days').toDate();
    return expenses.filter(expense => 
      expense.userId === userId && 
      !expense.isPaid && 
      expense.dueDate <= futureDate && 
      expense.dueDate >= new Date()
    );
  }

  static findByDateRange(userId, startDate, endDate) {
    return expenses.filter(expense => 
      expense.userId === userId &&
      expense.dueDate >= new Date(startDate) &&
      expense.dueDate <= new Date(endDate)
    );
  }

  static getTotalByCategory(userId) {
    const userExpenses = this.findByUserId(userId);
    const categoryTotals = {};
    
    userExpenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = {
          total: 0,
          paid: 0,
          unpaid: 0,
          count: 0
        };
      }
      
      categoryTotals[expense.category].total += expense.amount;
      categoryTotals[expense.category].count++;
      
      if (expense.isPaid) {
        categoryTotals[expense.category].paid += expense.amount;
      } else {
        categoryTotals[expense.category].unpaid += expense.amount;
      }
    });
    
    return categoryTotals;
  }

  static getMonthlyStats(userId, year, month) {
    const startDate = moment().year(year).month(month - 1).startOf('month').toDate();
    const endDate = moment().year(year).month(month - 1).endOf('month').toDate();
    
    const monthlyExpenses = this.findByDateRange(userId, startDate, endDate);
    
    return {
      total: monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      paid: monthlyExpenses.filter(e => e.isPaid).reduce((sum, expense) => sum + expense.amount, 0),
      unpaid: monthlyExpenses.filter(e => !e.isPaid).reduce((sum, expense) => sum + expense.amount, 0),
      count: monthlyExpenses.length,
      overdue: monthlyExpenses.filter(e => e.isOverdue()).length
    };
  }

  static validateExpense(expenseData) {
    const errors = [];
    
    if (!expenseData.description || expenseData.description.trim().length < 3) {
      errors.push('Description must be at least 3 characters long');
    }
    
    if (!expenseData.amount || expenseData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
    
    if (!expenseData.category || expenseData.category.trim().length < 2) {
      errors.push('Category must be at least 2 characters long');
    }
    
    if (!expenseData.dueDate || !moment(expenseData.dueDate).isValid()) {
      errors.push('Valid due date is required');
    }
    
    return errors;
  }
}

module.exports = { Expense, ExpenseModel };