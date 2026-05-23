function calculateVAT(){

    let amount = parseFloat(
        document.getElementById("amount").value
    );

    if(isNaN(amount)){

        alert("Please Enter Amount");

        return;
    }

    let vat = amount * 0.05;

    let total = amount + vat;

    document.getElementById("vatAmount").innerHTML =
        "VAT (5%): AED " + vat.toFixed(2);

    document.getElementById("totalAmount").innerHTML =
        "Total Amount: AED " + total.toFixed(2);
}
