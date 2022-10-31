require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// rest of the packages
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

// database
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const managerRouter = require('./routes/managerRoutes')

// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(helmet())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<center><h1>Ticketing System Backend</h1></center>')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/manager', managerRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    if (process.env.NODE_ENV !== 'test') {
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      )
    }
  } catch (error) {
    console.log(error)
  }
}

start()

module.exports = app