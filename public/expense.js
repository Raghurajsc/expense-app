const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');

expenseForm.addEventListener('submit', async function (e) {

    e.preventDefault();

    const expenseDetails = {
        amount: document.getElementById('amount').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value
    };

    try {

        const response = await axios.post(
            'http://localhost:3000/expense/add-expense',
            expenseDetails
        );

        showExpenseOnScreen(response.data);

        expenseForm.reset();

    } catch (err) {
        console.log(err);
    }
});

function showExpenseOnScreen(expense) {

    const li = document.createElement('li');

    li.id = expense.id;

    li.innerHTML = `
        ${expense.amount} - ${expense.description} - ${expense.category}
        <button onclick="deleteExpense(${expense.id})">
            Delete Expense
        </button>
    `;

    expenseList.appendChild(li);
}
window.addEventListener('DOMContentLoaded', async () => {

    try {

        const response = await axios.get(
            'http://localhost:3000/expense/get-expenses'
        );

        response.data.forEach(expense => {
            showExpenseOnScreen(expense);
        });

    } catch (err) {
        console.log(err);
    }

});

async function deleteExpense(expenseId) {

    try {

        await axios.delete(
            `http://localhost:3000/expense/delete-expense/${expenseId}`
        );

        removeExpenseFromScreen(expenseId);

    } catch (err) {

        console.log(err);

    }
}

function removeExpenseFromScreen(expenseId) {

    const childNode = document.getElementById(expenseId);

    if (childNode) {
        childNode.remove();
    }
}