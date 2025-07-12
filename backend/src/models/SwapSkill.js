import mongoose from 'mongoose';

const swapSkillSchema = new mongoose.Schema({
  requestor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  offeredSkill: {
    type: String,
    required: true,
  },
  wantedSkill: {
    type: String,
    required: true,
  },
  message: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const SwapSkill = mongoose.model('SwapSkill', swapSkillSchema);

export default SwapSkill;
