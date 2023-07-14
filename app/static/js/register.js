let pendingRequest = false;
const registerForm = document.getElementById('register');
const registerUsername = registerForm.elements['username'];
const registerPassword = registerForm.elements['password'];

document.addEventListener('DOMContentLoaded', () => {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingRequest)
            register();
    });
});

async function register() {
    try {
        pendingRequest = true;
        registerUsername.value = registerUsername.value.trim();
        registerPassword.value = registerPassword.value.trim();
        const formData = new FormData(registerForm);
        const response = await fetch('register', {
            method: 'POST',
            body: formData
        });
        if (response.status === 400) {
            const result = await response.json();
            throw new Error(result['response']);
        }
        if (!response.ok) {
            throw new Error("Error");
        }
        window.location.assign('login');
    } catch (error) {
        console.error("There has been a problem with your register operation:", error);
        alert(error.message);
    } finally {
        pendingRequest = false;
    }
}
