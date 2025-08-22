const express = require('express');
const { ExpenseModel } = require('../models/Expense');
const AuthMiddleware = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

/**
 * @route GET /api/expenses
 * @desc Get all expenses for the authenticated user
 * @access Private
 */
router.get('/', (req, res) => {
  try {
    const { category, status, startDate, endDate, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    
    let expenses = ExpenseModel.findByUserId(userId);
    
    // Filter by category
    if (category) {
      expenses = expenses.filter(expense => 
        expense.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Filter by status
    if (status) {
      if (status === 'paid') {
        expenses = expenses.filter(expense => expense.isPaid);
      } else if (status === 'unpaid') {
        expenses = expenses.filter(expense => !expense.isPaid);
      } else if (status === 'overdue') {
        expenses = expenses.filter(expense => expense.isOverdue());
      }
    }
    
    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      expenses = expenses.filter(expense => 
        expense.dueDate >= start && expense.dueDate <= end
      );
    }
    
    // Sort by due date (newest first)
    expenses.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedExpenses = expenses.slice(startIndex, endIndex);
    
    res.status(200).json({
      message: 'Expenses retrieved successfully',
      expenses: paginatedExpenses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(expenses.length / limit),
        totalItems: expenses.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve expenses'
    });
  }
});

/**
 * @route GET /api/expenses/:id
 * @desc Get a specific expense by ID
 * @access Private
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const expense = ExpenseModel.findById(id);
    
    if (!expense) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Expense not found'
      });
    }
    
    // Check if expense belongs to the authenticated user
    if (expense.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied to this expense'
      });
    }
    
    res.status(200).json({
      message: 'Expense retrieved successfully',
      expense
    });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve expense'
    });
  }
});

/**
 * @route POST /api/expenses
 * @desc Create a new expense
 * @access Private
 */
router.post('/', (req, res) => {
  try {
    const userId = req.user.id;
    const expenseData = { ...req.body, userId };
    
    // Validate expense data
    const validationErrors = ExpenseModel.validateExpense(expenseData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    const expense = ExpenseModel.create(expenseData);
    
    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create expense'
    });
  }
});

/**
 * @route PUT /api/expenses/:id
 * @desc Update an expense
 * @access Private
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    const expense = ExpenseModel.findById(id);
    
    if (!expense) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Expense not found'
      });
    }
    
    // Check if expense belongs to the authenticated user
    if (expense.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied to this expense'
      });
    }
    
    // Validate update data if provided
    if (updateData.description || updateData.amount || updateData.category || updateData.dueDate) {
      const validationData = {
        description: updateData.description || expense.description,
        amount: updateData.amount || expense.amount,
        category: updateData.category || expense.category,
        dueDate: updateData.dueDate || expense.dueDate
      };
      
      const validationErrors = ExpenseModel.validateExpense(validationData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Validation failed',
          errors: validationErrors
        });
      }
    }
    
    const updatedExpense = ExpenseModel.update(id, updateData);
    
    res.status(200).json({
      message: 'Expense updated successfully',
      expense: updatedExpense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update expense'
    });
  }
});

/**
 * @route DELETE /api/expenses/:id
 * @desc Delete an expense
 * @access Private
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const expense = ExpenseModel.findById(id);
    
    if (!expense) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Expense not found'
      });
    }
    
    // Check if expense belongs to the authenticated user
    if (expense.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied to this expense'
      });
    }
    
    const deleted = ExpenseModel.delete(id);
    
    if (!deleted) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete expense'
      });
    }
    
    res.status(200).json({
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete expense'
    });
  }
});

/**
 * @route PATCH /api/expenses/:id/pay
 * @desc Mark an expense as paid
 * @access Private
 */
router.patch('/:id/pay', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const expense = ExpenseModel.findById(id);
    
    if (!expense) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Expense not found'
      });
    }
    
    // Check if expense belongs to the authenticated user
    if (expense.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied to this expense'
      });
    }
    
    if (expense.isPaid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Expense is already marked as paid'
      });
    }
    
    expense.markAsPaid();
    
    // Generate next recurrence if applicable
    let nextExpense = null;
    if (expense.isRecurring) {
      nextExpense = expense.generateNextRecurrence();
      if (nextExpense) {
        ExpenseModel.create({
          userId: nextExpense.userId,
          description: nextExpense.description,
          amount: nextExpense.amount,
          category: nextExpense.category,
          dueDate: nextExpense.dueDate,
          isRecurring: nextExpense.isRecurring,
          recurrenceType: nextExpense.recurrenceType
        });
      }
    }
    
    res.status(200).json({
      message: 'Expense marked as paid successfully',
      expense,
      nextRecurrence: nextExpense ? {
        message: 'Next recurrence created',
        dueDate: nextExpense.dueDate
      } : null
    });
  } catch (error) {
    console.error('Mark expense as paid error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to mark expense as paid'
    });
  }
});

/**
 * @route PATCH /api/expenses/:id/unpay
 * @desc Mark an expense as unpaid
 * @access Private
 */
router.patch('/:id/unpay', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const expense = ExpenseModel.findById(id);
    
    if (!expense) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Expense not found'
      });
    }
    
    // Check if expense belongs to the authenticated user
    if (expense.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied to this expense'
      });
    }
    
    if (!expense.isPaid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Expense is already marked as unpaid'
      });
    }
    
    expense.markAsUnpaid();
    
    res.status(200).json({
      message: 'Expense marked as unpaid successfully',
      expense
    });
  } catch (error) {
    console.error('Mark expense as unpaid error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to mark expense as unpaid'
    });
  }
});

/**
 * @route GET /api/expenses/overdue
 * @desc Get overdue expenses
 * @access Private
 */
router.get('/status/overdue', (req, res) => {
  try {
    const userId = req.user.id;
    const overdueExpenses = ExpenseModel.findOverdue(userId);
    
    res.status(200).json({
      message: 'Overdue expenses retrieved successfully',
      expenses: overdueExpenses,
      count: overdueExpenses.length
    });
  } catch (error) {
    console.error('Get overdue expenses error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve overdue expenses'
    });
  }
});

/**
 * @route GET /api/expenses/upcoming
 * @desc Get upcoming expenses (next 7 days by default)
 * @access Private
 */
router.get('/status/upcoming', (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;
    
    const upcomingExpenses = ExpenseModel.findUpcoming(userId, parseInt(days));
    
    res.status(200).json({
      message: `Upcoming expenses (next ${days} days) retrieved successfully`,
      expenses: upcomingExpenses,
      count: upcomingExpenses.length
    });
  } catch (error) {
    console.error('Get upcoming expenses error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve upcoming expenses'
    });
  }
});

/**
 * @route GET /api/expenses/categories
 * @desc Get expenses grouped by category
 * @access Private
 */
router.get('/stats/categories', (req, res) => {
  try {
    const userId = req.user.id;
    const categoryStats = ExpenseModel.getTotalByCategory(userId);
    
    res.status(200).json({
      message: 'Category statistics retrieved successfully',
      categories: categoryStats
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve category statistics'
    });
  }
});

module.exports = router;