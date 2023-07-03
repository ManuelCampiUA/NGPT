let pendingRequest = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register').addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingRequest)
            register();
    });
});

async function register() {
    try {
        pendingRequest = true;
        const formData = new FormData(document.getElementById("register"));
        const response = await fetch('register', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result['response']);
        if (result['response'] === 'Success')
            window.location.assign("login");
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pendingRequest = false;
    }
}