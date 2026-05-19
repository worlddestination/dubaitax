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
function toggleMenu(){

document
.querySelector(".nav-links")
.classList.toggle("active");

}
function calculateVAT(){

let amount =
Number(
document.getElementById("amount").value
);

let vat =
amount * 0.05;

document.getElementById("vatResult")
.innerHTML =

"VAT: AED " +

vat.toFixed(2);

}
