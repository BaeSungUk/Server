const useridInput = document.querySelector("#userid")
const passwordInput = document.querySelector("#password")
const passwordCheckInput = document.querySelector("#password-check")
const nameInput = document.querySelector("#name")
const emailInput = document.querySelector("#email")

const signupBtn = document.querySelector("#signup-btn")
const loginPageBtn = document.querySelector("#login-page-btn")
const message = document.querySelector("#message")

signupBtn.addEventListener("click", async () => {
  const userid = useridInput.value.trim()
  const password = passwordInput.value.trim()
  const passwordCheck = passwordCheckInput.value.trim()
  const name = nameInput.value.trim()
  const email = emailInput.value.trim()

  if (!userid ) {
    message.textContent = "아이디를을 입력하세요."
    return
  }
  if (!password) {
    message.textContent = "비밀번호를 입력하세요."
    return
  }
  if (!passwordCheck) {
    message.textContent = "비밀번호 확인을 입력하세요."
    return
  }
  if (!name) {
    message.textContent = "이름을 입력하세요."
    return
  }
  if (!email) {
    message.textContent = "이메일을 입력하세요."
    return
  }      

  if (password !== passwordCheck) {
    message.textContent = "비밀번호가 서로 다릅니다."
    return
  }

  try {
    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid,
        password,
        name,
        email,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      message.textContent = data.message || "회원가입 실패"
      return
    }

    localStorage.setItem("token", data.token)
    location.href = "/index.html"
  } catch (error) {
    console.error(error)
    message.textContent = "서버 연결 실패"
  }
})

loginPageBtn.addEventListener("click", () => {
  location.href = "/index.html"
})