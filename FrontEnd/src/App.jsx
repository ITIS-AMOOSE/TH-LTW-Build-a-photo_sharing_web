import "./App.css";

import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";

const App = () => {
  const advancedFeaturesEnabled = true;

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>

          <div className="main-topbar-buffer" />

          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>

          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/" element={<Navigate to="/users" replace />} />
                <Route
                  path="/users"
                  element={<Typography variant="h6">Chọn một người dùng từ danh sách bên trái.</Typography>}
                />
                <Route path="/users/:userId" element={<UserDetail />} />
                <Route path="/users/:userId/comments" element={<UserComments />} />
                <Route
                  path="/photos/:userId"
                  element={<UserPhotos advancedFeaturesEnabled={advancedFeaturesEnabled} />}
                />
                <Route
                  path="/photos/:userId/:photoId"
                  element={<UserPhotos advancedFeaturesEnabled={advancedFeaturesEnabled} />}
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;