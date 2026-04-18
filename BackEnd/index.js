require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");

const app = express();
const PORT = process.env.PORT || 8081;

dbConnect();

app.use(cors());
app.use(express.json());

app.use("/user", UserRouter);
app.use("/photosOfUser", PhotoRouter);
app.use("/api/comment", CommentRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from photo-sharing app API!" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log("server listening on port", PORT);
});