// State Management
let products = []; // Will hold all products from data.json
let cart = []; // Will hold items added to cart

// ============================================
// LOCALSTORAGE HELPERS
// ============================================

/**
 * Saves the cart to localStorage
 */
function saveCartToLocalStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
    }
}

/**
 * Loads the cart from localStorage
 */
function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
            // Update all product cards to reflect cart state
            cart.forEach(item => {
                updateProductCardState(item.index);
            });
        }
    } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        cart = [];
    }
}

// Initialize DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const cartCount = document.getElementById('cart-count');
  const emptyCart = document.getElementById('empty-cart');
  const cartItems = document.getElementById('cart-items');
  const orderTotal = document.getElementById('order-total');
  const totalPrice = document.getElementById('total-price');
  const confirmOrderBtn = document.getElementById('confirm-order-btn');
  const orderModal = document.getElementById('order-modal');
  const modalItems = document.getElementById('modal-items');
  const modalTotalPrice = document.getElementById('modal-total-price');
  const newOrderBtn = document.getElementById('new-order-btn');

/**
 * Fetches products from data.json and renders them to the DOM
 * @async
 * @throws {Error} If the fetch operation fails
 */
async function fetchProducts() {
    try {
        // Show loading state
        productsGrid.innerHTML = '<p class="loading">Loading products...</p>';

        const response = await fetch('data.json');

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        products = await response.json();
        renderProducts();
        // Load saved cart after products are rendered
        loadCartFromLocalStorage();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        productsGrid.innerHTML = '<p class="error">Failed to load products. Please try again later.</p>';
    }
}
document.addEventListener('DOMContentLoaded', fetchProducts);

/**
 * Renders all products to the DOM
 */
function renderProducts() {
    productsGrid.innerHTML = ''; // Clear existing products
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
}


/**
 * Adds a product to the cart or increases quantity if already in cart
 * @param {number} productIndex - Index of the product in the products array
 */
function addToCart(productIndex) {
    const product = products[productIndex];

    // Check if product is already in cart
    const existingItem = cart.find(item => item.index === productIndex);

    if (existingItem) {
        // If already in cart, just increase quantity
        existingItem.quantity++;
    } else {
        // Add new item to cart
        cart.push({
            index: productIndex,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image.thumbnail,
            quantity: 1
        });
    }

    // Update UI and save to localStorage
    updateProductCardState(productIndex);
    updateCartDisplay();
    saveCartToLocalStorage();
}

/**
 * Increases the quantity of a product in the cart
 * @param {number} productIndex - Index of the product in the products array
 */
function increaseQuantity(productIndex) {
    const cartItem = cart.find(item => item.index === productIndex);

    if (cartItem) {
        cartItem.quantity++;
        updateProductCardState(productIndex);
        updateCartDisplay();
        saveCartToLocalStorage();
    }
}

/**
 * Decreases the quantity of a product in the cart
 * Removes the product if quantity reaches 0
 * @param {number} productIndex - Index of the product in the products array
 */
function decreaseQuantity(productIndex) {
    const cartItem = cart.find(item => item.index === productIndex);

    if (cartItem) {
        cartItem.quantity--;

        // If quantity reaches 0, remove from cart
        if (cartItem.quantity === 0) {
            removeFromCart(productIndex);
        } else {
            updateProductCardState(productIndex);
            updateCartDisplay();
            saveCartToLocalStorage();
        }
    }
}

/**
 * Removes a product from the cart completely
 * @param {number} productIndex - Index of the product in the products array
 */
function removeFromCart(productIndex) {
    // Remove item from cart array
    cart = cart.filter(item => item.index !== productIndex);

    // Update UI and save to localStorage
    updateProductCardState(productIndex);
    updateCartDisplay();
    saveCartToLocalStorage();
}

  
  // ============================================
  // UI UPDATES - PRODUCT CARD STATE
  // ============================================

  /**
   * Updates the visual state of a product card based on whether it's in the cart
   * @param {number} productIndex - Index of the product in the products array
   */
  function updateProductCardState(productIndex) {
    const productCard = document.querySelector(`.product-card[data-index="${productIndex}"]`);
    const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
    const quantityControls = productCard.querySelector('.quantity-controls');
    const quantityDisplay = quantityControls.querySelector('.quantity-display');

    // Find item in cart
    const cartItem = cart.find(item => item.index === productIndex);

    if (cartItem) {
      // Item is in cart - show quantity controls
      addToCartBtn.style.display = 'none';
      quantityControls.classList.add('active');
      quantityDisplay.textContent = cartItem.quantity;
      productCard.classList.add('in-cart');
    } else {
      // Item not in cart - show add to cart button
      addToCartBtn.style.display = 'flex';
      quantityControls.classList.remove('active');
      productCard.classList.remove('in-cart');
    }
  }

  
  // ============================================
  // UI UPDATES - CART DISPLAY
  // ============================================

  /**
   * Updates the cart display, including item count, cart items list, and total price
   */
  function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // If cart is empty
    if (cart.length === 0) {
      emptyCart.style.display = 'block';
      cartItems.style.display = 'none';
      orderTotal.style.display = 'none';
      return;
    }

    // Cart has items
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    orderTotal.style.display = 'block';

    // Clear existing cart items
    cartItems.innerHTML = '';

    // Add each cart item
    cart.forEach(item => {
      const cartItemElement = createCartItemElement(item);
      cartItems.appendChild(cartItemElement);
    });

    // Update total price
    updateTotalPrice();
  }

  
  // ============================================
  // CREATE CART ITEM ELEMENT
  // ============================================

  /**
   * Creates a cart item element for display in the cart
   * @param {Object} item - The cart item object
   * @returns {HTMLElement} The cart item element
   */
  function createCartItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.setAttribute('role', 'listitem');

    const itemTotal = item.price * item.quantity;

    itemElement.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-details">
          <span class="cart-item-quantity">${item.quantity}x</span>
          <span class="cart-item-price">@ $${item.price.toFixed(2)}</span>
          <span class="cart-item-total">$${itemTotal.toFixed(2)}</span>
        </div>
      </div>
      <button class="remove-item-btn" data-index="${item.index}" aria-label="Remove ${item.name} from cart">
        <img src="./assets/images/icon-remove-item.svg" alt="" role="presentation">
      </button>
    `;

    // Add remove button event listener
    const removeBtn = itemElement.querySelector('.remove-item-btn');
    removeBtn.addEventListener('click', () => removeFromCart(item.index));

    return itemElement;
  }


   // ============================================
  // CALCULATE TOTAL
  // ============================================

  function updateTotalPrice() {
    const total = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    totalPrice.textContent = `$${total.toFixed(2)}`;
  }


  // ============================================
  // MODAL - ORDER CONFIRMATION
  // ============================================

  function showOrderConfirmation() {
    // Clear existing modal items
    modalItems.innerHTML = '';

    // Add each cart item to modal
    cart.forEach(item => {
      const modalItem = createModalItemElement(item);
      modalItems.appendChild(modalItem);
    });

    // Update modal total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalTotalPrice.textContent = `$${total.toFixed(2)}`;

    // Show modal
    orderModal.style.display = 'flex';

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  // Add event listener to confirm order button
  confirmOrderBtn.addEventListener('click', showOrderConfirmation);

  
  // ============================================
  // CREATE MODAL ITEM ELEMENT
  // ============================================

  /**
   * Creates a modal item element for display in the order confirmation modal
   * @param {Object} item - The cart item object
   * @returns {HTMLElement} The modal item element
   */
  function createModalItemElement(item) {
    const modalItem = document.createElement('div');
    modalItem.className = 'modal-item';
    modalItem.setAttribute('role', 'listitem');

    const itemTotal = item.price * item.quantity;

    modalItem.innerHTML = `
      <img src="${item.image}" alt="" class="modal-item-image" role="presentation">
      <div class="modal-item-details">
        <div class="modal-item-name">${item.name}</div>
        <div class="modal-item-quantity-price">
          <span class="modal-item-quantity">${item.quantity}x</span>
          <span class="modal-item-price">@ $${item.price.toFixed(2)}</span>
        </div>
      </div>
      <span class="modal-item-total">$${itemTotal.toFixed(2)}</span>
    `;

    return modalItem;
  }

  // ============================================
  // RESET CART
  // ============================================

  /**
   * Resets the cart and closes the order confirmation modal
   */
  function startNewOrder() {
    // Clear cart array
    cart = [];

    // Hide modal
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Update all UI
    updateCartDisplay();

    // Reset all product cards
    products.forEach((_, index) => {
      updateProductCardState(index);
    });

    // Clear localStorage
    saveCartToLocalStorage();
  }

  // Add event listener to new order button
  newOrderBtn.addEventListener('click', startNewOrder);


  // ============================================
  // MODAL - CLOSE ON OUTSIDE CLICK
  // ============================================

  orderModal.addEventListener('click', (e) => {
    // Only close if clicking the overlay (not the modal content)
    if (e.target === orderModal) {
      startNewOrder();
    }
  });

  // ============================================
  // MODAL - KEYBOARD SUPPORT (ESC KEY)
  // ============================================

  /**
   * Handles keyboard events for the modal (ESC to close)
   * @param {KeyboardEvent} e - The keyboard event
   */
  function handleModalKeydown(e) {
    if (e.key === 'Escape' && orderModal.style.display === 'flex') {
      startNewOrder();
    }
  }

  // Add keyboard event listener
  document.addEventListener('keydown', handleModalKeydown);

  // ============================================
  // CREATE PRODUCT CARD
  // ============================================

  function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.index = index;

    // Use picture element for responsive images
    card.innerHTML = `
      
      <div class="product-image-wrapper">
        <picture>
          <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
          <source media="(min-width: 768px)" srcset="${product.image.tablet}">
          <img src="${product.image.mobile}" alt="${product.name}" class="product-image">
        </picture>

        <button class="add-to-cart-btn" data-index="${index}">
          <img src="./assets/images/icon-add-to-cart.svg" alt="">
          Add to Cart
        </button>

        <div class="quantity-controls" data-index="${index}">
          <button class="quantity-btn decrease-btn" data-index="${index}" aria-label="Decrease
  quantity">
            <img src="./assets/images/icon-decrement-quantity.svg" alt="">
          </button>
          <span class="quantity-display">1</span>
          <button class="quantity-btn increase-btn" data-index="${index}" aria-label="Increase
  quantity">
            <img src="./assets/images/icon-increment-quantity.svg" alt="">
          </button>
        </div>
      </div>

      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
      </div>
    `;

    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    const decreaseBtn = card.querySelector('.decrease-btn');
    const increaseBtn = card.querySelector('.increase-btn');

    addToCartBtn.addEventListener('click', () => addToCart(index));
    decreaseBtn.addEventListener('click', () => decreaseQuantity(index));
    increaseBtn.addEventListener('click', () => increaseQuantity(index));

    return card;
  }




