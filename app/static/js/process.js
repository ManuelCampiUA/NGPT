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
        if (!response.ok)
            throw new Error("Network response was not OK");
        const result = await response.json();
        alert(result['response']);
    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
    } finally {
        pendingProcessRequest = false;
    }
}
