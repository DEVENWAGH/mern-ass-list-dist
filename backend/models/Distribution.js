const mongoose = require("mongoose");

const distributionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    fileName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Distribution", distributionSchema);
