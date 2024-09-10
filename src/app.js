// AUTHOR : Dixit Kanubhai Ghodadara (B00913652) | dx343670@dal.ca (Shared)

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

const listingRouter = require("./routes/listingRoutes");
const userRoter = require("./routes/userRouter");
const documentRouter = require("./routes/documentsRoutes");
const globalErrorHandlerMiddleware = require("./controllers/errorController");
const News = require("./models/NewsModel");

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const database = mongoose.connection;

database.on("error", (err) => {
    console.log(err);
});

database.once("connected", () => {
    console.log("===== DATABASE CONNECTION SUCCESSFUL =====");
});

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(cors(corsOptions));

// Retrieve all news
app.get("/news", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    try {
        const news = await News.find();
        res.send(news);
    } catch (err) {
        console.error("Error occurred while retrieving news:", err);
        res.status(500).send("Internal server error");
    }
});

app.use("/listing", listingRouter);
app.use("/user", userRoter);
app.use("/document", documentRouter);

app.use(globalErrorHandlerMiddleware);
app.listen(PORT, () => {
    console.log(`Bid My Ride Server is running on port: ${PORT}`);
});
