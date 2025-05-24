const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).send("이미 존재하는 아이디입니다.");
  const user = new User({ username, password });
  await user.save();
  res.send("회원가입 성공");
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send("아이디 또는 비밀번호가 틀렸습니다.");
  }
  req.session.userId = user._id;
  req.session.username = user.username;
  res.send("로그인 성공");
});

router.get('/status', (req, res) => {
  if (req.session.userId) {
    return res.json({ loggedIn: true, username: req.session.username });
  }
  res.json({ loggedIn: false });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send("로그아웃 완료");
  });
});

module.exports = router;
