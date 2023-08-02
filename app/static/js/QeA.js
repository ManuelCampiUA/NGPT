let pendingQeARequest = false;
let firstQuestion = false;
const QeAForm = document.getElementById("question");
const QeAQuestion = QeAForm.elements["question"];
const QeADiv = document.getElementById("QeA");

async function QeA() {
    try {
        pendingQeARequest = true;
        const question = QeAQuestion.value.trim();
        QeAQuestion.value = question;
        if (question) {
            const formData = new FormData(QeAForm);
            const response = await axios.post("QeA", formData);
            const result = response.data["response"];
            const paragraphQuestion = document.createElement("p");
            const paragraphResponse = document.createElement("p");
            paragraphQuestion.appendChild(document.createTextNode(question));
            if (!firstQuestion) {
                QeADiv.style.display = "block";
                firstQuestion = true;
            }
            QeADiv.appendChild(paragraphQuestion);
            QeAForm.reset();
            paragraphResponse.appendChild(document.createTextNode(result));
            QeADiv.appendChild(paragraphResponse);
            QeAForm.scrollIntoView({ behavior: "smooth" });
        }
    } catch (error) {
        console.error("There has been a problem with your Q&A operation:", error.message);
        if (error.response) {
            errorAlert(error.response.data["response"]);
            return;
        }
        errorAlert("Error");
    } finally {
        pendingQeARequest = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    QeAForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!pendingQeARequest)
            QeA();
    });
});
