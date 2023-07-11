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
        if (!response.ok)
            throw new Error("Network response was not OK");
        const result = await response.json();
        if (result['response'] === 'Success') {
            window.location.assign('login');
            return;
        }
        alert(result['response']);
    } catch (error) {
        console.error("There has been a problem with your register operation:", error);
    } finally {
        pendingRequest = false;
    }
}
