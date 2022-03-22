const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const SSLCommerzPayment = require("sslcommerz-lts");
const Donation = require("../models/donationModel");

require("dotenv").config();
// all order products get ==============================================
router.get("/allDonation", async (req, res) => {
  const donations = await Donation.find({});
  res.send(donations);
});
// Delete manage all product ----------
router.delete("/manageAllDonationDelete/:id", async (req, res) => {
  const result = await Donation.findByIdAndDelete(req.params.id);
  res.send(result);
});
// my order delete ----------
router.delete("/myMyDonationDelete/:id", async (req, res) => {
  const result = await Donation.findByIdAndDelete(req.params.id);
  res.send(result);
});
// order Product ==================================================
router.post("/addToCartProduct", async (req, res) => {
  const product = req.body;
  const result = await Donation.create(product);
  res.json(result);
});
// email get my Order==============================================
router.get("/myDonation/:email", async (req, res) => {
  const email = req.params.email;
  const query = { cus_email: email };
  const myDonation = await Donation.find(query);
  res.send(myDonation);
});
// approve api-------------------
router.patch("/statusUpdate/:id", async (req, res) => {
  const status = req.body.status;
  const result = await Donation.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.send(result);
});
//sslcommerz init
router.post("/donationInit", async (req, res) => {
  const data = {
    total_amount: req.body.total_amount,
    currency: "BDT",
    tran_id: uuidv4(),
    success_url: "https://localhost:8000/api/donationSuccess",
    fail_url: "https://localhost:8000/api/fail",
    cancel_url: "https://localhost:8000/api/cancel",
    ipn_url: "https://localhost:8000/api/ipn",
    product_name: "Donation",
    product_category: "Donation",
    product_profile: "Donation",
    cus_name: req.body.cus_name,
    cus_email: req.body.cus_email,
    date: req.body.date,
    product_image: "https://i.ibb.co/t8Xfymf/logo-277198595eafeb31fb5a.png",
    cus_add1: req.body.cus_add1,
    cus_city: req.body.cus_city,
    cus_postcode: req.body.cus_postcode,
    cus_country: req.body.cus_country,
    ocupation: req.body.ocupation,
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
    multi_card_name: "mastercard",
    value_a: "ref001_A",
    value_b: "ref002_B",
    value_c: "ref003_C",
    value_d: "ref004_D",
    cus_phone: "01799999999",
    shipping_method: "NO",
  };
  const order = await Donation.create(data);
  const sslcommer = new SSLCommerzPayment(
    process.env.STORE_ID,
    process.env.STORE_PASS,
    false
  ); //true for live default false for sandbox
  sslcommer.init(data).then((data) => {
    //https://developer.sslcommerz.com/doc/v4/#returned-parameters

    if (data.GatewayPageURL) {
      res.json(data.GatewayPageURL);
    } else {
      return res.status(400).json({
        message: "Payment session failed",
      });
    }
  });
});
router.post("/donationSuccess", async (req, res) => {
  const result = await Donation.updateOne(
    { tran_id: req.body.tran_id },
    {
      $set: {
        val_id: req.body.val_id,
      },
    }
  );
  res
    .status(200)
    .redirect(`https://localhost:3000/success/${req.body.tran_id}`);
});

router.post("/fail", async (req, res) => {
  const result = await Donation.deleteOne({
    tran_id: req.body.tran_id,
  });
  res.status(400).redirect("https://localhost:3000");
});

router.post("/cancel", async (req, res) => {
  const result = await Donation.deleteOne({
    tran_id: req.body.tran_id,
  });
  res.status(300).redirect("https://localhost:3000");
});

router.post("/ipn", async (req, res) => {
  const result = await Donation.deleteOne({
    tran_id: req.body.tran_id,
  });
  res.status(300).redirect("https://localhost:3000");
});

router.get("/donationReq/:tran_id", async (req, res) => {
  const id = req.params.tran_id;
  const result = await Donation.findOne({ tran_id: id });
  res.json(result);
});
module.exports = router;
