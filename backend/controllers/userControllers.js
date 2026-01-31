import TryCatch from "../utils/Trycatch.js";
import { User } from "../models/userModel.js";
import getDataUrl from "../utils/urlGenrator.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

/* -------------------- MY PROFILE -------------------- */
export const myProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.status(200).json(req.user);
};

/* -------------------- SEARCH ALL USERS -------------------- */
export const getAllUsers = TryCatch(async (req, res) => {
  const search = req.query.search || "";

  const users = await User.find({
    name: { $regex: search, $options: "i" },
    _id: { $ne: req.user._id },
  }).select("-password");

  res.status(200).json(users);
});

/* -------------------- USER PROFILE -------------------- */
export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

/* -------------------- FOLLOW / UNFOLLOW -------------------- */
export const followandUnfollowUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user._id.toString() === loggedInUser._id.toString()) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  if (user.followers.includes(loggedInUser._id)) {
    user.followers.pull(loggedInUser._id);
    loggedInUser.followings.pull(user._id);
    await user.save();
    await loggedInUser.save();
    return res.json({ message: "User Unfollowed" });
  }

  user.followers.push(loggedInUser._id);
  loggedInUser.followings.push(user._id);
  await user.save();
  await loggedInUser.save();

  res.json({ message: "User Followed" });
});

/* -------------------- FOLLOW DATA -------------------- */
export const userFollowerandFollowingData = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "-password")
    .populate("followings", "-password");

  res.json({
    followers: user.followers,
    followings: user.followings,
  });
});

/* -------------------- UPDATE PROFILE -------------------- */
export const updateProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.name) {
    user.name = req.body.name;
  }

  if (req.file) {
    const fileUrl = getDataUrl(req.file);

    if (user.profilePic?.id) {
      await cloudinary.v2.uploader.destroy(user.profilePic.id);
    }

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);
    user.profilePic = {
      id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await user.save();
  res.json({ message: "Profile updated" });
});

/* -------------------- UPDATE PASSWORD -------------------- */
export const updatePassword = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { oldPassword, newPassword } = req.body;

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Wrong old password" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated" });
});
