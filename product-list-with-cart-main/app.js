let products = [];
let cart = [];

function saveCartToLocalStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
    }
}

function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
            cart.forEach(item => {
                updateProductCardState(item.index);
            });
        }
    } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        cart = [];
    }
}

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

async function fetchProducts() {
    try {
        productsGrid.innerHTML = '<p class="loading">Loading products...</p>';

        const response = await fetch('data.json');

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        products = await response.json();
        renderProducts();
        loadCartFromLocalStorage();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        productsGrid.innerHTML = '<p class="error">Failed to load products. Please try again later.</p>';
    }
}
document.addEventListener('DOMContentLoaded', fetchProducts);

function renderProducts() {
    productsGrid.innerHTML = '';
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
}

function addToCart(productIndex) {
    const product = products[productIndex];

    const existingItem = cart.find(item => item.index === productIndex);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            index: productIndex,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image.thumbnail,
            quantity: 1
        });
    }

    updateProductCardState(productIndex);
    updateCartDisplay();
    saveCartToLocalStorage();
}

function increaseQuantity(productIndex) {
    const cartItem = cart.find(item => item.index === productIndex);

    if (cartItem) {
        cartItem.quantity++;
        updateProductCardState(productIndex);
        updateCartDisplay();
        saveCartToLocalStorage();
    }
}

function decreaseQuantity(productIndex) {
    const cartItem = cart.find(item => item.index === productIndex);

    if (cartItem) {
        cartItem.quantity--;

        if (cartItem.quantity === 0) {
            removeFromCart(productIndex);
        } else {
            updateProductCardState(productIndex);
            updateCartDisplay();
            saveCartToLocalStorage();
        }
    }
}

function removeFromCart(productIndex) {
    cart = cart.filter(item => item.index !== productIndex);

    updateProductCardState(productIndex);
    updateCartDisplay();
    saveCartToLocalStorage();
}

  function updateProductCardState(productIndex) {
    const productCard = document.querySelector(`.product-card[data-index="${productIndex}"]`);
    const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
    const quantityControls = productCard.querySelector('.quantity-controls');
    const quantityDisplay = quantityControls.querySelector('.quantity-display');

    const cartItem = cart.find(item => item.index === productIndex);

    if (cartItem) {
      addToCartBtn.style.display = 'none';
      quantityControls.classList.add('active');
      quantityDisplay.textContent = cartItem.quantity;
      productCard.classList.add('in-cart');
    } else {
      addToCartBtn.style.display = 'flex';
      quantityControls.classList.remove('active');
      productCard.classList.remove('in-cart');
    }
  }

  function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
      emptyCart.style.display = 'block';
      cartItems.style.display = 'none';
      orderTotal.style.display = 'none';
      return;
    }

    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    orderTotal.style.display = 'block';

    cartItems.innerHTML = '';

    cart.forEach(item => {
      const cartItemElement = createCartItemElement(item);
      cartItems.appendChild(cartItemElement);
    });

    updateTotalPrice();
  }

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

    const removeBtn = itemElement.querySelector('.remove-item-btn');
    removeBtn.addEventListener('click', () => removeFromCart(item.index));

    return itemElement;
  }

  function updateTotalPrice() {
    const total = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    totalPrice.textContent = `$${total.toFixed(2)}`;
  }

  function showOrderConfirmation() {
    modalItems.innerHTML = '';

    cart.forEach(item => {
      const modalItem = createModalItemElement(item);
      modalItems.appendChild(modalItem);
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalTotalPrice.textContent = `$${total.toFixed(2)}`;

    orderModal.style.display = 'flex';

    document.body.style.overflow = 'hidden';
  }

  confirmOrderBtn.addEventListener('click', showOrderConfirmation);

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

  function startNewOrder() {
    cart = [];

    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';

    updateCartDisplay();

    products.forEach((_, index) => {
      updateProductCardState(index);
    });

    saveCartToLocalStorage();
  }

  newOrderBtn.addEventListener('click', startNewOrder);

  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      startNewOrder();
    }
  });

  function handleModalKeydown(e) {
    if (e.key === 'Escape' && orderModal.style.display === 'flex') {
      startNewOrder();
    }
  }

  document.addEventListener('keydown', handleModalKeydown);

  function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.index = index;

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
