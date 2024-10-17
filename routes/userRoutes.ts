import express from "express"
import { LoginUser, registerUser, updateUser } from "../controllers/usercontrollers"
import {isLoggedIn} from "../middlewares/isLoggedIn"

const UserRouter = express.Router()

UserRouter.post("/BookingSystem/users/create", registerUser)
UserRouter.post("/BookingSystem/users/login", LoginUser)
UserRouter.put("/BookingSystem/users/update", isLoggedIn as any,updateUser)
export default UserRouter