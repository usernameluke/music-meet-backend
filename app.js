require("dotenv").config();
require("./db");
const express = require("express");
const cors = require("cors");
const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();
app.use(cors());
require("./config")(app);

require("./models/EventPost.model");

// Routes
const eventPostRouter = require("./routes/eventPost.routes");
app.use("/api/events", isAuthenticated, eventPostRouter);

const commentRouter = require("./routes/comment.routes");
app.use("/api/comments", isAuthenticated, commentRouter);

const messageRouter = require("./routes/message.routes");
app.use("/api/messages", isAuthenticated, messageRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const userRouter = require("./routes/user.routes");
app.use("/users", isAuthenticated, userRouter);

const favouriteRouter = require("./routes/favourite.routes");
app.use("/api/favourites", isAuthenticated, favouriteRouter)

require("./error-handling")(app);

module.exports = app;
