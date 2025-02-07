import express from "express"
import Room from "../Models/Room.js"

const router = express.Router()

// Create Room
router.post("/create-room", async (req, res) => {
  try {
    const { playerName } = req.body
    const roomId = Math.random().toString(36).substr(2, 4).toUpperCase()

    const newRoom = new Room({
      roomId,
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: null,
      tie: false,
      X_name: playerName,
    })

    await newRoom.save()
    res.json({ roomId, player: "X" })
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" })
  }
})

// Join Room
router.post("/join-room", async (req, res) => {
  try {
    const { roomId, playerName } = req.body
    const room = await Room.findOne({ roomId })
    if (!room) return res.status(404).json({ error: "Room not found" })

    room.O_name = playerName
    await room.save()
    res.json({ roomId, player: "O" })
  } catch (error) {
    res.status(500).json({ error: "Failed to join room" })
  }
})

// Update Game State
router.post("/update-room", async (req, res) => {
  try {
    const { roomId, squares, xIsNext, winner, winnerName, tie } = req.body
    await Room.findOneAndUpdate({ roomId }, { squares, xIsNext, winner, winnerName, tie })
    res.json({ message: "Game updated" })
  } catch (error) {
    res.status(500).json({ error: "Failed to update room" })
  }
})

// Get Room State (should be a GET request, not POST)
router.get("/room/:roomId", async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
    if (!room) return res.status(404).json({ error: "Room not found" })
    res.json(room)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch room" })
  }
})

router.post("/restart-room", async (req, res) => {
  try {
    const { roomId } = req.body
    if (!roomId || typeof roomId !== "string") {
      return res.status(400).json({ error: "Invalid room ID" })
    }
    const room = await Room.findOne({ roomId })

    if (!room) {
      return res.status(404).json({ error: "Room not found" })
    }

    // Reset game state
    room.squares = Array(9).fill(null)
    room.xIsNext = true
    room.winner = null
    room.winnerName = null
    room.tie = false

    // Instead of clearing O_name, we'll swap X_name and O_name
    ;[room.X_name, room.O_name] = [room.O_name, room.X_name]

    await room.save()
    res.json({ message: "Game restarted successfully", room })
  } catch (error) {
    console.error("Error restarting game:", error)
    res.status(500).json({ error: "Failed to restart game" })
  }
})

router.post("/leave-room", async (req, res) => {
  try {
    const { roomId, playerName } = req.body;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Remove player from the room
    if (room.X_name === playerName) {
      room.X_name = null;
    } else if (room.O_name === playerName) {
      room.O_name = null;
    } else {
      return res.status(400).json({ error: "Player not in room" });
    }

    // If both players left, delete the room
    if (!room.X_name && !room.O_name) {
      await Room.deleteOne({ roomId });
      return res.json({ message: "Room deleted as both players left" });
    }

    await room.save();
    res.json({ message: "Player left the room", room });
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({ error: "Failed to leave room" });
  }
});


export default router

