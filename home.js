window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if(window.scrollY > 80){
        navbar.classList.add("scrolled");
    }
    else{
        navbar.classList.remove("scrolled");
    }

});

const navMenu = document.querySelector(".nav-option");
const navLinks = document.querySelector(".nav-links");

navMenu.addEventListener("click", () => { 
    navLinks.classList.toggle("active");
});
 
const navLinksItems = document.querySelectorAll(".nav-links a");

navLinksItems.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

document.addEventListener("click", (e) => {

    const isMenuOpen = navLinks.classList.contains("active");

    if (
        isMenuOpen &&
        !navLinks.contains(e.target) &&
        !navMenu.contains(e.target)
    ) {
        navLinks.classList.remove("active");
    }

});