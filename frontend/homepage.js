// Get references to elements from the index.html
const userIcon = document.getElementById('user-icon');
const loginModal = document.getElementById('login-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const loginForm = document.getElementById('login-form');

// Event listener to show the login modal when the user icon is clicked
userIcon.addEventListener('click', () => {
    loginModal.classList.add('modal--active'); // Add the active class to show and center the modal
});

// Event listener to hide the login modal when the close button is clicked
closeModalBtn.addEventListener('click', () => {
    loginModal.classList.remove('modal--active'); // Remove the active class to hide the modal
});

// Event listener to hide the modal if the user clicks outside of its content
window.addEventListener('click', (event) => {
    if (event.target === loginModal) { // Check if the click was directly on the modal background
        loginModal.classList.remove('modal--active'); // Hide the modal
    }
});

// Event listener for the login form submission within the modal
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission (which would reload the page)

    // Retrieve username and password (for demonstration purposes only)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // --- Simulated Login Logic ---
    if (username && password) {
        console.log('Login successful! Redirecting to home.html...');
        // Simulate a short delay before redirection
        setTimeout(() => {
            window.location.href = 'home.html'; // Redirect to the home page after successful login
        }, 500); // 500 milliseconds delay
    } else {
        // If credentials are empty, log an error. In a real app, you'd show an error message in the UI.
        console.error('Login failed: Please enter both username and password.');
        // You could add a small message element inside the modal to display this error to the user
    }
});
