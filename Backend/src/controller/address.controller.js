import { Address } from "../models/address.model.js";
import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Apiresponse } from "../utils/apiRespone.js";
const addAddress = asyncHandler(async (req, res) => {
    const { fullName, phoneNumber, address, city, postalCode, email } = req.body;
    console.log(req.body);
    if (!fullName || !phoneNumber || !address || !city || !postalCode || !email) {
        throw new Apierror(400, "All fields are required");
    }
    const savedAddr = await Address.findOne({ userId: req.user._id });
    if (savedAddr) {
        savedAddr.fullName = fullName;
        savedAddr.phoneNumber = phoneNumber;
        savedAddr.address = address;
        savedAddr.city = city;
        savedAddr.postalCode = postalCode;
        savedAddr.email = email;
        await savedAddr.save();
        return res.status(200).json(
            new Apiresponse(200, "Address updated successfully", savedAddr)
        );
    }
    const newAddress = await Address.create({
        userId: req.user._id,
        fullName,
        phoneNumber,
        address,
        city,
        email,
        postalCode,
    });
    return res.status(200).json(
        new Apiresponse(200, "Address added successfully", newAddress)
    );
});
const getAddresses = asyncHandler(async (req, res) => {
    const addresses = await Address.find();
    return res.status(200).json(
        new Apiresponse(200, "Addresses fetched successfully", addresses)
    );
});
const getAddressById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const address = await Address.findById(id);
    if (!address) {
        throw new Apierror(404, "Address not found");
    }
    return res.status(200).json(
        new Apiresponse(200, "Address fetched successfully", address)
    );
});
const deleteAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const address = await Address.findByIdAndDelete(id);    

    if (!address) {
        throw new Apierror(404, "Address not found");
    }   
    return res.status(200).json(
        new Apiresponse(200, "Address deleted successfully")
    );
}); 


export { addAddress , getAddresses, getAddressById, deleteAddress };