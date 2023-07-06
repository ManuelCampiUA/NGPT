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
        const formData = new FormData(document.getElementById('register'));
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