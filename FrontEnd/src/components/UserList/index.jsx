import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchModel("/user/list").then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <List component="nav">
      {users.map((item) => (
        <React.Fragment key={item._id}>
          <ListItem>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Link
                    to={"/users/" + item._id}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {item.first_name} {item.last_name}
                  </Link>
                  <Chip
                    label={item.photo_count ?? 0}
                    size="small"
                    sx={{ bgcolor: "#2e7d32", color: "#fff" }}
                  />
                  <Chip
                    label={item.comment_count ?? 0}
                    size="small"
                    component={Link}
                    to={"/users/" + item._id + "/comments"}
                    clickable
                    sx={{ bgcolor: "#c62828", color: "#fff" }}
                  />
                </Box>
              }
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}

export default UserList;