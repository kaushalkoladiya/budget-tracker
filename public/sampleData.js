/**
 * Sample Data Generator for Budget Tracker App
 * 
 * How to use:
 * 1. Copy this entire script
 * 2. Open your Browser Developer Tools (F12)
 * 3. Paste into the Console tab and press Enter
 * 4. The script will generate sample data for your app
 */

function generateSampleData() {
  // Helper functions
  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, 
            v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  
  const getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).getTime();
  };
  
  const getRandomAmount = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  // Clear existing data
  const clearExistingData = () => {
    localStorage.removeItem('budget-tracker-categories');
    localStorage.removeItem('budget-tracker-transactions');
    localStorage.removeItem('budget-tracker-budgets');
    localStorage.removeItem('budget-tracker-debts');
    localStorage.removeItem('budget-tracker-repayments');
    localStorage.removeItem('budget-tracker-notifications');
  };
  
  // Factory functions
  const createCategory = (data) => ({
    id: uuidv4(),
    name: '',
    icon: 'default',
    color: '#4CAF50',
    subcategories: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data
  });
  
  const createTransaction = (data) => ({
    id: uuidv4(),
    amount: 0,
    date: Date.now(),
    categoryId: '',
    description: '',
    type: 'expense',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data
  });
  
  const createBudget = (data) => ({
    id: uuidv4(),
    categoryId: '',
    amount: 0,
    period: 'monthly',
    startDate: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data
  });
  
  const createDebt = (data) => ({
    id: uuidv4(),
    amount: 0,
    date: Date.now(),
    dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    type: 'borrowed',
    personName: '',
    description: '',
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data
  });
  
  const createRepayment = (data) => ({
    id: uuidv4(),
    debtId: '',
    amount: 0,
    date: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data
  });
  
  const createNotification = (data) => ({
    id: uuidv4(),
    type: 'spike',
    message: '',
    read: false,
    date: Date.now(),
    createdAt: Date.now(),
    ...data
  });
  
  // Generate sample data
  const generateCategories = () => {
    const categories = [
      createCategory({
        name: 'Housing',
        icon: 'home',
        color: '#1E88E5',
        subcategories: [
          { id: uuidv4(), name: 'Rent', color: '#1E88E5', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Mortgage', color: '#1E88E5', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Utilities', color: '#1E88E5', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Maintenance', color: '#1E88E5', createdAt: Date.now(), updatedAt: Date.now() }
        ]
      }),
      createCategory({
        name: 'Food',
        icon: 'coffee',
        color: '#43A047',
        subcategories: [
          { id: uuidv4(), name: 'Groceries', color: '#43A047', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Restaurants', color: '#43A047', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Fast Food', color: '#43A047', createdAt: Date.now(), updatedAt: Date.now() }
        ]
      }),
      createCategory({
        name: 'Transportation',
        icon: 'truck',
        color: '#FB8C00',
        subcategories: [
          { id: uuidv4(), name: 'Gas', color: '#FB8C00', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Public Transit', color: '#FB8C00', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Car Maintenance', color: '#FB8C00', createdAt: Date.now(), updatedAt: Date.now() }
        ]
      }),
      createCategory({
        name: 'Entertainment',
        icon: 'film',
        color: '#8E24AA',
        subcategories: [
          { id: uuidv4(), name: 'Movies', color: '#8E24AA', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Games', color: '#8E24AA', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Concerts', color: '#8E24AA', createdAt: Date.now(), updatedAt: Date.now() }
        ]
      }),
      createCategory({
        name: 'Personal Care',
        icon: 'heart',
        color: '#E53935',
        subcategories: [
          { id: uuidv4(), name: 'Healthcare', color: '#E53935', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Gym', color: '#E53935', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Cosmetics', color: '#E53935', createdAt: Date.now(), updatedAt: Date.now() }
        ]
      }),
      createCategory({
        name: 'Shopping',
        icon: 'shopping-bag',
        color: '#F9A825',
        subcategories: [
          { id: uuidv4(), name: 'Clothing', color: '#F9A825', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Electronics', color: '#F9A825', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Gifts', color: '#F9A825', createdAt: Date.now(), updatedAt: Date.now() }
        ]
      }),
      createCategory({
        name: 'Income',
        icon: 'trending-up',
        color: '#4CAF50',
        incomeOnly: true,
        subcategories: [
          { id: uuidv4(), name: 'Salary', color: '#4CAF50', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Freelance', color: '#4CAF50', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Investments', color: '#4CAF50', createdAt: Date.now(), updatedAt: Date.now() },
          { id: uuidv4(), name: 'Gifts', color: '#4CAF50', createdAt: Date.now(), updatedAt: Date.now() }
        ]
      })
    ];
    
    return categories;
  };
  
  const generateTransactions = (categories) => {
    const transactions = [];
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    // Find income category and subcategories
    const incomeCategory = categories.find(c => c.name === 'Income');
    if (!incomeCategory) return transactions;
    
    // Generate 12 monthly salaries (past year)
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);
      date.setDate(1); // First of the month
      
      const salarySubcategory = incomeCategory.subcategories.find(s => s.name === 'Salary');
      
      transactions.push(
        createTransaction({
          amount: getRandomAmount(3000, 3500),
          date: date.getTime(),
          categoryId: incomeCategory.id,
          subcategoryId: salarySubcategory?.id,
          description: `Monthly Salary - ${date.toLocaleString('default', { month: 'long' })}`,
          type: 'income'
        })
      );
      
      // Occasional freelance income
      if (Math.random() > 0.7) {
        const freelanceSubcategory = incomeCategory.subcategories.find(s => s.name === 'Freelance');
        
        transactions.push(
          createTransaction({
            amount: getRandomAmount(500, 1500),
            date: getRandomDate(new Date(date), new Date(date.getFullYear(), date.getMonth() + 1, 0)),
            categoryId: incomeCategory.id,
            subcategoryId: freelanceSubcategory?.id,
            description: `Freelance Project - ${date.toLocaleString('default', { month: 'long' })}`,
            type: 'income'
          })
        );
      }
    }
    
    // Generate random expenses for each category
    const expenseCategories = categories.filter(c => !c.incomeOnly);
    
    // For each month in the past year
    for (let month = 0; month < 12; month++) {
      const currentMonth = new Date(now);
      currentMonth.setMonth(now.getMonth() - month);
      
      // For each expense category
      expenseCategories.forEach(category => {
        // For each subcategory, generate 1-5 transactions
        if (category.subcategories) {
          category.subcategories.forEach(subcategory => {
            const transactionsCount = Math.floor(Math.random() * 5) + 1;
            
            for (let i = 0; i < transactionsCount; i++) {
              let amount = 0;
              let description = '';
              
              // Set realistic amounts and descriptions based on category
              switch (category.name) {
                case 'Housing':
                  if (subcategory.name === 'Rent' || subcategory.name === 'Mortgage') {
                    amount = getRandomAmount(1000, 1500);
                    description = `${subcategory.name} Payment`;
                  } else if (subcategory.name === 'Utilities') {
                    amount = getRandomAmount(100, 300);
                    description = `${['Electric', 'Water', 'Gas', 'Internet'][Math.floor(Math.random() * 4)]} Bill`;
                  } else {
                    amount = getRandomAmount(50, 200);
                    description = `Home ${subcategory.name}`;
                  }
                  break;
                case 'Food':
                  if (subcategory.name === 'Groceries') {
                    amount = getRandomAmount(50, 200);
                    description = `${['Supermarket', 'Grocery Store', 'Farmer\'s Market'][Math.floor(Math.random() * 3)]}`;
                  } else {
                    amount = getRandomAmount(20, 80);
                    description = `${['Lunch', 'Dinner', 'Coffee', 'Breakfast'][Math.floor(Math.random() * 4)]} at ${['Restaurant', 'Cafe', 'Diner'][Math.floor(Math.random() * 3)]}`;
                  }
                  break;
                case 'Transportation':
                  if (subcategory.name === 'Gas') {
                    amount = getRandomAmount(30, 70);
                    description = 'Gas Station';
                  } else if (subcategory.name === 'Public Transit') {
                    amount = getRandomAmount(20, 100);
                    description = 'Monthly Transit Pass';
                  } else {
                    amount = getRandomAmount(50, 500);
                    description = `Car ${['Oil Change', 'Repair', 'Tire Replacement', 'Service'][Math.floor(Math.random() * 4)]}`;
                  }
                  break;
                default:
                  amount = getRandomAmount(10, 100);
                  description = `${subcategory.name} Expense`;
              }
              
              transactions.push(
                createTransaction({
                  amount,
                  date: getRandomDate(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
                  ),
                  categoryId: category.id,
                  subcategoryId: subcategory.id,
                  description,
                  type: 'expense'
                })
              );
            }
          });
        }
      });
    }
    
    // Sort transactions by date
    return transactions.sort((a, b) => a.date - b.date);
  };
  
  const generateBudgets = (categories) => {
    const budgets = [];
    
    categories.forEach(category => {
      if (!category.incomeOnly) {
        // Category budget
        budgets.push(
          createBudget({
            categoryId: category.id,
            amount: getRandomAmount(500, 2000),
            period: 'monthly',
            startDate: Date.now()
          })
        );
        
        // Subcategory budgets (for some subcategories)
        if (category.subcategories && category.subcategories.length > 0) {
          const randomSubcategory = category.subcategories[Math.floor(Math.random() * category.subcategories.length)];
          
          budgets.push(
            createBudget({
              categoryId: category.id,
              subcategoryId: randomSubcategory.id,
              amount: getRandomAmount(200, 500),
              period: 'monthly',
              startDate: Date.now()
            })
          );
        }
      }
    });
    
    return budgets;
  };
  
  const generateDebts = () => {
    const debts = [];
    const repayments = [];
    const now = Date.now();
    
    // Borrowed money
    const borrowedDebt = createDebt({
      amount: 2000,
      date: now - 60 * 24 * 60 * 60 * 1000, // 60 days ago
      dueDate: now + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      type: 'borrowed',
      personName: 'John Doe',
      description: 'Personal Loan',
      status: 'partially_paid'
    });
    
    debts.push(borrowedDebt);
    
    // Repayment for borrowed money
    repayments.push(
      createRepayment({
        debtId: borrowedDebt.id,
        amount: 500,
        date: now - 30 * 24 * 60 * 60 * 1000, // 30 days ago
        note: 'First installment'
      })
    );
    
    // Lent money
    const lentDebt = createDebt({
      amount: 1000,
      date: now - 90 * 24 * 60 * 60 * 1000, // 90 days ago
      dueDate: now - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      type: 'lent',
      personName: 'Jane Smith',
      description: 'Emergency Help',
      status: 'partially_paid'
    });
    
    debts.push(lentDebt);
    
    // Repayment for lent money
    repayments.push(
      createRepayment({
        debtId: lentDebt.id,
        amount: 500,
        date: now - 45 * 24 * 60 * 60 * 1000, // 45 days ago
        note: 'Partial repayment'
      })
    );
    
    // Another debt (borrowed)
    debts.push(
      createDebt({
        amount: 5000,
        date: now - 10 * 24 * 60 * 60 * 1000, // 10 days ago
        dueDate: now + 80 * 24 * 60 * 60 * 1000, // 80 days from now
        type: 'borrowed',
        personName: 'Bank',
        description: 'Credit Card',
        status: 'active'
      })
    );
    
    return { debts, repayments };
  };
  
  const generateNotifications = () => {
    const notifications = [];
    const now = Date.now();
    
    // Budget alert
    notifications.push(
      createNotification({
        type: 'budget',
        message: 'Food budget is at 90% of limit',
        read: false,
        date: now - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        relatedId: '1', // Dummy ID
      })
    );
    
    // Spike notification
    notifications.push(
      createNotification({
        type: 'spike',
        message: 'Unusual spending in Entertainment: $150 (avg: $75)',
        read: true,
        date: now - 5 * 24 * 60 * 60 * 1000, // 5 days ago
        relatedId: '2', // Dummy ID
      })
    );
    
    // Debt notification
    notifications.push(
      createNotification({
        type: 'debt',
        message: 'Debt payment of $1500 due in 7 days',
        read: false,
        date: now - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        relatedId: '3', // Dummy ID
      })
    );
    
    return notifications;
  };
  
  try {
    // Clear existing data
    clearExistingData();
    
    // Generate and save categories
    const categories = generateCategories();
    localStorage.setItem('budget-tracker-categories', JSON.stringify(categories));
    
    // Generate and save transactions
    const transactions = generateTransactions(categories);
    localStorage.setItem('budget-tracker-transactions', JSON.stringify(transactions));
    
    // Generate and save budgets
    const budgets = generateBudgets(categories);
    localStorage.setItem('budget-tracker-budgets', JSON.stringify(budgets));
    
    // Generate and save debts and repayments
    const { debts, repayments } = generateDebts();
    localStorage.setItem('budget-tracker-debts', JSON.stringify(debts));
    localStorage.setItem('budget-tracker-repayments', JSON.stringify(repayments));
    
    // Generate and save notifications
    const notifications = generateNotifications();
    localStorage.setItem('budget-tracker-notifications', JSON.stringify(notifications));
    
    console.log('Sample data generated successfully!');
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${transactions.length} transactions`);
    console.log(`Created ${budgets.length} budgets`);
    console.log(`Created ${debts.length} debts with ${repayments.length} repayments`);
    console.log(`Created ${notifications.length} notifications`);
    
    return {
      categories,
      transactions,
      budgets,
      debts,
      repayments,
      notifications
    };
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
}

// Run the generator
generateSampleData();
console.log('✅ Sample data generated! Refresh the page to see the changes.'); 