document.addEventListener("DOMContentLoaded", () => {
  gsap.to(".login-container", {
    duration: 1,
    opacity: 1,
    y: 20,
    ease: "power3.out",
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      gsap.to(input, {
        duration: 0.3,
        scale: 1.05,
        borderColor: "#005b98",
        ease: "power2.out",
      });
    });

    input.addEventListener("blur", () => {
      gsap.to(input, {
        duration: 0.3,
        scale: 1,
        borderColor: "#ddd",
        ease: "power2.out",
      });
    });
  });

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    gsap.to("button", {
      duration: 0.1,
      scale: 0.95,
      yoyo: true,
      repeat: 1,
    });
    // 여기에 로그인 로직을 추가하세요
  });
});
