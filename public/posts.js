const token = localStorage.getItem("token")

const logoutBtn = document.querySelector("#logout-btn")

const searchIdInput = document.querySelector("#search-id")
const searchBtn = document.querySelector("#search-btn")
const resetBtn = document.querySelector("#reset-btn")

const textInput = document.querySelector("#text")
const createBtn = document.querySelector("#create-btn")

const postList = document.querySelector("#post-list")
const message = document.querySelector("#message")

if (!token) {
  alert("로그인이 필요합니다.")
  location.href = "/index.html"
}

// posts.html 들어오자마자 전체 조회
loadPosts()

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token")
  location.href = "/index.html"
})

resetBtn.addEventListener("click", () => {
  searchIdInput.value = ""
  loadPosts()
})

searchBtn.addEventListener("click", async () => {
  const id = searchIdInput.value.trim()

  if (!id) {
    message.textContent = "검색할 사용자의 아이디를 입력하세요."
    return
  }

  await loadPostById(id)
})

createBtn.addEventListener("click", async () => {
  const text = textInput.value.trim()

  if (!text) {
    message.textContent = "게시글 내용을 입력하세요."
    return
  }

  try {
    const response = await fetch("/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      message.textContent = data.message || "게시글 작성 실패"
      return
    }

    message.textContent = "게시글 작성 성공"
    textInput.value = ""

    await loadPosts()
  } catch (error) {
    console.error(error)
    message.textContent = "서버 연결 실패"
  }
})

async function loadPosts() {
  try {
    const response = await fetch("/post", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      message.textContent = data.message || "게시글 전체 조회 실패"
      return
    }

    message.textContent = ""

    const posts = Array.isArray(data) ? data : data.posts

    renderPosts(posts || [])
  } catch (error) {
    console.error(error)
    message.textContent = "서버 연결 실패"
  }
}

async function loadPostById(searchId) {
  try {
    const response = await fetch(`/post?userid=${searchId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      message.textContent = data.message || "게시글 조회 실패"
      postList.innerHTML = ""
      return
    }

    message.textContent = ""

    const posts = Array.isArray(data) ? data : data.posts

    renderPosts(posts || [])
  } catch (error) {
    console.error(error)
    message.textContent = "서버 연결 실패"
  }
}

function renderPosts(posts) {
  postList.innerHTML = ""

  if (!posts || posts.length === 0) {
    postList.innerHTML = `
      <div class="empty-box">
        게시글이 없습니다.
      </div>
    `
    return
  }

  posts.forEach((post) => {
    const postId = post._id || post.id || post.idx

    const div = document.createElement("div")
    div.className = "post-card"

    div.innerHTML = `
      <p class="post-content">${post.text || ""}</p>

      <div class="post-info">
        <p>작성자: ${post.name || "-"} (${post.userid || "-"})</p>
        <p>작성일: ${formatDate(post.createdAt)}</p>
        <p>수정일: ${formatDate(post.updatedAt)}</p>
      </div>

      <div class="post-actions">
        <button class="edit-btn" data-id="${postId}">수정</button>
        <button class="delete-btn" data-id="${postId}">삭제</button>
      </div>
    `

    postList.appendChild(div)
  })

  addPostButtonEvents()
}

function addPostButtonEvents() {
  const editButtons = document.querySelectorAll(".edit-btn")
  const deleteButtons = document.querySelectorAll(".delete-btn")

  editButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id

      const newText = prompt("수정할 내용을 입력하세요.")

      if (!newText) {
        alert("내용을 입력하세요")
        return
      }

      await updatePost(id, newText)
    })
  })

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id

      const ok = confirm("정말 삭제하시겠습니까?")

      if (!ok) {
        return
      }

      await deletePost(id)
    })
  })
}

async function updatePost(id, text) {
  try {
    const response = await fetch(`/post/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
      })
    })

    const data = await response.json()

    if (!response.ok) {
      message.textContent = data.message || "게시글 수정 실패"
      return
    }
    
    message.textContent = "게시글 수정 성공"

    await loadPosts()
  } catch (error) {
    
    console.error(error)
    alert("다른 사용자 게시물을 삭제 할수 없습니다.")
  }
}

async function deletePost(id) {
  try {
    const response = await fetch(`/post/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      message.textContent = data.message || "게시글 삭제 실패"
      return
    }

    message.textContent = "게시글 삭제 성공"

    await loadPosts()
  } catch (error) {
    console.error(error)
    message.textContent = "서버 연결 실패"
  }
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "-"
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

  return date.toLocaleString("ko-KR")
}