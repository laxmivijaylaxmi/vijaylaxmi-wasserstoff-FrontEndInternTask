import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import TextEditor from "./component/TextEditor";

const socket = io("http://localhost:5000", { autoConnect: false });
const drawerWidth = 240;

const App = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [text, setText] = useState();
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState([]);
   
  //leaveRoom Handle:-
  const handleLeaveRoom = () => {
      socket.emit("leave", { roomId, userName });
      setJoined(false);
      setRoomId("");
      setUserName("");
      setUsers([]);
    };


  useEffect(() => {
  socket.connect();
    socket.on("typing", (userName) => {
      setTypingUser(userName);
      setTimeout(() => setTypingUser(null), 2000);
    });
    // Receive updated users in the room
    socket.on("user joined", (users) => {
      console.log("Received users:", users);
      setUsers(users);
    });

    // Receive text changes
    socket.on("text-changed", ({ content }) => {
      setText(content);
    });

 

    return () => {
      socket.disconnect();
      socket.off("text-changed");
      socket.off("userJoined");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
      console.log("userName", userName, "roomId", roomId);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied!");
  };

  // Join screen
  if (!joined) {
    return (
      <Container maxWidth="xs">
        <Paper elevation={9} sx={{ padding: 4, marginTop: 10 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Join Code Room
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Room ID"
              variant="outlined"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Username"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" size="large">
              Join
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Chat UI after joining
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2c2f6c",
            color: "white",
            p: 3,
          },
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Room Details
          </Typography>
          <List>
            <ListItem>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Room ID:
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#8e4095",
                    color: "white",
                    px: 2.5,
                    py: 1,
                    borderRadius: 1,
                    fontWeight: "bold",
                  }}
                >
                  {roomId}
                </Box>
              </Box>
            </ListItem>


            <ListItem>
              <Button
                onClick={copyRoomId}
                variant="outlined"
                sx={{ color: "white", borderColor: "white", mt: 8 }}
              >
                Copy Room ID
              </Button>
            </ListItem>
          </List>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Users in Room:
            </Typography>
            <List dense disablePadding>
              {users.map((user, index) => {
                const name =
                  typeof user === "string" ? user : user?.userName || "Unknown";
                return (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <Box
                      sx={{
                        backgroundColor: "#8e4095",
                        color: "white",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        width: "100%",
                        transition: "background-color 0.3s",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#a34dac",
                        },
                      }}
                    >
                      <ListItemText
                        primary={name}
                        primaryTypographyProps={{
                          variant: "body1",
                          sx: { color: "inherit" },
                        }}
                      />
                    </Box>
                  </ListItem>
                );
              })}
            </List>

            {typingUser && (
              <Typography variant="body2" sx={{ fontStyle: "italic", mt: 5 }}>
                {typingUser}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "red",
              color: "white",
              borderRadius: 2,
              cursor: "pointer",
              mt: 10,
              "&:hover": {
                backgroundColor: "#b30000",
              },
            }}
            onClick={handleLeaveRoom}
          >
            Leave room
          </Button>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <TextEditor
            text={text}
            setText={setText}
            socket={socket}
            roomId={roomId}
          />
        </Typography>
      </Box>
    </Box>
  );
};

export default App;
