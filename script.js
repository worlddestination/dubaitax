function calculateTax(){

let profit =
Number(
document.getElementById("profit").value
);

let tax = 0;

if(profit > 375000){

tax =
(profit - 375000) * 0.09;
}

document.getElementById("result")
.innerHTML =

"Corporate Tax: AED " +

tax.toFixed(2);
}
