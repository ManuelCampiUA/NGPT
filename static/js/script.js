document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('upload').addEventListener('submit', (event) => {
        event.preventDefault();
        upload(file_preparation());
    });
    document.getElementById('question').addEventListener('submit', (event) => {
        event.preventDefault();
        QeA();
    });
});

function file_preparation() {
    const PDFs = document.querySelector('input[type="file"][multiple]');
    const formData = new FormData();
    for (const [i, PDF] of Array.from(PDFs.files).entries()) {
        formData.append(`file_${i}`, PDF);
    }
    return formData;
}

async function upload(formData) {
    try {
        const response = await fetch("upload", {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        alert(result['response']);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function QeA() {
    try {
        let question = document.getElementsByName('question')[0].value;
        const response = await fetch('QeA', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });
        const result = await response.json();
        document.getElementById('response').textContent = result['response'];
    } catch (error) {
        console.error("Error:", error);
    }
}
