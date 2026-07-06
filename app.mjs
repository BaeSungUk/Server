import express from "express"
import { config } from "./config.mjs"
import { connectDB } from "./db/database.mjs"
import authRouter from "./router/auth.mjs"
import postsRouter from "./router/posts.mjs"


const app = express()

app.use(express.json())
app.use(express.static("public"))
// 회원 페이지 
app.use("/auth", authRouter)
// 포스트 페이지
app.use("/post", postsRouter)

//잘못 들어오게 되면 404 페이지
app.use((req, res) => {
    res.sendStatus(404)
})

connectDB().then(() => {
    app.listen(config.host.port, () => {
        console.log("DB/웹 서버 실행 중...")
    })
}).catch(console.error)
