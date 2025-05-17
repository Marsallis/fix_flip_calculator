document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const googleButton = document.querySelector('.google-button');
    const submitButton = document.querySelector('.login-button');

    // Password requirements
    const requirements = {
        length: { regex: /.{8,}/, element: document.getElementById('length') },
        uppercase: { regex: /[A-Z]/, element: document.getElementById('uppercase') },
        lowercase: { regex: /[a-z]/, element: document.getElementById('lowercase') },
        number: { regex: /[0-9]/, element: document.getElementById('number') },
        special: { regex: /[!@#$%^&*]/, element: document.getElementById('special') }
    };

    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            button.classList.toggle('fa-eye');
            button.classList.toggle('fa-eye-slash');
        });
    });

    // Form validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        let isValid = true;
        for (const [key, requirement] of Object.entries(requirements)) {
            const meetsRequirement = requirement.regex.test(password);
            requirement.element.classList.toggle('valid', meetsRequirement);
            if (!meetsRequirement) isValid = false;
        }
        return isValid;
    };

    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const inputGroup = input.closest('.input-group');
        inputGroup.classList.add('error');
        
        let errorDiv = formGroup.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            formGroup.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    };

    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        const inputGroup = input.closest('.input-group');
        inputGroup.classList.remove('error');
        
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    };

    const setLoading = (button, isLoading) => {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    };

    // Handle form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearError(emailInput);
        clearError(passwordInput);
        clearError(confirmPasswordInput);

        // Validate inputs
        let isValid = true;
        
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        }

        if (!passwordInput.value) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, 'Password does not meet requirements');
            isValid = false;
        }

        if (!confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'Please confirm your password');
            isValid = false;
        } else if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'Passwords do not match');
            isValid = false;
        }

        if (!isValid) return;

        setLoading(submitButton, true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Store the token
            localStorage.setItem('token', data.token);

            // Redirect to dashboard or home page
            window.location.href = '/index.html';
        } catch (error) {
            showError(emailInput, error.message);
        } finally {
            setLoading(submitButton, false);
        }
    });

    // Handle Google Sign-up
    googleButton.addEventListener('click', async () => {
        setLoading(googleButton, true);
        try {
            window.location.href = 'http://localhost:3000/api/auth/google';
        } catch (error) {
            showError(emailInput, 'Failed to initiate Google sign-up');
            setLoading(googleButton, false);
        }
    });

    // Real-time password validation
    passwordInput.addEventListener('input', () => {
        clearError(passwordInput);
        validatePassword(passwordInput.value);
    });

    // Real-time email validation
    emailInput.addEventListener('input', () => {
        clearError(emailInput);
    });

    // Real-time password confirmation validation
    confirmPasswordInput.addEventListener('input', () => {
        clearError(confirmPasswordInput);
        if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'Passwords do not match');
        }
    });
}); 