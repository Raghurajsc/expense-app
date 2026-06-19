const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');


// ADD EXPENSE
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


    } catch(err) {

        console.log(err);

    }

});



// SHOW EXPENSE ON SCREEN
function showExpenseOnScreen(expense) {


    const li = document.createElement('li');


    li.id = expense.id;


    li.innerHTML = `

        ${expense.amount} - 
        ${expense.description} - 
        ${expense.category}

        <button onclick="deleteExpense(${expense.id})">
            Delete Expense
        </button>

    `;


    expenseList.appendChild(li);

}



// LOAD EXPENSES WHEN PAGE LOADS
window.addEventListener('DOMContentLoaded', async () => {


    try {


        const userId = localStorage.getItem('userId');


        const response = await axios.get(

            `http://localhost:3000/expense/get-expenses?userId=${userId}`

        );


        response.data.forEach(expense => {

            showExpenseOnScreen(expense);

        });



        // CHECK PREMIUM STATUS HERE

        const statusResponse = await axios.get(

            `http://localhost:3000/user/status?userId=${userId}`

        );


        if(statusResponse.data.isPremium){


            document.getElementById("leaderboardBtn")
            .style.display = "block";


            document.getElementById("premiumMessage")
            .innerText = "⭐ You are a Premium User Now";


        }



    } catch(err) {

        console.log(err);

    }


});





// DELETE EXPENSE
async function deleteExpense(expenseId) {


    try {


        const userId = localStorage.getItem('userId');


        await axios.delete(

            `http://localhost:3000/expense/delete-expense/${expenseId}?userId=${userId}`

        );


        removeExpenseFromScreen(expenseId);



    } catch(err) {


        console.log(err);


    }

}




function removeExpenseFromScreen(expenseId) {


    const childNode = document.getElementById(expenseId);


    if(childNode){

        childNode.remove();

    }

}






// CASHFREE PAYMENT

const cashfree = Cashfree({

    mode:"sandbox"

});




document
.getElementById("renderBtn")
.addEventListener("click", async()=>{


    try{


        const userId = localStorage.getItem("userId");


        const response = await fetch(

            `http://localhost:3000/payment/create-order?userId=${userId}`,

            {

                method:"POST"

            }

        );



        const data = await response.json();



        let checkoutOptions = {


            paymentSessionId:data.paymentSessionId,


            redirectTarget:"_self"


        };



        cashfree.checkout(checkoutOptions);



    }catch(err){

        console.log(err);

    }


});








// LEADERBOARD

document
.getElementById("leaderboardBtn")
.addEventListener("click", async()=>{


    try{


        const response = await axios.get(

            "http://localhost:3000/premium/showleaderboard"

        );



        const leaderboardList =
        document.getElementById("leaderboardList");



        leaderboardList.innerHTML = "";



        response.data.forEach(user=>{


            const li = document.createElement("li");


            li.innerText =

            `${user.name} - ₹${user.totalExpense}`;



            leaderboardList.appendChild(li);


        });



    }catch(err){


        console.log(err);


    }


});