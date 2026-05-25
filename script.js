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
// ==========================
// BUSINESS COUNTER
// ==========================

let businessCount = localStorage.getItem("businessCount");

if (!businessCount) {
    businessCount = 120;
}

businessCount++;

localStorage.setItem("businessCount", businessCount);

document.getElementById("businessCount").innerText = businessCount;


// ==========================
// TAX COUNTER
// ==========================

let taxCount = localStorage.getItem("taxCount");

if (!taxCount) {
    taxCount = 850;
}

document.getElementById("taxCount").innerText = taxCount;


// ==========================
// TOOL CLICK INCREASE
// ==========================

function increaseTax() {

    taxCount++;

    localStorage.setItem("taxCount", taxCount);

}

document.getElementById("vatTool").addEventListener("click", increaseTax);

document.getElementById("corporateTool").addEventListener("click", increaseTax);

document.getElementById("aiTool").addEventListener("click", increaseTax);
fetch("blogs.json")

.then(res => res.json())

.then(data => {

const blogContainer = document.getElementById("blogContainer");

data.forEach(blog => {

blogContainer.innerHTML += `

<div class="blog-card">

<h3>${blog.title}</h3>

<p>${blog.summary}</p>

<span>${blog.date}</span>

</div>

`;

});

});
