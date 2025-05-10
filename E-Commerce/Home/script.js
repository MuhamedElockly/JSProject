const searchBar = document.querySelector(".search-bar")
const searchButton = document.querySelector(".search-button")
const profileIcon = document.querySelector("#profile");
const signOutBtn = document.querySelector("#sign-out")
const getProductsFromJson = async()=>{
  const returnedProducts = await fetch("http://localhost:3000/products")
  const products = returnedProducts.json();
  return products
}
let returnedCart =JSON.parse(localStorage.getItem("Cart"))
let cart = []
if (returnedCart)
  cart = returnedCart;

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
      // imageProductElem.setAttribute("src",product.image)
      imageProductElem.setAttribute("src","./Home/2016-09-06-what-is-a-product.webp")
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
        localStorage.setItem("Cart", JSON.stringify(cartArr))

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
  let cartArr= []
  const cartPopOut = document.createElement('div');
  cartPopOut.className = 'cart-pop-out';
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

     const cartContainer = document.createElement("div");
        cartContainer.setAttribute("class", "cart-content");
    const headingForCart = document.createElement("h2");
    headingForCart.textContent = "Your Cart";
    cartContainer.appendChild(headingForCart);

    const ulElem = document.createElement("ul");
  console.log(cart)
    for(let item of cart){
      let cartObj ;
        const liElem = document.createElement("li");
        const imgElem = document.createElement("img");
        imgElem.setAttribute("src", item.image);
        imgElem.setAttribute("alt", item.name);
        imgElem.setAttribute("class", "cart-item-image");
        liElem.appendChild(imgElem);
      console.log(Number(item.price).toFixed(2))
        const span = document.createElement("span");
        span.textContent = `${item.name} - $${Number(item.price).toFixed(2)}`;
        liElem.appendChild(span);

        const quantityControls = document.createElement("div");
        quantityControls.setAttribute("class", "quantity-controls");

        // Create decrease button
        const decreaseButton = document.createElement("button");
        decreaseButton.setAttribute("class", "decrease-quantity");
        decreaseButton.setAttribute("data-product-id", item.name);
        decreaseButton.textContent = "-";
        quantityControls.appendChild(decreaseButton);
        decreaseButton.addEventListener('click', () => {
      let quantity = Number(quantitySpan.textContent);
      if (quantity > 1) {
          let cartItem = cartArr.find(cartObj => cartObj.name === item.name);
          if (cartItem) {
          cartItem.quantity = quantity - 1;
    }
        quantitySpan.textContent = quantity - 1;
        updateTotalPrice(cartPopOut);}
      })

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
        increaseButton.addEventListener('click', () => {
        let quantity = Number(quantitySpan.textContent);
          let cartItem = cartArr.find(cartObj => cartObj.name === item.name);
          if (cartItem) {
          cartItem.quantity = quantity + 1;
        quantitySpan.textContent = quantity + 1;
        updateTotalPrice(cartPopOut);
          }
      })


        liElem.appendChild(quantityControls);

        ulElem.appendChild(liElem);

        cartObj = {"name" : item.name , "price" : Number(item.price).toFixed(2), "quantity": quantitySpan.textContent}
        cartArr.push(cartObj)
    }
    cartContainer.appendChild(ulElem);

    const totalPriceDiv = document.createElement("div");
    totalPriceDiv.setAttribute("class", "total-price");
    totalPriceDiv.textContent = `Total: $${Number(totalPrice).toFixed(2)}`;
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
    // console.log(quantitySpan)
    if (cart.length==0 || cart == null){
      alert("you cannot check out empty cart")
    }

    else if (!isSignedIn()){
      alert("you cannot check out your cart since you are not logged in")
      window.location.href="./Login/login.html"
    }
    else{
      const getUserData = JSON.parse(localStorage.getItem("User"));
      fetch('http://localhost:3000/orders', {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ 
      "cart" : cartArr ,
      "user": getUserData,
      // "quantity": quantitySpan.textContent,
      "status": "Pending"
    })
    })
    localStorage.removeItem("Cart")
  }})
  
}

const updateTotalPrice= (cartPopOut)=> {
  const quantities = cartPopOut.querySelectorAll('.quantity');
  const totalPrice = Array.from(quantities).reduce((sum, element, index) => {
    return sum + (parseInt(element.textContent) * Number(cart[index].price));
  }, 0);
  cartPopOut.querySelector('.total-price').textContent = `Total: $${totalPrice.toFixed(2)}`;
}
const userWelcoming = (isLoggedIn)=>{
const user =  JSON.parse(localStorage.getItem("User"));
const headerIdentity = document.querySelector("#identity")

if (isLoggedIn){
      let caller = ""
    if(user.gender == "female")
      caller= "Mrs"
    else
      caller= "Mr"
    
    headerIdentity.textContent= `${headerIdentity.textContent} , ${caller}.${user.firstName}`
    profileIcon.style.display="block"
    signOutBtn.style.display="block"
}
else{
      headerIdentity.textContent = `${headerIdentity.textContent}, Anonymous`
    profileIcon.style.display="block"
    signOutBtn.style.display="none"
}

}
const isSignedIn = ()=>{
  const user =  JSON.parse(localStorage.getItem("User"));
  if(user){
    return true
  }
  else{
    return false

  }

}
const profileHandler = ()=>{

}

window.addEventListener('load', () => {
  showApprovedByDefault();
  updateCartIcon();
  let userLoggedInStatus = isSignedIn(); ///-----------------------
  userWelcoming(userLoggedInStatus)
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

  profileIcon.addEventListener("click",async ()=>{
    const user = JSON.parse(localStorage?.getItem("User"))
    if(!user){
      window.location.href= "Login/login.html"
      return false
    }

    const profileSection = document.querySelector(".profile-section")
    const mainSection = document.querySelector("main")


    const fullname = document.querySelector("#full-name")

    const fname = document.querySelector("#fname")
    const lname = document.querySelector("#lname")
    const email = document.querySelector("#email")
    const password = document.querySelector("#password")
    const confirmPassword = document.querySelector("#confirm-password")
    const saveButton = document.querySelector("#save-button")
    const cancelButton = document.querySelector("#cancel-button")


    profileSection.style.display="grid"
    mainSection.style.display="none"

    fullname.textContent=`${user.firstName} ${user.lastName}`
    fname.value = `${user.firstName}`
    lname.value = `${user.lastName}`
    email.value = `${user.email}`

    const userId=user.id ;
    saveButton.addEventListener("click",()=>{
      if(password.value == confirmPassword.value){
              fetch(`http://localhost:3000/users/${userId}`,{
            method:"PUT", body: JSON.stringify({
                  "firstName" :fname .value,
                  "lastName": lname.value,
                  "email": email.value,
                  "password":password.value

        })
      })
      }
          profileSection.style.display="none"
          mainSection.style.display="grid"
    })
        cancelButton.addEventListener("click",()=>{
          profileSection.style.display="none"
          mainSection.style.display="grid"

  })
})
}); 





























