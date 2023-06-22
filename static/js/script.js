function QeA(event) {
    event.preventDefault();
    let question = document.getElementsByName('question')[0].value;
    fetch('QeA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question })
    })
        .then(response => response.json())
        .then(data => { document.getElementById('response').textContent = data.response })
} // Da mettere a posto

function upload(event) {
    event.preventDefault();
    const PDFs = document.querySelector('input[type="file"][multiple]');
    const formData = new FormData();
    for (const [i, PDF] of Array.from(PDFs.files).entries()) {
        formData.append(`file_${i}`, PDF);
    }
    uploadMultiple(formData);
}

async function uploadMultiple(formData) {
    try {
        const response = await fetch("upload", {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        console.log("Success:", result["response"]);
    } catch (error) {
        console.error("Error:", error);
    }
}
