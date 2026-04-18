import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";

const UserComments = () => {
  const { userId } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchModel("/commentsOfUser/" + userId).then((data) => {
      setItems(data || []);
    });
  }, [userId]);

  if (!items.length) {
    return <Typography variant="body1">No comments found for this user.</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" style={{ marginBottom: 16 }}>
        Comments by this user
      </Typography>
      {items.map((item) => (
        <Card key={item._id} style={{ marginBottom: 16, display: "flex" }}>
          <Link to={"/photos/" + item.photo.user_id + "/" + item.photo._id}>
            <CardMedia
              component="img"
              image={"/images/" + item.photo.file_name}
              alt={item.photo.file_name}
              style={{ width: 140, height: 100, objectFit: "cover" }}
            />
          </Link>
          <CardContent style={{ flex: 1 }}>
            <Typography variant="body2" color="textSecondary">
              {new Date(item.date_time).toLocaleString()}
            </Typography>
            <Typography
              component={Link}
              to={"/photos/" + item.photo.user_id + "/" + item.photo._id}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {item.comment}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserComments;
