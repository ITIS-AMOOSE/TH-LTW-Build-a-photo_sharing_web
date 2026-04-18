const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

const invalidUserIdMessage = () => ({
    message: "ID khong hop le",
})

router.get(":id", async(req, res) => {
    try{
        const{id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json(invalidUserIdMessage());
        }

        const user = await User.findById(id).select("_id").lean();

        if(!user){
            return res.status(400).json(invalidUserIdMessage());
        }

        const photos = await Photo.find({"comments.user_id": id}).lean();

        const result = [];

        photos.forEach((p) => {
            (p.comments || []).forEach((c) => {
                if(String(c.user_id) === String(id)){
                    result.push({
                        _id: c.id,
                        comment: c.comment,
                        date_time: c.date_time,
                        photo:{
                            _id: p.id,
                            file_name: p.file_name,
                            user_id: p.user_id,
                        },
                    });
                }
            });
        });
        result.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));

        return res.status(200).json(result);
    }
    catch (error){
        return res.status(500).json({message: error.message});
    }
})

module.exports = router;