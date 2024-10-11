import bcrypt from "bcrypt"

const salt = 10
const hashPassword = async (password:string) => {
   const hash = await bcrypt.hash(password, salt)
    return hash
}

const comparePassword = async (password:string, hash:string) => {
    const result = await bcrypt.compare(password, hash)
    return result
}

export {hashPassword, comparePassword}