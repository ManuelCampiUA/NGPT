let pendingRequest = false;
let fileUploaded = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('upload').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!pendingRequest)
            await upload(file_preparation());
        if (fileUploaded) {
            setTimeout(() => { loading_file_list(get_file_list()) }, 1000);
            fileUploaded = false;
        }
    });
    document.getElementById('process').addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingRequest)
            process();
    });
    document.getElementById('question').addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingRequest)
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
        pendingRequest = true;
        const response = await fetch('upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result['response']);
        if (result['response'] == 'No selected file')
            throw 'No selected file';
        if (result['response'] == 'Error')
            throw 'Error';
        fileUploaded = true;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pendingRequest = false;
    }
}

async function get_file_list() {
    try {
        const response = await fetch('get_file_list');
        const result = await response.json();
        return result['response'];
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loading_file_list(result) {
    files = await result;
    if (files.length === 0)
        return;
    const file_list = document.getElementById('file_list');
    while (file_list.firstChild)
        file_list.removeChild(file_list.firstChild);
    files.forEach(file => {
        const item = document.createElement('li');
        item.appendChild(document.createTextNode(file));
        file_list.appendChild(item);
    })
}

async function process() {
    try {
        const response = await fetch('process');
        const result = await response.json();
        alert(result['response']);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function QeA() {
    try {
        pendingRequest = true;
        const form = document.getElementById('question');
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
        const question = form.elements['question'];
        const paragraphQuestion = document.createElement('p');
        paragraphQuestion.appendChild(document.createTextNode(question.value));
        div.appendChild(paragraphQuestion);
        form.reset();
        const paragraphResponse = document.createElement('p');
        paragraphResponse.appendChild(document.createTextNode(result['response']));
        div.appendChild(paragraphResponse);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pendingRequest = false;
    }
}
