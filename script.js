// =========================
// DUBAI  TAX MAIN JS
// =========================



// Navbar Button Click

const startBtn =
    document.querySelector(".start-btn");

if(startBtn){

    startBtn.addEventListener("click", function(){

        window.location.href =
            "vat.html";
    });
}



// Primary Button

const primaryBtn =
    document.querySelector(".primary-btn");

if(primaryBtn){

    primaryBtn.addEventListener("click", function(){

        window.location.href =
            "vat.html";
    });
}



// Secondary Button

const secondaryBtn =
    document.querySelector(".secondary-btn");

if(secondaryBtn){

    secondaryBtn.addEventListener("click", function(){

        window.location.href =
            "ai-assistant.html";
    });
}



// Service Cards Animation

const cards =
    document.querySelectorAll(".service-card");

cards.forEach(function(card){

    card.addEventListener("mouseenter", function(){

        card.style.transform =
            "translateY(-10px)";

        card.style.transition =
            "0.3s";
    });



    card.addEventListener("mouseleave", function(){

        card.style.transform =
            "translateY(0px)";
    });
});
