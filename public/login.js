const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const loginDetails = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {

        const response = await axios.post(
            'http://localhost:3000/user/login',
            loginDetails
        );

        document.getElementById('message').innerText =
            response.data.message;

            window.location.href = '/expense';

    } catch (err) {

        if (err.response.status === 404) {

            document.getElementById('message').innerText =
                'User not found';

        } else if (err.response.status === 401) {

            document.getElementById('message').innerText =
                'Password is incorrect';

        } else {

            document.getElementById('message').innerText =
                'Login failed';
        }
    }
});