
document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("message");

        let users = JSON.parse(localStorage.getItem("freshUsers") || "[]");

        const loggedUser = users.find(function (user) {
            return (user.email || "").trim().toLowerCase() === email &&
                   user.password === password;
        });

        if (loggedUser) {

            localStorage.setItem("freshUser", JSON.stringify(loggedUser));
            localStorage.setItem("freshCartUser", JSON.stringify(loggedUser));

            message.style.color = "green";
            message.textContent = "Login successful! Opening FreshCart...";

            setTimeout(function () {
                window.location.assign("./products.html");
            }, 1000);

        } else {

            message.style.color = "red";
            message.textContent = "Invalid email or password!";

        }
    });

});
