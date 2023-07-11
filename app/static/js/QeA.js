let pendingQeARequest = false;
let firstQuestion = false;
const QeAForm = document.getElementById('question');
const QeAQuestion = QeAForm.elements['question'];
const QeADiv = document.getElementById('QeA');

document.addEventListener('DOMContentLoaded', () => {
    QeAForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingQeARequest)
            QeA();
    });
});

async function QeA() {
    try {
        pendingQeARequest = true;
        const question = QeAQuestion.value.trim();
        QeAQuestion.value = question;
        if (question) {
            const formData = new FormData(QeAForm);
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
            const paragraphQuestion = document.createElement('p');
            const paragraphResponse = document.createElement('p');
            paragraphQuestion.appendChild(document.createTextNode(question));
            if (!firstQuestion) {
                QeADiv.style.display = "block";
                firstQuestion = true;
            }
            QeADiv.appendChild(paragraphQuestion);
            QeAForm.reset();
            paragraphResponse.appendChild(document.createTextNode(result['response']));
            QeADiv.appendChild(paragraphResponse);
        }
    } catch (error) {
        console.error("There has been a problem with your Q&A operation:", error);
    } finally {
        pendingQeARequest = false;
    }
}
