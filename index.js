const express = require("express")
const app = express()
const cors = require('cors');
const connectDB = require("./others/ConnectDB");

const ErrorHandler = require("./others/ErrorHandler");
const cookieParser = require("cookie-parser");
const path = require("path");
connectDB()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));


const PORT = process.env.port || 5050


// User base routes starts
const UserRouter = require("./routes/User.routes");
app.use("/api", UserRouter)
// User base routes ends


// Blog routes starts
const BlogRouter = require("./routes/Blog.routes");
app.use("/api", BlogRouter)
// Blog routes ends


app.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
})


app.use((error, req, res, next) => {
    const message = error?.message || "Something went wrong!"
    const Status = error?.Status || 402
    res.status(Status).json({ error: message })
})