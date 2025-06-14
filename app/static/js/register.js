let pendingRequest = false;
const registerForm = document.getElementById('register');
const registerUsername = registerForm.elements['username'];
const registerPassword = registerForm.elements['password'];

const register = async () => {
    try {
        pendingRequest = true;
        registerUsername.value = registerUsername.value.trim();
        registerPassword.value = registerPassword.value.trim();
        const formData = new FormData(registerForm);
        await axios.post('register', formData);
        window.location.assign('login');
    } catch (error) {
        console.error(
            'There has been a problem with your register operation:',
            error.message
        );
        if (error.response) {
            errorAlert(error.response.data['response']);
            return;
        }
        errorAlert('Error');
    } finally {
        pendingRequest = false;
    }
};

document.addEventListener('DOMContentLoaded', () =>
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingRequest) register();
    })
);
