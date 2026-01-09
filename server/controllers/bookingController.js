

// function to check availability of room

import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";

const checkAvailability = async({checkInDate, checkOutDate, room})=>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate:{$lte:checkOutDate},
            checkOutDate:{$gte:checkInDate} 
        });

        const isAvailable = bookings.length ===0;
        return isAvailable;


    } catch (error) {
        
        console.error(error.message);

    }

}

// API to check availability of room

// POST /api/bookings/check-availability

export const checkAvailabilityAPI = async(req, res)=>{

    try {
        const {room, checkInDate, checkOutDate} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        res.json({success:true, isAvailable});
    } catch (error) {
        res.json({success:false, message: error.message});
        
    }
}


// API TO CREATE A NEW BOOKING
// POST /api/bookings/book

export const createBooking = async(req, res)=>{

    try {

        const {room, checkInDate, checkOutDate, guests} = req.body;

        const user = req.user._id;

        // before booking check availability\

        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});

        if(!isAvailable){
            return res.json({success:false, message:'Room is not available'});
        }
        // Get totalprice from room
        const roomData = await Room.findById(room).populate('hotel');
        let totalPrice = roomData.pricePerNight;
        // calculate total price based on nights
        const checkIn = new Date(checkInDate);

        const checkOut = new Date(checkOutDate);
        
        const timeDiff = checkOut.getTime() - checkIn.getTime();

        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= nights;

        const booking = await Booking.create({
            user,
            room,
            hotel:roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice

        })
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: 'Hotel Booking Details',
            html:`
                <h2>Booking Confirmed!</h2>
                <p> Dear ${req.user.username},</p>
                <p>Thank you for the booking! Here are your details:</p>
                <ul>
                    <li><strong>Booking Id:</strong> ${booking._id}</li>
                    <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                    <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                    <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
                    <li><strong>Booking Amount:</strong>${process.env.CURRENCY || '$'} ${booking.totalPrice}/night</li>

                    <p> We look forward to Hosting you!</p>
                    <P> QUICKSTAY-anupam</p>
                    

               
                </ul>
            `

        }

        await transporter.sendMail(mailOptions);



        res.json({success:true, message:'Booking created successfully'});


    } catch (error) {
        console.log(error);
        res.json({success:false, message: "failed to create booking"});
        
    }
};

// api to get all booking for a user
// GET /api/bookings/user

export const getUserBookings = async(req, res)=>{
    try {
        const user = req.user._id;

        const bookings = await Booking.find({ user })
            .populate('room hotel')
            .sort({ createdAt: -1 });

        res.json({success:true, bookings});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Failed to fetch bookings"});
    }
}


export const getHotelBookings = async(req, res)=>{
   try {
     const hotel = await Hotel.findOne({owner:req.auth.userId});
    if(!hotel){
        return res.json({success:false, message:'No hotel'});
    }

    const bookings = await Booking.find({hotel:hotel._id}).populate('room hotel user').sort({createdAt:-1});

    // total bookings

    const totalBookings = bookings.length;
    // total revenue
    const totalRevenue = bookings.reduce((acc, booking)=>acc + booking.totalPrice,0);
    res.json({success:true, dashboardData:{totalBookings, totalRevenue}, bookings});
    
   } catch (error) {
    res.json({success:false, message:"Failed to fetch bookings"});
   }

}

export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Get room + hotel info
    const roomData = await Room.findById(booking.room).populate('hotel');
    if (!roomData) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const totalPrice = booking.totalPrice;

    const { origin } = req.headers;

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Line items for Stripe
    const line_items = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: roomData.hotel.name,
            description: roomData.roomType || '', // optional
          },
          unit_amount: totalPrice * 100, // convert to cents
        },
        quantity: 1,
      },
    ];

    // ✅ Create Checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/my-bookings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId: booking._id.toString(), // MUST send bookingId
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe Payment Error:', error);
    res.status(500).json({ success: false, message: 'Stripe payment failed' });
  }
};
