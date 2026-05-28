import mongoose from "mongoose";
import "dotenv/config";
import User from "./models/User.js";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";

const roomsSeedData = [
  {
    roomType: "Double Bed",
    pricePerNight: 399,
    amenities: ["Room Service", "Mountain View", "Pool Access"],
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?q=80&w=800",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=800"
    ],
    isAvailable: true
  },
  {
    roomType: "Double Bed",
    pricePerNight: 299,
    amenities: ["Room Service", "Mountain View", "Pool Access"],
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?q=80&w=800",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800"
    ],
    isAvailable: true
  },
  {
    roomType: "Double Bed",
    pricePerNight: 249,
    amenities: ["Free WiFi", "Free Breakfast", "Room Service"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?q=80&w=800",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800"
    ],
    isAvailable: true
  },
  {
    roomType: "Single Bed",
    pricePerNight: 199,
    amenities: ["Free WiFi", "Room Service", "Pool Access"],
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?q=80&w=800"
    ],
    isAvailable: true
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = `${process.env.MONGODB_URI}/hotel-booking`;
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Database Connected successfully for Seeding!");

    // Clear existing data
    console.log("Clearing existing User, Hotel, and Room collections...");
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Room.deleteMany({});

    // 1. Create Default Owner User
    console.log("Creating default owner user...");
    const defaultUser = await User.create({
      _id: "user_2unqyL4diJFP1E3pIBnasc7w8hP",
      username: "Great Stack",
      email: "user.greatstack@gmail.com",
      image: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2N2c5YVpSSEFVYVUxbmVYZ2JkSVVuWnFzWSJ9",
      role: "hotelOwner",
      recentSearchedCities: ["New York"]
    });
    console.log(`Default User created: ${defaultUser.username} (${defaultUser._id})`);

    // 2. Create Default Hotel
    console.log("Creating default hotel...");
    const defaultHotel = await Hotel.create({
      _id: "67f76393197ac559e4089b72",
      name: "Urbanza Suites",
      address: "Main Road 123 Street, 23 Colony, New York",
      contact: "+0123456789",
      owner: defaultUser._id,
      city: "New York"
    });
    console.log(`Default Hotel created: ${defaultHotel.name} (${defaultHotel._id})`);

    // 3. Create Default Rooms
    console.log("Creating default rooms...");
    const roomsToInsert = roomsSeedData.map((room, idx) => ({
      ...room,
      _id: idx === 0 ? "67f7647c197ac559e4089b96" :
           idx === 1 ? "67f76452197ac559e4089b8e" :
           idx === 2 ? "67f76406197ac559e4089b82" : "67f763d8197ac559e4089b7a",
      hotel: defaultHotel._id
    }));

    const insertedRooms = await Room.create(roomsToInsert);
    console.log(`Successfully seeded ${insertedRooms.length} rooms!`);

    console.log("\n==========================================");
    console.log("DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
