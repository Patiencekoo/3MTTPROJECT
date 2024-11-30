document.addEventListener('DOMContentLoaded', () => {
  // Grab elements inside DOMContentLoaded to ensure DOM is fully loaded
  const fullName = document.getElementById('fullName');
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const emailField = document.getElementById('loginEmail');
  const passwordField = document.getElementById('loginPassword');
  
  // Function to switch tabs between login and signup
  function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');

    // Remove 'active' class from all tabs and add it to the clicked tab
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Show or hide the appropriate form based


    // Show or hide the appropriate form based on the clicked tab
    if (tab === 'login') {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
    } else {
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
    }
  }

  // Attach event listeners to the tabs for switching
  const loginTab = document.querySelector('.tab[data-tab="login"]');
  const signupTab = document.querySelector('.tab[data-tab="signup"]');

  loginTab.addEventListener('click', () => switchTab('login'));
  signupTab.addEventListener('click', () => switchTab('signup'));

  // Initial state: Show the login form by default
  switchTab('login');

  // Handle registration form submission
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent default form submission behavior

    // Get the input values
    const fullNameValue = fullName.value.trim();
    const emailValue = signupEmail.value.trim();
    const passwordValue = signupPassword.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    // Validate input fields
    if (!fullNameValue || !emailValue || !passwordValue || !confirmPasswordValue) {
      alert('Please fill in all fields.');
      return;
    }

    // Check if passwords match
    if (passwordValue !== confirmPasswordValue) {
      alert('Passwords do not match!');
      return;
    }

    // Prepare the payload for the registration API request
    const registerData = {
      username: fullNameValue,  // Use fullName for username
      email: emailValue,
      password: passwordValue,
    };

    // Make the POST request to the registration API
    fetch('http://localhost:7000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
      credentials: 'include',  // Include cookies with the request
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // Log the status and text for better debugging
          return response.text().then((text) => {
            throw new Error(`Registration failed: ${response.status} ${text}`);
          });
        }
      })
      .then((data) => {
        console.log('Registration successful:', data);
        alert('Registration successful');
        window.location.href = 'login.html'; // Redirect to login page
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`There was an error registering you: ${error.message}`);
      });
  });

  // Handle login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent form from submitting and reloading the page

    const email = emailField.value.trim();
    const password = passwordField.value.trim();

    if (!email || !password) {
      alert('Please fill in both email and password.');
      return;
    }

    const loginData = { email, password };

    // Send POST request to the backend login API
    fetch('http://localhost:7000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
      credentials: 'include',  // Include cookies with the request
    })
      .then((response) => {
        if (response.ok) {
          return response.json();  // Parse the response as JSON if it's successful
        }
        throw new Error('Invalid login credentials');
      })
      .then((data) => {
        // Successful login response
        console.log('Login successful', data);
        alert('Login successful!');
        
        // Save the JWT token in localStorage or cookies if needed
        localStorage.setItem('token', data.token);

        // Redirect user to the task dashboard or main page after login
        window.location.href = 'task.html';  // Adjust the URL as needed
      })
      .catch((error) => {
        // Handle login errors
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      });
  });
});
