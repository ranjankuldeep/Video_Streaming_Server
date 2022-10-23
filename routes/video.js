const express = require("express");
const router = express.Router();
const fs = require("fs");
const videos = require("../metadata");

router.get("/", (req, res) => {
  return res.json(videos);
});
router.get("/video/:id/metadata", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const videoMeta = videos.filter((item) => item.id === id);
  res.json(videoMeta);
});
/// Here metadata in the url is compulsory to be given in the path.

router.get("/video/:id", (req, res) => {
  console.log(req);
  const videoPath = `assets/${req.params.id}.mp4`;
  const videoStat = fs.statSync(videoPath);
  const fileSize = videoStat.size;
  const videoRange = req.headers.range;

  if (videoRange) {
    // console.log(videoRange);
    const parts = videoRange.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,

      "Accept-Ranges": "bytes",

      "Content-Length": chunksize,

      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);

    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,

      "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);

    fs.createReadStream(videoPath).pipe(res);
  }
});

module.exports = router;
