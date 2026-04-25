import mongoose from "mongoose";

const fighterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nickname: { type: String, default: "" },
    division: { type: String, required: true },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    knockouts: { type: Number, default: 0 },
    submissions: { type: Number, default: 0 },
    height: { type: String, default: "" },
    reach: { type: String, default: "" },
    stance: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    country: { type: String, default: "" },
    bio: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    popularityScore: { type: Number, default: 0 },
    notableFights: [
      {
        opponent: String,
        event: String,
        result: String,
        method: String,
        round: Number,
        year: Number
      }
    ]
  },
  { timestamps: true }
);

const Fighter = mongoose.model("Fighter", fighterSchema);
export default Fighter;
