const cartIcon = document.querySelector("#cart-icon");
const cartContainer = document.querySelector(".cart");
const productsContainer = document.querySelector(".products-container");
const userStatus = document.querySelector("#user-status");

const createProductComponent = (productObj) => {
  //Component structure in HTML (tags & relationship) CSS (Classes)
  const productComponentContainer = document.createElement("div");
  productComponentContainer.setAttribute("class", "product-component");
  productsContainer.appendChild(productComponentContainer);

  const productImgContainer = document.createElement("div");
  productImgContainer.setAttribute("class", "product-img-container");
  productComponentContainer.appendChild(productImgContainer);
  const productImg = document.createElement("img");
  productImg.setAttribute("src", productObj.imgSrc);
  productImg.setAttribute("class", "product-img");
  productImgContainer.appendChild(productImg);

  const productInformationContainer = document.createElement("ul");
  productInformationContainer.setAttribute("class", "product-text-container");
  productComponentContainer.appendChild(productInformationContainer);
  const productName = document.createElement("li");
  productName.setAttribute("id", "product-name");
  productName.setAttribute("class", "p-list");
  productName.textContent = `name: ${productObj.name}`;
  productInformationContainer.appendChild(productName);
  const productPrice = document.createElement("li");
  productPrice.setAttribute("id", "product-price");
  productPrice.setAttribute("class", "p-list");
  productPrice.textContent = `price: ${productObj.price}`;
  productInformationContainer.appendChild(productPrice);

  //quantity
  // const productQuantity = document.createElement("li")
  //     productQuantity.setAttribute("id","product-quantity")
  //     productQuantity.setAttribute("class","p-list")
  //     productQuantity.textContent= `qty: ${productObj.quantity}`;
  //     productInformationContainer.appendChild(productQuantity)

  const productBuy = document.createElement("li");
  productBuy.setAttribute("id", "product-buy");
  productBuy.setAttribute("class", "p-list");
  productInformationContainer.appendChild(productBuy);

  const productQuantityToBuy = document.createElement("input");
  productQuantityToBuy.setAttribute("type", "number");
  productQuantityToBuy.setAttribute("id", "quantity-input");
  productQuantityToBuy.setAttribute("min", "1");
  productQuantityToBuy.setAttribute("name", "qty");
  productBuy.appendChild(productQuantityToBuy);

  const productAddToCartBtn = document.createElement("button");
  productAddToCartBtn.setAttribute("type", "button");
  productAddToCartBtn.setAttribute("class", "buy-btn");
  productAddToCartBtn.textContent = "add to cart";
  productBuy.appendChild(productAddToCartBtn);

  // Event handling written below

  productAddToCartBtn.addEventListener("click", function () {
    //some logic
    console.log(Number(productQuantityToBuy?.value), productObj.price);
    let object = {
      price: productObj.price,
      quantity: productQuantityToBuy.value,
      name: productObj.name,
      img: productObj.imgSrc,
    };
    window.sessionStorage.setItem(
      "cart",
      productsToCart(JSON.stringify(object))
    );
    // console.log("getItem" + sessionStorage.getItem("cart"))
  });
};

//test purposes
// let i = 1;
// const arrOfProducts = [{imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},
//     {imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},{imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},
//     {imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},{imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},
//     {imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},{imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},
//     {imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},{imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},
//     {imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},{imgSrc:"EN_GreenOlive-1.webp",name:`product${i++}`,price:"20$",quantity:"20"},
// ]
//how we call it
// for(let prd of arrOfProducts){
//     createProductComponent(prd);
// }
// const
const getProducts = async () => {
  const productsFetched = await fetch("http://localhost:3000/products");
  const products = await productsFetched.json();

  for (let prd of products) {
    if (prd?.status?.trim()?.toLowerCase() == "approved") {
      createProductComponent(prd);
    }
  }
};
const productsToCart = (obj) => {
  if (
    sessionStorage?.getItem("cart") == null ||
    sessionStorage?.getItem("cart") == "undefined"
  )
    sessionStorage?.setItem("cart", "[]");
  console.log(JSON.parse(sessionStorage?.getItem("cart")));
  let returnedCart = JSON.parse(sessionStorage.getItem("cart"));
  let paramObject = JSON.parse(obj);
  returnedCart.push(paramObject);
  let stringedCart = JSON.stringify(returnedCart);
  sessionStorage.setItem("cart", stringedCart);
  return stringedCart;
};
const checkUser = () => {
  const userFromSession = JSON.parse(sessionStorage.getItem("user"));
  if (userFromSession == null) {
    return false;
  } else if (userFromSession.firstname) {
    userStatus.textContent = "Logout";
    userStatus.href = "../Login/login.html";

    userStatus.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.removeItem("user");
      window.location.href = "../Login/login.html";
    });
  }
};

window.addEventListener("load", () => {
  checkUser();
  getProducts();
});
