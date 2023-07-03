let pending_request = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login').addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pending_request)
            login();
    });
});

async function login() {
    try {
        pending_request = true;
        const formData = new FormData(document.getElementById("login"));
        const response = await fetch('login', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result['response']);
        if (result['response'] === 'Success')
            window.location.assign("test");
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pending_request = false;
    }
}