const express = require("express");
const router = express.Router();
const videosRoutes = require("./routes/video");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/videos", videosRoutes);

app.listen(PORT, () => {
  console.log("App is listening on port 3000");
});
