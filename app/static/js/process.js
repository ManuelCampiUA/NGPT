let pendingProcessRequest = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('process').addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingProcessRequest)
            process();
    });
});

async function process() {
    try {
        pendingProcessRequest = true;
        const response = await fetch('process');
        const result = await response.json();
        alert(result['response']);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pendingProcessRequest = false;
    }
}
