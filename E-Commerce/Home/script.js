const searchBar = document.querySelector(".search-bar")
const searchButton = document.querySelector(".search-button")
const profileIcon = document.querySelector("#profile");
const signOutBtn = document.querySelector("#sign-out")
const getProductsFromJson = async()=>{
  const returnedProducts = await fetch("http://localhost:3000/products")
  const products = returnedProducts.json();
  return products
}

let cart = [];

const renderProducts = async (products)=>{
  // const list = document.getElementById('product-list');
  const list = document.createElement("section");
  list.setAttribute("class","product-list")
  list.setAttribute("id","product-list")
  document.querySelector("main").append(list)
  products.forEach(product => {
    if(product.status?.toLowerCase() == "approved"){
    //------card container ------
    const card = document.createElement('div');
      card.setAttribute ("class",'product-card');
    //-------image element -------
    const imageProductElem = document.createElement('img');
      imageProductElem.setAttribute("class","product-image")
      imageProductElem.setAttribute("src",product.image)
      imageProductElem.setAttribute("alt",product.name)
    card.appendChild(imageProductElem);
    //----container for price, category , title , add to cart button ----
    const infoProductContainer = document.createElement('ul');
      infoProductContainer.setAttribute("class","product-info")
    card.appendChild(infoProductContainer)

    const productCategoryLi = document.createElement("li")
      productCategoryLi.setAttribute("class","product-category")
      productCategoryLi.textContent= product.category ;

    const productTitleLi = document.createElement("li")
      productTitleLi.setAttribute("class","product-title")
      productTitleLi.textContent= product.name ;

    
    const productPriceLi = document.createElement("li")
      productPriceLi.setAttribute("class","product-price")
      productPriceLi.textContent= product.price.toFixed(2) ;

    const addToCartButton = document.createElement("button");
      addToCartButton.setAttribute("class","add-to-cart");
      addToCartButton.setAttribute("id",product.name);
      addToCartButton.textContent= "Add to cart"
      addToCartButton.addEventListener("click",()=>{
                const product = products.find(prd => prd.name === addToCartButton.getAttribute("id"));
      if (product) {
        console.log(cart)
        if(cart.find(prod=> prod.name == product.name)){
          alert(`${product.name} already added`)
          return false
        }
        cart.push(product);
        updateCartIcon();
        alert(`${product.name} added to cart!`);
      }
      })
    
    infoProductContainer.append(productCategoryLi,productTitleLi,productPriceLi,addToCartButton)

    
          const reviewButton = document.createElement("button");
            reviewButton.textContent = "Leave a Review";
            reviewButton.setAttribute("class","add-to-cart review-btn"); 
            reviewButton.addEventListener("click", () =>{
              const User = JSON.parse(localStorage.getItem("User"))
              if(!User)
                return false
              let reviewPrompt = window.prompt("Enter your review")
              fetch("http://localhost:3000/review",{method:"POST", body: JSON.stringify({
                "reviewComment" : reviewPrompt , "userId": User.id , "product" : product.name
              })})
            });
            
    infoProductContainer.appendChild(reviewButton);
    list.appendChild(card);
    }
    else{
      return false;
    }
})}
//renders products approved by admin
const showApprovedByDefault = async()=>{
  let products = await getProductsFromJson();
  renderProducts(products)
}
//unused might be deleted
const updateCartIcon = ()=> {
  const cartIcon = document.querySelector('.fa-shopping-cart');
  cartIcon.setAttribute('data-count', cart.length);
}

const displayCart = ()=> {
  const cartPopOut = document.createElement('div');
  cartPopOut.className = 'cart-pop-out';
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

     const cartContainer = document.createElement("div");
        cartContainer.setAttribute("class", "cart-content");
    const headingForCart = document.createElement("h2");
    headingForCart.textContent = "Your Cart";
    cartContainer.appendChild(headingForCart);

    const ulElem = document.createElement("ul");

    for(let item of cart){
        const liElem = document.createElement("li");
        const imgElem = document.createElement("img");
        imgElem.setAttribute("src", item.image);
        imgElem.setAttribute("alt", item.name);
        imgElem.setAttribute("class", "cart-item-image");
        liElem.appendChild(imgElem);

        const span = document.createElement("span");
        span.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        liElem.appendChild(span);

        const quantityControls = document.createElement("div");
        quantityControls.setAttribute("class", "quantity-controls");

        // Create decrease button
        const decreaseButton = document.createElement("button");
        decreaseButton.setAttribute("class", "decrease-quantity");
        decreaseButton.setAttribute("data-product-id", item.name);
        decreaseButton.textContent = "-";
        quantityControls.appendChild(decreaseButton);

        // Create quantity display
        const quantitySpan = document.createElement("span");
        quantitySpan.setAttribute("class", "quantity");
        quantitySpan.textContent = "1"; // Default quantity
        quantityControls.appendChild(quantitySpan);

        // Create increase button
        const increaseButton = document.createElement("button");
        increaseButton.setAttribute("class", "increase-quantity");
        increaseButton.setAttribute("data-product-id", item.name);
        increaseButton.textContent = "+";
        quantityControls.appendChild(increaseButton);

        liElem.appendChild(quantityControls);

        ulElem.appendChild(liElem);
    }
    cartContainer.appendChild(ulElem);

    const totalPriceDiv = document.createElement("div");
    totalPriceDiv.setAttribute("class", "total-price");
    totalPriceDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
    cartContainer.appendChild(totalPriceDiv);

    const closeButton = document.createElement("button");
      closeButton.setAttribute("class", "close-cart");
      closeButton.textContent = "Close";
      cartContainer.appendChild(closeButton);

    const checkOutButton = document.createElement("button");
      checkOutButton.setAttribute("class", "close-cart check-out");
      checkOutButton.textContent = "Check Out";
      cartContainer.appendChild(checkOutButton);
    // Append the cart content to the body or another container
    cartPopOut.appendChild(cartContainer);
    document.body.appendChild(cartPopOut);
  // const closeButton = cartPopOut.querySelector('.close-cart');
  closeButton.addEventListener('click', () => {
    cartPopOut.remove();
  });

  checkOutButton.addEventListener("click", ()=>{
    if (!isSignedIn()){
      alert("you cannot check out your cart since you are not logged in")
      window.location.href="./Login/login.html"
    }
    else{
      const getUserData = JSON.parse(localStorage.getItem("User"));
      fetch('http://localhost:3000/checkout', {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ 
      "cart" : cart ,
      "user": getUserData,
      "quantity": quantityElement.textContent
    })
    })
  }})
    cartPopOut.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      const quantityElement = button.parentElement.querySelector('.quantity');
      let quantity = parseInt(quantityElement.textContent);
      quantityElement.textContent = quantity + 1;
      updateTotalPrice(cartPopOut);
    });
  });

    cartPopOut.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      const quantityElement = button.parentElement.querySelector('.quantity');
      let quantity = parseInt(quantityElement.textContent);
      if (quantity > 1) {
        quantityElement.textContent = quantity - 1;
        updateTotalPrice(cartPopOut);
      }
    });
  });
}

const updateTotalPrice= (cartPopOut)=> {
  const quantities = cartPopOut.querySelectorAll('.quantity');
  const totalPrice = Array.from(quantities).reduce((sum, element, index) => {
    return sum + (parseInt(element.textContent) * cart[index].price);
  }, 0);
  cartPopOut.querySelector('.total-price').textContent = `Total: $${totalPrice.toFixed(2)}`;
}

const isSignedIn = ()=>{
  const user =  JSON.parse(localStorage.getItem("User"));
  const headerIdentity = document.querySelector("#identity")
  console.log(user)
  if(!user){
    headerIdentity.textContent = `${headerIdentity.textContent}, Anonymous`
    profileIcon.style.display="block"
    signOutBtn.style.display="none"
    return false
  }
  else{
    let caller = ""
    if(user.gender == "female")
      caller= "Mrs"
    else
      caller= "Mr"
    
    headerIdentity.textContent= `${headerIdentity.textContent} , ${caller}.${user.firstName}`
    profileIcon.style.display="none"
    signOutBtn.style.display="block"
    return true

  }


}
window.addEventListener('load', () => {
  showApprovedByDefault();
  updateCartIcon();
  isSignedIn();
  //shopping cart click EVENT !
  document.querySelector(".fa-shopping-cart").addEventListener("click",()=>{
      displayCart();


  })
  signOutBtn.addEventListener("click",()=>{
    localStorage.removeItem("User");
    window.location.reload();
  })
    //search button
  searchButton.addEventListener("click",async()=>{
    const prevList = document.querySelector("#product-list")
    if(prevList)
      prevList.remove()

    const allProducts = await getProductsFromJson();
      const inputValue = searchBar.value.toLowerCase();
    let matchedProducts = allProducts.filter(product=>{
      // console.log(product.name)
      console.log(inputValue)
      if(product.name?.toLowerCase().includes(inputValue) || product.category?.toLowerCase().includes(inputValue) )
        return true
      else false
    })
    renderProducts(matchedProducts)
  })

  profileIcon.addEventListener("click",()=>{
    window.location.href= "Login/login.html"
  })
}); 