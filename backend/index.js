const express = require("express")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()
const prisma = new PrismaClient()

// ✅ CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET || "secret"
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || "7d"

// 🔍 HEALTH
app.get("/", (req, res) => {
  res.send("Backend çalışıyor 🚀")
})

// 🔐 TOKEN
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES }
  )
}

// 🔒 AUTH
function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: "Token yok" })

  try {
    const token = header.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: "Geçersiz token" })
  }
}

// 👑 ADMIN
function admin(req, res, next) {
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
    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { email, password: hash, server, nickname }
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
  } catch {
    res.status(400).json({ error: "Email zaten kayıtlı" })
  }
})

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: "Kullanıcı yok" })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: "Şifre yanlış" })

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

// 👤 ME
app.get("/me", auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  })

  res.json(user)
})

// 👥 ADMIN USERS
app.get("/admin/users", auth, admin, async (req, res) => {
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

// 🔄 ROLE UPDATE
app.post("/admin/role", auth, admin, async (req, res) => {
  const { userId, role } = req.body

  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })

  res.json({ success: true })
})

// 📚 GUIDE CREATE
app.post("/admin/guide", auth, admin, async (req, res) => {
  const { title, content, category } = req.body

  const guide = await prisma.guide.create({
    data: { title, content, category }
  })

  res.json(guide)
})

// 📚 GUIDE LIST
app.get("/guides", async (req, res) => {
  const guides = await prisma.guide.findMany({
    orderBy: { createdAt: "desc" }
  })

  res.json(guides)
})

// 🚀 START
app.listen(5000, () => {
  console.log("Backend çalışıyor: http://localhost:5000")
})