let pendingRequest = false;
const loginForm = document.getElementById('login');
const loginUsername = loginForm.elements['username'];
const loginPassword = loginForm.elements['password'];

document.addEventListener('DOMContentLoaded', () => {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingRequest)
            login();
    });
});

async function login() {
    try {
        pendingRequest = true;
        loginUsername.value = loginUsername.value.trim();
        loginPassword.value = loginPassword.value.trim();
        const formData = new FormData(loginForm);
        const response = await fetch('login', {
            method: 'POST',
            body: formData
        });
        if (response.status === 401) {
            const result = await response.json();
            throw new Error(result['response']);
        }
        if (!response.ok) {
            throw new Error("Error");
        }
        window.location.assign('../');
    } catch (error) {
        console.error("There has been a problem with your login operation:", error);
        alert(error.message);
    } finally {
        pendingRequest = false;
    }
}
