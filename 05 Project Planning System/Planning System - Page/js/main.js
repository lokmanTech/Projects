// CURRENT DATE & TIME
function updateDateTime() {
    var currentDate = new Date();
    var dateElement = document.getElementById('currentDate');
    var timeElement = document.getElementById('currentTime');

    dateElement.textContent = currentDate.toDateString();
    timeElement.textContent = currentDate.toLocaleTimeString();
}

// UPDATE DATE & TIME EVERY SECOND
setInterval(updateDateTime, 1000);

//MONEY TRACKER
let balance = 0;

function addIncome() {
    const incomeInput = document.getElementById('income');
    const income = parseFloat(incomeInput.value);
    if (!isNaN(income)) {
        balance += income;
        updateBalance();
        incomeInput.value = "";
    }
}

function addExpenses() {
    const expensesInput = document.getElementById("expenses");
    const expenses = parseFloat(expensesInput.value);
    if (!isNaN(expenses)) {
        balance -= expenses;
        updateBalance();
        expensesInput.value = "";
    }
}

function updateBalance() {
    const balanceElement = document.getElementById("balance");
    balanceElement.textContent = balance.toFixed(2);
}