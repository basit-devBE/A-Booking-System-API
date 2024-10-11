import express from "express"
import { registerUser } from "../controllers/usercontrollers"

const UserRouter = express.Router()

UserRouter.post("/BookingSystem/users/create", registerUser)

export default UserRouter