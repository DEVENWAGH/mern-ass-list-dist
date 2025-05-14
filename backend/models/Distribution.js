const mongoose = require("mongoose");

const distributionSchema = mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    items: [
      {
        firstName: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        notes: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Distribution", distributionSchema);
