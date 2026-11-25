document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const newUser = {
        name: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim().toLowerCase(),
        phone: document.getElementById("phone").value.trim(),
        password: document.getElementById("password").value,
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        pincode: document.getElementById("pincode").value.trim()
    };

    let users = JSON.parse(localStorage.getItem("freshUsers")) || [];

    const exists = users.some(user => user.email === newUser.email);

    const message = document.getElementById("message");

    if (exists) {
        message.style.color = "red";
        message.textContent = "This email is already registered!";
        return;
    }

    users.push(newUser);
    localStorage.setItem("freshUsers", JSON.stringify(users));

    message.style.color = "green";
    message.textContent = "Registration successful! Redirecting to login...";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1200);
});
