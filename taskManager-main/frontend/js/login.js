// Grab the form, input fields, and button
const loginForm = document.getElementById('login-form');
const emailField = document.getElementById('loginEmail');
const passwordField = document.getElementById('loginPassword');

// Event listener for form submission
loginForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent form from submitting and reloading the page

  // Get values from the form
  const email = emailField.value.trim();
  const password = passwordField.value.trim();

  // Validate input fields
  if (!email || !password) {
    alert('Please fill in both email and password.');
    return;
  }

  // Prepare the data to be sent in the request body
  const loginData = { email, password };

  // Send POST request to the backend login API
  fetch('http://localhost:7000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
    credentials: 'include', // Include cookies with the request
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the response as JSON if it's successful
      }
      throw new Error('Invalid login credentials'); // If not successful, throw error
    })
    .then((data) => {
      // Successful login response
      console.log('Login successful', data);
      alert('Login successful!');

      // Save the JWT token in localStorage (or cookies if needed)
      localStorage.setItem('token', data.token);

      // Redirect user to the task dashboard or main page after login
      window.location.href = 'task.html'; // Adjust the URL as needed
    })
    .catch((error) => {
      // Handle login errors
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    });
});
