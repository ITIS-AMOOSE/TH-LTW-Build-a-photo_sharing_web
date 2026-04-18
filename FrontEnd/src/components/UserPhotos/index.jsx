import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

const PhotoCard = ({ photo }) => (
  <Card key={photo._id} style={{ marginBottom: 24 }}>
    <CardMedia
      component="img"
      image={"/images/" + photo.file_name}
      alt={photo.file_name}
      style={{ maxHeight: 400, objectFit: "contain" }}
    />
    <CardContent>
      <Typography variant="body2" color="textSecondary">
        {new Date(photo.date_time).toLocaleString()}
      </Typography>

      {photo.comments && photo.comments.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Typography variant="h6">Comments:</Typography>
          {photo.comments.map((comment) => (
            <div key={comment._id} style={{ marginTop: 8 }}>
              <Divider />
              <Typography variant="body2" color="textSecondary">
                {new Date(comment.date_time).toLocaleString()}
                {" — "}
                <Link to={"/users/" + comment.user._id}>
                  {comment.user.first_name} {comment.user.last_name}
                </Link>
              </Typography>
              <Typography variant="body1">{comment.comment}</Typography>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const UserPhotos = ({ advancedFeaturesEnabled }) => {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchModel("/photosOfUser/" + userId).then((data) => {
      setPhotos(data || []);
    });
  }, [userId]);

  const currentIndex = useMemo(() => {
    if (!photoId) return 0;
    const idx = photos.findIndex((p) => String(p._id) === String(photoId));
    return idx >= 0 ? idx : 0;
  }, [photos, photoId]);

  // Khi bật advanced mà URL chưa có photoId thì điều hướng vào ảnh đầu tiên
  useEffect(() => {
    if (advancedFeaturesEnabled && photos.length > 0 && !photoId) {
      navigate("/photos/" + userId + "/" + photos[0]._id, { replace: true });
    }
  }, [advancedFeaturesEnabled, photos, photoId, userId, navigate]);

  if (photos.length === 0) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  // Chế độ thường: hiển thị toàn bộ ảnh (đúng requirement cũ)
  if (!advancedFeaturesEnabled) {
    return (
      <div>
        {photos.map((photo) => (
          <PhotoCard key={photo._id} photo={photo} />
        ))}
      </div>
    );
  }

  // Chế độ advanced: stepper từng ảnh
  const currentPhoto = photos[currentIndex];
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < photos.length - 1;

  const goPrev = () => {
    if (!canPrev) return;
    const prev = photos[currentIndex - 1];
    navigate("/photos/" + userId + "/" + prev._id);
  };

  const goNext = () => {
    if (!canNext) return;
    const next = photos[currentIndex + 1];
    navigate("/photos/" + userId + "/" + next._id);
  };

  return (
    <div>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}>
        <Button variant="outlined" onClick={goPrev} disabled={!canPrev}>
          Previous
        </Button>
        <Button variant="outlined" onClick={goNext} disabled={!canNext}>
          Next
        </Button>
        <Typography variant="body2" style={{ alignSelf: "center" }}>
          {currentIndex + 1} / {photos.length}
        </Typography>
      </Stack>

      <PhotoCard photo={currentPhoto} />
    </div>
  );
};

export default UserPhotos;