let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}

setInterval(nextSlide, 5000);

// popup register//

document.addEventListener("DOMContentLoaded", () => {
  const regs = document.getElementById("regs");
  const registerModal = document.getElementById("registerModal");
  const registerContent = document.getElementById("registerContent");

  regs.addEventListener("click", (e) => {
    e.preventDefault();

    fetch("/user/signup")
      .then((reg) => reg.text())
      .then((data) => {
        registerContent.innerHTML = data;
        console.log(data);
        registerModal.style.display = "flex";

        const form = document.getElementById("registerForm");
        let message = document.getElementById("results");
        let Firstname = document.getElementById("Firstname");
        let Lastname = document.getElementById("Lastname");
        let Phone = document.getElementById("Phone");
        let Email = document.getElementById("Email");
        let Password = document.getElementById("Password");

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          console.log(Firstname);
          if (checkRegisterForm()) {
            console.log(form);
            // form.submit();
            const formData = {
              Firstname: Firstname.value,
              Lastname: Lastname.value,
              Phone: Phone.value,
              Email: Email.value,
              Password: Password.value,
            };

            try {
              const res = await fetch("http://localhost:4000/user/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              });

              const result = await res.json();
              // alert(result.message);
              message.innerHTML = result.message;
              showSucess();
              form.reset();
            } catch (err) {
              // alert("Registration failed. See console.");
              message.innerHTML = "Error!! Something went wrong";
              console.error(err);
            }
          }
        });
        Firstname.addEventListener("input", () => {
          checkValid(
            Firstname,
            Firstname.value.trim() !== "" && isName(Firstname.value.trim()),
            "Firstname msut be atleast 3 character"
          );
        });
        Lastname.addEventListener("input", () => {
          checkValid(
            Lastname,
            Lastname.value.trim() !== "" && isName(Lastname.value.trim()),
            "Lastname  msut be atleast 3 character"
          );
        });
        Phone.addEventListener("input", () => {
          checkValid(
            Phone,
            Phone.value.trim() !== "" && isPhone(Phone.value.trim()),
            "Not a valid phone"
          );
        });
        Email.addEventListener("input", () => {
          checkValid(
            Email,
            Email.value.trim() !== "" && isEmail(Email.value.trim()),
            "Not a valid email"
          );
        });
        Password.addEventListener("input", () => {
          checkValid(
            Password,
            Password.value.trim().length >= 8,
            "Password must be atleast 8 "
          );
        });
        function checkRegisterForm() {
          let isValid = true;
          checkValid(
            Firstname,
            Firstname.value.trim() !== "" && isName(Firstname.value.trim()),
            "Firstname can't be blank"
          );
          checkValid(
            Lastname,
            Lastname.value.trim() !== "" && isName(Lastname.value.trim()),
            "Lastname can't be blank"
          );
          checkValid(
            Phone,
            Phone.value.trim() !== "" && isPhone(Phone.value.trim()),
            "Not a valid phone"
          );
          checkValid(
            Email,
            Email.value.trim() !== "" && isEmail(Email.value.trim()),
            "Not a valid email"
          );
          checkValid(
            Password,
            Password.value.trim().length >= 8,
            "Password must be at least 8 characters"
          );
          // checkValid(checkbox, checkbox.checked, "You must agree to the terms.");

          document
            .querySelectorAll("#Register-form .formContent")
            .forEach((control) => {
              if (control.classList.contains("error")) {
                isValid = false;
              }
            });
          return isValid;
        }
        function checkValid(input, condition, errormessage) {
          if (condition) {
            Success(input);
          } else {
            setError(input, errormessage);
          }
        }
        function Success(input) {
          console.log("Sucess");
          const formContent = input.parentElement;
          const icon = formContent.querySelector(".icon");
          const errorMsg = formContent.querySelector(".errorMsg");
          formContent.className = "formContent success";
          icon.className = "formContent icon fas fa-check-circle";
          if (errorMsg) {
            errorMsg.innerHTML = "";
          }
        }
        function setError(input, errormessage) {
          console.log("Error");
          const formContent = input.parentElement;
          const icon = formContent.querySelector(".icon");
          const errorMsg = formContent.querySelector(".errorMsg");
          formContent.classList = "formContent error";
          icon.className = "formContent icon fas fa-times-circle ";
          if (errorMsg) {
            errorMsg.innerHTML = errormessage;
          }
        }
        function isEmail(email) {
          // return /^[a-zA-Z._-]+@[a-zA-Z]+\.[a-zA-Z]{2,6}$/.test(email);
          return /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(
            email
          );
        }
        function isName(name) {
          return /^[a-zA-Z\s]{3,}$/.test(name);
        }

        function isPhone(phone) {
          return /^\d{10}$/.test(phone);
        }
        function showSucess() {
          const modal = document.getElementById("success");
          modal.style.display = "block";

          closeBtn = document.getElementById("close-btn");
          closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
          });
          window.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
          });
        }

        const closebtn = registerContent.querySelector("#close-btn");
        if (closebtn) {
          closebtn.addEventListener("click", () => {
            registerModal.style.display = "none";
          });
        }

      window.addEventListener("click", (e) => {
        if(e.target === registerModal){
          registerModal.style.display = "none";
        }
      })
    })
  })
});









