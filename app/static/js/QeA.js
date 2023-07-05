let pendingQeARequest = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('question').addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingQeARequest)
            QeA();
    });
});

async function QeA() {
    try {
        pendingQeARequest = true;
        const form = document.getElementById('question');
        const question = form.elements['question'].value;
        const formData = new FormData(form);
        const response = await fetch('QeA', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result['response'] === false) {
            alert("No file uploaded");
            throw "No file uploaded";
        }
        const div = document.getElementById('QeA');
        const paragraphQuestion = document.createElement('p');
        const paragraphResponse = document.createElement('p');
        paragraphQuestion.appendChild(document.createTextNode(question));
        div.appendChild(paragraphQuestion);
        form.reset();
        paragraphResponse.appendChild(document.createTextNode(result['response']));
        div.appendChild(paragraphResponse);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pendingQeARequest = false;
    }
}
