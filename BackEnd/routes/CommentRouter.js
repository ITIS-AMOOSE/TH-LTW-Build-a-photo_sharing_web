const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");

const router = express.Router();
const invalidUserIdMessage = () => ({
  message: "ID không hợp lệ hoặc không phải User.",
});

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

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json(invalidUserIdMessage());
    }

    const user = await User.findById(id).select("_id").lean();
    if (!user) {
      return response.status(400).json(invalidUserIdMessage());
    }

    const photos = await Photo.find({ "comments.user_id": id }).lean();
    const result = [];

    photos.forEach((p) => {
      (p.comments || []).forEach((c) => {
        if (String(c.user_id) === String(id)) {
          result.push({
            _id: c._id,
            comment: c.comment,
            date_time: c.date_time,
            photo: {
              _id: p._id,
              file_name: p.file_name,
              user_id: p.user_id,
            },
          });
        }
      });
    });

    result.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
});

module.exports = router;