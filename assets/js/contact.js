document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const fullName = document.getElementByName("fullname").value.trim();
    const email = document.getElementByName("email").value.trim();
    const phone = document.getElementByName("phone").value.trim();
    const message = document.getElementByName("message").value.trim();

    // Validate input
    if (!fullName || !email || !phone || !message) {
        showToast("⚠️ Please fill in all fields!", "red");
        return;
    }

    try {
        // Send data to backend
        let response = await fetch("http://localhost:5000/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, phone, message }),
        });

        let result = await response.json();

        if (response.ok) {
            showToast("✅ Message sent successfully!", "green");
            document.getElementById("contactForm").reset(); // Reset form
        } else {
            showToast("❌ " + result.error, "red");
        }
    } catch (error) {
        console.error("Error:", error);
        showToast("❌ Failed to send message. Try again!", "red");
    }
});

function showToast(message, color) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.background = color;
    toast.style.color = "white";
    toast.style.padding = "10px";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.borderRadius = "5px";
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 3000);
}