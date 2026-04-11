const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});


// ================= REGISTER =================
function registerUser() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    fetch("/api/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: username, email, password })
    })
    .then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || data.message || "Server error");
    }
    return data;
})
    .then(data => {
        console.log("Response from backend:", data);
        alert("Registered successfully!");

        // optional: switch to login view
        container.classList.remove('active');
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Registration failed: " + err.message);
    });
}


// ================= LOGIN =================
function loginUser() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    fetch("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(async res => {
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error);
        }
        return res.json();
    })
    .then(data => {
        // ✅ CORRECT place
        localStorage.setItem("userId", data.userId);
  

        console.log("Logged in user:", data);

        alert("Login successful!");

        window.location.href = "/";
    })
    .catch(err => {
        console.error(err);
        alert("Login failed: " + err.message);
    });
}