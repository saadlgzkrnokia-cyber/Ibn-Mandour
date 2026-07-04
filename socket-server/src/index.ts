import http from "http"
import { Server } from "socket.io"
import { createAdapter } from "@socket.io/redis-adapter"
import { createClient } from "redis"

const PORT = process.env.SOCKET_PORT || 3001

const server = http.createServer()

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Redis adapter for horizontal scaling (optional)
// const pubClient = createClient({ url: process.env.REDIS_URL });
// const subClient = pubClient.duplicate();
// io.adapter(createAdapter(pubClient, subClient));

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId
  if (!userId) return next(new Error("Authentication required"))
  ;(socket as any).userId = userId
  next()
})

io.on("connection", (socket) => {
  const userId = (socket as any).userId
  console.log(`User connected: ${userId}`)

  socket.on("join:room", (room: string) => socket.join(room))
  socket.on("leave:room", (room: string) => socket.leave(room))

  // Notification helpers
  const emitToUser = (userId: string, event: string, data: any) => {
    io.to(`user:${userId}`).emit(event, data)
  }

  const emitToClass = (className: string, event: string, data: any) => {
    io.to(`class:${className}`).emit(event, data)
  }

  const emitToTeachers = (event: string, data: any) => {
    io.to("teachers").emit(event, data)
  }

  const emitToAdmin = (event: string, data: any) => {
    io.to("admin").emit(event, data)
  }

  // Expose helpers on socket for service usage
  ;(socket as any).emitToUser = emitToUser
  ;(socket as any).emitToClass = emitToClass
  ;(socket as any).emitToTeachers = emitToTeachers
  ;(socket as any).emitToAdmin = emitToAdmin

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`)
  })
})

server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`)
})

export { io }
export type { ServerEvents, ClientEvents } from "./types"
