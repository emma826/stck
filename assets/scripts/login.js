const login_button = document.getElementById("login")
const success = document.getElementById("success")
const error = document.getElementById("error")

register_button.addEventListener("click", async () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value


    await fetch('/auth/register', {
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