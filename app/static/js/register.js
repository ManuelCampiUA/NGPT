let pending_request = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register').addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pending_request)
            register();
    });
});

async function register() {
    try {
        pending_request = true;
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
        pending_request = false;
    }
}