const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const dns = require('dns');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: true
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000;
const DOMAIN = process.env.DOMAIN || 'valorant-login-server.onrender.com';

app.listen(PORT, () => {
  dns.lookup(DOMAIN, (err, address) => {
    if (err) {
      console.log(`⚠️ IP 조회 실패: ${err.message}`);
    } else {
      console.log(`✅ 현재 아이피 : ${address}`);
    }
  });
  console.log(`✅ 현재 서버 이상 없음! (포트: ${PORT})`);
});