require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./database/db");

const adminRoutes = require("./routes/admin-routes");

connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

//Global Middlewares
app.use(cors()); //Cross Origin Resource Sharing
app.use(express.json());

//routes
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is now listening on PORT: ${PORT}`);
});
