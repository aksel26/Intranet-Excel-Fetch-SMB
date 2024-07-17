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

    const userId = document.getElementById("userId").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, password }),
    })
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          console.log("🚀 ~ .then ~ contentType:", contentType);
          return response.json().then((data) => {
            if (!response.ok) {
              throw new Error(data.error || "서버 오류가 발생했습니다.");
            }
            return data;
          });
        } else {
          throw new Error("서버가 올바른 형식의 데이터를 반환하지 않았습니다.");
        }
      })
      .then((data) => {
        // 로그인 성공 처리
        sessionStorage.setItem("userName", data.user);
        window.location.href = "/main";
        // 여기서 로그인 성공 후 리다이렉션 등을 처리할 수 있습니다.
      })
      .catch((error) => {
        // 에러 처리
        console.error("에러:", error.message);
        // 여기서 사용자에게 에러 메시지를 표시할 수 있습니다.
      });
  });
});
