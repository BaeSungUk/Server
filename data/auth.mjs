import MongoDB from "mongodb"
import { getUsers } from "../db/database.mjs"

const ObjectId = MongoDB.ObjectId

// 아이디 중복 확인
export async function findByUserid(userid) {
    // next하면 찾고나서 성공하면 mapOptionalUser함수 실행
    return getUsers().find({ userid }).next().then(mapOptionalUser)
}

// 회원가입
export async function createUser(user) {
    return getUsers().insertOne(user).then((result) => result.insertedId.toString())
}

function mapOptionalUser(user) {
    return user ? { ...user, id: user._id.toString() } : user
}

