const mongoose = require("mongoose");

const listItemSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
    },
    notes: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "not_interested", "converted"],
      default: "pending",
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ListItem", listItemSchema);
