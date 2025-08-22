const express = require('express');
const { ExpenseModel } = require('../models/Expense');
const AuthMiddleware = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

/**
 * @route GET /api/dashboard/overview
 * @desc Get dashboard overview with key metrics
 * @access Private
 */
router.get('/overview', (req, res) => {
  try {
    const userId = req.user.id;
    const allExpenses = ExpenseModel.findByUserId(userId);
    
    // Current month stats
    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();
    const monthlyStats = ExpenseModel.getMonthlyStats(userId, currentYear, currentMonth);
    
    // Overall stats
    const totalExpenses = allExpenses.length;
    const totalAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const paidAmount = allExpenses.filter(e => e.isPaid).reduce((sum, expense) => sum + expense.amount, 0);
    const unpaidAmount = allExpenses.filter(e => !e.isPaid).reduce((sum, expense) => sum + expense.amount, 0);
    
    // Status counts
    const paidCount = allExpenses.filter(e => e.isPaid).length;
    const unpaidCount = allExpenses.filter(e => !e.isPaid).length;
    const overdueCount = allExpenses.filter(e => e.isOverdue()).length;
    
    // Upcoming expenses (next 7 days)
    const upcomingExpenses = ExpenseModel.findUpcoming(userId, 7);
    
    // Category breakdown
    const categoryStats = ExpenseModel.getTotalByCategory(userId);
    
    // Recent expenses (last 5)
    const recentExpenses = allExpenses
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    res.status(200).json({
      message: 'Dashboard overview retrieved successfully',
      overview: {
        totalExpenses,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        paidAmount: parseFloat(paidAmount.toFixed(2)),
        unpaidAmount: parseFloat(unpaidAmount.toFixed(2)),
        statusCounts: {
          paid: paidCount,
          unpaid: unpaidCount,
          overdue: overdueCount
        },
        currentMonth: {
          month: currentMonth,
          year: currentYear,
          ...monthlyStats,
          total: parseFloat(monthlyStats.total.toFixed(2)),
          paid: parseFloat(monthlyStats.paid.toFixed(2)),
          unpaid: parseFloat(monthlyStats.unpaid.toFixed(2))
        },
        upcomingExpenses: {
          count: upcomingExpenses.length,
          totalAmount: parseFloat(upcomingExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
          expenses: upcomingExpenses.slice(0, 3) // Show only first 3
        },
        categoryBreakdown: categoryStats,
        recentExpenses
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve dashboard overview'
    });
  }
});

/**
 * @route GET /api/dashboard/monthly-stats
 * @desc Get monthly statistics for a specific month/year
 * @access Private
 */
router.get('/monthly-stats', (req, res) => {
  try {
    const userId = req.user.id;
    const { year = moment().year(), month = moment().month() + 1 } = req.query;
    
    const monthlyStats = ExpenseModel.getMonthlyStats(userId, parseInt(year), parseInt(month));
    const monthlyExpenses = ExpenseModel.findByDateRange(
      userId,
      moment().year(year).month(month - 1).startOf('month').toDate(),
      moment().year(year).month(month - 1).endOf('month').toDate()
    );
    
    // Group by category for the month
    const categoryBreakdown = {};
    monthlyExpenses.forEach(expense => {
      if (!categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] = {
          total: 0,
          paid: 0,
          unpaid: 0,
          count: 0
        };
      }
      
      categoryBreakdown[expense.category].total += expense.amount;
      categoryBreakdown[expense.category].count++;
      
      if (expense.isPaid) {
        categoryBreakdown[expense.category].paid += expense.amount;
      } else {
        categoryBreakdown[expense.category].unpaid += expense.amount;
      }
    });
    
    // Daily breakdown
    const dailyBreakdown = {};
    const daysInMonth = moment().year(year).month(month - 1).daysInMonth();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      dailyBreakdown[dayKey] = {
        total: 0,
        paid: 0,
        unpaid: 0,
        count: 0
      };
    }
    
    monthlyExpenses.forEach(expense => {
      const dayKey = moment(expense.dueDate).format('YYYY-MM-DD');
      if (dailyBreakdown[dayKey]) {
        dailyBreakdown[dayKey].total += expense.amount;
        dailyBreakdown[dayKey].count++;
        
        if (expense.isPaid) {
          dailyBreakdown[dayKey].paid += expense.amount;
        } else {
          dailyBreakdown[dayKey].unpaid += expense.amount;
        }
      }
    });
    
    res.status(200).json({
      message: 'Monthly statistics retrieved successfully',
      monthlyStats: {
        ...monthlyStats,
        total: parseFloat(monthlyStats.total.toFixed(2)),
        paid: parseFloat(monthlyStats.paid.toFixed(2)),
        unpaid: parseFloat(monthlyStats.unpaid.toFixed(2)),
        month: parseInt(month),
        year: parseInt(year),
        categoryBreakdown,
        dailyBreakdown
      }
    });
  } catch (error) {
    console.error('Monthly stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve monthly statistics'
    });
  }
});

/**
 * @route GET /api/dashboard/yearly-stats
 * @desc Get yearly statistics
 * @access Private
 */
router.get('/yearly-stats', (req, res) => {
  try {
    const userId = req.user.id;
    const { year = moment().year() } = req.query;
    
    const yearlyExpenses = ExpenseModel.findByDateRange(
      userId,
      moment().year(year).startOf('year').toDate(),
      moment().year(year).endOf('year').toDate()
    );
    
    // Monthly breakdown for the year
    const monthlyBreakdown = {};
    for (let month = 1; month <= 12; month++) {
      const monthStats = ExpenseModel.getMonthlyStats(userId, parseInt(year), month);
      monthlyBreakdown[month] = {
        ...monthStats,
        total: parseFloat(monthStats.total.toFixed(2)),
        paid: parseFloat(monthStats.paid.toFixed(2)),
        unpaid: parseFloat(monthStats.unpaid.toFixed(2)),
        monthName: moment().month(month - 1).format('MMMM')
      };
    }
    
    // Yearly totals
    const yearlyTotal = yearlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const yearlyPaid = yearlyExpenses.filter(e => e.isPaid).reduce((sum, expense) => sum + expense.amount, 0);
    const yearlyUnpaid = yearlyExpenses.filter(e => !e.isPaid).reduce((sum, expense) => sum + expense.amount, 0);
    
    // Category breakdown for the year
    const categoryBreakdown = {};
    yearlyExpenses.forEach(expense => {
      if (!categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] = {
          total: 0,
          paid: 0,
          unpaid: 0,
          count: 0
        };
      }
      
      categoryBreakdown[expense.category].total += expense.amount;
      categoryBreakdown[expense.category].count++;
      
      if (expense.isPaid) {
        categoryBreakdown[expense.category].paid += expense.amount;
      } else {
        categoryBreakdown[expense.category].unpaid += expense.amount;
      }
    });
    
    res.status(200).json({
      message: 'Yearly statistics retrieved successfully',
      yearlyStats: {
        year: parseInt(year),
        total: parseFloat(yearlyTotal.toFixed(2)),
        paid: parseFloat(yearlyPaid.toFixed(2)),
        unpaid: parseFloat(yearlyUnpaid.toFixed(2)),
        count: yearlyExpenses.length,
        monthlyBreakdown,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Yearly stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve yearly statistics'
    });
  }
});

/**
 * @route GET /api/dashboard/category-analysis
 * @desc Get detailed category analysis
 * @access Private
 */
router.get('/category-analysis', (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'all' } = req.query; // 'all', 'month', 'year'
    
    let expenses = ExpenseModel.findByUserId(userId);
    
    // Filter by period
    if (period === 'month') {
      const startOfMonth = moment().startOf('month').toDate();
      const endOfMonth = moment().endOf('month').toDate();
      expenses = expenses.filter(expense => 
        expense.dueDate >= startOfMonth && expense.dueDate <= endOfMonth
      );
    } else if (period === 'year') {
      const startOfYear = moment().startOf('year').toDate();
      const endOfYear = moment().endOf('year').toDate();
      expenses = expenses.filter(expense => 
        expense.dueDate >= startOfYear && expense.dueDate <= endOfYear
      );
    }
    
    const categoryAnalysis = {};
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    expenses.forEach(expense => {
      if (!categoryAnalysis[expense.category]) {
        categoryAnalysis[expense.category] = {
          total: 0,
          paid: 0,
          unpaid: 0,
          count: 0,
          averageAmount: 0,
          percentage: 0,
          expenses: []
        };
      }
      
      const category = categoryAnalysis[expense.category];
      category.total += expense.amount;
      category.count++;
      category.expenses.push({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        dueDate: expense.dueDate,
        isPaid: expense.isPaid
      });
      
      if (expense.isPaid) {
        category.paid += expense.amount;
      } else {
        category.unpaid += expense.amount;
      }
    });
    
    // Calculate percentages and averages
    Object.keys(categoryAnalysis).forEach(categoryName => {
      const category = categoryAnalysis[categoryName];
      category.averageAmount = parseFloat((category.total / category.count).toFixed(2));
      category.percentage = totalAmount > 0 ? parseFloat(((category.total / totalAmount) * 100).toFixed(2)) : 0;
      category.total = parseFloat(category.total.toFixed(2));
      category.paid = parseFloat(category.paid.toFixed(2));
      category.unpaid = parseFloat(category.unpaid.toFixed(2));
    });
    
    // Sort categories by total amount (descending)
    const sortedCategories = Object.entries(categoryAnalysis)
      .sort(([,a], [,b]) => b.total - a.total)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    
    res.status(200).json({
      message: 'Category analysis retrieved successfully',
      analysis: {
        period,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        totalExpenses: expenses.length,
        categoriesCount: Object.keys(categoryAnalysis).length,
        categories: sortedCategories
      }
    });
  } catch (error) {
    console.error('Category analysis error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve category analysis'
    });
  }
});

/**
 * @route GET /api/dashboard/trends
 * @desc Get expense trends over time
 * @access Private
 */
router.get('/trends', (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;
    
    const trends = [];
    const currentDate = moment();
    
    for (let i = parseInt(months) - 1; i >= 0; i--) {
      const targetDate = moment(currentDate).subtract(i, 'months');
      const year = targetDate.year();
      const month = targetDate.month() + 1;
      
      const monthStats = ExpenseModel.getMonthlyStats(userId, year, month);
      
      trends.push({
        year,
        month,
        monthName: targetDate.format('MMMM YYYY'),
        total: parseFloat(monthStats.total.toFixed(2)),
        paid: parseFloat(monthStats.paid.toFixed(2)),
        unpaid: parseFloat(monthStats.unpaid.toFixed(2)),
        count: monthStats.count,
        overdue: monthStats.overdue
      });
    }
    
    // Calculate trend indicators
    const currentMonthTotal = trends[trends.length - 1]?.total || 0;
    const previousMonthTotal = trends[trends.length - 2]?.total || 0;
    const trendPercentage = previousMonthTotal > 0 
      ? parseFloat(((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(2))
      : 0;
    
    res.status(200).json({
      message: 'Expense trends retrieved successfully',
      trends: {
        period: `${months} months`,
        data: trends,
        currentMonth: {
          total: currentMonthTotal,
          trendPercentage,
          trendDirection: trendPercentage > 0 ? 'up' : trendPercentage < 0 ? 'down' : 'stable'
        }
      }
    });
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve expense trends'
    });
  }
});

module.exports = router;