const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');

expenseForm.addEventListener('submit', async function (e) {

    e.preventDefault();

    const expenseDetails = {
        amount: document.getElementById('amount').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        userId: localStorage.getItem('userId')

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

        const userId = localStorage.getItem('userId');

const response = await axios.get(
    `http://localhost:3000/expense/get-expenses?userId=${userId}`
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

      const userId = localStorage.getItem('userId');

       await axios.delete(
       `http://localhost:3000/expense/delete-expense/${expenseId}?userId=${userId}`
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


const cashfree = Cashfree({
    mode:"sandbox"
});


document
.getElementById("renderBtn")
.addEventListener("click", async()=>{


    // call our backend
   const userId = localStorage.getItem("userId");

const response = await fetch(
    `http://localhost:3000/payment/create-order?userId=${userId}`,
    {
        method:"POST"
    }
);

    const data = await response.json();



    let checkoutOptions = {

        paymentSessionId:
        data.paymentSessionId,

        redirectTarget:"_self"

    };


    cashfree.checkout(checkoutOptions);


});