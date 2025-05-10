const mainCartContainer = document.querySelector(".cart-container")
const cartBody = document.querySelector(".cart-body")
const totalItemsElement = document.querySelector("#summary-total-items") 
const totalCostElement = document.querySelector("#summary-total-cost") 
const backToMenuButton = document.querySelector("#back-to-menu") 

let totalCost = 0;
let totalItems = 0;
cartIcon.addEventListener("click",()=>{
    productsContainer.style.opacity = "0.1";
    cartBody.style.display = "grid"
    showCartItem()
})
    const showCartItem = ()=>{
        let cart = JSON.parse(sessionStorage.getItem("cart"));
        console.log(cart)
        for(let item of cart){
            totalItems+=1;
            if(item.quantity=="" || item.quantity==undefined){
                item.quantity= "1" ;
            }
           const container = document.createElement("div")
            container.setAttribute("class","cart-item-component")
                const createFirstUl= document.createElement("ul")
                    createFirstUl.setAttribute("class","product-text-container cart-items")
                    const createPictureInLi= document.createElement("li")
                    createPictureInLi.setAttribute("class","p-list item-picture")
                    createPictureInLi.textContent="picture";
                    const createNameInLi= document.createElement("li")
                    createNameInLi.setAttribute("class","p-list");
                    createNameInLi.textContent = `Name: ${item.name}`
                    createFirstUl.appendChild(createPictureInLi)
                    createFirstUl.appendChild(createNameInLi)
                    container.appendChild(createFirstUl)

                const createSecondUl= document.createElement("ul")
                    createSecondUl.setAttribute("class","product-text-container cart-items")
                    const createPriceInLi= document.createElement("li")
                    createPriceInLi.setAttribute("class","p-list")
                    createPriceInLi.textContent=`Price: ${item.price}`;
                    const createQuantityInLi= document.createElement("li")
                    createQuantityInLi.setAttribute("class","p-list");
                    createQuantityInLi.textContent = `Quantity: ${item.quantity}`
                    const createTotalInLi= document.createElement("li")
                    createTotalInLi.setAttribute("class","p-list");
                    createTotalInLi.textContent = `Total: ${Number(item.quantity)* Number(item.price)}`
                    createSecondUl.appendChild(createPriceInLi)
                    createSecondUl.appendChild(createQuantityInLi)
                    createSecondUl.appendChild(createTotalInLi)
                    container.appendChild(createSecondUl)

            mainCartContainer.appendChild(container)


            totalCost+=  Number(item.quantity)* Number(item.price) ;

            totalCostElement.textContent = `total cost : ${totalCost.toFixed(2)}`;
            totalItemsElement.textContent= `total items: ${totalItems}`;

        }
            //             const backToMenuBtn = document.createElement("button");
            //             backToMenuBtn.textContent="back to menu"
            // mainCartContainer.appendChild(backToMenuBtn);
                backToMenuButton.addEventListener("click", ()=>{
                    cartBody.style.display = "none";
                productsContainer.style.opacity = "1";
                })

}






















                
        //    const container = document.createElement("div")
        //    container.innerHTML = `
        //    <div class="cart-item-component">
        //                 <ul class="product-text-container cart-items" >
        //                     <li class="p-list item-picture">picture</li>
        //                     <li class="p-list">${item.name}</li>

        //                 </ul>
        //                 <ul class="product-text-container cart-items" >
        //                     <li class="p-list">${item.price}</li>
        //                     <li class="p-list">quantity</li>
        //                     <li class="p-list">total</li>
        //                 </ul>
        //             </div>


        //         </div>
        //     </div>
        /*
        `
            <div class="order-summary">
                <h3>order summary</h3>
                <ul class="product-text-container summary-aside">
                    <li class="p-list" id="summary-total-items">total items</li>
                    <li class="p-list" id="summary-total-cost">total cost</li>
                </ul>
                <button class="buy-btn">Check out</button>
                <button class="buy-btn" id="continue" onclick = '()=>{
                    }'>continue shopping</button>

            </div>
        </div>

            ` */