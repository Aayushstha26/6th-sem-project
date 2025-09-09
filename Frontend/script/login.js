const form = document.getElementById("loginForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email);
  try {
    const res = await fetch("http://localhost:4000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login successful!");
      console.log("Access Token:", data.accessToken);
      const decoded = parseJwt(data.accessToken);
      console.log("Decoded Token:", decoded);

      // Example: access user's name
      console.log("User Name:", decoded.username);
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
});
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}
