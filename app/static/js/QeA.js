let pendingQeARequest = false;
let firstQuestion = false;

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
        if (question) {
            const formData = new FormData(form);
            const response = await fetch('QeA', {
                method: 'POST',
                body: formData
            });
            if (!response.ok)
                throw new Error("Network response was not OK");
            const result = await response.json();
            if (result['response'] === false) {
                alert("No file uploaded");
                throw new Error("No file uploaded");
            }
            const div = document.getElementById('QeA');
            const paragraphQuestion = document.createElement('p');
            const paragraphResponse = document.createElement('p');
            paragraphQuestion.appendChild(document.createTextNode(question));
            if (!firstQuestion) {
                div.style.display = "block";
                firstQuestion = true;
            }
            div.appendChild(paragraphQuestion);
            form.reset();
            paragraphResponse.appendChild(document.createTextNode(result['response']));
            div.appendChild(paragraphResponse);
        }
    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
    } finally {
        pendingQeARequest = false;
    }
}
