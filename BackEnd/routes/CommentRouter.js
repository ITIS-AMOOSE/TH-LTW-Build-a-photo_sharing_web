const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");

const router = express.Router();

router.post("/", async (request, response) => {
  try {
    const { photo_id, user_id, comment } = request.body;

    if (!photo_id || !user_id || comment === undefined || String(comment).trim() === "") {
      return response.status(400).json({
        message: "Thiếu hoặc rỗng: photo_id, user_id hoặc comment.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(photo_id) || !mongoose.Types.ObjectId.isValid(user_id)) {
      return response.status(400).json({
        message: "photo_id hoặc user_id không hợp lệ.",
      });
    }

    const updated = await Photo.findByIdAndUpdate(
      photo_id,
      {
        $push: {
          comments: {
            comment: String(comment).trim(),
            user_id,
            date_time: new Date(),
          },
        },
      },
      { new: true },
    );

    if (!updated || !updated.comments || updated.comments.length === 0) {
      return response.status(404).json({ message: "Không tìm thấy ảnh." });
    }

    const added = updated.comments[updated.comments.length - 1];
    return response.status(201).json({
      _id: added._id,
      photo_id: updated._id,
      user_id: added.user_id,
      comment: added.comment,
      date_time: added.date_time,
    });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
});

router.get("/", async (request, response) => {
  response.status(200).json({
    message: "Comment API: POST /api/comment với body { photo_id, user_id, comment }.",
  });
});

module.exports = router;