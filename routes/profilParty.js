import express from 'express';
const router = express.Router();
import User from '../models/user.js'
import Party from '../models/party.js';

router.get('/', async (req, res) => {

  const nameUrer = req.session.username;

  const user = await User.findOne({
    name: nameUrer
  });
  const arrParty = await Party.find({user: user._id});

  return res.send({arrParty});
});
export default router;
