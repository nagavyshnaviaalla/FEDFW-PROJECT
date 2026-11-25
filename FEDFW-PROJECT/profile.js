let currentUser = JSON.parse(localStorage.getItem("freshUser"));

if (!currentUser) {
    alert("Please login first!");
    window.location.href = "login.html";
} else {

    document.getElementById("displayName").textContent = currentUser.name;
    document.getElementById("displayEmail").textContent = currentUser.email;

    document.getElementById("avatar").textContent =
        currentUser.name.charAt(0).toUpperCase();

    document.getElementById("name").value = currentUser.name || "";
    document.getElementById("email").value = currentUser.email || "";
    document.getElementById("phone").value = currentUser.phone || "";
    document.getElementById("city").value = currentUser.city || "";
    document.getElementById("address").value = currentUser.address || "";
    document.getElementById("pincode").value = currentUser.pincode || ""; 
}

document.getElementById("profileForm").addEventListener("submit", function(e) {
    e.preventDefault();

    if (!currentUser) return;

    currentUser.name = document.getElementById("name").value.trim();
    currentUser.phone = document.getElementById("phone").value.trim();
    currentUser.city = document.getElementById("city").value.trim();
    currentUser.address = document.getElementById("address").value.trim();
    currentUser.pincode = document.getElementById("pincode").value.trim();

    let users = JSON.parse(localStorage.getItem("freshUsers")) || [];

    const index = users.findIndex(u => u.email === currentUser.email);

    if (index !== -1) {
        users[index] = currentUser;
    }

    localStorage.setItem("freshUsers", JSON.stringify(users));
    localStorage.setItem("freshUser", JSON.stringify(currentUser));

    document.getElementById("displayName").textContent = currentUser.name;
    document.getElementById("avatar").textContent =
        currentUser.name.charAt(0).toUpperCase();

    document.getElementById("message").style.color = "green";
    document.getElementById("message").textContent =
        "Profile updated successfully!";
});

document.getElementById("logoutBtn").addEventListener("click", function(e) {
    e.preventDefault();

    localStorage.removeItem("freshUser");

    alert("You have logged out successfully!");
    window.location.href = "login.html";
});
