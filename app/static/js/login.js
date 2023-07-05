let pendingRequest = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login').addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingRequest)
            login();
    });
});

async function login() {
    try {
        pendingRequest = true;
        const formData = new FormData(document.getElementById("login"));
        const response = await fetch('login', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result['response'] === 'Success') {
            window.location.assign("../");
            return;
        }
        alert(result['response']);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pendingRequest = false;
    }
}