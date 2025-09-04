
const form = document.getElementById('transaction-form');
const titleEl = document.getElementById('title');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');
const categoryEl = document.getElementById('category');
const dateEl = document.getElementById('date');

const searchEl = document.getElementById('search');
const filterTypeEl = document.getElementById('filter-type');
const filterCategoryEl = document.getElementById('filter-category');

const tableBody = document.getElementById('transaction-table');

const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const totalBalanceEl = document.getElementById('total-balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function saveData(){
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function renderSummary(){
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if(t.type === 'income') income += t.amount;
    else expense += t.amount;
  });
  totalIncomeEl.textContent = '₹' + income.toFixed(2);
  totalExpenseEl.textContent = '₹' + expense.toFixed(2);
  totalBalanceEl.textContent = '₹' + (income - expense).toFixed(2);
}

function renderTransactions(){
  tableBody.innerHTML = '';
  let filtered = transactions.filter(t => {
    let matchesSearch = t.title.toLowerCase().includes(searchEl.value.toLowerCase());
    let matchesType = filterTypeEl.value === 'all' || t.type === filterTypeEl.value;
    let matchesCategory = filterCategoryEl.value === 'all' || t.category === filterCategoryEl.value;
    return matchesSearch && matchesType && matchesCategory;
  });

  filtered.forEach((t, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.title}</td>
      <td>${t.type === 'income' ? '+' : '-'}₹${t.amount.toFixed(2)}</td>
      <td>${t.type.charAt(0).toUpperCase() + t.type.slice(1)}</td>
      <td>${t.category}</td>
      <td>${t.date}</td>
      <td><button class="delete-btn" onclick="deleteTransaction(${index})">X</button></td>
    `;
    tableBody.appendChild(row);
  });

  renderSummary();
}

function deleteTransaction(index){
  // Delete from full transactions array based on filtered index!
  // Fix: Must map index to real index in transactions[]
  let filtered = transactions.filter(t => {
    let matchesSearch = t.title.toLowerCase().includes(searchEl.value.toLowerCase());
    let matchesType = filterTypeEl.value === 'all' || t.type === filterTypeEl.value;
    let matchesCategory = filterCategoryEl.value === 'all' || t.category === filterCategoryEl.value;
    return matchesSearch && matchesType && matchesCategory;
  });
  const toDelete = filtered[index];
  // Find real index and delete
  const realIdx = transactions.findIndex(t =>
    t.title === toDelete.title &&
    t.amount === toDelete.amount &&
    t.type === toDelete.type &&
    t.category === toDelete.category &&
    t.date === toDelete.date
  );
  if(realIdx > -1) {
    transactions.splice(realIdx, 1);
    saveData();
    renderTransactions();
  }
}

// Make deleteTransaction available globally so button works
window.deleteTransaction = deleteTransaction;

form.onsubmit = (e) => {
  e.preventDefault();
  const transaction = {
    title: titleEl.value.trim(),
    amount: parseFloat(amountEl.value),
    type: typeEl.value,
    category: categoryEl.value,
    date: dateEl.value
  };
  transactions.push(transaction);
  saveData();
  form.reset();
  renderTransactions();
};

searchEl.oninput = renderTransactions;
filterTypeEl.onchange = renderTransactions;
filterCategoryEl.onchange = renderTransactions;

// Initialize
renderTransactions();