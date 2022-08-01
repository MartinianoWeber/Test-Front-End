const navbar = document.querySelector('#navbar');
const bg = document.querySelector('.bg');
const bgBar = document.querySelector('.bg__bar');


// Funcionalidad del boton Hamburguesa
document.addEventListener('click', (e) => {
    if(e.target.classList.contains('btnHamburguesa')){
        bg.style.display = "block";
        setTimeout(() => {
        bgBar.style.transition = "2s"
        bgBar.style.transform = "translate(0px)"
        },500)
    }
})
bg.addEventListener('click', (e) => {
        bgBar.style.transform = "translate(-248px)"
        bgBar.style.transition = "2s"
        setTimeout(() =>{bg.style.display = "none";}, 2000)
})
