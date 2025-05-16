const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-button");
const profileIcon = document.querySelector("#profile");
const signOutBtn = document.querySelector("#sign-out");
const getProductsFromJson = async () => {
  const returnedProducts = await fetch("http://localhost:3000/products");
  const products = returnedProducts.json();
  return products;
};
let returnedCart = JSON.parse(localStorage.getItem("Cart"));
let cart = [];
if (returnedCart) cart = returnedCart;

const renderProducts = async (products) => {
  const list = document.createElement("section");
  list.setAttribute("class", "product-list");
  list.setAttribute("id", "product-list");
  document.querySelector("main").append(list);
  products.forEach((product) => {
    if (product.status?.toLowerCase() == "approved") {
      const card = document.createElement("div");
      card.setAttribute("class", "product-card");

      const imageProductElem = document.createElement("img");
      imageProductElem.setAttribute("class", "product-image");

      const imageUrl = product.imageUrl.startsWith('/') ? '.' + product.imageUrl : './' + product.imageUrl;
      imageProductElem.setAttribute("src", imageUrl);
      imageProductElem.setAttribute("alt", product.name);
      card.appendChild(imageProductElem);

      const infoProductContainer = document.createElement("ul");
      infoProductContainer.setAttribute("class", "product-info");
      card.appendChild(infoProductContainer);

      const productCategoryLi = document.createElement("li");
      productCategoryLi.setAttribute("class", "product-category");
      productCategoryLi.textContent = product.category;

      const productTitleLi = document.createElement("li");
      productTitleLi.setAttribute("class", "product-title");
      productTitleLi.textContent = product.name;

      const productPriceLi = document.createElement("li");
      productPriceLi.setAttribute("class", "product-price");
      productPriceLi.textContent = product.price.toFixed(2);

      const addToCartButton = document.createElement("button");
      addToCartButton.setAttribute("class", "add-to-cart");
      addToCartButton.setAttribute("id", product.name);
      addToCartButton.textContent = "Add to cart";
      addToCartButton.addEventListener("click", () => {
        const product = products.find(
          (prd) => prd.name === addToCartButton.getAttribute("id")
        );
        if (product) {
          // Check if product already exists in cart
          const existingProduct = cart.find((item) => item.name === product.name);
          if (existingProduct) {
            alert(`${product.name} is already in your cart!`);
            return;
          }
          
          // Add product to cart with initial quantity of 1
          cart.push({
            ...product,
            quantity: 1
          });
          updateCartIcon();
          alert(`${product.name} added to cart!`);
          localStorage.setItem("Cart", JSON.stringify(cart));
        }
      });

      infoProductContainer.append(
        productCategoryLi,
        productTitleLi,
        productPriceLi,
        addToCartButton
      );

      const reviewButton = document.createElement("button");
      reviewButton.textContent = "Leave a Review";
      reviewButton.setAttribute("class", "add-to-cart review-btn");
      reviewButton.addEventListener("click", () => {
        const User = JSON.parse(localStorage.getItem("User"));
        if (!User) return false;
        let reviewPrompt = window.prompt("Enter your review");
        fetch("http://localhost:3000/review", {
          method: "POST",
          body: JSON.stringify({
            reviewComment: reviewPrompt,
            userId: User.id,
            product: product.name,
          }),
        });
      });

      infoProductContainer.appendChild(reviewButton);
      list.appendChild(card);
    } else {
      return false;
    }
  });
};
//renders products approved by admin
const showApprovedByDefault = async () => {
  let products = await getProductsFromJson();
  renderProducts(products);
};
//unused might be deleted
const updateCartIcon = () => {
  const cartIcon = document.querySelector(".fa-shopping-cart");
  cartIcon.setAttribute("data-count", cart.length);
};

const displayCart = () => {
  const cartPopOut = document.createElement("div");
  cartPopOut.className = "cart-pop-out";
  const totalPrice = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  const cartContainer = document.createElement("div");
  cartContainer.setAttribute("class", "cart-content");
  const headingForCart = document.createElement("h2");
  headingForCart.textContent = "Your Cart";
  cartContainer.appendChild(headingForCart);

  const ulElem = document.createElement("ul");
  for (let item of cart) {
    const liElem = document.createElement("li");
    const imgElem = document.createElement("img");
    const imageUrl = item.imageUrl.startsWith('/') ? '.' + item.imageUrl : './' + item.imageUrl;
    imgElem.setAttribute("src", imageUrl);
    imgElem.setAttribute("alt", item.name);
    imgElem.setAttribute("class", "cart-item-image");
    liElem.appendChild(imgElem);

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
    decreaseButton.addEventListener("click", () => {
      let quantity = Number(quantitySpan.textContent);
      if (quantity > 1) {
        // Update quantity in main cart array
        const cartItem = cart.find((cartItem) => cartItem.name === item.name);
        if (cartItem) {
          cartItem.quantity = quantity - 1;
          quantitySpan.textContent = quantity - 1;
          updateTotalPrice(cartPopOut);
          localStorage.setItem("Cart", JSON.stringify(cart));
        }
      }
    });

    const quantitySpan = document.createElement("span");
    quantitySpan.setAttribute("class", "quantity");
    quantitySpan.textContent = item.quantity || 1;
    quantityControls.appendChild(quantitySpan);

    const increaseButton = document.createElement("button");
    increaseButton.setAttribute("class", "increase-quantity");
    increaseButton.setAttribute("data-product-id", item.name);
    increaseButton.textContent = "+";
    quantityControls.appendChild(increaseButton);
    increaseButton.addEventListener("click", () => {
      let quantity = Number(quantitySpan.textContent);
      // Update quantity in main cart array
      const cartItem = cart.find((cartItem) => cartItem.name === item.name);
      if (cartItem) {
        cartItem.quantity = quantity + 1;
        quantitySpan.textContent = quantity + 1;
        updateTotalPrice(cartPopOut);
        localStorage.setItem("Cart", JSON.stringify(cart));
      }
    });

    liElem.appendChild(quantityControls);
    ulElem.appendChild(liElem);
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

  cartPopOut.appendChild(cartContainer);
  document.body.appendChild(cartPopOut);

  closeButton.addEventListener("click", () => {
    cartPopOut.remove();
  });

  checkOutButton.addEventListener("click", () => {
    // Validate cart
    if (!cart || cart.length === 0) {
      alert("Your cart is empty. Please add products before checkout.");
      return;
    }

    // Validate cart items have quantities
    const invalidItems = cart.filter(item => !item.quantity || item.quantity < 1);
    if (invalidItems.length > 0) {
      alert("Some items in your cart have invalid quantities. Please check your cart.");
      return;
    }

    // Check if user is logged in
    if (!isSignedIn()) {
      alert("Please log in to complete your order.");
      window.location.href = "./Login/login.html";
      return;
    }

    const getUserData = JSON.parse(localStorage.getItem("User"));
    
    // Create order object with all required information
    const order = {
      userId: getUserData.id,
      userName: `${getUserData.firstName} ${getUserData.lastName}`,
      userEmail: getUserData.email,
      date: new Date().toISOString(),
      status: "Pending",
      cart: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        sellerId: item.sellerId,
        imageUrl: item.imageUrl,
        category: item.category
      })),
      totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    // Validate order has items
    if (order.cart.length === 0) {
      alert("Cannot create order with empty cart.");
      return;
    }

    // Send order to server
    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      return response.json();
    })
    .then(data => {
      // Update orders in localStorage
      const currentOrders = JSON.parse(localStorage.getItem('orders')) || [];
      currentOrders.push(data);
      localStorage.setItem('orders', JSON.stringify(currentOrders));
      
      // Update order status display
      updateOrderStatus();
      
      // Clear cart
      localStorage.removeItem("Cart");
      cart = [];
      
      // Show success message
      alert("Order placed successfully!");
      
      // Close cart popup
      const cartPopOut = document.querySelector('.cart-pop-out');
      if (cartPopOut) {
        cartPopOut.remove();
      }
    })
    .catch(error => {
      console.error('Error creating order:', error);
      alert("Failed to place order. Please try again.");
    });
  });
};

const updateTotalPrice = (cartPopOut) => {
  const quantities = cartPopOut.querySelectorAll(".quantity");
  const totalPrice = Array.from(quantities).reduce((sum, element, index) => {
    return sum + parseInt(element.textContent) * Number(cart[index].price);
  }, 0);
  cartPopOut.querySelector(
    ".total-price"
  ).textContent = `Total: $${totalPrice.toFixed(2)}`;
};
const userWelcoming = (isLoggedIn) => {
  const user = JSON.parse(localStorage.getItem("User"));
  const headerIdentity = document.querySelector("#identity");

  if (isLoggedIn) {
    let caller = "";
    if (user.gender == "female") caller = "Mrs";
    else caller = "Mr";

    headerIdentity.textContent = `${headerIdentity.textContent} , ${caller}.${user.firstName}`;
    profileIcon.style.display = "block";
    signOutBtn.style.display = "block";
  } else {
    headerIdentity.textContent = `${headerIdentity.textContent}, Anonymous`;
    profileIcon.style.display = "block";
    signOutBtn.style.display = "none";
  }
};
const isSignedIn = () => {
  const user = JSON.parse(localStorage.getItem("User"));
  if (user) {
    return true;
  } else {
    return false;
  }
};
const profileHandler = () => {};

// Function to fetch and update orders
async function fetchAndUpdateOrders() {
  try {
    const user = JSON.parse(localStorage.getItem("User"));
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('Fetching orders for user:', user.id);
    const response = await fetch(`http://localhost:3000/orders?userId=${user.id}`);
    const orders = await response.json();
    
    console.log('Fetched orders:', orders);
    
    // Store orders in localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Update the order status display
    updateOrderStatus();
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

// Function to update order status
function updateOrderStatus() {
  const statusBadge = document.querySelector('.status-badge');
  const orderStatus = document.querySelector('.order-status');
  
  if (!statusBadge || !orderStatus) {
    console.log('Status elements not found');
    return;
  }

  // Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  console.log('Current orders:', orders);
  
  // Check if there are any pending orders
  const hasPendingOrders = orders.some(order => order.status === 'Pending');
  
  if (hasPendingOrders) {
    statusBadge.textContent = 'Pending';
    statusBadge.className = 'status-badge pending';
    orderStatus.style.display = 'flex';
  } else if (orders.length > 0) {
    statusBadge.textContent = 'Delivered';
    statusBadge.className = 'status-badge delivered';
    orderStatus.style.display = 'flex';
  } else {
    orderStatus.style.display = 'none';
  }
}

// Function to display orders in popup
function displayOrdersPopup() {
  console.log('Displaying orders popup');
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const ordersList = document.querySelector('.orders-list');
  const ordersModal = document.getElementById('ordersModal');
  
  if (!ordersList || !ordersModal) {
    console.log('Modal elements not found');
    return;
  }
  
  // Clear previous orders
  ordersList.innerHTML = '';
  
  if (orders.length === 0) {
    ordersList.innerHTML = '<p style="text-align: center; color: #666;">No orders found.</p>';
  } else {
    orders.forEach(order => {
      const orderItem = document.createElement('div');
      orderItem.className = 'order-item';
      
      // Format date
      const orderDate = new Date(order.date || Date.now()).toLocaleDateString();
      
      orderItem.innerHTML = `
        <div class="order-header">
          <span class="order-id">Order #${order.id}</span>
          <span class="order-date">${orderDate}</span>
        </div>
        <div class="order-products">
          ${order.cart.map(item => `
            <div class="order-product">
              <img src="${item.imageUrl.startsWith('/') ? '.' + item.imageUrl : './' + item.imageUrl}" alt="${item.name}">
              <div class="order-product-info">
                <div class="order-product-name">${item.name}</div>
                <div class="order-product-price">$${item.price} x ${item.quantity}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="order-total">
          Total: $${order.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
        </div>
        <div class="order-status ${order.status.toLowerCase()}">
          ${order.status}
        </div>
      `;
      
      ordersList.appendChild(orderItem);
    });
  }
  
  // Show the modal
  ordersModal.style.display = 'block';
  console.log('Modal displayed');
}

window.addEventListener("load", () => {
  showApprovedByDefault();
  updateCartIcon();
  let userLoggedInStatus = isSignedIn();
  userWelcoming(userLoggedInStatus);
  
  // Declare orderStatusIcon once
  const orderStatusIcon = document.querySelector('.order-status');
  const user = JSON.parse(localStorage.getItem("User"));
  if (!user) {
    if (orderStatusIcon) orderStatusIcon.style.display = "none";
  } else {
    if (orderStatusIcon) orderStatusIcon.style.display = "flex";
  }

  // Fetch and update orders when page loads
  if (userLoggedInStatus) {
    console.log('User is logged in, fetching orders');
    fetchAndUpdateOrders();
  }

  // Add click event listener to the order status icon
  if (orderStatusIcon) {
    console.log('Order status icon found, adding click listener');
    orderStatusIcon.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Order status icon clicked');
      displayOrdersPopup();
    });
  } else {
    console.log('Order status icon not found');
  }

  // Close modal when clicking the close button
  const closeOrdersModal = document.getElementById('closeOrdersModal');
  if (closeOrdersModal) {
    closeOrdersModal.addEventListener('click', () => {
      document.getElementById('ordersModal').style.display = 'none';
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    const ordersModal = document.getElementById('ordersModal');
    if (e.target === ordersModal) {
      ordersModal.style.display = 'none';
    }
  });

  //shopping cart click EVENT !
  document.querySelector(".fa-shopping-cart").addEventListener("click", () => {
    displayCart();
  });
  signOutBtn.addEventListener("click", () => {
    localStorage.removeItem("User");
    localStorage.removeItem("Cart");
    window.location.reload();
  });
  //search button
  searchButton.addEventListener("click", async () => {
    const prevList = document.querySelector("#product-list");
    if (prevList) prevList.remove();

    const allProducts = await getProductsFromJson();
    const inputValue = searchBar.value.toLowerCase();
    let matchedProducts = allProducts.filter((product) => {
      // console.log(product.name)
      console.log(inputValue);
      if (
        product.name?.toLowerCase().includes(inputValue) ||
        product.category?.toLowerCase().includes(inputValue)
      )
        return true;
      else false;
    });
    renderProducts(matchedProducts);
  });

  profileIcon.addEventListener("click", async () => {
    const user = JSON.parse(localStorage?.getItem("User"));
    if (!user) {
      window.location.href = "Login/login.html";
      return false;
    }

    const profileSection = document.querySelector(".profile-section");
    const mainSection = document.querySelector("main");

    const fullname = document.querySelector("#full-name");

    const fname = document.querySelector("#fname");
    const lname = document.querySelector("#lname");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirm-password");
    const saveButton = document.querySelector("#save-button");
    const cancelButton = document.querySelector("#cancel-button");

    profileSection.style.display = "grid";
    mainSection.style.display = "none";

    fullname.textContent = `${user.firstName} ${user.lastName}`;
    fname.value = `${user.firstName}`;
    lname.value = `${user.lastName}`;
    email.value = `${user.email}`;

    const userId = user.id;
    saveButton.addEventListener("click", () => {
      if (password.value == confirmPassword.value) {
        fetch(`http://localhost:3000/users/${userId}`, {
          method: "PUT",
          body: JSON.stringify({
            firstName: fname.value,
            lastName: lname.value,
            email: email.value,
            password: password.value,
          }),
        });
      }
      profileSection.style.display = "none";
      mainSection.style.display = "grid";
    });
    cancelButton.addEventListener("click", () => {
      profileSection.style.display = "none";
      mainSection.style.display = "grid";
    });
  });

  // Call updateOrderStatus when the page loads
  updateOrderStatus();
});

// Update order status when orders change
function updateOrders(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
  updateOrderStatus();
}

// Ensure DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
  const orderStatusIcon = document.querySelector('.order-status');
  const ordersModal = document.getElementById('ordersModal');
  const closeOrdersModal = document.getElementById('closeOrdersModal');
  const ordersList = document.querySelector('.orders-list');

  // Helper: Get current user from localStorage
  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('User'));
  }

  // Helper: Get all orders from localStorage (or fetch from server if needed)
  function getAllOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
  }

  // Display orders for the current user (fetch from server)
  async function displayUserOrders() {
    const user = getCurrentUser();
    if (!user) {
      ordersList.innerHTML = '<div style="padding:1rem;">Please log in to view your orders.</div>';
      return;
    }
    try {
      // Fetch orders for the user
      const response = await fetch(`http://localhost:3000/orders?userId=${user.id}`);
      const allOrders = await response.json();
      // Fetch all products
      const productsResponse = await fetch('http://localhost:3000/products');
      const allProducts = await productsResponse.json();
      if (!Array.isArray(allOrders) || allOrders.length === 0) {
        ordersList.innerHTML = '<div style="padding:1rem;">No orders found.</div>';
        return;
      }
      ordersList.innerHTML = allOrders.map(order => `
        <div class="order-item">
          <div class="order-header">
            <span class="order-id">Order #${order.id || ''}</span>
            <span class="order-date">${order.date ? new Date(order.date).toLocaleDateString() : ''}</span>
          </div>
          <div class="order-products">
            ${(order.cart || []).map(item => {
              // Find the product by productId
              const product = allProducts.find(p => p.id === item.productId);
              const imageUrl = product && product.imageUrl
                ? (product.imageUrl.startsWith('/') ? '.' + product.imageUrl : './' + product.imageUrl)
                : (item.imageUrl || '');
              return `
                <div class="order-product">
                  <img src="${imageUrl}" alt="${item.name || ''}" />
                  <div class="order-product-info">
                    <div class="order-product-name">${item.name || ''}</div>
                    <div class="order-product-price">Qty: ${item.quantity || 1} &times; $${item.price || 0}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="order-total">Total: $${order.totalAmount || 0}</div>
          <div class="order-status ${order.status ? order.status.toLowerCase() : ''}">Status: ${order.status || 'Pending'}</div>
        </div>
      `).join('');
    } catch (error) {
      ordersList.innerHTML = '<div style="padding:1rem; color:red;">Failed to load orders.</div>';
    }
  }

  // Open modal and show orders
  orderStatusIcon.addEventListener('click', function() {
    ordersModal.style.display = 'block';
    displayUserOrders();
  });

  // Close modal
  closeOrdersModal.addEventListener('click', function() {
    ordersModal.style.display = 'none';
  });

  // Close modal when clicking outside content
  window.addEventListener('click', function(event) {
    if (event.target === ordersModal) {
      ordersModal.style.display = 'none';
    }
  });
});
