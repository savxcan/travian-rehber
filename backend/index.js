const express = require("express")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()
const prisma = new PrismaClient()

// ✅ CORS FIX (çok önemli)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || "7d"

// 🧪 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend çalışıyor 🚀")
})

// 🔐 TOKEN OLUŞTUR
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES }
  )
}

// 🔒 AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: "Token yok" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: "Geçersiz token" })
  }
}

// 👑 ADMIN MIDDLEWARE
function adminOnly(req, res, next) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Yetkisiz" })
  }
  next()
}

// 📝 REGISTER
app.post("/register", async (req, res) => {
  const { email, password, server, nickname } = req.body

  if (!email || !password || !server || !nickname) {
    return res.status(400).json({ error: "Eksik alan" })
  }

  try {
    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        server,
        nickname,
        role: "USER"
      }
    })

    const token = generateToken(user)

    res.json({
      user: {
        id: user.id,
        email: user.email,
        server: user.server,
        nickname: user.nickname,
        role: user.role
      },
      token
    })
  } catch (err) {
    res.status(400).json({ error: "Email zaten kayıtlı" })
  }
})

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(401).json({ error: "Kullanıcı bulunamadı" })
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    return res.status(401).json({ error: "Şifre yanlış" })
  }

  const token = generateToken(user)

  res.json({
    user: {
      id: user.id,
      email: user.email,
      server: user.server,
      nickname: user.nickname,
      role: user.role
    },
    token
  })
})

// 🔒 ME (TEST)
app.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  })

  res.json({
    id: user.id,
    email: user.email,
    server: user.server,
    nickname: user.nickname,
    role: user.role
  })
})

// 👥 ADMIN - USERS
app.get("/admin/users", authMiddleware, adminOnly, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      nickname: true,
      server: true,
      role: true
    }
  })

  res.json(users)
})

// 🔄 ADMIN - ROLE UPDATE
app.post("/admin/role", authMiddleware, adminOnly, async (req, res) => {
  const { userId, role } = req.body

  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })

  res.json({ success: true })
})

// 🚀 SERVER START
app.listen(5000, () => {
  console.log("Backend çalışıyor: http://localhost:5000")
})