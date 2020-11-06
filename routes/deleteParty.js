import express from 'express';
const router = express.Router();
import User from '../models/user.js'
import Party from '../models/party.js';

router.get('/:id', async (req, res) => {
  const party = req.params.id;
  if (!req.session.username) {
    return res.redirect('/');
  }
  // const user = req.session.user
  console.log('I FM FROM DELETE', party);
await Party.deleteOne({ _id: party }, function (err) {
  if (err) return res.redirect('/');
});
  res.status(200).end();
});
export default router;
