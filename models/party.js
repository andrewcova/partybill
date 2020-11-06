import mongoose from 'mongoose';

const partySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date: Date,
  member: [String],
  debtors: [String],
});



export default mongoose.model('Party', partySchema);
