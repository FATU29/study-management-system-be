import express from 'express'
import usersRouter from './routes/users.routes'
import coursesRouter from '~/routes/courses.routes'
import roleRouter from '~/routes/role.routes'
import notificationsRouter from './routes/notifications.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import process from 'node:process'
import cors from 'cors'
import refreshTokenRouter from '~/routes/refreshToken.routes'
import searchRouter from './routes/search.routes'
import { initSocket } from './utils/socket'
import fileRouter from './routes/files.routes'
import messageRouter from './routes/messages.routes'
dotenv.config()

const port = process.env.PORT
const app = express()

databaseService.connect().catch(console.dir)
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

app.use('/api/users', usersRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/files', fileRouter)
app.use('/api/role', roleRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/search', searchRouter)
app.use('/api/refresh-token', refreshTokenRouter)
app.use('/api/message',messageRouter)
app.use(defaultErrorHandler)



const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }
})

initSocket(io)

io.on('connection', (socket) => {

  socket.on('join', (userId) => {
    console.log(`User ${userId} joined their room`)
    socket.join(userId)
  })

  socket.on('send-notification', (userId, notification) => {
    console.log(`Sending notification to user ${userId}:`, notification)
    io.to(userId).emit('new-notification', notification)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id)
  })
})


app.use(defaultErrorHandler)
server.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
