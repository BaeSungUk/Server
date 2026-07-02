import express from "express"
import { config } from "./config.mjs"
import { connectDB } from "./db/database.mjs"

const app = express()

app.use(express.json())



connectDB().then(() => {
    app.listen(config.host.port, () => {
        console.log("DB/웹 서버 실행 중...");
        
    })
}).catch(console.error)
