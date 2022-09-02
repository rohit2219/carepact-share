import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Grid, Box, GridList } from '@material-ui/core'
import { useForm, Form } from '../../components/UseForm'
import Controls from "../../components/controls/Controls";
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import moment from 'moment';

const statusItems = [
    { id: 'active', title: 'Active' },
    { id: 'inactive', title: 'Inactive' }
]
const lockItems = [
    { id: 'enable', title: 'Enabled' },
    { id: 'disable', title: 'Disabled' },
]

const accItems = [
    { id: 'cash', title: 'Cash a/c' },
    { id: 'bank', title: 'Bank a/c' },
    { id: 'trading', title: 'Trading a/c' },
    { id: 'other', title: 'Other a/c' }
]
const paymentItems = [
    { id: 'cash', title: 'Cash' },
    { id: 'card', title: 'Card' },
    { id: 'credit', title: 'Credit' },
]

const gsttypetCollection = [
    { id: '1', title: 'Registered' },
    { id: '2', title: 'Unregistered' },
]
const billtypeCollection = [
    { id: '1', title: 'Tax' },
    { id: '2', title: 'No Tax' },
]
const initialFValues = {
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    pincode: '',
    panNo: '',
    autoLock: 'enable',
    status: 'active',
    paymentMethod: 'cash',
    lockItems: 'unlock',
    isLock: false,
    isSales: false,
    isPurchase: true,
    accType: 'other',
    gstNo:''
}

const AccountMaster = (props) => {

    const { history } = props;

    useEffect(() => {

        var loginUser = localStorage.getItem("userInfo");
        if(loginUser==null) 
        {
            history.push("/pages/auth/login")
        }
    
      }, []);
      
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('fullName' in fieldValues)
            temp.fullName = fieldValues.fullName ? "" : "This field is required."
        if ('email' in fieldValues)
            temp.email = (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/).test(fieldValues.email) ? "" : "Email is not valid."
        if ('mobile' in fieldValues)
            temp.mobile = (/^[0-9]{10}$/).test(fieldValues.mobile) ? "" : "Minimum 10 numbers and characters not allowed."
        if ('pincode' in fieldValues)
            temp.pincode = (/^[0-9]{1,6}$/).test(fieldValues.pincode) ? "" : "Only 6 digit and characters not allowed."
        if ('gstNo' in fieldValues)
            temp.gstNo = fieldValues.gstNo ? "" : "Gstnoode is required."
        if ('panNo' in fieldValues)
            temp.panNo = (/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]$/).test(fieldValues.panNo) ? "" : "Pan Number is not valid."
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const [gstDate, setDate] = useState(
        moment(new Date()).format("YYYY-MM-DD")
     );
    
     // handles when user changes input in date inputfield
     const handleChangeDate = e => {
        setDate(e.target.value);
     };

     var front = 'supp';
     //var supplierid = front+Math.floor(Math.random() * 10000);
     var supplierid = front+Math.floor(Date.now() /1000);

    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            
            console.log(supplierid)
            try {
                var supplierId = supplierid;
                var supplierName = values.fullName;
                var status = values.status;
                var address = values.address;
                var email = values.email;
                var mobile = values.mobile;
                var city = values.city;
                var pincode = values.pincode;
                var contactPerson = values.contactPerson;
                var gstNo = values.gstNo;
                var gstType = values.gstType;
                var gstValid = gstDate;
                var supplierDlno1 = values.dlno1;
                var supplierDlno2 = values.dlno2;
                var autoLock = values.autoLock;
                var accountHead = values.bankHead;
                var accountNumber = values.bankAccno;
                var branchName = values.bankBranch;
                var bankName = values.bankName;
                var bankIfsc = values.bankIfsc;
                var bankMicr = values.bankMicr;
                var billType = values.billType;
                var panNo = values.panNo;
                var accType = values.accType;
                var creditDays = values.creditDays;
                var creditLimit = values.creditLimit;
                var debitDays = values.debitDays;
                var debitLimit = values.debitLimit;
                var noofBills = values.noofBills;
                var lockDays = values.lockDays;
                var paymentMethod = values.paymentMethod;
                var isSale = values.isSale;
                var isPurchase = values.isPurchase;
                var isLock = values.isLock;

                var loginUser = localStorage.getItem("userInfo");
                var parsedloginuser = JSON.parse(loginUser)

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${parsedloginuser.token}`,
                    },
                }
                axios.post('http://localhost:5000/api/account/register', { 
                    supplierId,supplierName,status,address,email,mobile,city,pincode,contactPerson,gstNo,gstType,gstValid,supplierDlno1,supplierDlno2,autoLock,accountHead,accountNumber,branchName,bankName,bankIfsc,bankMicr,billType,panNo,accType,creditDays,creditLimit,debitDays,debitLimit,noofBills,lockDays,paymentMethod,isSale,isPurchase,isLock                
                    }, config)
                    .then(response => {
                        console.log(response.data);
                        alert('Supplier registerd')
                        window.location.reload(false);
                    })
            } catch (error) {

                console.log(error)

            }
        }
    }

    return (
        <OftadehLayout>
            <Form onSubmit={handleSubmit}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={6}>
                        <Grid item  xs={12} sm={12} md={9}>
                            <Controls.Input
                                name="fullName"
                                label="Supplier Name"
                                value={values.fullName}
                                onChange={handleInputChange}
                                error={errors.fullName}
                            />
                        </Grid>

                        <Controls.RadioGroup
                            name="status"
                            label="Status"
                            value={values.status}
                            onChange={handleInputChange}
                            items={statusItems}
                        />
                        <Grid item xs={9}>
                            <Controls.TextArea
                                label="Address"
                                name="address"
                                value={values.address}
                                onChange={handleInputChange}
                                error={errors.address}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <Controls.Input
                                label="Email"
                                name="email"
                                value={values.email}
                                onChange={handleInputChange}
                                error={errors.email}
                            />
                        </Grid>

                        <Grid item xs={9}>
                            <Controls.Input
                                label="Mobile"
                                name="mobile"
                                value={values.mobile}
                                onChange={handleInputChange}
                                error={errors.mobile}
                            />
                        </Grid>
                        <Grid container xs={9}>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="City"
                                    name="city"
                                    value={values.city}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Pincode"
                                    name="pincode"
                                    value={values.pincode}
                                    onChange={handleInputChange}
                                    error={errors.pincode}
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={9}>
                            <Controls.Input
                                label="Contact Person"
                                name="contactPerson"
                                value={values.contactPerson}
                                onChange={handleInputChange}
                                error={errors.contactPerson}
                            />
                        </Grid>
                        <Grid container xs={9}>
                            <Grid item xs={8}>
                                <Controls.Input
                                    label="GST No"
                                    name="gstNo"
                                    value={values.gstNo}
                                    onChange={handleInputChange}
                                    error={errors.gstNo}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Controls.Select
                                    label="GST Type"
                                    name="gstType"
                                    value={values.gstType}
                                    onChange={handleInputChange}
                                    options={gsttypetCollection}
                                    error={errors.gstType}
                                />
                            </Grid>
                        </Grid>

                        <Grid container xs={9}>
                            <Grid item xs={8}>
                                <Controls.DateSelect
                                    label="Valid From"
                                    name="gstValid"
                                    value={values.gstValid}
                                    onChange={handleChangeDate}
                                />
                            </Grid>    
                        </Grid>
                        <Grid container xs={9}>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="DLNO 1"
                                    name="dlno1"
                                    value={values.dlno1}
                                    onChange={handleInputChange}
                                    error={errors.dlno1}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="DLNO 2"
                                    name="dlno2"
                                    value={values.dlno2}
                                    onChange={handleInputChange}
                                    error={errors.dlno2}
                                />
                            </Grid>
                            
                        </Grid>
                        <Controls.RadioGroup
                            name="autoLock"
                            label="Auto Lock"
                            value={values.autoLock}
                            onChange={handleInputChange}
                            items={lockItems}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Grid container xs={9}>
                            <Controls.Input
                                name="bankHead"
                                label="Account Head"
                                value={values.bankHead}
                                onChange={handleInputChange}
                                error={errors.bankHead}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <Controls.Input
                                name="bankAccno"
                                label="Account No"
                                value={values.bankAccno}
                                onChange={handleInputChange}
                                error={errors.bankAccno}
                            />
                        </Grid>
                        <Grid container xs={12}>
                            <Grid item xs={6}>
                                <Controls.Input
                                    name="bankName"
                                    label="Bank Name"
                                    value={values.bankName}
                                    onChange={handleInputChange}
                                    error={errors.bankName}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    name="bankBranch"
                                    label="Branch"
                                    value={values.bankBranch}
                                    onChange={handleInputChange}
                                    error={errors.bankBranch}
                                />
                            </Grid>
                            
                        </Grid>
                        <Grid item xs={7}>
                            <Controls.Input
                                name="bankIfsc"
                                label="IFSC"
                                value={values.bankIfsc}
                                onChange={handleInputChange}
                                error={errors.bankIfsc}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <Controls.Input
                                name="bankMicr"
                                label="MICR"
                                value={values.bankMicr}
                                onChange={handleInputChange}
                                error={errors.bankMicr}
                            />
                        </Grid>
                        <Grid container xs={12}>
                            <Grid item xs={6}>
                                <Controls.Select
                                    name="billType"
                                    label="Bill Type"
                                    value={values.billType}
                                    onChange={handleInputChange}
                                    options={billtypeCollection}
                                    error={errors.billType}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    name="panNo"
                                    label="Pan No"
                                    value={values.panNo}
                                    onChange={handleInputChange}
                                    error={errors.panNo}
                                />
                            </Grid>                            
                        </Grid>
                        <Controls.RadioGroup
                            name="accType"
                            label="Account Type"
                            value={values.accType}
                            onChange={handleInputChange}
                            items={accItems}
                        />
                        <Grid container xs={12}>
                            <Grid item xs={6}>
                                <Controls.Input
                                    name="creditDays"
                                    label="Credit Days"
                                    value={values.creditDays}
                                    onChange={handleInputChange}
                                    error={errors.creditDays}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    name="creditLimit"
                                    label="Credit Limit"
                                    value={values.creditLimit}
                                    onChange={handleInputChange}
                                    error={errors.creditLimit}
                                />
                            </Grid>        
                        </Grid>

                        <Grid container xs={12}>
                            <Grid item xs={6}>
                                <Controls.Input
                                    name="debitDays"
                                    label="Debit Days"
                                    value={values.debitDays}
                                    onChange={handleInputChange}
                                    error={errors.debitDays}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    name="debitLimit"
                                    label="Debit Limit"
                                    value={values.debitLimit}
                                    onChange={handleInputChange}
                                    error={errors.debitLimit}
                                />
                            </Grid>
                        </Grid>

                        <Grid container xs={12}>
                            <Grid item xs={6}>
                                <Controls.Input
                                    name="noofBills"
                                    label="No Of Bills"
                                    value={values.noofBills}
                                    onChange={handleInputChange}
                                    error={errors.noofBills}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    name="lockDays"
                                    label="Lock Days"
                                    value={values.lockDays}
                                    onChange={handleInputChange}
                                    error={errors.lockDays}
                                />
                            </Grid>                          
                        </Grid>

                        <Controls.RadioGroup
                            name="paymentMethod"
                            label="Payment Method"
                            value={values.paymentMethod}
                            onChange={handleInputChange}
                            items={paymentItems}
                        />
                        <Grid container xs={9}>
                            <Grid item xs={6}>
                                <Controls.Checkbox
                                    name="isSales"
                                    label="Allow sales"
                                    value={values.isSales}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Checkbox
                                    name="isPurchase"
                                    label="Allow purchase"
                                    value={values.isPurchase}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Checkbox
                                    name="isLock"
                                    label="Lock"
                                    value={values.isLock}
                                    onChange={handleInputChange}
                                />
                            </Grid>                        
                        </Grid>

                        <div>
                            <Controls.Button
                                type="submit"
                                text="Submit" />
                            <Controls.Button
                                text="Reset"
                                color="default"
                                onClick={resetForm} />
                        </div>
                    </Grid>
                </Grid>
            </Form>
        </OftadehLayout>
    )
}

export default AccountMaster
