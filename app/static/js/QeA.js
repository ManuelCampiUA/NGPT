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
            if (response.status === 400) {
                const result = await response.json();
                throw new Error(result['response']);
            }
            if (!response.ok) {
                throw new Error("Error");
            }
            const result = await response.json();
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
        alert(error.message);
    } finally {
        pendingQeARequest = false;
    }
}
