const url = "https://corebiz-test.herokuapp.com/api/v1/products";
const containerProducts = document.querySelector("#containerProducts");
const containerCarrito = document.querySelector("#containerCarrito");
const cantidadCarrito = document.querySelector("#cantidadCarrito");
const vaciarCarrito = document.querySelector("#vaciarCarrito");
let carrito = []

document.addEventListener("DOMContentLoaded", getProducts);
document.addEventListener("DOMContentLoaded", (e) => {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        mostrarCarrito()
    }
});

// fetch para obtener los productos
function getProducts() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const 
            screen = {
              small: 0,
              medium: 400,
              mediumLarge: 750,
              largeXl: 1200
            };
          
          // observe window resize
          eventThrottle(window, 'resize', resizeHandler);
          resizeHandler();
          
          
          // throttled event handler
          function eventThrottle(element, event, callback, delay = 200) {
            let throttle;
            element.addEventListener(event, (e) => {
              throttle = throttle || setTimeout(() => {
                throttle = null;
                callback(e);
              }, delay);
            });
          }
          
          
          // calculate size
          function resizeHandler() {
            
            // get window width
            const iw = window.innerWidth;
           
            // determine named size
            let size = null;
            for (let s in screen) {
              if (iw >= screen[s]) size = s;
            }
           
            if(size == "largeXl"){
                controlesDemov(data, 4, 1)
            }
            if(size == "mediumLarge"){
                controlesDemov(data, 3, 0)
            }
            if(size == "medium"){
                controlesDemov(data, 2, 0)
            }
            if(size == "small"){
                controlesDemov(data, 2, 0)
            }
          }
            crearCarrito(data); 
        })
        .catch(error => console.log(error));
}

function controlesDemov(productosArray, cantidad, suma){
    const updatePage = ( elements, page, elementsPerPage) =>
    {
        const firstElement = (page * elementsPerPage) - elementsPerPage;
        const lastElement = page * elementsPerPage;
        return elements.slice(firstElement, lastElement);
    }
    
    let focusElements = [...productosArray];
    const btnsNav = document.querySelector('#barra__cambio').children;
    let ActualPage = 1;
    let lastPage = Math.round(suma+focusElements.length/cantidad);
    plantilla(updatePage(focusElements, 1, cantidad));
    
    btnsNav[0].onclick = ()=>
    {
        if(ActualPage > 1)
        {
            ActualPage--;
            plantilla(updatePage(focusElements, ActualPage, cantidad));
            
        }
    }
    btnsNav[1].onclick = ()=>
    {
        if(ActualPage < lastPage)
        {
            ActualPage++
            plantilla(updatePage(focusElements, ActualPage, cantidad));
           
        }
    }
}

function plantilla(data){
    containerProducts.innerHTML = "";
    data.forEach(data => {
        console.log(data);
        containerProducts.innerHTML += `<div class="productos__card">
        <div id="cardImg" class="card__img" style= "background-image: url('${data.imageUrl}')">
            ${off(data.listPrice)}
            
        </div>
        <div class="card__container">
            <p class="card__name">${data.productName}</p>
            <div id="estrellas" class="card__stars">
                ${estrellasView(data.stars)}
            </div>
            <div class="card__textos">
                ${price(data.price, data.listPrice)}
                ${cuotas(data.installments)}
            </div>
            <div class="card__btn">
                <button class="btnBuy" data-id="${data.productId}">Comprar</button>
            </div>
        </div>
    </div>
    `
    
    

    })
}

function off(listPrice){
    let off= ""
    if(listPrice != null){
        off += `<div class="card__off">
        <h4>OFF</h4>
    </div>`
    }
    return off
}

function price(price, listPrice){

    let prices = ""
    if(listPrice != null){
        prices = `<p style="text-decoration:line-through;">de $ ${listPrice}</p>
        <h3>por $ ${price}</h3>
        `
    }else{
        prices = `<h3>por $ ${price}</h3>`
    }

    return prices
}

function cuotas(installments){
    let cuota = ""
    if(installments.length != 0) {
        installments.forEach(installment => {
            cuota += `<p>o en ${installment.quantity}x de R $${installment.value}</p>`
        })
    }

    return cuota
}

function estrellasView(activas){
    let estrellas = "" 
    for(let i = 1; i <= 5; i++){
        if(i <= activas){
            estrellas += `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.69478 8.68583L9.21415 10.649L8.28021 6.94899L11.3896 4.45951L7.29501 4.13846L5.69478 0.648987L4.09454 4.13846L0 4.45951L3.10935 6.94899L2.17541 10.649L5.69478 8.68583Z" fill="#F8475F"/>
            </svg>`
        }else{
            estrellas += `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3896 4.4595L7.29501 4.13318L5.69478 0.648972L4.09454 4.13845L0 4.4595L3.10935 6.94897L2.17541 10.649L5.69478 8.68581L9.21415 10.649L8.2859 6.94897L11.3896 4.4595ZM5.69479 7.7016L3.55355 8.89634L4.12303 6.64371L2.23236 5.12792L4.72667 4.92792L5.69479 2.80687L6.66859 4.93318L9.1629 5.13318L7.27224 6.64897L7.84172 8.9016L5.69479 7.7016Z" fill="#F8475F"/>
            </svg>
            `
        }
    }
    return estrellas
}
// trae los datos y detecta los click dentro de la plantilla de productos
function crearCarrito(data){
// Evento para el carrito de compras
document.addEventListener("click", (e) =>{
    if(e.target.classList.contains("btnBuy")){
        const id = e.target.dataset.id;
        agregarCarrito(id, data);
    }
});
}
// Agrega los productos al carrito
function agregarCarrito(ids, productos) {
    let resultado = productos.filter(elm => elm.productId == ids);
    console.log(resultado);
    let encontrado = carrito.find(elm => elm.id == ids);
    if(encontrado){
        carrito.forEach(elm => {
            if(elm.id == ids){
                elm.cantidad++;
            }
        })
    }else{
        carrito.push({nombre: resultado[0].productName, precio: resultado[0].price, img: resultado[0].imageUrl, id: resultado[0].productId, cantidad: resultado[0].cantidad = 1});
        console.log(carrito);
    }
    localeStorage()
    mostrarCarrito()
    
}
// Setea el locale storage
function localeStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Muestra el carrito actualizado
function mostrarCarrito(){
    containerCarrito.innerHTML = "";
    carrito.forEach(elm => {
        containerCarrito.innerHTML += `
        <tr>
            <th><img class="img__carrito" src="${elm.img}"></th>
            <th>${elm.nombre}</th>
            <th>${elm.precio}</th>
            <th>${elm.cantidad}</th>
            <th data-id="${elm.id}"class="btnEliminar">X</th>
        </tr>
        `
})
    cantidadCarrito.innerText = carrito.length
}
// Funcion para eliminar algun item del carrito
function eliminarItem(){
    document.addEventListener("click", (e) =>{
        if(e.target.classList.contains("btnEliminar")){
            let id = e.target.dataset.id;
            let item = carrito.find(elm => elm.id == id);
            
            
            if(item.cantidad >= 2){   
                item.cantidad--;
                localeStorage()
                mostrarCarrito()
            }else{
                const indice = carrito.indexOf(item)
                carrito.splice(indice, 1)
                localeStorage()
                mostrarCarrito()
            }
        }
    })
}
eliminarItem()
// Boton para eliminar el carrito por completo
function vaciarCarro(){
    vaciarCarrito.addEventListener("click", () => {
        carrito = [];
        mostrarCarrito();
        localStorage.setItem("carrito", []);
    })
}
vaciarCarro()
