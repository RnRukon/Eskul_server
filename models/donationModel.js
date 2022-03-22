const mongoose = require("mongoose");
const DonationSchema = new mongoose.Schema({}, { strict: false });
const Donation = mongoose.model("Donation", DonationSchema);

module.exports = Donation;
