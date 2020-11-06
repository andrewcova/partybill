import express from 'express';
import session from 'express-session';
// import sessionFileStore from 'session-file-store';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import usersRouter from './routes/user.js';
import newPartyRouter from './routes/newParty.js';
import profilPartyRouter from './routes/profilParty.js';
import deletePartyRouter from './routes/deleteParty.js';
import dotenv from 'dotenv'; 
dotenv.config(); 

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({
  extended: false
}));

app.set('view engine', 'hbs');
const MongoStore = connectMongo(session);

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    key: 'racooncookie'
  },
  store: new MongoStore({
    mongooseConnection: mongoose.createConnection(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  })
}));

app.use((req, res, next) => {
  if (req.session.username) {
    res.locals.username = req.session.username; // если в сессии есть юзер записываем его в объект res.locals который доступен всем hbs
  };
  next();
});

app.get('/', (req, res) => {
  return res.render('home');
});

app.use('/user', usersRouter);
app.use('/profilParty', profilPartyRouter);
app.use('/newParty', newPartyRouter);
app.use('/deleteParty', deletePartyRouter);

app.listen(process.env.PORT ?? 3000);



