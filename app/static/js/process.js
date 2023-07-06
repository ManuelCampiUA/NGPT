let pendingProcessRequest = false;
const processForm = document.getElementById('process');

document.addEventListener('DOMContentLoaded', () => {
    processForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingProcessRequest)
            process();
    });
});

async function process() {
    try {
        pendingProcessRequest = true;
        const response = await fetch('process');
        if (!response.ok)
            throw new Error("Network response was not OK");
        const result = await response.json();
        alert(result['response']);
    } catch (error) {
        console.error("There has been a problem with your process operation:", error);
    } finally {
        pendingProcessRequest = false;
    }
}
