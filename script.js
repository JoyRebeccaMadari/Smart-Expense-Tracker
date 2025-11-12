document.addEventListener("DOMContentLoaded", () => {
  // Show existing expenses on page load
  displayExpenses();

  // Add Expense
  document.getElementById("expense-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const note = document.getElementById("note").value;

    if (!amount || !category) return;

    // ✅ Date and Time
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    const expense = { amount, category, note, date, time };
const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const editIndex = document.getElementById("expense-form").dataset.editIndex;

if (editIndex) {
  // Update existing expense
  expenses[editIndex] = expense;
  delete document.getElementById("expense-form").dataset.editIndex;
  document.getElementById("submit-btn").textContent = "Add Expense";
} else {
  // Add new expense
  expenses.push(expense);
}

localStorage.setItem("expenses", JSON.stringify(expenses));
displayExpenses();
e.target.reset();
});
  // Clear all expenses
  document.getElementById("clear-expenses").addEventListener("click", () => {
    localStorage.removeItem("expenses");
    displayExpenses();
  });
});

// ✅ Function to display all expenses
function displayExpenses() {
  const expenseList = document.getElementById("expense-list");
  expenseList.innerHTML = "";

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  expenses.forEach((expense, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
  <div>
    <strong>₹${expense.amount}</strong> - ${expense.category} <br>
    ${expense.note ? `<em>${expense.note}</em><br>` : ""}
    <small>${expense.date}, ${expense.time}</small>
  </div>
  <div>
    <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
    <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
  </div>
`;
    expenseList.appendChild(li);
  });

  updateTotal();
}

// ✅ Update total
function updateTotal() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  document.getElementById("total").textContent = `Total: ₹${total}`;
}

// ✅ Delete individual expense
function deleteExpense(index) {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  displayExpenses();
}
// ✅ Edit expense
function editExpense(index) {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const expense = expenses[index];

  document.getElementById("amount").value = expense.amount;
  document.getElementById("category").value = expense.category;
  document.getElementById("note").value = expense.note;
const form =
  document.getElementById("expense-form").dataset.editIndex = index;
  document.getElementById("submit-btn").textContent = "Update Expense";
}
 //✅ Download all expenses as CSV
document.getElementById("download-expenses").addEventListener("click", () => {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  if (expenses.length === 0) {
    alert("No expenses to download!");
    return;
  }

  let csvContent = "Amount,Category,Note,Date,Time\n";
  expenses.forEach(expense => {
    csvContent += `${expense.amount},${expense.category},${expense.note || ""},${expense.date},${expense.time}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Expense_Report.csv";
  link.click();
});
