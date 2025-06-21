const form = document.getElementById("loginForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email);
  try {
    const res = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login successful!");
      console.log("Access Token:", data.accessToken);
      // Save token to localStorage or cookie if needed
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
});
