// Get references to elements
const userIcon = document.getElementById('user-icon');
const loginModal = document.getElementById('login-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const loginForm = document.getElementById('login-form');

// Show the modal when the user icon is clicked
userIcon.addEventListener('click', () => {
    loginModal.style.display = 'flex'; // Use 'flex' to center the modal content
});

// Hide the modal when the close button is clicked
closeModalBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Hide the modal if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Handle the login form submission
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    // In a real application, you would validate credentials here.
    // For this example, we'll assume a successful login.
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        console.log('Login successful! Redirecting...');
        // Simulate successful login
        // Instead of alert, you might show a temporary success message in the UI
        // For now, directly redirect as per previous instructions
        setTimeout(() => {
            window.location.href = 'home.html'; // Redirect to the home page
        }, 500);
    } else {
        // Instead of alert, show a message box or inline error
        console.error('Please enter both username and password.');
        // You could add a div in the modal to display this message
    }
});
