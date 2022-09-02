import asyncHandler from 'express-async-handler'
import Account from '../models/accountModel.js'
import validator from 'express-validator'
const { check, validationResult } = validator

const registerSupplier = asyncHandler(async(req, res) => {

    const errors = validationResult(req);

    const supplierId = req.body.supplierId;
    const supplierName = req.body.supplierName;
    const status = req.body.status;
    const address = req.body.address;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const city = req.body.city;
    const pincode = req.body.pincode;
    const contactPerson = req.body.contactPerson;
    const gstno = req.body.gstNo;
    const gstType = req.body.gstType;
    const gstValid = req.body.gstValid;
    const supplierDlno1 = req.body.dlno1;
    const supplierDlno2 = req.body.dlno2;
    const autoLock = req.body.autoLock;
    const accountHead = req.body.accountHead;
    const accountNumber = req.body.bankAccno;
    const branchName = req.body.bankBranch;
    const bankName = req.body.bankName;
    const bankIfsc = req.body.bankIfsc;
    const bankMicr = req.body.bankMicr;
    const billType = req.body.billType;
    const panNo = req.body.panNo;
    const accType = req.body.accType;
    const creditDays = req.body.creditDays;
    const creditLimit = req.body.creditLimit;
    const debitDays = req.body.debitDays;
    const debitLimit = req.body.debitLimit;
    const noofBills = req.body.noofBills;
    const lockDays = req.body.lockDays;
    const paymentMethod = req.body.paymentMethod;
    const isSale = req.body.isSale;
    const isPurchase = req.body.isPurchase;
    const isLock = req.body.isLock;

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "CO-AC-registerSupplier/47-Unprocessable Entity, modification require in content"
                // error: errors.array()[0].msg
        });
    } else {
        const userExists = await Account.findOne({ email, gstno })

        if (userExists) {
            res.status(400).json({ message: "CO-AC-registerSupplier/54-User already exists" })
        }

        const supplier = await Account.create({
            supplierId,
            supplierName,
            status,
            address,
            email,
            mobile,
            city,
            pincode,
            contactPerson,
            gstno,
            gstType,
            gstValid,
            supplierDlno1,
            supplierDlno2,
            autoLock,
            accountHead,
            accountNumber,
            branchName,
            bankName,
            bankIfsc,
            bankMicr,
            billType,
            panNo,
            accType,
            creditDays,
            creditLimit,
            debitDays,
            debitLimit,
            noofBills,
            lockDays,
            paymentMethod,
            isSale,
            isPurchase,
            isLock
        })

        if (supplier) {
            res.status(201).json({
                message: "success",
                supplier
            })
        } else {
            res.status(400).json({ message: "CO-AC-registerSupplier/100-Invalid user data" })
        }
    }
})

const getSupplierById = asyncHandler(async(req, res) => {
    Account.find({ supplierId: req.params.id }, function(err, result) {
        if (err) {
            res.send({
                message: "CO-AC-getSupplierById/109-not found"
                    // err
            });
        } else {
            res.send(result);
        }
    });
});

export {
    registerSupplier,
    getSupplierById
}