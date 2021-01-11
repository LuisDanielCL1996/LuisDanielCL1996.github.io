const btnToogle = document.querySelector('.menu-btn');
btnToogle.addEventListener('click',function() {
document.getElementById('nav-menu').classList.toggle('active');
});

ScrollReveal().reveal('.slider',{delay: 500});
ScrollReveal().reveal('.member-container',{delay: 500});
ScrollReveal().reveal('.portfolio-container',{delay: 500});
ScrollReveal().reveal('.container-fluid',{delay: 500});
ScrollReveal().reveal('.news-cards',{delay: 500});
ScrollReveal().reveal('.container',{delay: 500});