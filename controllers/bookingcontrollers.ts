import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import User from "../models/users";
import Booking from "../models/booking";

export const createBooking = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { service,price } = req.body;

    // Validate the service field
    if (!service) {
      res.status(400).json({
        status: 400,
        message: "Service field is required.",
      });
      return;
    }

    // Ensure req.user exists and contains the email
    if (!req.user || !req.user.email) {
      res.status(401).json({
        status: 401,
        message: "Unauthorized. User information is missing.",
      });
      return;
    }

    // Find the user
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      res.status(404).json({
        status: 404,
        message: "User not found.",
      });
      return;
    }

    // Check user role
    if (user.role !== "admin") {
      res.status(403).json({
        status: 403,
        message: "Only admins can create booking services.",
      });
      return;
    }
    
    // Create the booking
    const bookingService = await Booking.create({
      service,
      user: user._id,
      price
    });
    await User.updateOne(
      { _id: user._id }, // Query to match the user
      { $push: { bookings: bookingService._id } } // Update operation to push the bookingService._id into the bookings array
    );
        res.status(201).json({
      status: 201,
      message: "Booking service created successfully.",
      data: bookingService,
    });
  } catch (error) {
    console.error("Error creating booking service:", error);
    res.status(500).json({
      status: 500,
      message: "An error occurred while creating the booking service.",
    });
  }
});


export const BookService = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bookingId = req.params.bookingId as string;

  if (!bookingId) {
    res.status(403).json({
      message: "You have not selected any service to book",
    });
    return;
  }

  const user = await User.findOne({ email: req?.user?.email });
  if (!user || user.role !== "user") {
    res.status(403).json({
      message: "Unauthorized User or No user",
    });
    return;
  }

  const service = await Booking.findById(bookingId);
  if (!service) {
    res.status(404).json({
      message: "Service is not available",
    });
    return;
  }

  if (service.status === "closed") {
    res.status(400).json({
      message: "Service is closed for booking",
    });
    return;
  }

  try {
    await User.updateOne({ _id: user._id }, { $push: { bookings: service._id } });
    res.status(200).json({
      message: "Booking made successfully",
    });
    return;
  } catch (error) {
    console.error("Error during booking:", error);
    res.status(500).json({
      message: "An error occurred while processing the booking",
    });
  }
});


export const openBookings = expressAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  const limitvalue = 5
  const page = parseInt(req.query.page as string) || 1
  const skipvalue = (page -1) * limitvalue
try{
 const openbookings = await Booking.find({status:"open"}).limit(limitvalue).skip(skipvalue).exec()
  const totalopenbookings = await Booking.countDocuments({status: "open"})

  res.json({
    status:200,
    data:openbookings,
    pagination:{
      currentPage : page,
      totalItems: totalopenbookings
    }
  })
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }else{
    console.error(e)
  }
}

})