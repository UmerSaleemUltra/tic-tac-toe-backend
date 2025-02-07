import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  squares: { type: Array, required: true },
  xIsNext: { type: Boolean, required: true },
  winner: { type: String },
  winnerName: { type: String },
  tie: { type: Boolean, required: true },
  X_name: { type: String, required: true },
  O_name: { type: String },
  messages: [
    {
      playerName: { type: String, required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
})

const Room = mongoose.model("Room", roomSchema)

export default Room