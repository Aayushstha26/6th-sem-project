
  let slideIndex = 0;
  const slides = document.querySelectorAll('.slide');

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) slide.classList.add('active');
    });
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }

  function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex)
  };

  setInterval(nextSlide, 5000);


// popup register//

  document.addEventListener("DOMContentLoaded", () => {
  const profile = document.getElementById("profile");
  const registerModal = document.getElementById("registerModal");
  const registerContent = document.getElementById("registerContent");

  profile.addEventListener("click", (e) => {
    e.preventDefault();

    fetch("Register.html")
    .then((reg) => reg.text())
    .then((data) => {
      registerContent.innerHTML = data;
      registerModal.style.display = "flex";

      const closebtn = registerContent.querySelector("#close-btn");
      if(closebtn){
        closebtn.addEventListener("click", () =>{
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
})

