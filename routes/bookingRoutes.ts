import express from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn"
import { BookService, createBooking } from "../controllers/bookingcontrollers"

const bookingRouter = express.Router()

bookingRouter.post("/bookings/create",isLoggedIn as any,createBooking)
bookingRouter.post("/bookings/book/:bookingId", isLoggedIn as any,BookService)

export default bookingRouter