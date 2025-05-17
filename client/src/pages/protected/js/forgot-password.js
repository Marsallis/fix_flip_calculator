document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');
    const emailInput = document.getElementById('email');
    const submitButton = document.querySelector('.login-button');

    // Form validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
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

    const showSuccess = (message) => {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        resetForm.insertBefore(successDiv, resetForm.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    };

    // Handle form submission
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearError(emailInput);

        // Validate email
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            return;
        }
        
        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email');
            return;
        }

        setLoading(submitButton, true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailInput.value.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset link');
            }

            showSuccess('Password reset link has been sent to your email');
            resetForm.reset();
        } catch (error) {
            showError(emailInput, error.message);
        } finally {
            setLoading(submitButton, false);
        }
    });

    // Input event listener for real-time validation
    emailInput.addEventListener('input', () => {
        clearError(emailInput);
    });
}); 