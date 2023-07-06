let pendingRequest = false;
const loginForm = document.getElementById('login');

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
        const formData = new FormData(loginForm);
        const response = await fetch('login', {
            method: 'POST',
            body: formData
        });
        if (!response.ok)
            throw new Error("Network response was not OK");
        const result = await response.json();
        if (result['response'] === 'Success') {
            window.location.assign('../');
            return;
        }
        alert(result['response']);
    } catch (error) {
        console.error("There has been a problem with your login operation:", error);
    } finally {
        pendingRequest = false;
    }
}
