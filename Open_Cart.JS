// Add item to Cart
let cart = [];

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

// Update cart UI
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  cartItemsContainer.innerHTML = '';

  let total = 0;

  cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
          <img src="${item.image}" alt="${item.name}" style="width: 30px; height: 30px; object-fit: cover; margin-right: 10px; border-radius: 5px;">
          <div>
              <h3 style="margin: 0; font-size: 16px;">${item.name}</h3>
              <p style="margin: 5px 0; font-size: 14px;">¢${item.price} × ${item.quantity}</p>
              <button onclick="removeFromCart('${item.name}')" style="padding: 5px 10px; background-color: red; color: white; border: none; border-radius: 3px; cursor: pointer;">Remove</button>
          </div>
      `;
      cartItemsContainer.appendChild(itemElement);

        total += item.price * item.quantity;
    });
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = totalItems;
  
  // Update cart modal content
  const cartItemsElement = document.getElementById('cart-items');
  cartItemsElement.innerHTML = '';
  
  let totalPrice = 0;
  
  cart.forEach(item => {
    totalPrice += item.price * item.quantity;
     
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.style.display = 'flex'; // Ensure items are displayed in a row
    itemElement.style.alignItems = 'center'; // Align image and text vertically
    itemElement.style.marginBottom = '10px'; // Add spacing between items
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width:100px; height: 100px; object-fit: cover; margin-right: 10px; border-radius: 5px;">
      <div>
        <h3 style="margin: 0; font-size: 16px;">${item.name}</h3>
        <p style="margin: 5px 0; font-size: 14px;">¢${item.price} × ${item.quantity}</p>
        <button onclick="removeFromCart('${item.name}')" style="padding: 5px 10px; background-color: red; color: white; border: none; border-radius: 3px; cursor: pointer;">Remove</button>
      </div>
    `;
    cartItemsElement.appendChild(itemElement);
  });
  
  document.getElementById('cart-total').textContent = `Total: ¢${totalPrice}`;
}

// Remove item from cart
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
}

// Open cart modal
function openCart() {
  updateCartUI(); // Refresh cart contents
  document.getElementById('cartModal').style.display = 'block';
}

// Close cart modal
function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

// Visual feedback when item is added
function showAddedToCartFeedback() {
  const feedback = document.createElement('div');
  feedback.textContent = 'Item added to cart!';
  feedback.style.position = 'fixed';
  feedback.style.top = '20px';
  feedback.style.left = '50%';
  feedback.style.transform = 'translateX(-50%)';
  feedback.style.backgroundColor = ' #0aa5e2';
  feedback.style.color = 'white';
  feedback.style.padding = '10px 20px';
  feedback.style.borderRadius = '5px';
  feedback.style.zIndex = '1000';
  
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.5s';
    setTimeout(() => feedback.remove(), 500);
  }, 2000);
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('cartModal');
  if (event.target === modal) {
    closeCart();
  }
}
function goToCheckout() {
  const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd2LZUs_mQmi13tnp7_Amraw8uZohWYO1K1ACDvQ3efCzWU3w/viewform?usp=header"; // replace with your actual form link
  const orderSummaryField = "entry.1607547187"; // replace with your actual field name
  // Build a detailed receipt
  const receipt = cart.map(item =>
    `${item.name} - ¢${item.price} × ${item.quantity}\nImage: ${item.image}`
  ).join('\n\n'); // double line break between items for clarity

  const fullUrl = `${baseUrl}&${orderSummaryField}=${encodeURIComponent(receipt)}`;
  window.location.href = fullUrl;
}
