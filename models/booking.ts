import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now, // Ensures bookingDate defaults to the time of creation.
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Prevent negative pricing.
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields.
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
