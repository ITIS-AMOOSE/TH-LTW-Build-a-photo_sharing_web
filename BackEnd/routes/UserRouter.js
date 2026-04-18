const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");

const router = express.Router();

const invalidUserIdMessage = () => ({
  message: "ID không hợp lệ hoặc không phải User.",
});

router.post("/", async (req, res) => {});

router.get("/list", async (req, res) => {
  try {
    const users = await User.find({})
      .select("_id first_name last_name")
      .lean();

    const photoCounts = await Photo.aggregate([
      { $group: { _id: "$user_id", count: { $sum: 1 } } },
    ]);
    const photoMap = Object.fromEntries(
      photoCounts.map((x) => [String(x._id), x.count]),
    );

    const commentCounts = await Photo.aggregate([
      { $unwind: "$comments" },
      { $group: { _id: "$comments.user_id", count: { $sum: 1 } } },
    ]);
    const commentMap = Object.fromEntries(
      commentCounts.map((x) => [String(x._id), x.count]),
    );

    const result = users.map((u) => ({
      _id: u._id,
      first_name: u.first_name,
      last_name: u.last_name,
      photo_count: photoMap[String(u._id)] || 0,
      comment_count: commentMap[String(u._id)] || 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(invalidUserIdMessage());
    }

    const user = await User.findById(id)
      .select("_id first_name last_name location description occupation")
      .lean();

    if (!user) {
      return res.status(400).json(invalidUserIdMessage());
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;