const useridInput = document.querySelector("#userid")
const passwordInput = document.querySelector("#password")
const loginBtn = document.querySelector("#login-btn")
const signupPageBtn = document.querySelector("#signup-page-btn")
const message = document.querySelector("#message")

// 이미 로그인한 상태면 posts.html로 이동
const savedToken = localStorage.getItem("token")

// 로그인 버튼 클릭
loginBtn.addEventListener("click", async () => {
  const userid = useridInput.value
  const password = passwordInput.value

  if (!userid || !password) {
    message.textContent = "아이디와 비밀번호를 입력하세요."
    return
  }

  try {
    const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        userid,
        password,
    }),
    })

    const data = await response.json()

    if (!response.ok) {
    message.textContent = data.message || "로그인 실패"
    return
    }

    localStorage.setItem("token", data.token)
    alert("로그인 성공")
    location.href = "/posts.html"
  } catch (error) {
    console.error(error)
    message.textContent = "서버 연결 실패"
  }
})

// 회원가입 페이지로 이동
signupPageBtn.addEventListener("click", () => {
  location.href = "/auth.html"
})