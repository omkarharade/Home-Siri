document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const showLoginBtn = document.getElementById('show-login');
    const showRegisterBtn = document.getElementById('show-register');
    const showAdminBtn = document.querySelector('.fixed-anchor');
    const showUserBtn = document.getElementById('show-user');
    const registrationSection = document.getElementById('registration-section');
    const loginSection = document.getElementById('login-section');
    const adminSection = document.getElementById('admin-section');

    showLoginBtn.addEventListener('click', () => {
        registrationSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    showRegisterBtn.addEventListener('click', () => {
        registrationSection.style.display = 'block';
        loginSection.style.display = 'none';
    });

    showAdminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        adminSection.style.display = 'block';
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
    });

    showUserBtn.addEventListener('click', () => {
        adminSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    registerBtn.addEventListener('click', () => {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();

        if (!name || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        })
        .then(response => {
            console.log('Register response:', response);
            if (!response.ok) throw new Error('Registration failed.');
            return response.text();
        })
        .then(data => {
            console.log('Register data:', data);
            alert('Registration successful!');
            window.location.href = 'Home.html';  // Redirect to Home.html
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Registration failed. Please try again.');
        });
    });

    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            console.log('Login response:', response);
            if (!response.ok) throw new Error('Login failed.');
            return response.text();
        })
        .then(data => {
            console.log('Login data:', data);
            if (data === "Login successful") {
                window.location.href = 'Home.html';  // Redirect to Home.html
            } else {
                alert(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
    });

    adminLoginBtn.addEventListener('click', () => {
        const adminEmail = document.getElementById('admin-email').value.trim();
        const adminPassword = document.getElementById('admin-password').value.trim();

        if (!adminEmail || !adminPassword) {
            alert('Please enter both email and password for admin login.');
            return;
        }

        fetch('http://localhost:3000/admin-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminEmail, adminPassword }),
        })
        .then(response => {
            console.log('Admin login response:', response);
            if (!response.ok) throw new Error('Admin login failed.');
            return response.text();
        })
        .then(data => {
            console.log('Admin login data:', data);
            if (data === "Admin login successful") {
                window.location.href = 'Home.html';  // Redirect to Home.html
            } else {
                alert(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Admin login failed. Please try again.');
        });
    });
});
