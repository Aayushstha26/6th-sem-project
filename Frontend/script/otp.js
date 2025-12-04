document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken");
    const emailSpan = document.getElementById("email");
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    if(emailSpan && email) {
        emailSpan.textContent = email;
    }
  // if (!token) {
  //   showtoast("Please login to verify OTP.");
  //   return;
  // }
  try {
    const response = await fetch("http://localhost:4000/auth/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: email }),
      
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      showToast("OTP sent successfully to your email.");
    } else {
        showToast(data.message || "Failed to send OTP.");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
  const inputs = document.querySelectorAll(".otp-input");
  inputs[0].focus();
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length > 1) {
        input.value = input.value.slice(0, 1);
      }

      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });

  const verifyBtn = document.getElementById("verifyBtn");
  verifyBtn.addEventListener("click", async () => {
    console.log("Verify button clicked");
    const otp = Array.from(inputs)
      .map((input) => input.value)
      .join("");
    if (otp.length < 6) {
      showToast("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email,otp }),
      });
      const data = await response.json();
      if (response.ok) {
        showToast("OTP verified successfully!");
        inputs.forEach((input) => (input.value = ""));
        setTimeout(() => {
        window.location.href = "/change-password?email="+email;
        }, 1500);
      } else {
        showToast(data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      showToast("An error occurred during OTP verification.");
    }
  });
  const resendBtn = document.getElementById("resendBtn");
  resendBtn.addEventListener("click", async () => {
    try { 
      const response = await fetch("http://localhost:4000/auth/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json(); 
      if (response.ok) {
        showToast("OTP resent successfully to your email.");
      } else {    
        showToast(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  }); 
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
    <img src="../images/check.png" class="toast-icon" alt="Success" />
    <span class="toast-message">${message}</span>
  `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  }
});
