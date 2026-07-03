import jwt from "jsonwebtoken"
import { config } from "../config.mjs"
import * as authRepository from "../data/auth.mjs"


const AUTH_ERROR = { message: "인증에러" }

// next는 맨 끝에 next()를 하게되면 실행한 곳에서 그다음 실행할 부분을 이어서 실행 시킴
export const isAuth = async (req, res, next) => {
    const authHeader = req.get("Authorization")
    console.log(authHeader)
    
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("헤더에러")
        return res.status(401).json(AUTH_ERROR)
    }

    // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDVmNmMxNWY3OWQ3ZWNkNTFiODhhOCIsImlhdCI6MTc4MzAzODAyNywiZXhwIjoxNzgzMTI0NDI3fQ.-arXdlTZ1rlXlERGzaHYEaf18ajaLUcGqnD2ykH_ndc

    const token = authHeader.split(" ")[1]
    jwt.verify(token, config.jwt.secretKey, async(error, decoded) => {
        if(error) {
            console.log("토큰에러")
            return res.status(401).json(AUTH_ERROR)
        }
        // console.log(decoded)
        const user = await authRepository.findById(decoded.id)
        if(!user) {
            console.log("해당 아이디 없음")
            return res.status(401).json(AUTH_ERROR)
        }
        // ObjectId
        console.log("user.id : ", user.id)
        // 로그인한 user id
        console.log("user.userid : ", user.userid)
        req.id = user.id
        req.token = token
        next()
    })
}