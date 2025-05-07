require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./database/db");

const authRoutes = require("./routes/admin-routes");
const productRoutes = require("./routes/product-routes");
const roomRoutes = require("./routes/room-routes");
const designRoutes = require("./routes/design-routes");

// Connect to MongoDB
connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middlewares
app.use(cors()); // Cross Origin Resource Sharing
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/designs", designRoutes);

app.listen(PORT, () => {
  console.log(`Server is now listening on PORT: ${PORT}`);
});
