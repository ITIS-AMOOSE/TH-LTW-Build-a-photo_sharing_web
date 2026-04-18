const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");

const router = express.Router();

const invalidUserIdMessage = () => ({
  message: "ID không hợp lệ hoặc không phải User.",
});

router.post("/", async (req, res) => {});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(invalidUserIdMessage());
    }

    const owner = await User.findById(id).select("_id").lean();
    if (!owner) {
      return res.status(400).json(invalidUserIdMessage());
    }

    const photos = await Photo.find({ user_id: id }).lean();

    const commentUserIdSet = new Set();
    photos.forEach((p) => {
      (p.comments || []).forEach((c) => {
        if (c.user_id) commentUserIdSet.add(String(c.user_id));
      });
    });

    const commentUsers = await User.find({
      _id: { $in: [...commentUserIdSet] },
    })
      .select("_id first_name last_name")
      .lean();

    const userMap = Object.fromEntries(
      commentUsers.map((u) => [String(u._id), u]),
    );

    const result = photos.map((p) => ({
      _id: p._id,
      user_id: p.user_id,
      file_name: p.file_name,
      date_time: p.date_time,
      comments: (p.comments || []).map((c) => {
        const u = userMap[String(c.user_id)];
        return {
          _id: c._id,
          comment: c.comment,
          date_time: c.date_time,
          user: u
            ? {
                _id: u._id,
                first_name: u.first_name,
                last_name: u.last_name,
              }
            : {
                _id: c.user_id,
                first_name: "Unknown",
                last_name: "",
              },
        };
      }),
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;