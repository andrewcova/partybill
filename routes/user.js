import express from 'express';
import User from '../models/user.js'
const router = express.Router();



router.get('/singin', (req, res) => {
  return res.render('user/singin');
}).post('/singin', async (req, res) => {
  const {
    name,
    password,
    email
  } = req.body;

  if (!name && !password && !email) {
    return res.render('user/singin', {
      massage: 'Все поля должны быть заполнены'
    });
  }
  const userName = await User.findOne({
    name
  });
  const userEmail = await User.findOne({
    email
  });

  if (userName !== null && userEmail !== null) {
    return res.render('user/singin', {
      massage: 'Username и Email должны быть уникальными'
    });
  }
  const user = new User({
    name,
    password,
    email
  });
  await user.save();
  return res.render('home', {
    nameUser: user.name
  });

});



router.get('/singup', (req, res) => {
  return res.render('user/singup');
});

router.post('/singup', async (req, res) => {
  const {
    password,
    email
  } = req.body;
  const user = await User.findOne({
    email
  });
  if (user) {
    if (user.password === password + '') {
      req.session.username = user.name;
      res.locals.username = user.name;
      return res.render('home');
    }
    return res.render('user/singup', {
      massage: 'Не правильный пароль'
    });
  }
  return res.render('user/singup', {
    massage: 'Нет такого профиля'
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(); // удаляем сессию
  res.locals.username = '';
  res.status(200);
  res.render('home');
});

export default router;
