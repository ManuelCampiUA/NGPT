const textarea = document.getElementById('myTextarea');

textarea.addEventListener('input', function () {
    this.style.height = 'auto'; // Ripristina l'altezza predefinita
    this.style.height = this.scrollHeight + 'px'; // Imposta l'altezza in base al contenuto
});