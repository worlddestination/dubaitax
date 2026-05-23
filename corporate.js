function calculateCorporateTax(){

    let profit = parseFloat(
        document.getElementById("profit").value
    );

    if(isNaN(profit)){

        alert("Please Enter Profit");

        return;
    }

    let tax = 0;

    if(profit > 375000){

        tax = (profit - 375000) * 0.09;
    }

    let finalProfit = profit - tax;

    document.getElementById("taxAmount").innerHTML =
        "Corporate Tax: AED " + tax.toFixed(2);

    document.getElementById("netProfit").innerHTML =
        "Net Profit: AED " + finalProfit.toFixed(2);
}
