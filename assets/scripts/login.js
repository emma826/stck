const login_button = document.getElementById("login_button")
const success = document.getElementById("success")
const error = document.getElementById("error")

login_button.addEventListener("click", async () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value


    await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                success.style.display = "block"
                error.style.display = "none"

                success.innerHTML = "Registration successful"
                window.location = "/"
            }
            else{
                error.style.display = "block"
                success.style.display = "none"

                error.innerHTML = data.message

                setTimeout(() => {
                    error.style.display = "none"
                }, 3000);
            }
        })
        .catch(err => console.error(err))
})