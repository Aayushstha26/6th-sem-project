import { Admin } from "../models/admin.model.js";
import { Apierror } from "../utils/apiError.js";
import { Order } from "../models/order.model.js";
import { Apiresponse } from "../utils/apiRespone.js";
import asyncHandler from "../utils/asyncHandler.js";

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Apierror("Email and password are required", 400);
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Apierror("User not found", 401);
  }
  const isPassword = await admin.isPassword(password);
  if (!isPassword) {
    throw new Apierror("Invalid password", 401);
  }
  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });
  const Option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, Option)
    .cookie("refreshToken", refreshToken, Option)
    .json({
      message: "Admin logged in successfully",
      accessToken,
    });
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    { new: true }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json({ message: "Admin logged out successfully" });
});

const getMonthlyOrders = asyncHandler(async (req, res) => {

  let startDate = new Date(new Date().getFullYear(), 0, 1);
  let endDate = new Date();

  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          $month: "$createdAt"
        },
        totalOrders: {$sum:1},
        revenue: {$sum: "$amount"}
      },
    },
    {
      $sort : {"_id": 1}
    }
  ]);
  const monthsName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let label  = [];
  let ordersData = [];
  let revenueData = [];
  let totalOrders = 0;
  let totalRevenue = 0;

  orders.forEach((order) => {
    label.push(monthsName[order._id - 1]);
    ordersData.push(order.totalOrders);
    revenueData.push(order.revenue);

    totalOrders += order.totalOrders;
    totalRevenue += order.revenue;
  });
  const lastMonthOrders = ordersData[ordersData.length -2] || 0;
  const currentMonthOrders = ordersData[ordersData.length -1] || 0;
  const ordersPercentageChange = lastMonthOrders === 0 ? 0 : ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;



  return res.status(200).json( new Apiresponse(200, "Monthly orders fetched successfully", {
    meta: {
      from: startDate,
      to: endDate,
      groupBy: "month",
  },
  summary: {
    totalOrders,
    totalRevenue,
    ordersPercentageChange,
  },
  data: {
    labels: label,
    orders: ordersData,
    revenue: revenueData,
  }
}) );
});


export { loginAdmin, logoutAdmin, getMonthlyOrders };
