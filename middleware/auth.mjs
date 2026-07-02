import jwt from "jsonwebtoken"


const AUTH_ERROR = { message: "인증에러" }

// next는 맨 끝에 next()를 하게되면 실행한 곳에서 그다음 실행할 부분을 이어서 실행 시킴
export const isAuth = async (req, res, next) => {
    const authHeader = req.get("Authorization")
    console.log(authHeader)
    next()
    
}