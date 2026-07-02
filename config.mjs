// env 파일을 읽어오기
import dotenv from "dotenv"
// 객체 생성
dotenv.config()

function required(key, defaultValue=undefined){
    const value = process.env[key] || defaultValue
    if(value == null) {
        throw new Error(`키 ${key}는 undefined`)
    }
    return value
}
// 외부에서 사용할수 있는 객체 생성
export const config = {
    jwt: {
        secretKey: required("JWT_SECRET"),
        expiresInSec: parseInt(required("JWT_EXPIRES_SEC"))
    },
    bcrypt: {
        saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 10))
    },
    host: {
        port: parseInt(required("HOST_PORT", 8080))
    },
    db: {
        host: required("DB_HOST")
    }
}
