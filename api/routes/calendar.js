const express = require('express');
const { ExpenseModel } = require('../models/Expense');
const AuthMiddleware = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

/**
 * @route GET /api/calendar/month
 * @desc Get calendar view for a specific month
 * @access Private
 */
router.get('/month', (req, res) => {
  try {
    const userId = req.user.id;
    const { year = moment().year(), month = moment().month() + 1 } = req.query;
    
    const startDate = moment().year(year).month(month - 1).startOf('month').toDate();
    const endDate = moment().year(year).month(month - 1).endOf('month').toDate();
    
    const monthlyExpenses = ExpenseModel.findByDateRange(userId, startDate, endDate);
    
    // Group expenses by day
    const calendarData = {};
    const daysInMonth = moment().year(year).month(month - 1).daysInMonth();
    
    // Initialize all days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      calendarData[dayKey] = {
        date: dayKey,
        dayOfWeek: moment(dayKey).format('dddd'),
        expenses: [],
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        expenseCount: 0,
        hasOverdue: false
      };
    }
    
    // Populate with expenses
    monthlyExpenses.forEach(expense => {
      const dayKey = moment(expense.dueDate).format('YYYY-MM-DD');
      
      if (calendarData[dayKey]) {
        calendarData[dayKey].expenses.push({
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          isPaid: expense.isPaid,
          isOverdue: expense.isOverdue(),
          isRecurring: expense.isRecurring,
          tags: expense.tags
        });
        
        calendarData[dayKey].totalAmount += expense.amount;
        calendarData[dayKey].expenseCount++;
        
        if (expense.isPaid) {
          calendarData[dayKey].paidAmount += expense.amount;
        } else {
          calendarData[dayKey].unpaidAmount += expense.amount;
        }
        
        if (expense.isOverdue()) {
          calendarData[dayKey].hasOverdue = true;
        }
      }
    });
    
    // Format amounts
    Object.keys(calendarData).forEach(dayKey => {
      const day = calendarData[dayKey];
      day.totalAmount = parseFloat(day.totalAmount.toFixed(2));
      day.paidAmount = parseFloat(day.paidAmount.toFixed(2));
      day.unpaidAmount = parseFloat(day.unpaidAmount.toFixed(2));
    });
    
    // Calculate month summary
    const monthSummary = {
      year: parseInt(year),
      month: parseInt(month),
      monthName: moment().year(year).month(month - 1).format('MMMM YYYY'),
      totalExpenses: monthlyExpenses.length,
      totalAmount: parseFloat(monthlyExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
      paidAmount: parseFloat(monthlyExpenses.filter(e => e.isPaid).reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
      unpaidAmount: parseFloat(monthlyExpenses.filter(e => !e.isPaid).reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
      overdueCount: monthlyExpenses.filter(e => e.isOverdue()).length,
      daysWithExpenses: Object.values(calendarData).filter(day => day.expenseCount > 0).length
    };
    
    res.status(200).json({
      message: 'Monthly calendar retrieved successfully',
      calendar: {
        summary: monthSummary,
        days: calendarData
      }
    });
  } catch (error) {
    console.error('Monthly calendar error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve monthly calendar'
    });
  }
});

/**
 * @route GET /api/calendar/week
 * @desc Get calendar view for a specific week
 * @access Private
 */
router.get('/week', (req, res) => {
  try {
    const userId = req.user.id;
    const { date = moment().format('YYYY-MM-DD') } = req.query;
    
    const targetDate = moment(date);
    const startOfWeek = moment(targetDate).startOf('week').toDate();
    const endOfWeek = moment(targetDate).endOf('week').toDate();
    
    const weeklyExpenses = ExpenseModel.findByDateRange(userId, startOfWeek, endOfWeek);
    
    // Group expenses by day of the week
    const weekData = {};
    
    for (let i = 0; i < 7; i++) {
      const dayDate = moment(startOfWeek).add(i, 'days');
      const dayKey = dayDate.format('YYYY-MM-DD');
      
      weekData[dayKey] = {
        date: dayKey,
        dayName: dayDate.format('dddd'),
        dayShort: dayDate.format('ddd'),
        dayNumber: dayDate.date(),
        isToday: dayDate.isSame(moment(), 'day'),
        expenses: [],
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        expenseCount: 0,
        hasOverdue: false
      };
    }
    
    // Populate with expenses
    weeklyExpenses.forEach(expense => {
      const dayKey = moment(expense.dueDate).format('YYYY-MM-DD');
      
      if (weekData[dayKey]) {
        weekData[dayKey].expenses.push({
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          isPaid: expense.isPaid,
          isOverdue: expense.isOverdue(),
          isRecurring: expense.isRecurring,
          tags: expense.tags,
          dueTime: moment(expense.dueDate).format('HH:mm')
        });
        
        weekData[dayKey].totalAmount += expense.amount;
        weekData[dayKey].expenseCount++;
        
        if (expense.isPaid) {
          weekData[dayKey].paidAmount += expense.amount;
        } else {
          weekData[dayKey].unpaidAmount += expense.amount;
        }
        
        if (expense.isOverdue()) {
          weekData[dayKey].hasOverdue = true;
        }
      }
    });
    
    // Format amounts and sort expenses by time
    Object.keys(weekData).forEach(dayKey => {
      const day = weekData[dayKey];
      day.totalAmount = parseFloat(day.totalAmount.toFixed(2));
      day.paidAmount = parseFloat(day.paidAmount.toFixed(2));
      day.unpaidAmount = parseFloat(day.unpaidAmount.toFixed(2));
      
      // Sort expenses by due time
      day.expenses.sort((a, b) => {
        const timeA = moment(`2000-01-01 ${a.dueTime}`);
        const timeB = moment(`2000-01-01 ${b.dueTime}`);
        return timeA.diff(timeB);
      });
    });
    
    // Calculate week summary
    const weekSummary = {
      startDate: moment(startOfWeek).format('YYYY-MM-DD'),
      endDate: moment(endOfWeek).format('YYYY-MM-DD'),
      weekNumber: targetDate.week(),
      year: targetDate.year(),
      totalExpenses: weeklyExpenses.length,
      totalAmount: parseFloat(weeklyExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
      paidAmount: parseFloat(weeklyExpenses.filter(e => e.isPaid).reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
      unpaidAmount: parseFloat(weeklyExpenses.filter(e => !e.isPaid).reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
      overdueCount: weeklyExpenses.filter(e => e.isOverdue()).length,
      daysWithExpenses: Object.values(weekData).filter(day => day.expenseCount > 0).length
    };
    
    res.status(200).json({
      message: 'Weekly calendar retrieved successfully',
      calendar: {
        summary: weekSummary,
        days: weekData
      }
    });
  } catch (error) {
    console.error('Weekly calendar error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve weekly calendar'
    });
  }
});

/**
 * @route GET /api/calendar/day
 * @desc Get detailed view for a specific day
 * @access Private
 */
router.get('/day', (req, res) => {
  try {
    const userId = req.user.id;
    const { date = moment().format('YYYY-MM-DD') } = req.query;
    
    const targetDate = moment(date);
    const startOfDay = moment(targetDate).startOf('day').toDate();
    const endOfDay = moment(targetDate).endOf('day').toDate();
    
    const dailyExpenses = ExpenseModel.findByDateRange(userId, startOfDay, endOfDay);
    
    // Sort expenses by amount (descending) and then by creation time
    dailyExpenses.sort((a, b) => {
      if (b.amount !== a.amount) {
        return b.amount - a.amount;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Group by category
    const categoryBreakdown = {};
    dailyExpenses.forEach(expense => {
      if (!categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] = {
          expenses: [],
          totalAmount: 0,
          paidAmount: 0,
          unpaidAmount: 0,
          count: 0
        };
      }
      
      categoryBreakdown[expense.category].expenses.push(expense);
      categoryBreakdown[expense.category].totalAmount += expense.amount;
      categoryBreakdown[expense.category].count++;
      
      if (expense.isPaid) {
        categoryBreakdown[expense.category].paidAmount += expense.amount;
      } else {
        categoryBreakdown[expense.category].unpaidAmount += expense.amount;
      }
    });
    
    // Format category amounts
    Object.keys(categoryBreakdown).forEach(category => {
      const cat = categoryBreakdown[category];
      cat.totalAmount = parseFloat(cat.totalAmount.toFixed(2));
      cat.paidAmount = parseFloat(cat.paidAmount.toFixed(2));
      cat.unpaidAmount = parseFloat(cat.unpaidAmount.toFixed(2));
    });
    
    // Calculate day summary
    const daySummary = {
      date: targetDate.format('YYYY-MM-DD'),
      dayName: targetDate.format('dddd'),
      dayFull: targetDate.format('dddd, MMMM Do, YYYY'),
      isToday: targetDate.isSame(moment(), 'day'),
      isPast: targetDate.isBefore(moment(), 'day'),
      isFuture: targetDate.isAfter(moment(), 'day'),
      totalExpenses: dailyExpenses.length,
      totalAmount: parseFloat(dailyExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
      paidAmount: parseFloat(dailyExpenses.filter(e => e.isPaid).reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
      unpaidAmount: parseFloat(dailyExpenses.filter(e => !e.isPaid).reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
      paidCount: dailyExpenses.filter(e => e.isPaid).length,
      unpaidCount: dailyExpenses.filter(e => !e.isPaid).length,
      overdueCount: dailyExpenses.filter(e => e.isOverdue()).length,
      categoriesCount: Object.keys(categoryBreakdown).length
    };
    
    res.status(200).json({
      message: 'Daily calendar retrieved successfully',
      calendar: {
        summary: daySummary,
        expenses: dailyExpenses,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Daily calendar error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve daily calendar'
    });
  }
});

/**
 * @route GET /api/calendar/upcoming
 * @desc Get upcoming expenses for calendar notifications
 * @access Private
 */
router.get('/upcoming', (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;
    
    const upcomingExpenses = ExpenseModel.findUpcoming(userId, parseInt(days));
    
    // Group by days until due
    const groupedExpenses = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: []
    };
    
    upcomingExpenses.forEach(expense => {
      const daysUntilDue = expense.getDaysUntilDue();
      
      if (daysUntilDue === 0) {
        groupedExpenses.today.push(expense);
      } else if (daysUntilDue === 1) {
        groupedExpenses.tomorrow.push(expense);
      } else if (daysUntilDue <= 7) {
        groupedExpenses.thisWeek.push(expense);
      } else {
        groupedExpenses.later.push(expense);
      }
    });
    
    // Calculate totals for each group
    const summary = {
      today: {
        count: groupedExpenses.today.length,
        totalAmount: parseFloat(groupedExpenses.today.reduce((sum, e) => sum + e.amount, 0).toFixed(2))
      },
      tomorrow: {
        count: groupedExpenses.tomorrow.length,
        totalAmount: parseFloat(groupedExpenses.tomorrow.reduce((sum, e) => sum + e.amount, 0).toFixed(2))
      },
      thisWeek: {
        count: groupedExpenses.thisWeek.length,
        totalAmount: parseFloat(groupedExpenses.thisWeek.reduce((sum, e) => sum + e.amount, 0).toFixed(2))
      },
      later: {
        count: groupedExpenses.later.length,
        totalAmount: parseFloat(groupedExpenses.later.reduce((sum, e) => sum + e.amount, 0).toFixed(2))
      },
      total: {
        count: upcomingExpenses.length,
        totalAmount: parseFloat(upcomingExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2))
      }
    };
    
    res.status(200).json({
      message: 'Upcoming expenses retrieved successfully',
      upcoming: {
        period: `Next ${days} days`,
        summary,
        expenses: groupedExpenses
      }
    });
  } catch (error) {
    console.error('Upcoming expenses error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve upcoming expenses'
    });
  }
});

/**
 * @route GET /api/calendar/notifications
 * @desc Get notification-worthy expenses (overdue and due soon)
 * @access Private
 */
router.get('/notifications', (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get overdue expenses
    const overdueExpenses = ExpenseModel.findOverdue(userId);
    
    // Get expenses due today
    const today = moment().startOf('day').toDate();
    const endOfToday = moment().endOf('day').toDate();
    const dueTodayExpenses = ExpenseModel.findByDateRange(userId, today, endOfToday)
      .filter(expense => !expense.isPaid);
    
    // Get expenses due tomorrow
    const tomorrow = moment().add(1, 'day').startOf('day').toDate();
    const endOfTomorrow = moment().add(1, 'day').endOf('day').toDate();
    const dueTomorrowExpenses = ExpenseModel.findByDateRange(userId, tomorrow, endOfTomorrow)
      .filter(expense => !expense.isPaid);
    
    const notifications = {
      overdue: {
        count: overdueExpenses.length,
        totalAmount: parseFloat(overdueExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
        expenses: overdueExpenses.map(expense => ({
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          dueDate: expense.dueDate,
          daysOverdue: Math.abs(expense.getDaysUntilDue())
        }))
      },
      dueToday: {
        count: dueTodayExpenses.length,
        totalAmount: parseFloat(dueTodayExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
        expenses: dueTodayExpenses.map(expense => ({
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          dueDate: expense.dueDate
        }))
      },
      dueTomorrow: {
        count: dueTomorrowExpenses.length,
        totalAmount: parseFloat(dueTomorrowExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)),
        expenses: dueTomorrowExpenses.map(expense => ({
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          dueDate: expense.dueDate
        }))
      }
    };
    
    const totalNotifications = notifications.overdue.count + 
                              notifications.dueToday.count + 
                              notifications.dueTomorrow.count;
    
    res.status(200).json({
      message: 'Notifications retrieved successfully',
      notifications: {
        ...notifications,
        total: {
          count: totalNotifications,
          hasNotifications: totalNotifications > 0
        }
      }
    });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve notifications'
    });
  }
});

module.exports = router;