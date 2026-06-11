import "dotenv/config";
import { sendCancellationEmail } from "./configs/emailService.js";

const testEmail = async () => {
    console.log("Starting email test...");
    const booking = {
        checkInDate: new Date(),
        checkOutDate: new Date(Date.now() + 86400000),
        guests: 2,
        isPaid: true,
        totalPrice: 15000,
        paymentMethod: "Credit Card"
    };
    const hotel = {
        name: "Test Resort",
        address: "123 Mewar Road, Udaipur"
    };
    const room = {
        roomType: "Luxury Suite"
    };

    try {
        await sendCancellationEmail("moulikmanocha5@gmail.com", "Test User", booking, hotel, room);
        console.log("Email test call completed.");
    } catch (err) {
        console.error("Test failed with error:", err);
    }
};

testEmail();
