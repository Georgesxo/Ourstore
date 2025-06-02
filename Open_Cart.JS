// Load cart from cookie or initialize as empty
function getCartFromCookie() {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('geokels_cart='));

  return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : [];
}

let cart = getCartFromCookie();

// Add item to Cart
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name && item.image === image);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price: parseFloat(price),
      image,
      quantity: 1
    });
  }

  updateCartUI();
  showAddedToCartFeedback();
}

// Update Cart UI
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');

  if (!cartItemsContainer || !cartTotalElement) return;

  // Clear current items
  cartItemsContainer.innerHTML = '';

  let totalPrice = 0;

  // Rebuild UI
  cart.forEach(item => {
    totalPrice += item.price * item.quantity;

    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.style.display = 'flex';
    itemElement.style.alignItems = 'center';
    itemElement.style.marginBottom = '10px';
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 10px; border-radius: 5px;">
      <div>
        <h3 style="margin: 0; font-size: 16px;">${item.name}</h3>
        <p style="margin: 5px 0; font-size: 14px;">¢${item.price} × ${item.quantity}</p>
        <button onclick="removeFromCart('${item.name}', '${item.image}')" style="padding: 5px 10px; background-color: red; color: white; border: none; border-radius: 3px; cursor: pointer;">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  // Update total price display
  document.getElementById('cart-total').textContent = `Total: ¢${totalPrice}`;

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  // Style checkout button based on cart state
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    if (cart.length === 0) {
      checkoutBtn.style.opacity = '0.6';
      checkoutBtn.style.cursor = 'not-allowed';
    } else {
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.cursor = 'pointer';
    }
  }

  // Save updated cart to cookie
  saveCartToCookie();
}

// Save Cart to Cookie
function saveCartToCookie() {
  const expirationDays = 7;
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = date.toUTCString();

  // Convert cart to string and encode
  const cartStr = JSON.stringify(cart);
  document.cookie = `geokels_cart=${encodeURIComponent(cartStr)}; expires=${expires}; path=/`;
}

// Remove One Item from Cart (by name + image)
function removeFromCart(name, image) {
  const itemIndex = cart.findIndex(item => item.name === name && item.image === image);

  if (itemIndex > -1) {
    const item = cart[itemIndex];

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      cart.splice(itemIndex, 1); // Remove entirely if only one left
    }

    updateCartUI(); // Always update UI after removal
  }
}

// Open Cart Modal
function openCart() {
  const modal = document.getElementById('cartModal');
  const modalContent = modal?.querySelector('.modal-content');

  if (modal && modalContent) {
    modal.style.display = 'block';

    // Force iOS to repaint
    void modal.offsetWidth;

    modalContent.style.display = 'block';
    setTimeout(() => {
      modalContent.style.opacity = '1';
    }, 50);

    updateCartUI();
  }
}

// Close Cart Modal
function closeCart() {
  const modal = document.getElementById('cartModal');
  const modalContent = modal?.querySelector('.modal-content');

  if (modalContent) {
    modalContent.style.opacity = '0';
    setTimeout(() => {
      modalContent.style.display = 'none';
      modal.style.display = 'none';
    }, 300);
  }
}

// Feedback Message When Adding to Cart
function showAddedToCartFeedback() {
  const feedback = document.createElement('div');
  feedback.textContent = 'Item added to cart!';
  feedback.style.position = 'fixed';
  feedback.style.top = '20px';
  feedback.style.left = '50%';
  feedback.style.transform = 'translateX(-50%)';
  feedback.style.backgroundColor = '#0aa5e2';
  feedback.style.color = 'white';
  feedback.style.padding = '10px 20px';
  feedback.style.borderRadius = '5px';
  feedback.style.zIndex = '1000';
  feedback.style.transition = 'opacity 0.5s';
  feedback.style.opacity = '1';

  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.style.opacity = '0';
    setTimeout(() => {
      feedback.remove();
    }, 500);
  }, 2000);
}

// Proceed to Order Button Logic
function goToCheckout() {
  if (cart.length === 0) {
    const message = document.getElementById('cart-empty-message');

    if (message) {
      message.style.display = 'block';
      message.style.opacity = '1';

      // Hide after 3 seconds
      setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
          message.style.display = 'none';
        }, 500);
      }, 3000);
    }

    return; // Stop form redirect
  }

  // If cart has items, proceed to Google Form
  const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd2LZUs_mQmi13tnp7_Amraw8uZohWYO1K1ACDvQ3efCzWU3w/viewform?usp=header";
  const orderSummaryField = "entry.1607547187";

  const receipt = cart.map(item =>
    `${item.name} - ¢${item.price} × ${item.quantity}\nImage: ${item.image}`
  ).join('\n\n');

  const fullUrl = `${baseUrl}&${orderSummaryField}=${encodeURIComponent(receipt)}`;
  window.location.href = fullUrl;
}

// Automatically Show Cart Count on Page Load
document.addEventListener('DOMContentLoaded', function () {
  const savedCart = getCartFromCookie();
  const totalItems = savedCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById('cart-count');

  if (cartCount) {
    cartCount.textContent = totalItems;
  }
});

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('cartModal');
  if (event.target === modal) {
    closeCart();
  }
});

// Optional: Fix rendering on iOS with MutationObserver
const cartItems = document.getElementById('cart-items');
if (cartItems) {
  const observer = new MutationObserver(() => {
    cartItems.style.display = 'flex';
    cartItems.style.flexDirection = 'column';
    cartItems.style.overflowY = 'auto';
  });

  observer.observe(cartItems, { childList: true, subtree: true });
}
