// ======================
// Modal Control Functions
// ======================
function openUserAccount() {
  document.getElementById('accountModal').style.display = 'block';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
}

function closeModal() {
  document.getElementById('accountModal').style.display = 'none';
}

function showSignup() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
}

function showLogin() {
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

// ======================
// Event Listeners
// ======================
document.addEventListener('DOMContentLoaded', function() {
  // User icon click handler
  const userIcon = document.querySelector('.user-icon');
  if (userIcon) {
    userIcon.addEventListener('click', openUserAccount);
  }

  // Login form submission
  const loginForm = document.getElementById('login');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      await authenticateUser(email, password);
    });
  }

  // Signup form submission
  const signupForm = document.getElementById('signup');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirm').value;

      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

      await registerUser(name, email, password);
    });
  }

  // Close modal when clicking outside
  const accountModal = document.getElementById('accountModal');
  window.addEventListener('click', (event) => {
    if (accountModal && event.target === accountModal) {
      closeModal();
    }
  });
});
// ======================
// API Functions
// ======================
async function authenticateUser(email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    if (data.success) {
      alert("Login successful!");
      localStorage.setItem('user', JSON.stringify(data.user));
      closeModal();
      updateUserUI(data.user); // Optional: Update UI after login
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert("Login failed. Please try again.");
  }
}

async function registerUser(name, email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    if (data.success) {
      alert("Registration successful! Please login.");
      showLogin();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert("Registration failed. Please try again.");
  }
}

// ======================
// Optional Helper Functions
// ======================
function updateUserUI(user) {
  // Example: Update UI after login
  const userIcon = document.querySelector('.user-icon');
  userIcon.innerHTML = `<i class="fas fa-user-check"></i> ${user.name}`;
}