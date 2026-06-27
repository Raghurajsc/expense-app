const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');

let allExpenses = [];
let isPremium = false;

let itemsPerPage = localStorage.getItem("itemsPerPage") || 10;



// =====================
// ADD EXPENSE
// =====================

expenseForm.addEventListener('submit', async function (e) {

    e.preventDefault();

    try {

        const expenseDetails = {

            amount: document.getElementById('amount').value,

            description:
            document.getElementById('description').value,

            category:
            document.getElementById('category').value,

            userId:
            localStorage.getItem('userId')

        };


      
const response = await axios.post(
    'http://localhost:3000/expense/add-expense',
    expenseDetails
);

await loadExpenses(1);

expenseForm.reset();




    }
    catch(err){

        console.log(err);

    }


});





// =====================
// SHOW EXPENSE
// =====================

function showExpenseOnScreen(expense){


    allExpenses.push(expense);


    renderExpenses(allExpenses);

    updateDashboard();


}





// =====================
// RENDER EXPENSE LIST
// =====================


function renderExpenses(expenses){


    expenseList.innerHTML = "";


    expenses.forEach(expense=>{


        const li =
        document.createElement("li");


        li.className="expense";


        li.id = expense.id;



        li.innerHTML = `


        <span>

        ₹${expense.amount}
        -
        ${expense.description}
        -
        ${expense.category}

        </span>



        <button onclick="deleteExpense(${expense.id})">

        Delete

        </button>


        `;



        expenseList.appendChild(li);



    });


}
async function loadExpenses(page = 1) {

    const userId = localStorage.getItem("userId");

    const response = await axios.get(
    `http://localhost:3000/expense/get-expenses?userId=${userId}&page=${page}&limit=${itemsPerPage}`
);

    allExpenses = response.data.expenses;

    renderExpenses(allExpenses);

    updateDashboard();

    showPagination(response.data);
}



function showPagination(data) {

    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    if (data.hasPreviousPage) {

        const prevBtn = document.createElement("button");

        prevBtn.innerText = data.previousPage;

        prevBtn.onclick = () => loadExpenses(data.previousPage);

        pagination.appendChild(prevBtn);
    }

    const currentBtn = document.createElement("button");

    currentBtn.innerText = data.currentPage;

    currentBtn.disabled = true;

    pagination.appendChild(currentBtn);

    if (data.hasNextPage) {

        const nextBtn = document.createElement("button");

        nextBtn.innerText = data.nextPage;

        nextBtn.onclick = () => loadExpenses(data.nextPage);

        pagination.appendChild(nextBtn);
    }

    const lastBtn = document.createElement("button");

    lastBtn.innerText = "Last (" + data.lastPage + ")";

    lastBtn.onclick = () => loadExpenses(data.lastPage);

    pagination.appendChild(lastBtn);
}











// =====================
// LOAD EXPENSES
// =====================


window.addEventListener('DOMContentLoaded', async()=>{


try{



document.getElementById("rowsPerPage").value = itemsPerPage;
await loadExpenses(1);


const userId = localStorage.getItem("userId");






// premium check


const statusResponse =
await axios.get(

`http://localhost:3000/user/status?userId=${userId}`

);



if(statusResponse.data.isPremium){


    isPremium=true;


    document.getElementById("premiumMessage")
    .innerText =
    "⭐ You are a Premium User";

    document.getElementById("premiumDashboard")
.style.display="block";


    document.getElementById("leaderboardBtn")
    .style.display="block";


    document.getElementById("downloadBtn")
    .disabled=false;


}
else{


    document.getElementById("downloadBtn")
    .disabled=true;


}



}
catch(err){

console.log(err);

}



});








// =====================
// DELETE EXPENSE
// =====================


async function deleteExpense(expenseId){


try{


const userId =
localStorage.getItem("userId");



await axios.delete(
    `http://localhost:3000/expense/delete-expense/${expenseId}?userId=${userId}`
);

await loadExpenses(1);





}
catch(err){

console.log(err);

}


}




function removeExpenseFromScreen(id){


const item =
document.getElementById(id);



if(item){

item.remove();

}



allExpenses =
allExpenses.filter(
expense=>expense.id !== id
);


}








// =====================
// FILTERS
// =====================


function filterExpense(type){


const now =
new Date();



const filtered =
allExpenses.filter(expense=>{


const expenseDate =
new Date(expense.createdAt);



const diff =
(now-expenseDate) /
(1000*60*60*24);




if(type==="daily"){

return diff < 1;

}



if(type==="weekly"){

return diff < 7;

}



if(type==="monthly"){

return diff < 30;

}



});



renderExpenses(filtered);



}








// =====================
// DOWNLOAD
// =====================


function downloadExpense(){

    if(!isPremium){

        alert("Only premium users can download expenses");
        return;

    }


    const data = JSON.stringify(
        allExpenses,
        null,
        2
    );


    const blob = new Blob(
        [data],
        {
            type:"application/json"
        }
    );


    const url = URL.createObjectURL(blob);


    const a = document.createElement("a");

    a.href = url;

    a.download = "expenses.json";

    a.click();


    URL.revokeObjectURL(url);

}


document
.getElementById("downloadBtn")
.addEventListener(
"click",
downloadExpense
);







// =====================
// CASHFREE PAYMENT
// =====================


const cashfree =
Cashfree({
mode:"sandbox"
});



document
.getElementById("renderBtn")
.addEventListener(
"click",
async()=>{


try{


const userId =
localStorage.getItem("userId");



const response =
await fetch(

`http://localhost:3000/payment/create-order?userId=${userId}`,

{
method:"POST"
}

);



const data =
await response.json();



cashfree.checkout({

paymentSessionId:
data.paymentSessionId,

redirectTarget:"_self"

});



}
catch(err){

console.log(err);

}


});








// =====================
// LEADERBOARD
// =====================


document
.getElementById("leaderboardBtn")
.addEventListener(
"click",
async()=>{


try{


const response =
await axios.get(

"http://localhost:3000/premium/showleaderboard"

);



const list =
document.getElementById(
"leaderboardList"
);



list.innerHTML="";



response.data.forEach(user=>{


const li =
document.createElement("li");


li.innerText =
`${user.name} - ₹${user.totalExpense}`;



list.appendChild(li);



});


}
catch(err){

console.log(err);

}



});

function updateDashboard(){

let income = 0;
let expense = 0;


allExpenses.forEach(item=>{


if(item.category==="Income"){
income += Number(item.amount);
}
else{
expense += Number(item.amount);
}


});


document.getElementById("totalIncome")
.innerText = income;


document.getElementById("totalExpense")
.innerText = expense;


document.getElementById("savings")
.innerText = income-expense;


}

document.getElementById("rowsPerPage").addEventListener("change", function () {

    itemsPerPage = this.value;

    localStorage.setItem("itemsPerPage", itemsPerPage);

    loadExpenses(1);

});