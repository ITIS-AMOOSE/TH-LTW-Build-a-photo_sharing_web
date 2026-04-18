import React, { useState, useEffect } from "react";
import {
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
          <ListItem component={Link} to={"/users/" + item._id}>
            <ListItemText primary={item.first_name + " " + item.last_name} />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}

export default UserList;