import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

const TopBar = () => {
  const location = useLocation();
  const [contextText, setContextText] = useState("");

  useEffect(() => {
    const path = location.pathname;
    const parts = path.split("/").filter(Boolean);

    if (parts.length === 0) {
      setContextText("");
      return;
    }

    if ((parts[0] === "users" || parts[0] === "photos") && parts[1]) {
      const userId = parts[1];
      fetchModel("/user/" + userId)
        .then((user) => {
          if (parts[0] === "users") {
            setContextText(user.first_name + " " + user.last_name);
          } else {
            setContextText("Photos of " + user.first_name + " " + user.last_name);
          }
        })
        .catch(() => setContextText(""));
      return;
    }

    setContextText("");
  }, [location.pathname]);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" style={{ flexGrow: 1 }}>
          Nguyen Van A
        </Typography>

        <Typography variant="h6" color="inherit">
          {contextText}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;