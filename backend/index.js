/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import instagramGetUrl from "instagram-url-direct";
import { facebook } from "another-fb-video-downloader";
import getTwitterMedia from "get-twitter-media";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
  const { url } = req.body;

if (ytdl.validateURL(url)) {
    try {
      const info = await ytdl.getInfo(url);
      const format = ytdl.chooseFormat(info.formats, {
        filter: (format) => format.container === 'mp4' && format.hasVideo && format.hasAudio,
        quality: 'highestvideo',
      });

      res.json({ url: format.url });
    } catch (error) {
      res.status(500).json({ message: "Failed to download video from YouTube." });
    }
  } 
 else if (url.includes("instagram.com")) {
    try {
      const links = await instagramGetUrl(url);
      if (links.url_list && links.url_list.length > 0) {
        res.json({ url: links.url_list[0] });
      } else {
        res
          .status(500)
          .json({ message: "Failed to download video from Instagram." });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to download video from Instagram." });
    }
  } else if (url.includes("facebook.com")) {
    try {
      const video = await facebook(url);
      res.json({ url: video });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to download video from Facebook." });
    }
  } else if (url.includes("x.com") || url.includes("twitter.com")) {
    try {
      const info = await getTwitterMedia(url);
      res.json({ url: info.media[0].url });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to download video from Twitter." });
    }
  } else {
    res.status(400).json({ message: "Invalid URL" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
