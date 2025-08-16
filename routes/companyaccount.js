const express = require("express");
require("dotenv").config({ path: __dirname + "/.env" });
const router = express.Router();
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
const {
  Companyaccount,
  Workflow,
  Shareholdercapital,
  validateCompanyInfo,
} = require("../models/companyaccount");
const {
  Subscription,
  SubscriberSubscription,
} = require("../models/subscription");
const auth = require("../middleware/Auth");
const { date } = require("joi");
const { documentsetting } = require("../models/documentsetting");
const { User } = require("../models/user");
var nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const uploadCloudinary = require("../configs/couldinary");
const { authenticateToken } = require("../middleware/accessToken");
const { ShareholderInfo } = require("../models/shareHoldersInfo");
const invateShareHolder = require("../models/invateShareHolder");
const { sendShareInvitationEmail } = require("../configs/sendShareMail");
const { sendDirectorInvitationEmail } = require("../configs/directorMail");
const DirectorInvite = require("../models/DirectorInvite");
const { CompanyAccount } = require("../models/company");

const directorInfo = require("../models/directorInfo");
const CompanySecretary = require("../models/companySecretary");
const ShareCapital = require("../models/shareCapital");
var liveurlnew = "./uploads";
// var liveurlnew="../newcomsec/src/assets";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "company_logo") {
      // cb(null, "../Frontend/assets/company_logo");
      cb(null, liveurlnew + "/company_logo"); //localhost
    }
  },
  filename: (req, file, cb) => {
    if (file != "") {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  },
});
const upload = multer({ storage: storage });

// creating company info
// router.post("/submitCompanyInfo", async (req, res) => {
//   try {
//     let companyLogoUrl = "";
//     if (req.body.companyLogo) {
//       companyLogoUrl = await uploadCloudinary(req.body.companyLogo);
//     }
//     console.log('reqqqq',req.body)

//     const companyInfo = new Companyaccount({
//       business_name: req.body.companyNameEN,
//       trading_name: req.body.companyNameCN,
//       business_name_chinese: req.body.companyNameCN,
//       type_of_business: req.body.companyType,
//       natureOfBusiness: req.body.natureofCompany.value,
//       natureOfBusiness_code: req.body.natureofCompany.code,
//       subscriptionDuration: req.body.subscriptionDuration,
//       office_address: req.body.Flat_Address,
//       office_address1: req.body.Building_Address,
//       office_city: req.body.District_Address,
//       office_country: req.body.country_Address,
//       office_state: req.body.country_Address,
//       email_id: req.body.company_Email,
//       mobile_number: req.body.company_Telphone,
//       fax: req.body.company_Fax,
//       reference_no: req.body.presentorReferance,
//       company_logo: companyLogoUrl,
//       presentorName: req.body.presentorName,
//       presentorChiName: req.body.presentorChiName,
//       presentorAddress: req.body.presentorAddress,
//       presentorDistrict: req.body.presentorDistrict,
//       presentorBuilding: req.body.presentorBuilding,
//       presentorStreet: req.body.presentorStreet,
//       presentorTel: req.body.presentorTel,
//       presentorFax: req.body.presentorFax,
//       presentorEmail: req.body.presentorEmail,

//       currentStage : req.body.currentStage
//     });

//     const savedCompanyInfo = await companyInfo.save();
//     console.log("saving",savedCompanyInfo)
//     const userId = req.body.userId; // Assuming the user ID is sent in the request

//     if (userId) {
//       await User.findByIdAndUpdate(
//         userId,
//         { $push: { companyid: savedCompanyInfo._id } }, // Push the new companyId to user's companyid array
//         { new: true }
//       );
//     }
//     console.log("saving",User)


//     res.status(201).json({
//       message: "Company information submitted successfully!",
//       companyId: savedCompanyInfo._id,
//     });
//   } catch (err) {
//     console.error("Error submitting company information:", err);
//     res.status(500).json({ error: "Server error. Please try again later." });
//   }
// });

router.post("/createCompanyInfo", async (req, res) => {
  try {
    let companyLogoUrl = "";
    if (req.body.companyLogo) {
      companyLogoUrl = await uploadCloudinary(req.body.companyLogo);
    }

    console.log("new company account creation : ", req.body)

    const companyInfo = new Companyaccount({
      business_name: req.body.companyNameEN,
      trading_name: req.body.companyNameCN,
      business_name_chinese: req.body.companyNameCN,
      type_of_business: req.body.companyType,
      natureOfBusiness: req.body.natureofCompany.value,
      natureOfBusiness_code: req.body.natureofCompany.code,
      subscriptionDuration: req.body.subscriptionDuration,
      office_address: req.body.Flat_Address,
      office_address1: req.body.Building_Address,
      office_city: req.body.District_Address,
      office_country: req.body.country_Address,
      office_state: req.body.country_Address,
      email_id: req.body.company_Email,
      mobile_number: req.body.company_Telphone,
      fax: req.body.company_Fax,
      reference_no: req.body.presentorReferance,
      company_logo: companyLogoUrl,
      presentorName: req.body.presentorName,
      presentorChiName: req.body.presentorChiName,
      presentorAddress: req.body.presentorAddress,
      presentorDistrict: req.body.presentorDistrict,
      presentorBuilding: req.body.presentorBuilding,
      presentorStreet: req.body.presentorStreet,
      presentorTel: req.body.presentorTel,
      presentorFax: req.body.presentorFax,
      presentorEmail: req.body.presentorEmail,
      currentStage: req.body.currentStage
    });

    const savedCompanyInfo = await companyInfo.save();
    const userId = req.body.userId;

    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        { $push: { companyid: savedCompanyInfo._id } },
        { new: true }
      );
    }

    res.status(201).json({
      message: "Company information created successfully!",
      companyId: savedCompanyInfo._id,
    });
  } catch (err) {
    console.error("Error creating company information:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Update existing company
router.put("/updateCompanyInfo/:companyId", async (req, res) => {
  try {
    let companyLogoUrl = req.body.companyLogo;
    
    // Only upload to cloudinary if it's a new base64 image
    if (req.body.companyLogo && req.body.companyLogo.startsWith('data:image')) {
      companyLogoUrl = await uploadCloudinary(req.body.companyLogo);
    }

    const updateData = {
      business_name: req.body.companyNameEN,
      trading_name: req.body.companyNameCN,
      business_name_chinese: req.body.companyNameCN,
      type_of_business: req.body.companyType,
      natureOfBusiness: req.body.natureofCompany.value,
      natureOfBusiness_code: req.body.natureofCompany.code,
      subscriptionDuration: req.body.subscriptionDuration,
      office_address: req.body.Flat_Address,
      office_address1: req.body.Building_Address,
      office_city: req.body.District_Address,
      office_country: req.body.country_Address,
      office_state: req.body.country_Address,
      email_id: req.body.company_Email,
      mobile_number: req.body.company_Telphone,
      fax: req.body.company_Fax,
      reference_no: req.body.presentorReferance,
      company_logo: companyLogoUrl,
      presentorName: req.body.presentorName,
      presentorChiName: req.body.presentorChiName,
      presentorAddress: req.body.presentorAddress,
      presentorDistrict: req.body.presentorDistrict,
      presentorBuilding: req.body.presentorBuilding,
      presentorStreet: req.body.presentorStreet,
      presentorTel: req.body.presentorTel,
      presentorFax: req.body.presentorFax,
      presentorEmail: req.body.presentorEmail,
      currentStage: req.body.currentStage
    };

    const updatedCompany = await Companyaccount.findByIdAndUpdate(
      req.params.companyId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json({
      message: "Company information updated successfully!",
      companyId: updatedCompany._id,
    });
  } catch (err) {
    console.error("Error updating company information:", err);

    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.put("/updateCompanyCurrentStage/:companyId", async (req, res) =>{
   const updateData = {
      currentStage: req.body.currentStage
    };
   
   const updatedCompany = await Companyaccount.findByIdAndUpdate(
      req.params.companyId,
      updateData,
      { new: true, runValidators: true }
    );
})


router.post("/creationOfShare", async (req, res) => {
  try {
    console.log("Inside the share creation");
    console.log("Request body:", req.body); 

    const {
      companyId: companyid,
      userid,
      total_shares_proposed: total_share,
      unit_price: amount_share,
      total_capital_subscribed,
      unpaid_amount,
      class_of_shares: share_class,
      particulars_of_rights: share_right,
      currency=currency
    } = req.body;

    // Log received data
    console.log("Received data:", {
      companyid,
      userid,
      total_share,
      amount_share,
      share_class,
      share_right,
      total_capital_subscribed,
      unpaid_amount,
    });

    // Validate required fields
    if (
      !companyid ||
      !userid ||
      !total_share ||
      !amount_share ||
      !share_class ||
      total_capital_subscribed === undefined ||
      unpaid_amount === undefined
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Parse numerical values
    const numericTotalShare = parseInt(total_share, 10);
    const numericAmountShare = parseFloat(amount_share);
    const numericTotalCapitalSubscribed = parseFloat(total_capital_subscribed);
    const numericUnpaidAmount = parseFloat(unpaid_amount);

    // Create a new share capital entry
    const newShare = new ShareCapital({
      userid,
      companyid,
      total_share: numericTotalShare,
      amount_share: numericAmountShare,
      currency: currency,
      total_capital_subscribed: numericTotalCapitalSubscribed,
      unpaid_amount: numericUnpaidAmount,
      share_class,
      share_right,
    });

    // Attempt to save and catch errors
    await newShare.save();

    // Update total share in the Companyaccount collection
    await Companyaccount.findByIdAndUpdate(companyid, {
      $inc: { total_share: numericTotalShare },
    });

    return res.status(201).json({ message: "Share created successfully!" });
  } catch (error) {
    console.error("Error creating/updating share:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.put("/updateShare", async (req, res) => {
  try {
    console.log("Inside share update");
    console.log("Request body:", req.body);

    const {
      shareId,
      companyId,
      userid,
      total_shares_proposed: total_share,
      unit_price: amount_share,
      total_capital_subscribed,
      unpaid_amount,
      class_of_shares: share_class,
      particulars_of_rights: share_right,
      currency:currency
    } = req.body;

    // Log received data
    console.log("Received update data:", {
      shareId,
      companyId,
      userid,
      total_share,
      amount_share,
      share_class,
      share_right,
      total_capital_subscribed,
      unpaid_amount,
      
    });

    // Validate required fields
    if (
      !shareId ||
      !companyId ||
      !userid ||
      !total_share ||
      !amount_share ||
      !share_class ||
      total_capital_subscribed === undefined ||
      unpaid_amount === undefined
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Find the existing share to get the old total_share
    const existingShare = await ShareCapital.findById(shareId);
    if (!existingShare) {
      return res.status(404).json({ error: "Share not found." });
    }

    // Calculate the difference in shares to update company total
    const oldTotalShare = existingShare.total_share;
    const newTotalShare = parseInt(total_share, 10);
    const shareDifference = newTotalShare - oldTotalShare;

    // Parse numerical values
    const numericAmountShare = parseFloat(amount_share);
    const numericTotalCapitalSubscribed = parseFloat(total_capital_subscribed);
    const numericUnpaidAmount = parseFloat(unpaid_amount);

    // Update the share capital
    await ShareCapital.findByIdAndUpdate(shareId, {
      total_share: newTotalShare,
      amount_share: numericAmountShare,
      total_capital_subscribed: numericTotalCapitalSubscribed,
      unpaid_amount: numericUnpaidAmount,
      currency,
      share_class,
      share_right,
    });

    // Update the company's total share count if there was a change
    if (shareDifference !== 0) {
      await Companyaccount.findByIdAndUpdate(companyId, {
        $inc: { total_share: shareDifference },
      });
    }

    return res.status(200).json({ message: "Share updated successfully!" });
  } catch (error) {
    console.error("Error updating share:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Delete share capital
router.delete("/deleteShare/:shareId/:companyId", async (req, res) => {
  try {
    console.log("Inside share deletion");
    const { shareId, companyId } = req.params;

    // Log received data
    console.log("Deleting share:", { shareId, companyId });

    // Validate required parameters
    if (!shareId || !companyId) {
      return res.status(400).json({ error: "Share ID and Company ID are required." });
    }

    // Find the share to be deleted to get its total_share value
    const shareToDelete = await ShareCapital.findById(shareId);
    if (!shareToDelete) {
      return res.status(404).json({ error: "Share not found." });
    }

    // Get the total_share value to deduct from company account
    const totalShareToDeduct = shareToDelete.total_share;

    // Delete the share capital
    await ShareCapital.findByIdAndDelete(shareId);

    // Update the company's total share count
    await Companyaccount.findByIdAndUpdate(companyId, {
      $inc: { total_share: -totalShareToDeduct },
    });

    return res.status(200).json({ message: "Share deleted successfully!" });
  } catch (error) {
    console.error("Error deleting share:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


// create shareHoldersInfo
router.post("/shareHoldersInfo", async (req, res) => {
  try {
    const {
      surname,
      name,
      chineeseName,
      idNo,
      idProof,
      userType,
      address,
      street,
      building,
      district,
      addressProof,
      email,
      phone,
      shareDetailsNoOfShares,
      shareDetailsClassOfShares,
      userId,
      companyId,
      isInvited
    } = req.body;

    console.log("Received data:", req.body);

    if (
      !name ||
      !idProof ||
      !userType ||
      !address ||
      !email ||
      !shareDetailsNoOfShares ||
      !shareDetailsClassOfShares ||
      !userId ||
      !companyId
    ) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "All fields are required." });
    }

    // Upload files to Cloudinary
    const idProofUrl = await uploadCloudinary(idProof);
    let addressProofUrl = null;
    if (addressProof) {
      addressProofUrl = await uploadCloudinary(addressProof);
    }

    // Ensure companyId and userId are valid ObjectIds
    let companyObjectId, userObjectId;
    
    try {
      companyObjectId = mongoose.Types.ObjectId(companyId);
      userObjectId = mongoose.Types.ObjectId(userId);
    } catch (error) {
      console.error("Invalid ObjectId format:", error);
      return res.status(400).json({ error: "Invalid company ID or user ID format" });
    }

    const newShareholderInfo = new ShareholderInfo({
      surname,
      name,
      chineeseName,
      idNo,
      idProof: idProofUrl,
      userType,
      address,
      district,
      building,
      street,
      addressProof: addressProofUrl,
      email,
      isInvited,
      phone,
      shareDetailsNoOfShares,
      shareDetailsClassOfShares,
      userId: userObjectId,
      companyId: companyObjectId,
    });

    console.log("New shareholder info:", newShareholderInfo);
    await newShareholderInfo.save();

    res.status(201).json({ 
      message: "Shareholder info created successfully!",
      shareholder: newShareholderInfo 
    });
  } catch (error) {
    console.error("Error creating shareholder info:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.delete("/deleteShareHolder/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ShareholderInfo.findByIdAndDelete(id);
    res.status(200).json({ message: "Shareholder deleted successfully!" });
  } catch (error) {
    console.error("Error deleting shareholder:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


router.put("/updateShareHolder/:id", async (req, res) => {
  try {
    const shareholderId = req.params.id
    const {
      surname,
      name,
      chineeseName,
      idNo,
      idProof,
      userType,
      address,
      street,
      building,
      district,
      addressProof,
      email,
      phone,
      shareDetailsNoOfShares,
      shareDetailsClassOfShares,
    } = req.body

    console.log("Updating shareholder:", shareholderId)
    console.log("Received data:", req.body)

    // Find the shareholder by ID
    const shareholder = await ShareholderInfo.findById(shareholderId)

    if (!shareholder) {
      return res.status(404).json({ message: "Shareholder not found" })
    }

    // Process images if new ones are provided
    let idProofUrl = shareholder.idProof
    if (idProof && idProof !== shareholder.idProof) {
      idProofUrl = await uploadCloudinary(idProof)
    }

    let addressProofUrl = shareholder.addressProof
    if (addressProof && addressProof !== shareholder.addressProof) {
      addressProofUrl = await uploadCloudinary(addressProof)
    }

    // Update the shareholder
    const updatedShareholder = await ShareholderInfo.findByIdAndUpdate(
      shareholderId,
      {
        surname,
        name,
        chineeseName,
        idNo,
        idProof: idProofUrl,
        userType,
        address,
        district,
        building,
        street,
        addressProof: addressProofUrl,
        email,
        phone,
        shareDetailsNoOfShares,
        shareDetailsClassOfShares,
      },
      { new: true },
    )

    res.status(200).json({
      message: "Shareholder updated successfully!",
      shareholder: updatedShareholder,
    })
  } catch (error) {
    console.error("Error updating shareholder:", error)
    res.status(500).json({ message: "Server error. Please try again later." })
  }
})

// create InvateShareHolders
router.post("/invateShare", async (req, res) => {
  try {
      const { name, email, classOfShares, noOfShares, userId, companyId,password } = req.body;

      console.log("Received data:", req.body);

      if (!name || !email || !classOfShares || !noOfShares || !userId || !companyId) {
          return res.status(400).json({ message: "All fields are required." });
      }
     const roles='Shareholder'

      const inviteShareHolders = new invateShareHolder({
          name,
          password,
          email,
          classOfShares,
          roles,
          noOfShares,
          userId: mongoose.Types.ObjectId(userId),
          companyId: mongoose.Types.ObjectId(companyId),
      });
      const inviteToken = jwt.sign({ email, companyId }, process.env.SECRET_KEY || "Token", { expiresIn: "1h" });
      const inviteUrl = `${process.env.FRONTEND_URL}/project-form?tab=1&token=${inviteToken}&companyId=${companyId}&isInvited=true`;

      await inviteShareHolders.save();
      console.log('inviteShareHolders',inviteShareHolders)
      await sendShareInvitationEmail(email, name, classOfShares, noOfShares, companyId,password,inviteUrl);

      res.status(201).json({ message: "Invitation to shareholder sent successfully!" });
  } catch (error) {
      console.error("Error creating shareholder invite mail:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/validate-invitation", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ valid: false, message: "Token is required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "Token");

    // First, check in the Shareholders database
    let invitation = await invateShareHolder.findOne({ 
      email: decoded.email,
      companyId: mongoose.Types.ObjectId(decoded.companyId)
    });

    let role = "Shareholder"; // Default role

    if (!invitation) {
      console.log(`No Shareholder found for ${decoded.email}, checking Directors...`);

      // If not found in Shareholders, check in Directors
      invitation = await DirectorInvite.findOne({ 
        email: decoded.email,
        companyId: mongoose.Types.ObjectId(decoded.companyId)
      });

      if (!invitation) {
        console.log(`No Director found for ${decoded.email} either.`);
        return res.status(404).json({ valid: false, message: "Invitation not found" });
      }

      role = "Director"; // Update role if found in Directors
    }

    console.log(`${decoded.email} is a ${role} in company ${decoded.companyId}`);

    // Generate a token for auto-login
    const authToken = jwt.sign(
      { id: invitation._id, email: invitation.email, role },
      process.env.SECRET_KEY || "Token",
      { expiresIn: "24h" }
    );

    return res.status(200).json({ 
      valid: true,
      token: authToken, // Authentication token for auto-login 
      invitationData: {
        id: invitation._id,
        name: invitation.name,
        email: invitation.email,
        classOfShares: invitation.classOfShares,
        noOfShares: invitation.noOfShares,
        companyId: invitation.companyId
      } 
    });

  } catch (error) {
    console.error("Error validating invitation token:", error);
    return res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
});


// Add a route to handle accepting the invitation
router.post("/accept-invitation", async (req, res) => {
  try {
    const { token, password } = req.body;

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "Token");

    let invitation = await invateShareHolder.findOne({ 
      email: decoded.email,
      companyId: mongoose.Types.ObjectId(decoded.companyId)
    });

    let role = "Shareholder";

    if (!invitation) {
      console.log(`No Shareholder found for ${decoded.email}, checking Directors...`);

      // If not found in Shareholders, check in Directors
      invitation = await DirectorInvite.findOne({ 
        email: decoded.email,
        companyId: mongoose.Types.ObjectId(decoded.companyId)
      });

      if (!invitation) {
        console.log(`No Director found for ${decoded.email} either.`);
        return res.status(404).json({ message: "Invitation not found" });
      }

      role = "Director";
    }

    console.log(`${decoded.email} is a ${role}, updating password...`);

    // Update the password (Make sure to hash it)
    invitation.password = password;
    await invitation.save();

    // Generate a login token
    const loginToken = jwt.sign(
      { id: invitation._id, email: invitation.email, role },
      process.env.SECRET_KEY || "Token",
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Invitation accepted successfully",
      token: loginToken,
      user: {
        id: invitation._id,
        name: invitation.name,
        email: invitation.email
      }
    });

  } catch (error) {
    console.error("Error accepting invitation:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});



router.get("/getShareCapitalList", async (req, res) => {
  try {
    const { companyId, userId } = req.query;
    console.log(req.query);

    if (!companyId || !userId) {
      return res
        .status(400)
        .json({ message: "Company ID and User ID are required." });
    }

    // Fetch share capital list with populated company name
    const shareCapitalList = await ShareCapital.find({
      companyid: companyId,
      userid: userId,
    }).populate("companyid", "companyName");

    console.log("Share capital list", shareCapitalList);

    if (shareCapitalList.length === 0) {
      return res.status(404).json({ message: "No share capital found." });
    }

    res.status(200).json({
      message: "Share capital list fetched successfully.",
      data: shareCapitalList,
    });
  } catch (error) {
    console.error("Error fetching share capital list:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching share capital list." });
  }
});


// Route to get the list of shareholders with populated data
router.get("/getShareHoldersList", async (req, res) => {
  const { companyId, userId } = req.query;
  console.log('Fetching shareholders for company:', companyId);

  if (!companyId) {
    return res.status(400).json({ message: "companyId is required." });
  }

  try {
    // Ensure companyId is a valid ObjectId
    let companyObjectId;
    try {
      companyObjectId = mongoose.Types.ObjectId(companyId);
    } catch (error) {
      console.error("Invalid companyId format:", error);
      return res.status(400).json({ error: "Invalid company ID format" });
    }

    // Find shareholders with this companyId
    const shareholders = await ShareholderInfo.find({ 
      companyId: companyObjectId 
    }).populate("companyId");
    
    console.log(`Found ${shareholders.length} shareholders for company ${companyId}`);

    res.status(200).json({
      message: "Shareholders fetched successfully",
      data: shareholders,
    });
  } catch (error) {
    console.error("Error fetching shareholders list:", error);
    res.status(500).json({ message: "Failed to fetch shareholders list", error: error.message });
  }
});


// Add this route to your router
router.delete("/deleteShareCapital", async (req, res) => {
  try {
    const id = req.query.id;
    console.log('delete query its getting',id);
    
    if (!id) {
      return res.status(400).json({ message: "ID is required." });
    }

    const deletedShareCapital = await ShareCapital.findByIdAndDelete(id);

    if (!deletedShareCapital) {
      return res.status(404).json({ message: "Share capital not found." });
    }

    res.status(200).json({ message: "Share capital deleted successfully." });
  } catch (error) {
    console.error("Error deleting share capital:", error);
    res.status(500).json({ message: "Server error while deleting share capital." });
  }
});


//Director info creation
router.post("/directorInfoCreation", async (req, res) => {
  try {
    const {
      surname,
      name,
      chineeseName,
      idNo,
      idProof,
      type,
      address,
      street,
      building,
      district,
      addressProof,
      email,
      phone,
      userId,
      isInvited,
      companyId,
    } = req.body;

    console.log("Received data:", req.body);

    if (
      !name ||
      !idProof ||
      !type ||
      !address ||
      !email ||
      !userId ||
      !companyId
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const idProofUrl = await uploadCloudinary(idProof);
    let addressProofUrl
    if (addressProof) {
      addressProofUrl = await uploadCloudinary(addressProof);
    }

    // Create a new director document
    const newDirector = new directorInfo({
      surname,
      name,
      chineeseName,
      idNo,
      idProof: idProofUrl,
      type,
      address,
      street,
      building,
      isInvited,
      district,
      addressProof: addressProofUrl,
      email,
      phone,
      userId: mongoose.Types.ObjectId(userId),
      companyId: mongoose.Types.ObjectId(companyId),
    });

    await newDirector.save();

    res.status(201).json({ message: "Director info created successfully!" });
  } catch (error) {
    console.error("Error creating director info:", error);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or ID number already exists." });
    }

    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.put("/updateDirector/:id", async (req, res) => {
  try {
    const directorId = req.params.id
    const {
      surname,
      name,
      chineeseName,
      idNo,
      idProof,
      type,
      address,
      street,
      building,
      district,
      addressProof,
      email,
      phone,
    } = req.body

    console.log("Updating director:", directorId)
    console.log("Received data:", req.body)

    // Find the director by ID
    const director = await directorInfo.findById(directorId)

    if (!director) {
      return res.status(404).json({ message: "Director not found" })
    }

    // Process images if new ones are provided
    let idProofUrl = director.idProof
    if (idProof && idProof !== director.idProof) {
      idProofUrl = await uploadCloudinary(idProof)
    }

    let addressProofUrl = director.addressProof
    if (addressProof && addressProof !== director.addressProof) {
      addressProofUrl = await uploadCloudinary(addressProof)
    }

    // Update the director
    const updatedDirector = await directorInfo.findByIdAndUpdate(
      directorId,
      {
        surname,
        name,
        chineeseName,
        idNo,
        idProof: idProofUrl,
        type,
        address,
        district,
        building,
        street,
        addressProof: addressProofUrl,
        email,
        phone,
      },
      { new: true },
    )

    res.status(200).json({
      message: "Director updated successfully!",
      director: updatedDirector,
    })
  } catch (error) {
    console.error("Error updating director:", error)
    res.status(500).json({ message: "Server error. Please try again later." })
  }
})

router.post("/uploadNNC1/:directorId", async (req, res) => {
  try {
    const { directorId } = req.params;

    // Upload file to Cloudinary

    // Update director record
    const updatedDirector = await directorInfo.findByIdAndUpdate(
      directorId,
      {
        NNC1Singed: true
      },
      { new: true }
    );

    if (!updatedDirector) {
      return res.status(404).json({ message: "Director not found." });
    }

    res.status(200).json({
      message: "NNC1 document uploaded successfully.",
      director: updatedDirector,
    });
  } catch (error) {
    console.error("Error uploading NNC1 document:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// getting data directors info
router.get("/getDirectorsInfo", async (req, res) => {
  try {
    const { companyId, userId } = req.query;

    if (!companyId || !userId) {
      return res
        .status(400)
        .json({ message: "companyId and userId are required" });
    }

    const directors = await directorInfo.find({ companyId });

    if (directors.length === 0) {
      return res
        .status(404)
        .json({ message: "No directors found for the given company and user" });
    }

    res
      .status(200)
      .json({ message: "Directors retrieved successfully", data: directors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve directors" });
  }
});

// Delete Director Information
router.delete("/deleteDirector/:id", async (req, res) => {
  try {
    const directorId = req.params.id;

    if (!directorId) {
      return res.status(400).json({ message: "Director ID is required" });
    }

    const deletedDirector = await directorInfo.findByIdAndDelete(directorId);

    if (!deletedDirector) {
      return res.status(404).json({ message: "Director not found" });
    }

    res.status(200).json({ message: "Director deleted successfully" });
  } catch (error) {
    console.error("Error deleting director:", error);
    res.status(500).json({ message: "Failed to delete director" });
  }
});

//create director invatition
router.post("/inviteDirector", async (req, res) => {
  try {
      const { name, email, classOfShares, noOfShares, userId, companyId, password,isInvited } = req.body;
      console.log('req.body',req.body)

      if (!name || !email || !userId || !companyId || !password) {
          return res.status(400).json({ message: "All fields are required." });
      }

      const roles = "Director";
      const inviteToken = jwt.sign({ email, companyId }, process.env.SECRET_KEY || "Token", { expiresIn: "1h" });
      const inviteUrl = `${process.env.FRONTEND_URL}/project-form?tab=2&token=${inviteToken}&companyId=${companyId}`;

      const directorInvite = new DirectorInvite({
          name,
          email,
          classOfShares,
          noOfShares,
          password,
          roles,
          isInvited,
          userId: mongoose.Types.ObjectId(userId),
          companyId: mongoose.Types.ObjectId(companyId),
      });

      await directorInvite.save();
      console.log("Director Invitation:", directorInvite);

      await sendDirectorInvitationEmail(email, name, classOfShares, noOfShares, password, companyId, inviteUrl);

      res.status(201).json({ message: "Invitation sent to the director successfully!" });
  } catch (error) {
      if (error.code === 11000) {
          const field = Object.keys(error.keyValue)[0]; 
          return res.status(400).json({ message: `The email ${error.keyValue[field]} already exists.` });
      }

      console.error("Error creating director invitation:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
  }
});



//comapny secretary creation
router.post("/companySecretary", async (req, res) => {
  try {
    const {
      tcspLicenseNo,
      tcspReason,
      type,
      surname,
      name,
      chineeseName,
      idProof,
      address,
      district,
      street,
      building,
      addressProof,
      email,
      phone,
      userId,
      companyId,
    } = req.body;

    console.log("Received data:", req.body);

    if (
      !tcspLicenseNo ||
      !type ||
      !name ||
      !idProof ||
      !address ||
      !email ||
      !userId ||
      !companyId
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const idProofUrl = await uploadCloudinary(idProof);
    let addressProofUrl
    if (addressProof) {
      addressProofUrl = await uploadCloudinary(addressProof);
    }

    const newCompanySecretary = new CompanySecretary({
      tcspLicenseNo,
      tcspReason: tcspReason || "",
      type,
      surname,
      name,
      chineeseName,
      idProof: idProofUrl,
      address,
      district,
      street,
      building,
      addressProof: addressProofUrl,
      email,
      phone,
      userId: mongoose.Types.ObjectId(userId),
      companyId: mongoose.Types.ObjectId(companyId),
    });

    //consooe.log("ifooss",newCompanySecretary)
    await newCompanySecretary.save();
    console.log("ifooss22222",newCompanySecretary)

    res
      .status(201)
      .json({ message: "Company secretary info created successfully!" });
  } catch (error) {
    console.error("Error creating company secretary info:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists." });
    }

    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.get("/getAllCompanys", async (req, res) => {
  try {
    const companies = await CompanyAccount.find()
      .populate("directors", "name email") // Populate directors' details
      .populate("shareholders", "name email") // Populate shareholders' details
      .populate("secretary", "name email"); // Populate secretary details

    if (!companies || companies.length === 0) {
      return res.status(404).json({ message: "No companies found" });
    }
console.log('companies',companies)
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});




router.post("/storeCompanyData", async (req, res) => {
  try {
    // Extracting data from the payload
    const { companyInfo, directors, shareholders, secretary } = req.body;
    console.log('payload',req.body)

    if (!companyInfo || companyInfo.length === 0) {
      return res.status(400).json({ message: "Company info is missing" });
      throw new Error("Company info is missing.");
    }

    const companyData = companyInfo[0]; // Assuming only one company info object

    // Convert related data into ObjectIds (If directors, shareholders, and secretary exist)
    const directorIds = directors.map(d => new mongoose.Types.ObjectId(d._id));
    const shareholderIds = shareholders.map(s => new mongoose.Types.ObjectId(s._id));
    const secretaryId = secretary.length > 0 ? new mongoose.Types.ObjectId(secretary[0]._id) : null;

    // Create new company entry
    const newCompany = new CompanyAccount({
      business_name: companyData.business_name,
      trading_name: companyData.trading_name,
      business_name_chinese: companyData.business_name_chinese,
      active: companyData.active,
      directors: directorIds,
      shareholders: shareholderIds,
      secretary: secretaryId,
      proceededBy:secretary[0].name,
      status: "inprocessing",
      project: "incorporation"
    });

    // Save to database
    //console.log("Company data saved successfully:", newCompany);
    const savedCompany = await newCompany.save();
    console.log("Company data saved successfully:", secretary[0].name);
    return res.status(200).json(savedCompany);
  } catch (error) {
    console.error("Error saving company data:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/getCompanyInfo", async (req, res) => {
  try {
    const companyId = req.query.companyId;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required." });
    }

    const companyInfo = await Companyaccount.findById(companyId);
    console.log("for company",companyInfo)

    if (!companyInfo) {
      return res.status(404).json({ message: "Company not found." });
    }

    return res.status(200).json(companyInfo);
  } catch (error) {
    console.error("Error fetching company information:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/getShareCapitalInfo", async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required." });
    }

    const shareCapitalInfo = await ShareCapital.find({ companyid: companyId });

    if (!shareCapitalInfo.length) {
      return res.status(404).json({ message: "No share capital information found." });
    }

    res.status(200).json(shareCapitalInfo);
  } catch (error) {
    console.error("Error fetching share capital information:", error);
    res.status(500).json({ message: "Server error while fetching share capital information." });
  }
});

router.get('/getShareHoldersListSummery', async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const shareholders = await ShareholderInfo.find({ companyId }).populate('userId');

    return res.status(200).json({
      message: "Shareholders list fetched successfully",
      data: shareholders,
    });
  } catch (error) {
    console.error("Error fetching shareholders list:", error);
    return res.status(500).json({ message: "Failed to get shareholders." });
  }
});


router.get('/getDirectorInformation', async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const directorsInformation = await directorInfo.find({ companyId });

    return res.status(200).json({
      message: "Directors list fetched successfully",
      data: directorsInformation,
    });
  } catch (error) {
    console.error("Error fetching directors list:", error);
    return res.status(500).json({ message: "Failed to get directors." });
  }
});


//  company secretary information
router.get('/getCompanySecretaryInformation', async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const companySecretaries = await CompanySecretary.find({ companyId });
    console.log("fetched getCompanySecretaryInformation",companySecretaries)

    if (companySecretaries.length === 0) {
      return res.status(404).json({ message: "No company secretary found." });
    }

    return res.status(200).json({
      message: "Company secretary list fetched successfully",
      data: companySecretaries,
    });
  } catch (error) {
    console.error("Error fetching company secretary list:", error);
    return res.status(500).json({ message: "Failed to get company secretary." });
  }
});



// ------------- create--------------------

// router.post("/create", async (req, res) => {
//   try {
//     const data = req.body;

//     Companyaccount.create(data)
//     .then((user) => {
//       return res.status(201).json({
//         status: "201",
//         message: "Company created successfully!",
//         data: data,
//       });
//     })
//     .catch((error) => {
//       console.error("Error saving user: ", error);
//       return res.status(500).json({
//         status: "500",
//         message: "Error saving user.",
//       });
//     });
//   } catch (error) {
//     // Handle errors
//     console.error("Error creating user:", error);
//     res.status(500).json({
//       message: "Error creating user",
//       error: error.message,
//     });
//   }
// });
// -------------

router.post("/getactiveaccountbyuserid", async (req, res) => {
  let data;
  if (req.body.active != "") {
    data = {
      userid: mongoose.Types.ObjectId(req.body.userid),
      active: req.body.active,
    };
  } else {
    data = { userid: mongoose.Types.ObjectId(req.body.userid) };
  }
  Companyaccount.aggregate(
    [
      { $match: data },

      {
        $lookup: {
          localField: "_id",
          from: "users",
          foreignField: "companyid",
          as: "usersinfo",
        },
      },
      {
        $lookup: {
          localField: "_id",
          from: "subscriptions",
          foreignField: "companyid",
          as: "subscriptionsinfo",
        },
      },

      { $sort: { _id: -1 } },
    ],
    (err, result) => {
      res.status(200).json({
        status: "200",
        message: "Result Found",
        result: result,
      });
    }
  );
});

router.post("/getsharecpitalbyuseridandcompanyid", auth, async (req, res) => {
  let data;
  if (req.body.userid != "" && req.body.companyid != "") {
    data = {
      userid: mongoose.Types.ObjectId(req.body.userid),
      companyid: mongoose.Types.ObjectId(req.body.companyid),
    };
  }
  Shareholdercapital.aggregate(
    [
      { $match: data },

      {
        $lookup: {
          localField: "_id",
          from: "users",
          foreignField: "companyid",
          as: "usersinfo",
        },
      },
      {
        $lookup: {
          localField: "_id",
          from: "subscriptions",
          foreignField: "companyid",
          as: "subscriptionsinfo",
        },
      },

      { $sort: { _id: -1 } },
    ],
    (err, result) => {
      res.status(200).json({
        status: "200",
        message: "Result Found",
        result: result,
      });
    }
  );
});

// router.post("/getactiveaccountbyuserid", auth, async function (req, res) {
//   let data;
//   if (req.body.active != "") {
//     data = {
//       userid: mongoose.Types.ObjectId(req.body.userid),
//       active: req.body.active,
//     };
//   } else {
//     data = { userid: mongoose.Types.ObjectId(req.body.userid) };
//   }
//   Companyaccount.find(data).populate('userid').exec(async (err, result) => {
//     if (err) {
//       res.status(200).json({
//         status: "400",
//         message: "Something Went Wrong",
//       });
//     }
//     if (!result) {
//       res.status(200).json({
//         status: "400",
//         message: "No Result Found",
//       });
//     } else {
//       res.status(200).json({
//         status: "200",
//         message: "Result Found",
//         result: result,
//       });
//     }
//   }).sort({ active: -1 });
// });

router.post(
  "/getallcompanyaccountbysubscriberid",
  auth,
  async function (req, res) {
    let data;
    if (req.body.active != "") {
      data = {
        userid: mongoose.Types.ObjectId(req.body.userid),
        active: req.body.active,
      };
    } else {
      data = { userid: mongoose.Types.ObjectId(req.body.userid) };
    }

    Companyaccount.aggregate(
      [
        { $match: data },

        {
          $lookup: {
            localField: "_id",
            from: "subscriptions",
            foreignField: "companyid",
            as: "subscriptioninfo",
          },
        },
        { $unwind: "$subscriptioninfo" },
        // { "$project": {
        //   "business_name": 1,
        //   "active": 1,
        //   "subscriptioninfo": 1,
        // } },
        {
          $group: {
            _id: "$subscriptioninfo.companyid",
            subscriptioninfo: { $last: "$subscriptioninfo" },
            business_name: { $last: "$business_name" },
          },
        },
        { $sort: { _id: -1 } },
      ],
      (err, result) => {
        res.status(200).json({
          status: "200",
          message: "Result Found",
          result: result,
        });
      }
    );

    // Companyaccount.find(data).exec((err, ids) => {
    //   Subscription.find({'_id':{$in : ids._id}},function(err,result) {
    //     console.log(result);
    //     res.status(200).json({
    //       status: "200",
    //       message: "Result Found",
    //       result: result,
    //     });
    //   });
    // });
  }
);

router.post("/getsubscriptionbycompanyid", auth, async function (req, res) {
  let data;

  if (req.body.companyid == "" || req.body.companyid == undefined) {
    console.log("muskan gupta");

    data = {};
  } else {
    data = {
      companyid: mongoose.Types.ObjectId(req.body.companyid),
    };
  }

  Subscription.aggregate([
    { $match: data },
    {
      $lookup: {
        from: "companyaccounts",
        localField: "companyid",
        foreignField: "_id",
        as: "companyinfo",
      },
    },
  ])
    .sort({ companyid: -1 }, { _id: -1 })
    .then((result, err) => {
      if (err) {
        res.status(200).json({
          status: "400",
          message: "Something Went Wrong",
        });
      }
      if (result.length > 0) {
        res.status(200).json({
          status: "200",
          message: "Result Found",
          result: result,
        });
      } else {
        res.status(200).json({
          status: "400",
          message: "No Result Found",
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post(
  "/getsubscribersubscriptionbyuserid",
  auth,
  async function (req, res) {
    let data;

    if (req.body.userid == "" || req.body.userid == undefined) {
      console.log("muskan gupta");

      data = {};
    } else {
      data = {
        userid: mongoose.Types.ObjectId(req.body.userid),
      };
    }

    SubscriberSubscription.aggregate([
      { $match: data },
      {
        $lookup: {
          from: "companyaccounts",
          localField: "companyid",
          foreignField: "_id",
          as: "companyinfo",
        },
      },
    ])
      .sort({ createdAt: -1 }, { _id: -1 })
      .then((result, err) => {
        if (err) {
          res.status(200).json({
            status: "400",
            message: "Something Went Wrong",
          });
        }
        if (result.length > 0) {
          res.status(200).json({
            status: "200",
            message: "Result Found",
            result: result,
          });
        } else {
          res.status(200).json({
            status: "400",
            message: "No Result Found",
          });
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }
);

router.post("/getsubscribersubscriptionbyid", auth, async function (req, res) {
  let data;

  if (req.body.id == "" || req.body.id == undefined) {
    data = {};
  } else {
    data = {
      _id: mongoose.Types.ObjectId(req.body.id),
    };
  }

  SubscriberSubscription.aggregate([
    { $match: data },
    {
      $lookup: {
        from: "companyaccounts",
        localField: "companyid",
        foreignField: "_id",
        as: "companyinfo",
      },
    },
  ])
    .sort({ createdAt: -1 }, { _id: -1 })
    .then((result, err) => {
      if (err) {
        res.status(200).json({
          status: "400",
          message: "Something Went Wrong",
        });
      }
      if (result.length > 0) {
        res.status(200).json({
          status: "200",
          message: "Result Found",
          result: result,
        });
      } else {
        res.status(200).json({
          status: "400",
          message: "No Result Found",
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/getcompanybyid", auth, async function (req, res) {
  let data;

  data = {
    _id: mongoose.Types.ObjectId(req.body.companyid),
  };

  Companyaccount.find(data, (err, result) => {
    if (err) {
      res.status(200).json({
        status: "400",
        message: "Something Went Wrong",
      });
    }
    if (!result) {
      res.status(200).json({
        status: "400",
        message: "No Result Found",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "Result Found",
        result: result,
      });
    }
  }).sort({ _id: -1 });
});

router.post("/getcompanybymultipleid", async function (req, res) {
  let data;
  let array = [];
  for (k = 0; k < req.body.companyid.length; k++) {
    array.push(mongoose.Types.ObjectId(req.body.companyid[k]));
  }
  data = {
    _id: { $in: array },
  };

  Companyaccount.aggregate(
    [
      { $match: data },

      {
        $lookup: {
          localField: "_id",
          from: "users",
          foreignField: "companyid",
          as: "usersinfo",
        },
      },
      {
        $lookup: {
          localField: "_id",
          from: "subscriptions",
          foreignField: "companyid",
          as: "subscriptionsinfo",
        },
      },
      // { $unwind: "$usersinfo" },
      // { "$project": {
      //   "business_name": 1,
      //   "active": 1,
      //   "subscriptioninfo": 1,
      // } },
      // {
      //   $group: {
      //     _id: {_id},
      //     usersinfo: {usersinfo},
      //     business_name: {$business_name},
      //     trading_name: {$trading_name},
      //     incorporate_date: {$incorporate_date},
      //     financial_date: {$financial_date},
      //     company_number: {$company_number},
      //     br_number: {$br_number},
      //     related_company: {$related_company},
      //   },
      // },
      { $sort: { _id: -1 } },
    ],
    (err, result) => {
      res.status(200).json({
        status: "200",
        message: "Result Found",
        result: result,
      });
    }
  );
  // Companyaccount.find(data, (err, result) => {
  //   if (err) {
  //     res.status(200).json({
  //       status: "400",
  //       message: "Something Went Wrong",
  //     });
  //   }
  //   if (!result) {
  //     res.status(200).json({
  //       status: "400",
  //       message: "No Result Found",
  //     });
  //   } else {
  //     res.status(200).json({
  //       status: "200",
  //       message: "Result Found",
  //       result: result,
  //     });
  //   }
  // }).sort({ _id: -1 });
});

router.post("/getlastsubscriptionbycompanyid", auth, async function (req, res) {
  let data;

  data = {
    companyid: mongoose.Types.ObjectId(req.body.companyid),
  };

  Subscription.find(data, (err, result) => {
    if (err) {
      res.status(200).json({
        status: "400",
        message: "Something Went Wrong",
      });
    }
    if (!result) {
      res.status(200).json({
        status: "400",
        message: "No Result Found",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "Result Found",
        result: result,
      });
    }
  })
    .sort({ _id: -1 })
    .limit(1);
});

router.post("/getsubscriptionbyid", auth, async function (req, res) {
  let data;

  data = {
    _id: mongoose.Types.ObjectId(req.body.id),
  };

  Subscription.find(data, (err, result) => {
    if (err) {
      res.status(200).json({
        status: "400",
        message: "Something Went Wrong",
      });
    }
    if (!result) {
      res.status(200).json({
        status: "400",
        message: "No Result Found",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "Result Found",
        result: result,
      });
    }
  }).sort({ _id: -1 });
});

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}

router.post("/addcompanyaccount", auth, async (req, res) => {
  let api_url = process.env.APP_URL;
  let liveAPP_URL = process.env.liveAPP_URL;
  if (req.body.business_name != "" && req.body.type_of_business != "") {
    let userdata = {
      business_name: req.body.business_name,
      business_name_chinese: req.body.business_name_chinese,
      type_of_business: req.body.type_of_business,
      office_address: req.body.office_address,
      office_address1: req.body.office_address1,
      office_city: req.body.office_city,
      office_state: req.body.office_state,
      office_country: req.body.office_country,
      // "share_class":req.body.share_class,
      // "total_share":req.body.total_share,
      // "total_amount":req.body.total_amount,
      capital: req.body.capital,
      share_right: req.body.share_right,
      country: req.body.country,
      userid: req.body.userid,
      active: req.body.active,
      application_date: req.body.application_date,
    };
    Companyaccount.findOne(
      { business_name: req.body.business_name },
      async (err, result) => {
        if (err) {
          res.status(200).json({
            status: "400",
            msg: "Something Went Wrong",
          });
        }
        if (!result) {
          let userresult = Companyaccount(userdata);
          let resultusernew = await userresult.save();

          if (resultusernew) {
            let end_date = new Date();
            end_date.setDate(end_date.getDate() + 13);
            let subscriptiondata = {
              companyid: mongoose.Types.ObjectId(resultusernew._id),
              end_date: formatDate(end_date),
              subscriptions_amount: "0",
              start_date: formatDate(new Date()),
              userid: mongoose.Types.ObjectId(req.body.userid),
              type: "trial",
            };
            let subscriptiondataresult = Subscription(subscriptiondata);
            let resultsubscriptiondata = await subscriptiondataresult.save();
            let newdata = 0;
            let userdata = {
              email_id: req.body.email_id,
              name: req.body.first_name,
              surname: req.body.last_name,
              mobile_number: req.body.mobile_number,
              companyid: mongoose.Types.ObjectId(resultusernew._id),
              roles: req.body.roles,
              typeofuser: "Natural Person",
              firstperson: "1",
              password: "",
            };
            User.findOne(
              { email_id: req.body.email_id },
              async (err, result) => {
                if (err) {
                  // res.status(200).json({
                  //   status: "400",
                  //   msg: "Something Went Wrong",
                  // });
                }
                if (!result) {
                  let userresult = User(userdata);
                  let resultuser = await userresult.save();

                  if (resultuser) {
                    if (req.body.roles != "Employee") {
                      if (req.body.roles == "shareholder") {
                        let newcapital = [];
                        for (
                          let capitalnew = 0;
                          capitalnew < req.body.capital.length;
                          capitalnew++
                        ) {
                          newcapital.push({
                            share_class:
                              req.body.capital[capitalnew].share_class,
                            total_share: "",
                            total_amount_paid: "",
                            currency: "HKD",
                          });
                        }

                        let shareholdercapital = {
                          companyid: mongoose.Types.ObjectId(resultusernew._id),
                          userid: mongoose.Types.ObjectId(resultshare._id),
                          capital: newcapital,
                        };
                        let shareholdercapitaldata =
                          Shareholdercapital(shareholdercapital);
                        let shareholdercapitalreponse =
                          await shareholdercapitaldata.save();
                      }
                      var transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                          user: "vikas@synram.co",
                          pass: "Synram@2019",
                        },
                      });

                      var mailOptions = {
                        from: "vikas@synram.co",
                        to: req.body.email_id,
                        subject:
                          "" +
                          req.body.caname +
                          " has invited you to collaborate as a " +
                          req.body.roles +
                          "",
                        html:
                          "<!DOCTYPE html>" +
                          "<html><head>" +
                          "    <title>ComSec360 Invitation</title>" +
                          '	<link rel="stylesheet" href="css/font-awesome.min.css">' +
                          "	<link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>" +
                          '    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">' +
                          '    <meta name="viewport" content="width=device-width, initial-scale=1">' +
                          '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
                          '    <style type="text/css">' +
                          "     " +
                          "        /* CLIENT-SPECIFIC STYLES */" +
                          "        body," +
                          "        table," +
                          "        td," +
                          "        a {" +
                          "            -webkit-text-size-adjust: 100%;" +
                          "            -ms-text-size-adjust: 100%;" +
                          "        }" +
                          "" +
                          "        table," +
                          "        td {" +
                          "            mso-table-lspace: 0pt;" +
                          "            mso-table-rspace: 0pt;" +
                          "        }" +
                          "" +
                          "        img {" +
                          "            -ms-interpolation-mode: bicubic;" +
                          "        }" +
                          "" +
                          "        /* RESET STYLES */" +
                          "        img {" +
                          "            border: 0;" +
                          "            height: auto;" +
                          "            line-height: 100%;" +
                          "            outline: none;" +
                          "            text-decoration: none;" +
                          "        }" +
                          "" +
                          "        table {" +
                          "            border-collapse: collapse !important;" +
                          "        }" +
                          "" +
                          "        body {" +
                          "            height: 100% !important;" +
                          "            margin: 0 !important;" +
                          "            padding: 0 !important;" +
                          "            width: 100% !important;" +
                          "        }" +
                          "" +
                          "        /* iOS BLUE LINKS */" +
                          "        a[x-apple-data-detectors] {" +
                          "            color: inherit !important;" +
                          "            text-decoration: none !important;" +
                          "            font-size: inherit !important;" +
                          "            font-family: inherit !important;" +
                          "            font-weight: inherit !important;" +
                          "            line-height: inherit !important;" +
                          "        }" +
                          "" +
                          "        /* MOBILE STYLES */" +
                          "        @media screen and (max-width:600px) {" +
                          "            h1 {" +
                          "                font-size: 32px !important;" +
                          "                line-height: 32px !important;" +
                          "            }" +
                          "        }" +
                          "" +
                          "        /* ANDROID CENTER FIX */" +
                          '        div[style*="margin: 16px 0;"] {' +
                          "            margin: 0 !important;" +
                          "        }" +
                          "    </style>" +
                          "</head>" +
                          " <style>" +
                          " #para_text {" +
                          "  padding: 0px 20px;" +
                          "  color: #111111;" +
                          "  font-family: 'Raleway Light', Arial, sans-serif;" +
                          "  font-size: 1.5em;" +
                          "  text-align: center;" +
                          "}" +
                          "#grad1 {" +
                          "  background-color: #E5E5E5;" +
                          "}" +
                          "#link_social" +
                          "{" +
                          "	padding: 5px;" +
                          "	color: #666666;" +
                          "}" +
                          "</style>" +
                          '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">' +
                          "    " +
                          '    <table id="grad1" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                          "        <!-- LOGO -->" +
                          "        <tbody><tr>" +
                          "           " +
                          '<td align="center">' +
                          '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                          "                    <tbody><tr>" +
                          '                        <td style="padding: 10px;" valign="top" align="center"> </td>' +
                          "                    </tr>" +
                          "                </tbody></table>" +
                          "            </td>" +
                          "        </tr>" +
                          "        <tr>" +
                          '            <td align="center">' +
                          '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                          "                    <tbody><tr>" +
                          '                        <td style="padding: 30px;  " valign="top" align="center">' +
                          '                           <img style="max-width: 29%; max-height: 50%; " src="' +
                          api_url +
                          '/assets/loginlogo.png" style="display: block; border: 0px; width:50%;">' +
                          "                        </td>" +
                          "                    </tr>" +
                          "                </tbody></table>" +
                          "            </td>" +
                          "        </tr>" +
                          "        " +
                          "		<!-- MESSAGE -->" +
                          "		<tr>" +
                          '        <td align="center">' +
                          '        <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                          "        <tbody>" +
                          "		<tr>" +
                          '            <td align="center">' +
                          '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                          "                    <tbody>" +
                          "					<tr>" +
                          '                        <td style=" background: transparent; background-position: left bottom; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; " valign="top" bgcolor="#ffffff" align="center">' +
                          "                           <h1>CA " +
                          req.body.caname +
                          " has invited you to collaborate as a owner  in " +
                          liveAPP_URL +
                          "</h1>" +
                          "						   " +
                          "						" +
                          "						   " +
                          '							<a href="' +
                          api_url +
                          "/registeration/" +
                          resultuser._id +
                          '" target="_blank" style="background-color: #3CBAC6 !important; font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 50px; border-radius: 8px; display: inline-block;">Accept Invitation</a>' +
                          '							<p id="para_text" valign="top">Your ComSec360 Team</p>' +
                          '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Account\'s URL:</b><br>' +
                          liveAPP_URL +
                          "</p>" +
                          '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Login Email:</b><br>' +
                          req.body.email_id +
                          "</p>" +
                          "                        </td>" +
                          "" +
                          "                    </tr><tr><td><hr><td></tr>" +
                          "" +
                          "                </tbody></table>" +
                          "            </td>" +
                          "        </tr>" +
                          "		</tbody>" +
                          "		</table>" +
                          "        </td>" +
                          "        </tr>" +
                          "        <tr>" +
                          '            <td style="padding: 0px 10px 0px 10px;" align="center">' +
                          '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                          "                <tbody>" +
                          "				" +
                          "					<tr>" +
                          '                    <td style="padding: 0px 30px; color: #666666; font-family: \'Raleway Light\', Arial, sans-serif; font-size: 15px; font-weight: 400;" align="center">' +
                          "				" +
                          "			" +
                          "				" +
                          "				<!-- COPYRIGHT TEXT -->" +
                          '					<p id="footer_text">' +
                          "If you have any questions you can get in touch at support.comsec360.com</p>" +
                          "					<p>© 2021 ComSec360</p>" +
                          "                    </td>" +
                          "                    </tr>" +
                          "				" +
                          "	" +
                          "                </tbody>" +
                          "				</table>" +
                          "            </td>" +
                          "        </tr>" +
                          "    </tbody></table>" +
                          "" +
                          "" +
                          "</body></html>",
                      };

                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          console.log("error" + error);
                        } else {
                          console.log("Email sent: " + info.response);
                        }
                      });
                    }

                    // res.status(200).json({
                    //   status: "200",
                    //   msg: "Successfully Invited",
                    //   result: resultuser,
                    // });
                  } else {
                    // res.status(200).json({
                    //   status: "400",
                    //   msg: "Something Went Wrong",
                    // });
                  }
                }
                if (result) {
                  console.log("email:" + result.companyid);
                  let companyid = result.companyid;
                  companyid.push(mongoose.Types.ObjectId(resultusernew._id));
                  User.updateOne(
                    { email_id: req.body.email_id },
                    {
                      $set: {
                        companyid: companyid,
                      },
                    },
                    (err, result) => {
                      if (err) {
                        // res.status(200).json({
                        //   status: "400",
                        //   msg: "Updation failed",
                        // });
                      } else {
                        // return res.status(200).json({
                        //   status: "200",
                        //   msg: "Sucessfully Updated",
                        // });
                      }
                    }
                  );

                  if (req.body.roles != "Employee") {
                    if (req.body.roles == "shareholder") {
                      let newcapital = [];
                      for (
                        let capitalnew = 0;
                        capitalnew < req.body.capital.length;
                        capitalnew++
                      ) {
                        newcapital.push({
                          share_class: req.body.capital[capitalnew].share_class,
                          total_share: "",
                          total_amount_paid: "",
                          currency: "HKD",
                        });
                      }

                      let shareholdercapital = {
                        companyid: mongoose.Types.ObjectId(resultusernew._id),
                        userid: mongoose.Types.ObjectId(resultshare._id),
                        capital: newcapital,
                      };
                      let shareholdercapitaldata =
                        Shareholdercapital(shareholdercapital);
                      let shareholdercapitalreponse =
                        await shareholdercapitaldata.save();
                    }
                    var transporter = nodemailer.createTransport({
                      host: "smtp.gmail.com",
                      port: 465,
                      secure: true,
                      auth: {
                        user: "vikas@synram.co",
                        pass: "Synram@2019",
                      },
                    });

                    var mailOptions = {
                      from: "vikas@synram.co",
                      to: req.body.email_id,
                      subject:
                        "" +
                        req.body.caname +
                        " has invited you to collaborate as a " +
                        req.body.roles +
                        "",
                      html:
                        "<!DOCTYPE html>" +
                        "<html><head>" +
                        "    <title>ComSec360 Invitation</title>" +
                        '	<link rel="stylesheet" href="css/font-awesome.min.css">' +
                        "	<link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>" +
                        '    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">' +
                        '    <meta name="viewport" content="width=device-width, initial-scale=1">' +
                        '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
                        '    <style type="text/css">' +
                        "     " +
                        "        /* CLIENT-SPECIFIC STYLES */" +
                        "        body," +
                        "        table," +
                        "        td," +
                        "        a {" +
                        "            -webkit-text-size-adjust: 100%;" +
                        "            -ms-text-size-adjust: 100%;" +
                        "        }" +
                        "" +
                        "        table," +
                        "        td {" +
                        "            mso-table-lspace: 0pt;" +
                        "            mso-table-rspace: 0pt;" +
                        "        }" +
                        "" +
                        "        img {" +
                        "            -ms-interpolation-mode: bicubic;" +
                        "        }" +
                        "" +
                        "        /* RESET STYLES */" +
                        "        img {" +
                        "            border: 0;" +
                        "            height: auto;" +
                        "            line-height: 100%;" +
                        "            outline: none;" +
                        "            text-decoration: none;" +
                        "        }" +
                        "" +
                        "        table {" +
                        "            border-collapse: collapse !important;" +
                        "        }" +
                        "" +
                        "        body {" +
                        "            height: 100% !important;" +
                        "            margin: 0 !important;" +
                        "            padding: 0 !important;" +
                        "            width: 100% !important;" +
                        "        }" +
                        "" +
                        "        /* iOS BLUE LINKS */" +
                        "        a[x-apple-data-detectors] {" +
                        "            color: inherit !important;" +
                        "            text-decoration: none !important;" +
                        "            font-size: inherit !important;" +
                        "            font-family: inherit !important;" +
                        "            font-weight: inherit !important;" +
                        "            line-height: inherit !important;" +
                        "        }" +
                        "" +
                        "        /* MOBILE STYLES */" +
                        "        @media screen and (max-width:600px) {" +
                        "            h1 {" +
                        "                font-size: 32px !important;" +
                        "                line-height: 32px !important;" +
                        "            }" +
                        "        }" +
                        "" +
                        "        /* ANDROID CENTER FIX */" +
                        '        div[style*="margin: 16px 0;"] {' +
                        "            margin: 0 !important;" +
                        "        }" +
                        "    </style>" +
                        "</head>" +
                        " <style>" +
                        " #para_text {" +
                        "  padding: 0px 20px;" +
                        "  color: #111111;" +
                        "  font-family: 'Raleway Light', Arial, sans-serif;" +
                        "  font-size: 1.5em;" +
                        "  text-align: center;" +
                        "}" +
                        "#grad1 {" +
                        "  background-color: #E5E5E5;" +
                        "}" +
                        "#link_social" +
                        "{" +
                        "	padding: 5px;" +
                        "	color: #666666;" +
                        "}" +
                        "</style>" +
                        '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">' +
                        "    " +
                        '    <table id="grad1" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                        "        <!-- LOGO -->" +
                        "        <tbody><tr>" +
                        "           " +
                        '<td align="center">' +
                        '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                        "                    <tbody><tr>" +
                        '                        <td style="padding: 10px;" valign="top" align="center"> </td>' +
                        "                    </tr>" +
                        "                </tbody></table>" +
                        "            </td>" +
                        "        </tr>" +
                        "        <tr>" +
                        '            <td align="center">' +
                        '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                        "                    <tbody><tr>" +
                        '                        <td style="padding: 30px;  " valign="top" align="center">' +
                        '                           <img style="max-width: 29%; max-height: 50%; " src="' +
                        api_url +
                        '/assets/loginlogo.png" style="display: block; border: 0px; width:50%;">' +
                        "                        </td>" +
                        "                    </tr>" +
                        "                </tbody></table>" +
                        "            </td>" +
                        "        </tr>" +
                        "        " +
                        "		<!-- MESSAGE -->" +
                        "		<tr>" +
                        '        <td align="center">' +
                        '        <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                        "        <tbody>" +
                        "		<tr>" +
                        '            <td align="center">' +
                        '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                        "                    <tbody>" +
                        "					<tr>" +
                        '                        <td style=" background: transparent; background-position: left bottom; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; " valign="top" bgcolor="#ffffff" align="center">' +
                        "                           <h1>CA " +
                        req.body.caname +
                        " has invited you to collaborate as a owner  in " +
                        liveAPP_URL +
                        "</h1>" +
                        "						   " +
                        "						" +
                        "						   " +
                        '							<a href="' +
                        api_url +
                        "/registeration/" +
                        resultuser._id +
                        '" target="_blank" style="background-color: #3CBAC6 !important; font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 50px; border-radius: 8px; display: inline-block;">Accept Invitation</a>' +
                        '							<p id="para_text" valign="top">Your ComSec360 Team</p>' +
                        '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Account\'s URL:</b><br>' +
                        liveAPP_URL +
                        "</p>" +
                        '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Login Email:</b><br>' +
                        req.body.email_id +
                        "</p>" +
                        "                        </td>" +
                        "" +
                        "                    </tr><tr><td><hr><td></tr>" +
                        "" +
                        "                </tbody></table>" +
                        "            </td>" +
                        "        </tr>" +
                        "		</tbody>" +
                        "		</table>" +
                        "        </td>" +
                        "        </tr>" +
                        "        <tr>" +
                        '            <td style="padding: 0px 10px 0px 10px;" align="center">' +
                        '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                        "                <tbody>" +
                        "				" +
                        "					<tr>" +
                        '                    <td style="padding: 0px 30px; color: #666666; font-family: \'Raleway Light\', Arial, sans-serif; font-size: 15px; font-weight: 400;" align="center">' +
                        "				" +
                        "			" +
                        "				" +
                        "				<!-- COPYRIGHT TEXT -->" +
                        '					<p id="footer_text">' +
                        "If you have any questions you can get in touch at support.comsec360.com</p>" +
                        "					<p>© 2021 ComSec360</p>" +
                        "                    </td>" +
                        "                    </tr>" +
                        "				" +
                        "	" +
                        "                </tbody>" +
                        "				</table>" +
                        "            </td>" +
                        "        </tr>" +
                        "    </tbody></table>" +
                        "" +
                        "" +
                        "</body></html>",
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                        console.log("error" + error);
                      } else {
                        console.log("Email sent: " + info.response);
                      }
                    });
                  }

                  // res.status(200).json({
                  //   status: "400",
                  //   msg: "Email Id is already register",
                  // });
                }
              }
            );
            console.log(req.body.shareholder.length);

            for (let sh = 0; sh < req.body.shareholder.length; sh++) {
              if (
                req.body.shareholder[sh].shareemail_id != "" &&
                req.body.shareholder[sh].sharefirst_name != ""
              ) {
                let userdata = {
                  email_id: req.body.shareholder[sh].shareemail_id,
                  name: req.body.shareholder[sh].sharefirst_name,
                  surname: req.body.shareholder[sh].sharelast_name,
                  mobile_number: "",
                  companyid: mongoose.Types.ObjectId(resultusernew._id),
                  roles: "Shareholder",
                  typeofuser: "Natural Person",
                  firstperson: sh + 1,
                  password: "",
                };

                console.log(userdata);

                User.findOne(
                  { email_id: req.body.shareholder[sh].shareemail_id },
                  async (err, share) => {
                    if (err) {
                      // res.status(200).json({
                      //   status: "400",
                      //   msg: "Something Went Wrong",
                      // });
                    }
                    if (!share) {
                      let usershare = User(userdata);
                      let resultshare = await usershare.save();

                      if (resultshare) {
                        let newcapital = [];
                        for (
                          let capitalnew = 0;
                          capitalnew < req.body.capital.length;
                          capitalnew++
                        ) {
                          newcapital.push({
                            share_class:
                              req.body.capital[capitalnew].share_class,
                            total_share: "",
                            total_amount_paid: "",
                            currency: "HKD",
                          });
                        }

                        let shareholdercapital = {
                          companyid: mongoose.Types.ObjectId(resultusernew._id),
                          userid: mongoose.Types.ObjectId(resultshare._id),
                          capital: newcapital,
                        };
                        let shareholdercapitaldata =
                          Shareholdercapital(shareholdercapital);
                        let shareholdercapitalreponse =
                          await shareholdercapitaldata.save();

                        var transporter = nodemailer.createTransport({
                          host: "smtp.gmail.com",
                          port: 465,
                          secure: true,
                          auth: {
                            user: "vikas@synram.co",
                            pass: "Synram@2019",
                          },
                        });

                        var mailOptionsshare = {
                          from: "vikas@synram.co",
                          to: req.body.shareholder[sh].shareemail_id,
                          subject:
                            "" +
                            req.body.caname +
                            " has invited you to collaborate as a Shareholder ",
                          html:
                            "<!DOCTYPE html>" +
                            "<html><head>" +
                            "    <title>ComSec360 Invitation</title>" +
                            '	<link rel="stylesheet" href="css/font-awesome.min.css">' +
                            "	<link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>" +
                            '    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">' +
                            '    <meta name="viewport" content="width=device-width, initial-scale=1">' +
                            '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
                            '    <style type="text/css">' +
                            "     " +
                            "        /* CLIENT-SPECIFIC STYLES */" +
                            "        body," +
                            "        table," +
                            "        td," +
                            "        a {" +
                            "            -webkit-text-size-adjust: 100%;" +
                            "            -ms-text-size-adjust: 100%;" +
                            "        }" +
                            "" +
                            "        table," +
                            "        td {" +
                            "            mso-table-lspace: 0pt;" +
                            "            mso-table-rspace: 0pt;" +
                            "        }" +
                            "" +
                            "        img {" +
                            "            -ms-interpolation-mode: bicubic;" +
                            "        }" +
                            "" +
                            "        /* RESET STYLES */" +
                            "        img {" +
                            "            border: 0;" +
                            "            height: auto;" +
                            "            line-height: 100%;" +
                            "            outline: none;" +
                            "            text-decoration: none;" +
                            "        }" +
                            "" +
                            "        table {" +
                            "            border-collapse: collapse !important;" +
                            "        }" +
                            "" +
                            "        body {" +
                            "            height: 100% !important;" +
                            "            margin: 0 !important;" +
                            "            padding: 0 !important;" +
                            "            width: 100% !important;" +
                            "        }" +
                            "" +
                            "        /* iOS BLUE LINKS */" +
                            "        a[x-apple-data-detectors] {" +
                            "            color: inherit !important;" +
                            "            text-decoration: none !important;" +
                            "            font-size: inherit !important;" +
                            "            font-family: inherit !important;" +
                            "            font-weight: inherit !important;" +
                            "            line-height: inherit !important;" +
                            "        }" +
                            "" +
                            "        /* MOBILE STYLES */" +
                            "        @media screen and (max-width:600px) {" +
                            "            h1 {" +
                            "                font-size: 32px !important;" +
                            "                line-height: 32px !important;" +
                            "            }" +
                            "        }" +
                            "" +
                            "        /* ANDROID CENTER FIX */" +
                            '        div[style*="margin: 16px 0;"] {' +
                            "            margin: 0 !important;" +
                            "        }" +
                            "    </style>" +
                            "</head>" +
                            " <style>" +
                            " #para_text {" +
                            "  padding: 0px 20px;" +
                            "  color: #111111;" +
                            "  font-family: 'Raleway Light', Arial, sans-serif;" +
                            "  font-size: 1.5em;" +
                            "  text-align: center;" +
                            "}" +
                            "#grad1 {" +
                            "  background-color: #E5E5E5;" +
                            "}" +
                            "#link_social" +
                            "{" +
                            "	padding: 5px;" +
                            "	color: #666666;" +
                            "}" +
                            "</style>" +
                            '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">' +
                            "    " +
                            '    <table id="grad1" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <!-- LOGO -->" +
                            "        <tbody><tr>" +
                            "           " +
                            '<td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 10px;" valign="top" align="center"> </td>' +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 30px;  " valign="top" align="center">' +
                            '                           <img style="max-width: 29%; max-height: 50%; " src="' +
                            api_url +
                            '/assets/loginlogo.png" style="display: block; border: 0px; width:50%;">' +
                            "                        </td>" +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        " +
                            "		<!-- MESSAGE -->" +
                            "		<tr>" +
                            '        <td align="center">' +
                            '        <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <tbody>" +
                            "		<tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody>" +
                            "					<tr>" +
                            '                        <td style=" background: transparent; background-position: left bottom; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; " valign="top" bgcolor="#ffffff" align="center">' +
                            "                           <h1>CA " +
                            req.body.caname +
                            " has invited you to collaborate as a Shareholder in " +
                            liveAPP_URL +
                            "</h1>" +
                            "						   " +
                            "						" +
                            "						   " +
                            '							<a href="' +
                            api_url +
                            "/registeration/" +
                            resultshare._id +
                            '" target="_blank" style="background-color: #3CBAC6 !important; font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 50px; border-radius: 8px; display: inline-block;">Accept Invitation</a>' +
                            '							<p id="para_text" valign="top">Your ComSec360 Team</p>' +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Account\'s URL:</b><br>' +
                            liveAPP_URL +
                            "</p>" +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Login Email:</b><br>' +
                            req.body.shareholder[sh].shareemail_id +
                            "</p>" +
                            "                        </td>" +
                            "" +
                            "                    </tr><tr><td><hr><td></tr>" +
                            "" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "		</tbody>" +
                            "		</table>" +
                            "        </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td style="padding: 0px 10px 0px 10px;" align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                <tbody>" +
                            "				" +
                            "					<tr>" +
                            '                    <td style="padding: 0px 30px; color: #666666; font-family: \'Raleway Light\', Arial, sans-serif; font-size: 15px; font-weight: 400;" align="center">' +
                            "				" +
                            "			" +
                            "				" +
                            "				<!-- COPYRIGHT TEXT -->" +
                            '					<p id="footer_text">' +
                            "If you have any questions you can get in touch at support.comsec360.com</p>" +
                            "					<p>© 2021 ComSec360</p>" +
                            "                    </td>" +
                            "                    </tr>" +
                            "				" +
                            "	" +
                            "                </tbody>" +
                            "				</table>" +
                            "            </td>" +
                            "        </tr>" +
                            "    </tbody></table>" +
                            "" +
                            "" +
                            "</body></html>",
                        };

                        transporter.sendMail(
                          mailOptionsshare,
                          function (error, info) {
                            if (error) {
                              console.log("error" + error);
                            } else {
                              console.log("Email sent: " + info.response);
                            }
                          }
                        );
                        // res.status(200).json({
                        //   status: "200",
                        //   msg: "Successfully Added",
                        //   result: resultusernew,
                        // });
                        // res.status(200).json({
                        //   status: "200",
                        //   msg: "Successfully Invited",
                        //   result: resultuser,
                        // });
                      } else {
                        // res.status(200).json({
                        //   status: "400",
                        //   msg: "Something Went Wrong",
                        // });
                      }
                    }
                    if (share) {
                      let companyid = share.companyid;
                      if (companyid.includes(resultusernew._id)) {
                      } else {
                        companyid.push(
                          mongoose.Types.ObjectId(resultusernew._id)
                        );
                        User.updateOne(
                          { email_id: req.body.shareholder[sh].shareemail_id },
                          {
                            $set: {
                              companyid: companyid,
                            },
                          },
                          (err, result) => {
                            if (err) {
                              // res.status(200).json({
                              //   status: "400",
                              //   msg: "Updation failed",
                              // });
                            } else {
                              // return res.status(200).json({
                              //   status: "200",
                              //   msg: "Sucessfully Updated",
                              // });
                            }
                          }
                        );
                        let shareholdercapital = {
                          companyid: mongoose.Types.ObjectId(resultusernew._id),
                          userid: mongoose.Types.ObjectId(share._id),
                          capital: [
                            {
                              share_class: "Ordinary",
                              total_share: "",
                              total_amount_paid: "",
                              currency: "HKD",
                            },
                            {
                              share_class: "Preference",
                              total_share: "",
                              total_amount_paid: "",
                              currency: "HKD",
                            },
                          ],
                        };
                        let shareholdercapitaldata =
                          Shareholdercapital(shareholdercapital);
                        let shareholdercapitalreponse =
                          await shareholdercapitaldata.save();

                        var transporter = nodemailer.createTransport({
                          host: "smtp.gmail.com",
                          port: 465,
                          secure: true,
                          auth: {
                            user: "vikas@synram.co",
                            pass: "Synram@2019",
                          },
                        });

                        var mailOptionsshare = {
                          from: "vikas@synram.co",
                          to: req.body.shareholder[sh].shareemail_id,
                          subject:
                            "" +
                            req.body.caname +
                            " has invited you to collaborate as a Shareholder ",
                          html:
                            "<!DOCTYPE html>" +
                            "<html><head>" +
                            "    <title>ComSec360 Invitation</title>" +
                            '	<link rel="stylesheet" href="css/font-awesome.min.css">' +
                            "	<link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>" +
                            '    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">' +
                            '    <meta name="viewport" content="width=device-width, initial-scale=1">' +
                            '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
                            '    <style type="text/css">' +
                            "     " +
                            "        /* CLIENT-SPECIFIC STYLES */" +
                            "        body," +
                            "        table," +
                            "        td," +
                            "        a {" +
                            "            -webkit-text-size-adjust: 100%;" +
                            "            -ms-text-size-adjust: 100%;" +
                            "        }" +
                            "" +
                            "        table," +
                            "        td {" +
                            "            mso-table-lspace: 0pt;" +
                            "            mso-table-rspace: 0pt;" +
                            "        }" +
                            "" +
                            "        img {" +
                            "            -ms-interpolation-mode: bicubic;" +
                            "        }" +
                            "" +
                            "        /* RESET STYLES */" +
                            "        img {" +
                            "            border: 0;" +
                            "            height: auto;" +
                            "            line-height: 100%;" +
                            "            outline: none;" +
                            "            text-decoration: none;" +
                            "        }" +
                            "" +
                            "        table {" +
                            "            border-collapse: collapse !important;" +
                            "        }" +
                            "" +
                            "        body {" +
                            "            height: 100% !important;" +
                            "            margin: 0 !important;" +
                            "            padding: 0 !important;" +
                            "            width: 100% !important;" +
                            "        }" +
                            "" +
                            "        /* iOS BLUE LINKS */" +
                            "        a[x-apple-data-detectors] {" +
                            "            color: inherit !important;" +
                            "            text-decoration: none !important;" +
                            "            font-size: inherit !important;" +
                            "            font-family: inherit !important;" +
                            "            font-weight: inherit !important;" +
                            "            line-height: inherit !important;" +
                            "        }" +
                            "" +
                            "        /* MOBILE STYLES */" +
                            "        @media screen and (max-width:600px) {" +
                            "            h1 {" +
                            "                font-size: 32px !important;" +
                            "                line-height: 32px !important;" +
                            "            }" +
                            "        }" +
                            "" +
                            "        /* ANDROID CENTER FIX */" +
                            '        div[style*="margin: 16px 0;"] {' +
                            "            margin: 0 !important;" +
                            "        }" +
                            "    </style>" +
                            "</head>" +
                            " <style>" +
                            " #para_text {" +
                            "  padding: 0px 20px;" +
                            "  color: #111111;" +
                            "  font-family: 'Raleway Light', Arial, sans-serif;" +
                            "  font-size: 1.5em;" +
                            "  text-align: center;" +
                            "}" +
                            "#grad1 {" +
                            "  background-color: #E5E5E5;" +
                            "}" +
                            "#link_social" +
                            "{" +
                            "	padding: 5px;" +
                            "	color: #666666;" +
                            "}" +
                            "</style>" +
                            '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">' +
                            "    " +
                            '    <table id="grad1" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <!-- LOGO -->" +
                            "        <tbody><tr>" +
                            "           " +
                            '<td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 10px;" valign="top" align="center"> </td>' +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 30px;  " valign="top" align="center">' +
                            '                           <img style="max-width: 29%; max-height: 50%; " src="' +
                            api_url +
                            '/assets/loginlogo.png" style="display: block; border: 0px; width:50%;">' +
                            "                        </td>" +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        " +
                            "		<!-- MESSAGE -->" +
                            "		<tr>" +
                            '        <td align="center">' +
                            '        <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <tbody>" +
                            "		<tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody>" +
                            "					<tr>" +
                            '                        <td style=" background: transparent; background-position: left bottom; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; " valign="top" bgcolor="#ffffff" align="center">' +
                            "                           <h1>CA " +
                            req.body.caname +
                            " has invited you to collaborate as a Shareholder in " +
                            liveAPP_URL +
                            "</h1>" +
                            "						   " +
                            "						" +
                            "						   " +
                            '							<a href="' +
                            api_url +
                            "/registeration/" +
                            resultshare._id +
                            '" target="_blank" style="background-color: #3CBAC6 !important; font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 50px; border-radius: 8px; display: inline-block;">Accept Invitation</a>' +
                            '							<p id="para_text" valign="top">Your ComSec360 Team</p>' +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Account\'s URL:</b><br>' +
                            liveAPP_URL +
                            "</p>" +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Login Email:</b><br>' +
                            req.body.shareholder[sh].shareemail_id +
                            "</p>" +
                            "                        </td>" +
                            "" +
                            "                    </tr><tr><td><hr><td></tr>" +
                            "" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "		</tbody>" +
                            "		</table>" +
                            "        </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td style="padding: 0px 10px 0px 10px;" align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                <tbody>" +
                            "				" +
                            "					<tr>" +
                            '                    <td style="padding: 0px 30px; color: #666666; font-family: \'Raleway Light\', Arial, sans-serif; font-size: 15px; font-weight: 400;" align="center">' +
                            "				" +
                            "			" +
                            "				" +
                            "				<!-- COPYRIGHT TEXT -->" +
                            '					<p id="footer_text">' +
                            "If you have any questions you can get in touch at support.comsec360.com</p>" +
                            "					<p>© 2021 ComSec360</p>" +
                            "                    </td>" +
                            "                    </tr>" +
                            "				" +
                            "	" +
                            "                </tbody>" +
                            "				</table>" +
                            "            </td>" +
                            "        </tr>" +
                            "    </tbody></table>" +
                            "" +
                            "" +
                            "</body></html>",
                        };

                        transporter.sendMail(
                          mailOptionsshare,
                          function (error, info) {
                            if (error) {
                              console.log("error" + error);
                            } else {
                              console.log("Email sent: " + info.response);
                            }
                          }
                        );
                      }
                    }
                  }
                );
              }
            }

            for (let sh = 0; sh < req.body.director.length; sh++) {
              if (
                req.body.director[sh].directoremail_id != "" &&
                req.body.director[sh].directorfirst_name != ""
              ) {
                let userdata = {
                  email_id: req.body.director[sh].directoremail_id,
                  name: req.body.director[sh].directorfirst_name,
                  surname: req.body.director[sh].directorlast_name,
                  mobile_number: "",
                  companyid: mongoose.Types.ObjectId(resultusernew._id),
                  roles: "Director",
                  typeofuser: "Natural Person",
                  firstperson: sh + 1,
                  password: "",
                };
                User.findOne(
                  { email_id: req.body.director[sh].directoremail_id },
                  async (err, director) => {
                    if (err) {
                      // res.status(200).json({
                      //   status: "400",
                      //   msg: "Something Went Wrong",
                      // });
                    }
                    if (!director) {
                      let userdirector = User(userdata);
                      let resultdirector = await userdirector.save();

                      if (resultdirector) {
                        var transporter = nodemailer.createTransport({
                          host: "smtp.gmail.com",
                          port: 465,
                          secure: true,
                          auth: {
                            user: "vikas@synram.co",
                            pass: "Synram@2019",
                          },
                        });

                        var mailOptionsdirector = {
                          from: "vikas@synram.co",
                          to: req.body.director[sh].directoremail_id,
                          subject:
                            "" +
                            req.body.caname +
                            " has invited you to collaborate as a Director ",
                          html:
                            "<!DOCTYPE html>" +
                            "<html><head>" +
                            "    <title>ComSec360 Invitation</title>" +
                            '	<link rel="stylesheet" href="css/font-awesome.min.css">' +
                            "	<link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>" +
                            '    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">' +
                            '    <meta name="viewport" content="width=device-width, initial-scale=1">' +
                            '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
                            '    <style type="text/css">' +
                            "     " +
                            "        /* CLIENT-SPECIFIC STYLES */" +
                            "        body," +
                            "        table," +
                            "        td," +
                            "        a {" +
                            "            -webkit-text-size-adjust: 100%;" +
                            "            -ms-text-size-adjust: 100%;" +
                            "        }" +
                            "" +
                            "        table," +
                            "        td {" +
                            "            mso-table-lspace: 0pt;" +
                            "            mso-table-rspace: 0pt;" +
                            "        }" +
                            "" +
                            "        img {" +
                            "            -ms-interpolation-mode: bicubic;" +
                            "        }" +
                            "" +
                            "        /* RESET STYLES */" +
                            "        img {" +
                            "            border: 0;" +
                            "            height: auto;" +
                            "            line-height: 100%;" +
                            "            outline: none;" +
                            "            text-decoration: none;" +
                            "        }" +
                            "" +
                            "        table {" +
                            "            border-collapse: collapse !important;" +
                            "        }" +
                            "" +
                            "        body {" +
                            "            height: 100% !important;" +
                            "            margin: 0 !important;" +
                            "            padding: 0 !important;" +
                            "            width: 100% !important;" +
                            "        }" +
                            "" +
                            "        /* iOS BLUE LINKS */" +
                            "        a[x-apple-data-detectors] {" +
                            "            color: inherit !important;" +
                            "            text-decoration: none !important;" +
                            "            font-size: inherit !important;" +
                            "            font-family: inherit !important;" +
                            "            font-weight: inherit !important;" +
                            "            line-height: inherit !important;" +
                            "        }" +
                            "" +
                            "        /* MOBILE STYLES */" +
                            "        @media screen and (max-width:600px) {" +
                            "            h1 {" +
                            "                font-size: 32px !important;" +
                            "                line-height: 32px !important;" +
                            "            }" +
                            "        }" +
                            "" +
                            "        /* ANDROID CENTER FIX */" +
                            '        div[style*="margin: 16px 0;"] {' +
                            "            margin: 0 !important;" +
                            "        }" +
                            "    </style>" +
                            "</head>" +
                            " <style>" +
                            " #para_text {" +
                            "  padding: 0px 20px;" +
                            "  color: #111111;" +
                            "  font-family: 'Raleway Light', Arial, sans-serif;" +
                            "  font-size: 1.5em;" +
                            "  text-align: center;" +
                            "}" +
                            "#grad1 {" +
                            "  background-color: #E5E5E5;" +
                            "}" +
                            "#link_social" +
                            "{" +
                            "	padding: 5px;" +
                            "	color: #666666;" +
                            "}" +
                            "</style>" +
                            '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">' +
                            "    " +
                            '    <table id="grad1" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <!-- LOGO -->" +
                            "        <tbody><tr>" +
                            "           " +
                            '<td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 10px;" valign="top" align="center"> </td>' +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 30px;  " valign="top" align="center">' +
                            '                           <img style="max-width: 29%; max-height: 50%; " src="' +
                            api_url +
                            '/assets/loginlogo.png" style="display: block; border: 0px; width:50%;">' +
                            "                        </td>" +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        " +
                            "		<!-- MESSAGE -->" +
                            "		<tr>" +
                            '        <td align="center">' +
                            '        <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <tbody>" +
                            "		<tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody>" +
                            "					<tr>" +
                            '                        <td style=" background: transparent; background-position: left bottom; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; " valign="top" bgcolor="#ffffff" align="center">' +
                            "                           <h1>CA " +
                            req.body.caname +
                            " has invited you to collaborate as a Director in " +
                            liveAPP_URL +
                            "</h1>" +
                            "						   " +
                            "						" +
                            "						   " +
                            '							<a href="' +
                            api_url +
                            "/registeration/" +
                            resultdirector._id +
                            '" target="_blank" style="background-color: #3CBAC6 !important; font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 50px; border-radius: 8px; display: inline-block;">Accept Invitation</a>' +
                            '							<p id="para_text" valign="top">Your ComSec360 Team</p>' +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Account\'s URL:</b><br>' +
                            liveAPP_URL +
                            "</p>" +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Login Email:</b><br>' +
                            req.body.director[sh].directoremail_id +
                            "</p>" +
                            "                        </td>" +
                            "" +
                            "                    </tr><tr><td><hr><td></tr>" +
                            "" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "		</tbody>" +
                            "		</table>" +
                            "        </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td style="padding: 0px 10px 0px 10px;" align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                <tbody>" +
                            "				" +
                            "					<tr>" +
                            '                    <td style="padding: 0px 30px; color: #666666; font-family: \'Raleway Light\', Arial, sans-serif; font-size: 15px; font-weight: 400;" align="center">' +
                            "				" +
                            "			" +
                            "				" +
                            "				<!-- COPYRIGHT TEXT -->" +
                            '					<p id="footer_text">' +
                            "If you have any questions you can get in touch at support.comsec360.com</p>" +
                            "					<p>© 2021 ComSec360</p>" +
                            "                    </td>" +
                            "                    </tr>" +
                            "				" +
                            "	" +
                            "                </tbody>" +
                            "				</table>" +
                            "            </td>" +
                            "        </tr>" +
                            "    </tbody></table>" +
                            "" +
                            "" +
                            "</body></html>",
                        };

                        transporter.sendMail(
                          mailOptionsdirector,
                          function (error, info) {
                            if (error) {
                              console.log("error" + error);
                            } else {
                              console.log("Email sent: " + info.response);
                            }
                          }
                        );
                        // res.status(200).json({
                        //   status: "200",
                        //   msg: "Successfully Added",
                        //   result: resultusernew,
                        // });
                        // res.status(200).json({
                        //   status: "200",
                        //   msg: "Successfully Invited",
                        //   result: resultuser,
                        // });
                      } else {
                        res.status(200).json({
                          status: "400",
                          msg: "Something Went Wrong",
                        });
                      }
                    }
                    if (director) {
                      let companyid = director.companyid;
                      if (companyid.includes(resultusernew._id)) {
                      } else {
                        companyid.push(
                          mongoose.Types.ObjectId(resultusernew._id)
                        );

                        User.updateOne(
                          { email_id: req.body.director[sh].directoremail_id },
                          {
                            $set: {
                              companyid: companyid,
                            },
                          },
                          (err, result) => {
                            if (err) {
                              // res.status(200).json({
                              //   status: "400",
                              //   msg: "Updation failed",
                              // });
                            } else {
                              // return res.status(200).json({
                              //   status: "200",
                              //   msg: "Sucessfully Updated",
                              // });
                            }
                          }
                        );

                        var transporter = nodemailer.createTransport({
                          host: "smtp.gmail.com",
                          port: 465,
                          secure: true,
                          auth: {
                            user: "vikas@synram.co",
                            pass: "Synram@2019",
                          },
                        });

                        var mailOptionsdirector = {
                          from: "vikas@synram.co",
                          to: req.body.director[sh].directoremail_id,
                          subject:
                            "" +
                            req.body.caname +
                            " has invited you to collaborate as a Director ",
                          html:
                            "<!DOCTYPE html>" +
                            "<html><head>" +
                            "    <title>ComSec360 Invitation</title>" +
                            '	<link rel="stylesheet" href="css/font-awesome.min.css">' +
                            "	<link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>" +
                            '    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">' +
                            '    <meta name="viewport" content="width=device-width, initial-scale=1">' +
                            '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
                            '    <style type="text/css">' +
                            "     " +
                            "        /* CLIENT-SPECIFIC STYLES */" +
                            "        body," +
                            "        table," +
                            "        td," +
                            "        a {" +
                            "            -webkit-text-size-adjust: 100%;" +
                            "            -ms-text-size-adjust: 100%;" +
                            "        }" +
                            "" +
                            "        table," +
                            "        td {" +
                            "            mso-table-lspace: 0pt;" +
                            "            mso-table-rspace: 0pt;" +
                            "        }" +
                            "" +
                            "        img {" +
                            "            -ms-interpolation-mode: bicubic;" +
                            "        }" +
                            "" +
                            "        /* RESET STYLES */" +
                            "        img {" +
                            "            border: 0;" +
                            "            height: auto;" +
                            "            line-height: 100%;" +
                            "            outline: none;" +
                            "            text-decoration: none;" +
                            "        }" +
                            "" +
                            "        table {" +
                            "            border-collapse: collapse !important;" +
                            "        }" +
                            "" +
                            "        body {" +
                            "            height: 100% !important;" +
                            "            margin: 0 !important;" +
                            "            padding: 0 !important;" +
                            "            width: 100% !important;" +
                            "        }" +
                            "" +
                            "        /* iOS BLUE LINKS */" +
                            "        a[x-apple-data-detectors] {" +
                            "            color: inherit !important;" +
                            "            text-decoration: none !important;" +
                            "            font-size: inherit !important;" +
                            "            font-family: inherit !important;" +
                            "            font-weight: inherit !important;" +
                            "            line-height: inherit !important;" +
                            "        }" +
                            "" +
                            "        /* MOBILE STYLES */" +
                            "        @media screen and (max-width:600px) {" +
                            "            h1 {" +
                            "                font-size: 32px !important;" +
                            "                line-height: 32px !important;" +
                            "            }" +
                            "        }" +
                            "" +
                            "        /* ANDROID CENTER FIX */" +
                            '        div[style*="margin: 16px 0;"] {' +
                            "            margin: 0 !important;" +
                            "        }" +
                            "    </style>" +
                            "</head>" +
                            " <style>" +
                            " #para_text {" +
                            "  padding: 0px 20px;" +
                            "  color: #111111;" +
                            "  font-family: 'Raleway Light', Arial, sans-serif;" +
                            "  font-size: 1.5em;" +
                            "  text-align: center;" +
                            "}" +
                            "#grad1 {" +
                            "  background-color: #E5E5E5;" +
                            "}" +
                            "#link_social" +
                            "{" +
                            "	padding: 5px;" +
                            "	color: #666666;" +
                            "}" +
                            "</style>" +
                            '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">' +
                            "    " +
                            '    <table id="grad1" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <!-- LOGO -->" +
                            "        <tbody><tr>" +
                            "           " +
                            '<td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 10px;" valign="top" align="center"> </td>' +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 30px;  " valign="top" align="center">' +
                            '                           <img style="max-width: 29%; max-height: 50%; " src="' +
                            api_url +
                            '/assets/loginlogo.png" style="display: block; border: 0px; width:50%;">' +
                            "                        </td>" +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        " +
                            "		<!-- MESSAGE -->" +
                            "		<tr>" +
                            '        <td align="center">' +
                            '        <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <tbody>" +
                            "		<tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody>" +
                            "					<tr>" +
                            '                        <td style=" background: transparent; background-position: left bottom; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; " valign="top" bgcolor="#ffffff" align="center">' +
                            "                           <h1>CA " +
                            req.body.caname +
                            " has invited you to collaborate as a Director in " +
                            liveAPP_URL +
                            "</h1>" +
                            "						   " +
                            "						" +
                            "						   " +
                            '							<a href="' +
                            api_url +
                            "/registeration/" +
                            resultdirector._id +
                            '" target="_blank" style="background-color: #3CBAC6 !important; font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 50px; border-radius: 8px; display: inline-block;">Accept Invitation</a>' +
                            '							<p id="para_text" valign="top">Your ComSec360 Team</p>' +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Account\'s URL:</b><br>' +
                            liveAPP_URL +
                            "</p>" +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Login Email:</b><br>' +
                            req.body.director[sh].directoremail_id +
                            "</p>" +
                            "                        </td>" +
                            "" +
                            "                    </tr><tr><td><hr><td></tr>" +
                            "" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "		</tbody>" +
                            "		</table>" +
                            "        </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td style="padding: 0px 10px 0px 10px;" align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                <tbody>" +
                            "				" +
                            "					<tr>" +
                            '                    <td style="padding: 0px 30px; color: #666666; font-family: \'Raleway Light\', Arial, sans-serif; font-size: 15px; font-weight: 400;" align="center">' +
                            "				" +
                            "			" +
                            "				" +
                            "				<!-- COPYRIGHT TEXT -->" +
                            '					<p id="footer_text">' +
                            "If you have any questions you can get in touch at support.comsec360.com</p>" +
                            "					<p>© 2021 ComSec360</p>" +
                            "                    </td>" +
                            "                    </tr>" +
                            "				" +
                            "	" +
                            "                </tbody>" +
                            "				</table>" +
                            "            </td>" +
                            "        </tr>" +
                            "    </tbody></table>" +
                            "" +
                            "" +
                            "</body></html>",
                        };

                        transporter.sendMail(
                          mailOptionsdirector,
                          function (error, info) {
                            if (error) {
                              console.log("error" + error);
                            } else {
                              console.log("Email sent: " + info.response);
                            }
                          }
                        );
                      }
                    }
                  }
                );
              }
            }

            for (let sh = 0; sh < req.body.cs.length; sh++) {
              if (
                req.body.cs[sh].csemail_id != "" &&
                req.body.cs[sh].csfirst_name != ""
              ) {
                let userdata = {
                  email_id: req.body.cs[sh].csemail_id,
                  name: req.body.cs[sh].csfirst_name,
                  surname: req.body.cs[sh].cslast_name,
                  mobile_number: "",
                  companyid: mongoose.Types.ObjectId(resultusernew._id),
                  roles: "Company Secretory",
                  typeofuser: "Natural Person",
                  firstperson: sh + 1,
                  password: "",
                };
                User.findOne(
                  { email_id: req.body.cs[sh].csemail_id },
                  async (err, cs) => {
                    if (err) {
                      // res.status(200).json({
                      //   status: "400",
                      //   msg: "Something Went Wrong",
                      // });
                    }
                    if (!cs) {
                      let usercs = User(userdata);
                      let resultcs = await usercs.save();

                      if (resultcs) {
                        var transporter = nodemailer.createTransport({
                          host: "smtp.gmail.com",
                          port: 465,
                          secure: true,
                          auth: {
                            user: "vikas@synram.co",
                            pass: "Synram@2019",
                          },
                        });

                        var mailOptionscs = {
                          from: "vikas@synram.co",
                          to: req.body.cs[sh].csemail_id,
                          subject:
                            "" +
                            req.body.caname +
                            " has invited you to collaborate as a Company Secretory ",
                          html:
                            "<!DOCTYPE html>" +
                            "<html><head>" +
                            "    <title>ComSec360 Invitation</title>" +
                            '	<link rel="stylesheet" href="css/font-awesome.min.css">' +
                            "	<link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>" +
                            '    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">' +
                            '    <meta name="viewport" content="width=device-width, initial-scale=1">' +
                            '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
                            '    <style type="text/css">' +
                            "     " +
                            "        /* CLIENT-SPECIFIC STYLES */" +
                            "        body," +
                            "        table," +
                            "        td," +
                            "        a {" +
                            "            -webkit-text-size-adjust: 100%;" +
                            "            -ms-text-size-adjust: 100%;" +
                            "        }" +
                            "" +
                            "        table," +
                            "        td {" +
                            "            mso-table-lspace: 0pt;" +
                            "            mso-table-rspace: 0pt;" +
                            "        }" +
                            "" +
                            "        img {" +
                            "            -ms-interpolation-mode: bicubic;" +
                            "        }" +
                            "" +
                            "        /* RESET STYLES */" +
                            "        img {" +
                            "            border: 0;" +
                            "            height: auto;" +
                            "            line-height: 100%;" +
                            "            outline: none;" +
                            "            text-decoration: none;" +
                            "        }" +
                            "" +
                            "        table {" +
                            "            border-collapse: collapse !important;" +
                            "        }" +
                            "" +
                            "        body {" +
                            "            height: 100% !important;" +
                            "            margin: 0 !important;" +
                            "            padding: 0 !important;" +
                            "            width: 100% !important;" +
                            "        }" +
                            "" +
                            "        /* iOS BLUE LINKS */" +
                            "        a[x-apple-data-detectors] {" +
                            "            color: inherit !important;" +
                            "            text-decoration: none !important;" +
                            "            font-size: inherit !important;" +
                            "            font-family: inherit !important;" +
                            "            font-weight: inherit !important;" +
                            "            line-height: inherit !important;" +
                            "        }" +
                            "" +
                            "        /* MOBILE STYLES */" +
                            "        @media screen and (max-width:600px) {" +
                            "            h1 {" +
                            "                font-size: 32px !important;" +
                            "                line-height: 32px !important;" +
                            "            }" +
                            "        }" +
                            "" +
                            "        /* ANDROID CENTER FIX */" +
                            '        div[style*="margin: 16px 0;"] {' +
                            "            margin: 0 !important;" +
                            "        }" +
                            "    </style>" +
                            "</head>" +
                            " <style>" +
                            " #para_text {" +
                            "  padding: 0px 20px;" +
                            "  color: #111111;" +
                            "  font-family: 'Raleway Light', Arial, sans-serif;" +
                            "  font-size: 1.5em;" +
                            "  text-align: center;" +
                            "}" +
                            "#grad1 {" +
                            "  background-color: #E5E5E5;" +
                            "}" +
                            "#link_social" +
                            "{" +
                            "	padding: 5px;" +
                            "	color: #666666;" +
                            "}" +
                            "</style>" +
                            '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">' +
                            "    " +
                            '    <table id="grad1" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <!-- LOGO -->" +
                            "        <tbody><tr>" +
                            "           " +
                            '<td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 10px;" valign="top" align="center"> </td>' +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 30px;  " valign="top" align="center">' +
                            '                           <img style="max-width: 29%; max-height: 50%; " src="' +
                            api_url +
                            '/assets/loginlogo.png" style="display: block; border: 0px; width:50%;">' +
                            "                        </td>" +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        " +
                            "		<!-- MESSAGE -->" +
                            "		<tr>" +
                            '        <td align="center">' +
                            '        <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <tbody>" +
                            "		<tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody>" +
                            "					<tr>" +
                            '                        <td style=" background: transparent; background-position: left bottom; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; " valign="top" bgcolor="#ffffff" align="center">' +
                            "                           <h1>CA " +
                            req.body.caname +
                            " has invited you to collaborate as a Company Secretory in" +
                            liveAPP_URL +
                            "</h1>" +
                            "						   " +
                            "						" +
                            "						   " +
                            '							<a href="' +
                            api_url +
                            "/registeration/" +
                            resultcs._id +
                            '" target="_blank" style="background-color: #3CBAC6 !important; font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 50px; border-radius: 8px; display: inline-block;">Accept Invitation</a>' +
                            '							<p id="para_text" valign="top">Your ComSec360 Team</p>' +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Account\'s URL:</b><br>' +
                            liveAPP_URL +
                            "</p>" +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Login Email:</b><br>' +
                            req.body.cs[sh].csemail_id +
                            "</p>" +
                            "                        </td>" +
                            "" +
                            "                    </tr><tr><td><hr><td></tr>" +
                            "" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "		</tbody>" +
                            "		</table>" +
                            "        </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td style="padding: 0px 10px 0px 10px;" align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                <tbody>" +
                            "				" +
                            "					<tr>" +
                            '                    <td style="padding: 0px 30px; color: #666666; font-family: \'Raleway Light\', Arial, sans-serif; font-size: 15px; font-weight: 400;" align="center">' +
                            "				" +
                            "			" +
                            "				" +
                            "				<!-- COPYRIGHT TEXT -->" +
                            '					<p id="footer_text">' +
                            "If you have any questions you can get in touch at support.comsec360.com</p>" +
                            "					<p>© 2021 ComSec360</p>" +
                            "                    </td>" +
                            "                    </tr>" +
                            "				" +
                            "	" +
                            "                </tbody>" +
                            "				</table>" +
                            "            </td>" +
                            "        </tr>" +
                            "    </tbody></table>" +
                            "" +
                            "" +
                            "</body></html>",
                        };

                        transporter.sendMail(
                          mailOptionscs,
                          function (error, info) {
                            if (error) {
                              console.log("error" + error);
                            } else {
                              console.log("Email sent: " + info.response);
                            }
                          }
                        );
                        // res.status(200).json({
                        //   status: "200",
                        //   msg: "Successfully Added",
                        //   result: resultusernew,
                        // });
                        // res.status(200).json({
                        //   status: "200",
                        //   msg: "Successfully Invited",
                        //   result: resultuser,
                        // });
                      } else {
                        // res.status(200).json({
                        //   status: "400",
                        //   msg: "Something Went Wrong",
                        // });
                      }
                    }
                    if (cs) {
                      let companyid = cs.companyid;
                      if (companyid.includes(resultusernew._id)) {
                      } else {
                        companyid.push(
                          mongoose.Types.ObjectId(resultusernew._id)
                        );

                        User.updateOne(
                          { email_id: req.body.cs[sh].csemail_id },
                          {
                            $set: {
                              companyid: companyid,
                            },
                          },
                          (err, result) => {
                            if (err) {
                              // res.status(200).json({
                              //   status: "400",
                              //   msg: "Updation failed",
                              // });
                            } else {
                              // return res.status(200).json({
                              //   status: "200",
                              //   msg: "Sucessfully Updated",
                              // });
                            }
                          }
                        );

                        var transporter = nodemailer.createTransport({
                          host: "smtp.gmail.com",
                          port: 465,
                          secure: true,
                          auth: {
                            user: "vikas@synram.co",
                            pass: "Synram@2019",
                          },
                        });

                        var mailOptionscs = {
                          from: "vikas@synram.co",
                          to: req.body.cs[sh].csemail_id,
                          subject:
                            "" +
                            req.body.caname +
                            " has invited you to collaborate as a Company Secretory ",
                          html:
                            "<!DOCTYPE html>" +
                            "<html><head>" +
                            "    <title>ComSec360 Invitation</title>" +
                            '	<link rel="stylesheet" href="css/font-awesome.min.css">' +
                            "	<link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>" +
                            '    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">' +
                            '    <meta name="viewport" content="width=device-width, initial-scale=1">' +
                            '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
                            '    <style type="text/css">' +
                            "     " +
                            "        /* CLIENT-SPECIFIC STYLES */" +
                            "        body," +
                            "        table," +
                            "        td," +
                            "        a {" +
                            "            -webkit-text-size-adjust: 100%;" +
                            "            -ms-text-size-adjust: 100%;" +
                            "        }" +
                            "" +
                            "        table," +
                            "        td {" +
                            "            mso-table-lspace: 0pt;" +
                            "            mso-table-rspace: 0pt;" +
                            "        }" +
                            "" +
                            "        img {" +
                            "            -ms-interpolation-mode: bicubic;" +
                            "        }" +
                            "" +
                            "        /* RESET STYLES */" +
                            "        img {" +
                            "            border: 0;" +
                            "            height: auto;" +
                            "            line-height: 100%;" +
                            "            outline: none;" +
                            "            text-decoration: none;" +
                            "        }" +
                            "" +
                            "        table {" +
                            "            border-collapse: collapse !important;" +
                            "        }" +
                            "" +
                            "        body {" +
                            "            height: 100% !important;" +
                            "            margin: 0 !important;" +
                            "            padding: 0 !important;" +
                            "            width: 100% !important;" +
                            "        }" +
                            "" +
                            "        /* iOS BLUE LINKS */" +
                            "        a[x-apple-data-detectors] {" +
                            "            color: inherit !important;" +
                            "            text-decoration: none !important;" +
                            "            font-size: inherit !important;" +
                            "            font-family: inherit !important;" +
                            "            font-weight: inherit !important;" +
                            "            line-height: inherit !important;" +
                            "        }" +
                            "" +
                            "        /* MOBILE STYLES */" +
                            "        @media screen and (max-width:600px) {" +
                            "            h1 {" +
                            "                font-size: 32px !important;" +
                            "                line-height: 32px !important;" +
                            "            }" +
                            "        }" +
                            "" +
                            "        /* ANDROID CENTER FIX */" +
                            '        div[style*="margin: 16px 0;"] {' +
                            "            margin: 0 !important;" +
                            "        }" +
                            "    </style>" +
                            "</head>" +
                            " <style>" +
                            " #para_text {" +
                            "  padding: 0px 20px;" +
                            "  color: #111111;" +
                            "  font-family: 'Raleway Light', Arial, sans-serif;" +
                            "  font-size: 1.5em;" +
                            "  text-align: center;" +
                            "}" +
                            "#grad1 {" +
                            "  background-color: #E5E5E5;" +
                            "}" +
                            "#link_social" +
                            "{" +
                            "	padding: 5px;" +
                            "	color: #666666;" +
                            "}" +
                            "</style>" +
                            '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">' +
                            "    " +
                            '    <table id="grad1" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <!-- LOGO -->" +
                            "        <tbody><tr>" +
                            "           " +
                            '<td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 10px;" valign="top" align="center"> </td>' +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody><tr>" +
                            '                        <td style="padding: 30px;  " valign="top" align="center">' +
                            '                           <img style="max-width: 29%; max-height: 50%; " src="' +
                            api_url +
                            '/assets/loginlogo.png" style="display: block; border: 0px; width:50%;">' +
                            "                        </td>" +
                            "                    </tr>" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "        " +
                            "		<!-- MESSAGE -->" +
                            "		<tr>" +
                            '        <td align="center">' +
                            '        <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "        <tbody>" +
                            "		<tr>" +
                            '            <td align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                    <tbody>" +
                            "					<tr>" +
                            '                        <td style=" background: transparent; background-position: left bottom; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; " valign="top" bgcolor="#ffffff" align="center">' +
                            "                           <h1>CA " +
                            req.body.caname +
                            " has invited you to collaborate as a Company Secretory in" +
                            liveAPP_URL +
                            "</h1>" +
                            "						   " +
                            "						" +
                            "						   " +
                            '							<a href="' +
                            api_url +
                            "/registeration/" +
                            resultcs._id +
                            '" target="_blank" style="background-color: #3CBAC6 !important; font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 50px; border-radius: 8px; display: inline-block;">Accept Invitation</a>' +
                            '							<p id="para_text" valign="top">Your ComSec360 Team</p>' +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Account\'s URL:</b><br>' +
                            liveAPP_URL +
                            "</p>" +
                            '								<p id="para_text" valign="top" style="font-size:17px;"><b style="font-size:20px;">Your Login Email:</b><br>' +
                            req.body.cs[sh].csemail_id +
                            "</p>" +
                            "                        </td>" +
                            "" +
                            "                    </tr><tr><td><hr><td></tr>" +
                            "" +
                            "                </tbody></table>" +
                            "            </td>" +
                            "        </tr>" +
                            "		</tbody>" +
                            "		</table>" +
                            "        </td>" +
                            "        </tr>" +
                            "        <tr>" +
                            '            <td style="padding: 0px 10px 0px 10px;" align="center">' +
                            '                <table style="max-width: 600px;" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                            "                <tbody>" +
                            "				" +
                            "					<tr>" +
                            '                    <td style="padding: 0px 30px; color: #666666; font-family: \'Raleway Light\', Arial, sans-serif; font-size: 15px; font-weight: 400;" align="center">' +
                            "				" +
                            "			" +
                            "				" +
                            "				<!-- COPYRIGHT TEXT -->" +
                            '					<p id="footer_text">' +
                            "If you have any questions you can get in touch at support.comsec360.com</p>" +
                            "					<p>© 2021 ComSec360</p>" +
                            "                    </td>" +
                            "                    </tr>" +
                            "				" +
                            "	" +
                            "                </tbody>" +
                            "				</table>" +
                            "            </td>" +
                            "        </tr>" +
                            "    </tbody></table>" +
                            "" +
                            "" +
                            "</body></html>",
                        };

                        transporter.sendMail(
                          mailOptionscs,
                          function (error, info) {
                            if (error) {
                              console.log("error" + error);
                            } else {
                              console.log("Email sent: " + info.response);
                            }
                          }
                        );
                      }
                    }
                  }
                );
              }
            }

            res.status(200).json({
              status: "200",
              msg: "Successfully Invited",
              result: resultusernew,
            });
          } else {
            res.status(200).json({
              status: "400",
              msg: "Something Went Wrong",
            });
          }
        }
        if (result) {
          res.status(200).json({
            status: "400",
            msg: "Business Name is already register",
          });
        }
      }
    );
  } else {
    res.status(200).json({
      status: "400",
      msg: "Invalid Data",
    });
  }
});

router.post("/adddocumentsetting", async (req, res) => {
  let api_url = process.env.APP_URL;
  let liveAPP_URL = process.env.liveAPP_URL;

  let userdata = {
    name: "dddd",
    content: myvar,
  };

  let userresult = documentsetting(userdata);
  let resultuser = await userresult.save();
});

router.post("/getdocumentsettingbyid", async (req, res) => {
  let userid = req.body.userid;
  let name = req.body.name;

  documentsetting.findOne(
    { userid: mongoose.Types.ObjectId(userid), name: name },
    async (err, result) => {
      if (err) {
        res.status(400).json({
          message: "Something went wrong",
          status: "400",
        });
      }
      if (result) {
        res.status(200).json({
          message: "Data Found",
          status: "200",
          result: result,
        });
      } else {
        res.status(200).json({
          message: "No Data Found",
          status: "200",
          result: [],
        });
      }
    }
  );

  // let userdata ={
  //   name:"dddd",
  //   content:myvar
  // };
  // let userresult = documentsetting(userdata);
  // let resultuser = await userresult.save();
});

router.post("/updatecompanyaccount", auth, async (req, res) => {
  let api_url = process.env.APP_URL;
  let liveAPP_URL = process.env.liveAPP_URL;
  let createdby = req.decoded.id;
  let createdname = req.decoded.name;
  let rolesname = req.decoded.roles;
  if (req.body.business_name != "" && req.body.type_of_business != "") {
    let userdata = req.body;
    Companyaccount.findOne(
      {
        business_name: req.body.business_name,
        _id: { $ne: mongoose.Types.ObjectId(req.body.id) },
      },
      async (err, result) => {
        if (err) {
          res.status(200).json({
            status: "400",
            msg: "Something Went Wrong",
          });
        }
        if (!result) {
          Companyaccount.findOne(
            { _id: mongoose.Types.ObjectId(req.body.id) },
            async (ernew, getcompanydetails) => {
              console.log(String(req.body.business_name));
              console.log(String(getcompanydetails.business_name));

              if (
                String(getcompanydetails.business_name) !=
                String(req.body.business_name)
              ) {
                let msg =
                  "Previous Company name '" +
                  getcompanydetails.business_name +
                  "' has been changed by " +
                  rolesname +
                  " (" +
                  createdname +
                  ")";
                let data = {
                  userid: mongoose.Types.ObjectId(createdby),
                  message: msg,
                  companyid: mongoose.Types.ObjectId(req.body.id),
                };
                let saveworkflowresponse = await Workflow(data).save();
              }

              if (
                String(getcompanydetails.business_name_chinese) !=
                String(req.body.business_name_chinese)
              ) {
                let msg =
                  "Previous Company name in chinese '" +
                  getcompanydetails.business_name_chinese +
                  "' has been changed by " +
                  rolesname +
                  " (" +
                  createdname +
                  ")";
                let data = {
                  userid: mongoose.Types.ObjectId(createdby),
                  message: msg,
                  companyid: mongoose.Types.ObjectId(req.body.id),
                };
                let saveworkflowresponse = await Workflow(data).save();
              }
              if (
                String(getcompanydetails.type_of_business) !=
                String(req.body.type_of_business)
              ) {
                let msg =
                  "Company Type '" +
                  getcompanydetails.type_of_business +
                  "' has been changed by " +
                  rolesname +
                  " (" +
                  createdname +
                  ") for Company name '" +
                  req.body.business_name +
                  "'";
                let data = {
                  userid: mongoose.Types.ObjectId(createdby),
                  message: msg,
                  companyid: mongoose.Types.ObjectId(req.body.id),
                };
                let saveworkflowresponse = await Workflow(data).save();
              }
            }
          );

          Companyaccount.updateOne(
            { _id: mongoose.Types.ObjectId(req.body.id) },
            {
              $set: {
                business_name: req.body.business_name,
                business_name_chinese: req.body.business_name_chinese,
                type_of_business: req.body.type_of_business,
                office_address: req.body.office_address,
                office_address1: req.body.office_address1,
                office_city: req.body.office_city,
                office_country: req.body.office_country,
                office_state: req.body.office_state,
                office_address_physical: req.body.office_address_physical,
                office_address1_physical: req.body.office_address1_physical,
                office_city_physical: req.body.office_city_physical,
                office_country_physical: req.body.office_country_physical,
                office_state_physical: req.body.office_state_physical,
                // email_id: req.body.email_id,
                // mobile_number: req.body.mobile_number,
                // fax: req.body.fax,
                // reference_no: req.body.reference_no,
                // total_share: req.body.total_share,
                // amount_share: req.body.amount_share,
                // company_number: req.body.company_number,
                // incorporate_date: req.body.incorporate_date,
              },
            },
            (err, result) => {
              if (err) {
                res.status(200).json({
                  status: "400",
                  msg: "Updation failed",
                });
              } else {
                return res.status(200).json({
                  status: "200",
                  msg: "Sucessfully Updated",
                });
              }
            }
          );
        }
        if (result) {
          res.status(200).json({
            status: "400",
            msg: "Business Name is already register",
          });
        }
      }
    );
  } else {
    res.status(200).json({
      status: "400",
      msg: "Invalid Data",
    });
  }
});

router.post("/updatecompanyaccountinshareholder", auth, async (req, res) => {
  let api_url = process.env.APP_URL;
  let liveAPP_URL = process.env.liveAPP_URL;
  let createdby = req.decoded.id;
  let createdname = req.decoded.name;
  let rolesname = req.decoded.roles;
  if (req.body.business_name != "" && req.body.type_of_business != "") {
    let userdata = req.body;
    Companyaccount.findOne(
      {
        business_name: req.body.business_name,
        _id: { $ne: mongoose.Types.ObjectId(req.body.id) },
      },
      async (err, result) => {
        if (err) {
          res.status(200).json({
            status: "400",
            msg: "Something Went Wrong",
          });
        }
        if (!result) {
          Companyaccount.findOne(
            { _id: mongoose.Types.ObjectId(req.body.id) },
            async (ernew, getcompanydetails) => {
              console.log(String(req.body.business_name));
              console.log(String(getcompanydetails.business_name));

              if (
                String(getcompanydetails.business_name) !=
                String(req.body.business_name)
              ) {
                let msg =
                  "Previous Company name '" +
                  getcompanydetails.business_name +
                  "' has been changed by " +
                  rolesname +
                  " (" +
                  createdname +
                  ")";
                let data = {
                  userid: mongoose.Types.ObjectId(createdby),
                  message: msg,
                  companyid: mongoose.Types.ObjectId(req.body.id),
                };
                let saveworkflowresponse = await Workflow(data).save();
              }

              if (
                String(getcompanydetails.business_name_chinese) !=
                String(req.body.business_name_chinese)
              ) {
                let msg =
                  "Previous Company name in chinese '" +
                  getcompanydetails.business_name_chinese +
                  "' has been changed by " +
                  rolesname +
                  " (" +
                  createdname +
                  ")";
                let data = {
                  userid: mongoose.Types.ObjectId(createdby),
                  message: msg,
                  companyid: mongoose.Types.ObjectId(req.body.id),
                };
                let saveworkflowresponse = await Workflow(data).save();
              }
              if (
                String(getcompanydetails.type_of_business) !=
                String(req.body.type_of_business)
              ) {
                let msg =
                  "Company Type '" +
                  getcompanydetails.type_of_business +
                  "' has been changed by " +
                  rolesname +
                  " (" +
                  createdname +
                  ") for Company name '" +
                  req.body.business_name +
                  "'";
                let data = {
                  userid: mongoose.Types.ObjectId(createdby),
                  message: msg,
                  companyid: mongoose.Types.ObjectId(req.body.id),
                };
                let saveworkflowresponse = await Workflow(data).save();
              }
            }
          );

          Companyaccount.updateOne(
            { _id: mongoose.Types.ObjectId(req.body.id) },
            {
              $set: {
                business_name: req.body.business_name,
                business_name_chinese: req.body.business_name_chinese,
                type_of_business: req.body.type_of_business,
                office_address: req.body.office_address,
                office_address1: req.body.office_address1,
                office_city: req.body.office_city,
                office_country: req.body.office_country,
                office_state: req.body.office_state,
                office_address_physical: req.body.office_address_physical,
                office_address1_physical: req.body.office_address1_physical,
                office_city_physical: req.body.office_city_physical,
                office_country_physical: req.body.office_country_physical,
                office_state_physical: req.body.office_state_physical,
              },
            },
            (err, result) => {
              if (err) {
                res.status(200).json({
                  status: "400",
                  msg: "Updation failed",
                });
              } else {
                let newcapital = [];
                for (
                  let capitalnew = 0;
                  capitalnew < req.body.capital.length;
                  capitalnew++
                ) {
                  newcapital.push({
                    share_class: req.body.capital[capitalnew].share_class,
                    total_share: req.body.capital[capitalnew].total_share,
                    total_amount_paid:
                      req.body.capital[capitalnew].total_amount_paid,
                    currency: req.body.capital[capitalnew].currency,
                  });
                }

                Shareholdercapital.updateOne(
                  {
                    _id: mongoose.Types.ObjectId(req.body.shareholdercpaitalid),
                  },
                  {
                    $set: {
                      capital: newcapital,
                    },
                  },
                  (err, result) => {}
                );

                return res.status(200).json({
                  status: "200",
                  msg: "Sucessfully Updated",
                });
              }
            }
          );
        }
        if (result) {
          res.status(200).json({
            status: "400",
            msg: "Business Name is already register",
          });
        }
      }
    );
  } else {
    res.status(200).json({
      status: "400",
      msg: "Invalid Data",
    });
  }
});

router.post(
  "/updatecompanyaccountformultipart",
  upload.single("company_logo"),
  auth,
  async (req, res) => {
    let Data = JSON.parse(req.body.Data);
    let api_url = process.env.APP_URL;
    let liveAPP_URL = process.env.liveAPP_URL;
    let createdby = req.decoded.id;
    let createdname = req.decoded.name;
    let rolesname = req.decoded.roles;
    if (Data.business_name != "" && Data.type_of_business != "") {
      let userdata = req.body;
      Companyaccount.findOne(
        {
          business_name: Data.business_name,
          _id: { $ne: mongoose.Types.ObjectId(Data.id) },
        },
        async (err, result) => {
          if (err) {
            res.status(200).json({
              status: "400",
              msg: "Something Went Wrong",
            });
          }
          if (!result) {
            Companyaccount.findOne(
              { _id: mongoose.Types.ObjectId(Data.id) },
              async (ernew, getcompanydetails) => {
                console.log(String(Data.business_name));
                console.log(String(getcompanydetails.business_name));

                if (
                  String(getcompanydetails.business_name) !=
                  String(Data.business_name)
                ) {
                  let msg =
                    "Previous Company name '" +
                    getcompanydetails.business_name +
                    "' has been changed by " +
                    rolesname +
                    " (" +
                    createdname +
                    ")";
                  let data = {
                    userid: mongoose.Types.ObjectId(createdby),
                    message: msg,
                    companyid: mongoose.Types.ObjectId(Data.id),
                  };
                  let saveworkflowresponse = await Workflow(data).save();
                }

                if (
                  String(getcompanydetails.business_name_chinese) !=
                  String(Data.business_name_chinese)
                ) {
                  let msg =
                    "Previous Company name in chinese '" +
                    getcompanydetails.business_name_chinese +
                    "' has been changed by " +
                    rolesname +
                    " (" +
                    createdname +
                    ")";
                  let data = {
                    userid: mongoose.Types.ObjectId(createdby),
                    message: msg,
                    companyid: mongoose.Types.ObjectId(Data.id),
                  };
                  let saveworkflowresponse = await Workflow(data).save();
                }
                if (
                  String(getcompanydetails.type_of_business) !=
                  String(Data.type_of_business)
                ) {
                  let msg =
                    "Company Type '" +
                    getcompanydetails.type_of_business +
                    "' has been changed by " +
                    rolesname +
                    " (" +
                    createdname +
                    ") for Company name '" +
                    Data.business_name +
                    "'";
                  let data = {
                    userid: mongoose.Types.ObjectId(createdby),
                    message: msg,
                    companyid: mongoose.Types.ObjectId(Data.id),
                  };
                  let saveworkflowresponse = await Workflow(data).save();
                }
              }
            );

            let company_logo;
            console.log(req.file);
            if (req.file != undefined) {
              company_logo = req.file.filename;

              Companyaccount.updateOne(
                { _id: mongoose.Types.ObjectId(Data.id) },
                {
                  $set: {
                    business_name: Data.business_name,
                    business_name_chinese: Data.business_name_chinese,
                    type_of_business: Data.type_of_business,
                    office_address: Data.office_address,
                    office_address1: Data.office_address1,
                    office_city: Data.office_city,
                    office_country: Data.office_country,
                    office_state: Data.office_state,
                    office_address_physical: Data.office_address_physical,
                    office_address1_physical: Data.office_address1_physical,
                    office_city_physical: Data.office_city_physical,
                    office_country_physical: Data.office_country_physical,
                    office_state_physical: Data.office_state_physical,
                    company_logo: company_logo,
                    incorporate_date: Data.incorporate_date,
                    financial_date: Data.financial_date,
                    share_right: Data.share_right,
                    capital: Data.capital,
                    company_number: Data.company_number,
                  },
                },
                (err, result) => {
                  if (err) {
                    res.status(200).json({
                      status: "400",
                      msg: "Updation failed",
                    });
                  } else {
                    return res.status(200).json({
                      status: "200",
                      msg: "Sucessfully Updated",
                    });
                  }
                }
              );
            } else {
              Companyaccount.updateOne(
                { _id: mongoose.Types.ObjectId(Data.id) },
                {
                  $set: {
                    business_name: Data.business_name,
                    business_name_chinese: Data.business_name_chinese,
                    type_of_business: Data.type_of_business,
                    office_address: Data.office_address,
                    office_address1: Data.office_address1,
                    office_city: Data.office_city,
                    office_country: Data.office_country,
                    office_state: Data.office_state,
                    office_address_physical: Data.office_address_physical,
                    office_address1_physical: Data.office_address1_physical,
                    office_city_physical: Data.office_city_physical,
                    office_country_physical: Data.office_country_physical,
                    office_state_physical: Data.office_state_physical,
                    incorporate_date: Data.incorporate_date,
                    financial_date: Data.financial_date,
                    share_right: Data.share_right,
                    capital: Data.capital,
                    company_number: Data.company_number,
                  },
                },
                (err, result) => {
                  if (err) {
                    res.status(200).json({
                      status: "400",
                      msg: "Updation failed",
                    });
                  } else {
                    return res.status(200).json({
                      status: "200",
                      msg: "Sucessfully Updated",
                    });
                  }
                }
              );
            }
          }
          if (result) {
            res.status(200).json({
              status: "400",
              msg: "Business Name is already register",
            });
          }
        }
      );
    } else {
      res.status(200).json({
        status: "400",
        msg: "Invalid Data",
      });
    }
  }
);

router.post("/changeactiveaccount", auth, async (req, res) => {
  if (req.body.activeid != "" && req.body.newid != "") {
    await Companyaccount.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.activeid) },
      { $set: { active: "0" } }
    );
    let newidupdate = await Companyaccount.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.newid) },
      { $set: { active: "1" } }
    );
    if (newidupdate) {
      res.status(200).json({
        status: "200",
        msg: "Changed Successfully",
      });
    } else {
      res.status(200).json({
        status: "400",
        msg: "No Update",
      });
    }
  } else {
    res.status(200).json({
      status: "400",
      msg: "All Field Required",
    });
  }
});

router.post("/addsubscription", auth, async (req, res) => {
  if (
    req.body.userid != "" &&
    req.body.companyid != "" &&
    req.body.subscriptions_amount != "" &&
    req.body.end_date != "" &&
    req.body.start_date != "" &&
    req.body.type != ""
  ) {
    let subscriptiondata = {
      companyid: req.body.companyid,
      end_date: new Date(req.body.end_date),
      subscriptions_amount: req.body.subscriptions_amount,
      start_date: req.body.start_date,
      userid: req.body.userid,
      type: req.body.type,
    };
    let subscriptiondataresult = Subscription(subscriptiondata);
    let resultsubscriptiondata = await subscriptiondataresult.save();

    let year = new Date(req.body.start_date).getFullYear();
    let newdate = "10-31-" + year;
    if (new Date(req.body.start_date).getTime() > new Date(newdate).getTime()) {
      let enddatenew = new Date(req.body.end_date);
      let startdate = enddatenew.setDate(enddatenew.getDate() + 1);
      let date = new Date(startdate);
      let newenddate = "12-31-" + date.getFullYear();
      let nextsubscriptiondata = {
        companyid: req.body.companyid,
        end_date: new Date(newenddate),
        subscriptions_amount: "500",
        start_date: new Date(startdate),
        userid: req.body.userid,
        type: "subscription",
      };
      let nextsubscriptiondataresult = Subscription(nextsubscriptiondata);
      let nextresultsubscriptiondata = await nextsubscriptiondataresult.save();
    }

    if (resultsubscriptiondata) {
      res.status(200).json({
        status: "200",
        msg: "Added Successfully",
      });
    } else {
      res.status(200).json({
        status: "400",
        msg: "No Added",
      });
    }
  } else {
    res.status(200).json({
      status: "400",
      msg: "All Field Required",
    });
  }
});

router.post("/addallsubscription", auth, async (req, res) => {
  if (req.body.length > 0) {
    let resultsubscriptiondata = "";
    let companyidnew = [];
    let subscription_id = [];
    let subscriptions_amount = 0;
    for (let i = 0; i < req.body.length; i++) {
      companyidnew.push(mongoose.Types.ObjectId(req.body[i].companyid));
      subscriptions_amount =
        subscriptions_amount + req.body[i].subscriptions_amount;
      let subscriptiondata = "";
      let year = new Date(req.body[i].start_date).getFullYear();
      let newdate = "10-31-" + year;
      if (
        new Date(req.body[i].start_date).getTime() > new Date(newdate).getTime()
      ) {
        subscriptiondata = {
          companyid: req.body[i].companyid,
          end_date: req.body[i].end_date,
          subscriptions_amount: req.body[i].subscriptions_amount - 500,
          start_date: req.body[i].start_date,
          userid: req.body[i].userid,
          type: req.body[i].type,
        };
      } else {
        subscriptiondata = {
          companyid: req.body[i].companyid,
          end_date: req.body[i].end_date,
          subscriptions_amount: req.body[i].subscriptions_amount,
          start_date: req.body[i].start_date,
          userid: req.body[i].userid,
          type: req.body[i].type,
        };
      }
      let subscriptiondataresult = Subscription(subscriptiondata);
      resultsubscriptiondata = await subscriptiondataresult.save();
      subscription_id.push(mongoose.Types.ObjectId(resultsubscriptiondata._id));

      if (
        new Date(req.body[i].start_date).getTime() > new Date(newdate).getTime()
      ) {
        let enddatenew = new Date(req.body[i].end_date);
        let startdate = enddatenew.setDate(enddatenew.getDate() + 1);

        let date = new Date(startdate);
        console.log("date" + date);
        console.log("date" + date.getFullYear());
        let newenddate = "12-31-" + date.getFullYear();
        let nextsubscriptiondata = {
          companyid: req.body[i].companyid,
          end_date: new Date(newenddate),
          subscriptions_amount: "500",
          start_date: new Date(startdate),
          userid: req.body[i].userid,
          type: "subscription",
        };
        let nextsubscriptiondataresult = Subscription(nextsubscriptiondata);
        let nextresultsubscriptiondata =
          await nextsubscriptiondataresult.save();
        subscription_id.push(
          mongoose.Types.ObjectId(nextresultsubscriptiondata._id)
        );
      }
    }
    if (resultsubscriptiondata != "") {
      let nextsubscriptiondata11 = {
        companyid: companyidnew,
        subscription_id: subscription_id,
        subscriptions_amount: subscriptions_amount,
        userid: req.body[0].userid,
      };
      let nextsubscriptiondataresult11 = SubscriberSubscription(
        nextsubscriptiondata11
      );
      let nextresultsubscriptiondata11 =
        await nextsubscriptiondataresult11.save();

      res.status(200).json({
        status: "200",
        msg: "Added Successfully",
      });
    } else {
      res.status(200).json({
        status: "400",
        msg: "No Added",
      });
    }
  } else {
    res.status(200).json({
      status: "400",
      msg: "All Field Required",
    });
  }
});

module.exports = router;
