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

const initialFValues = {
    bankName: '',
    accountNumber: '',
    branchName: '',
    bankIfsc: '',
    address: '',
    gstno:'',
    status: 'active',
}

const BankMaster = (props) => {

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
        if ('bankName' in fieldValues)
            temp.bankName = fieldValues.bankName ? "" : "Bank Name is required."
        if ('accountNumber' in fieldValues)
            temp.accountNumber = fieldValues.accountNumber ? "" : "Account No is required."
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


    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            
            console.log(values)
            try {
                var bankName = values.bankName;
                var accountNumber = values.accountNumber;
                var branchName = values.branchName;
                var bankIfsc = values.bankIfsc;
                var status = values.status;
                var address = values.address;
                var gstno = values.gstno;
              
                var loginUser = localStorage.getItem("userInfo");
                var parsedloginuser = JSON.parse(loginUser)

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${parsedloginuser.token}`,
                    },
                }
                axios.post('http://localhost:5000/api/ledgers/addbank', { 
                    bankName,accountNumber,branchName,bankIfsc,status,address,gstno
                    }, config)
                    .then(response => {
                        console.log(response.data);
                        alert('Bank register Succesfull')
                        window.location.reload(false);
                    })
            } catch (error) {

                console.log(error)

            }
        }
    }

    return (
        <OftadehLayout>
            <h2>Bank Register</h2>
            <Form onSubmit={handleSubmit}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <Grid item  xs={12} sm={12} md={5}>
                            <Controls.Input
                                name="bankName"
                                label="Bank Name"
                                value={values.bankName}
                                onChange={handleInputChange}
                                error={errors.bankName}
                            />
                        </Grid>
                        <Grid item  xs={12} sm={12} md={5}>
                            <Controls.Input
                                name="accountNumber"
                                label="Account No"
                                value={values.accountNumber}
                                onChange={handleInputChange}
                                error={errors.accountNumber}
                            />
                        </Grid>
                        <Grid item  xs={12} sm={12} md={4}>
                            <Controls.Input
                                name="branchName"
                                label="Branch Name"
                                value={values.branchName}
                                onChange={handleInputChange}
                                error={errors.branchName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={5}>
                            <Controls.TextArea
                                label="Bank Address"
                                name="address"
                                value={values.address}
                                onChange={handleInputChange}
                                error={errors.address}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Controls.Input
                                label="IFSC Code"
                                name="bankIfsc"
                                value={values.bankIfsc}
                                onChange={handleInputChange}
                                error={errors.bankIfsc}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={7}>
                            <Controls.RadioGroup
                                name="status"
                                label="Status"
                                value={values.status}
                                onChange={handleInputChange}
                                items={statusItems}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={5}>
                            <Controls.Input
                                label="GST No"
                                name="gstno"
                                value={values.gstno}
                                onChange={handleInputChange}
                                error={errors.gstno}
                            />
                        </Grid>

                        <Controls.Button
                                type="submit"
                                text="Add Bank" />
                    </Grid>
                    

                        

                            

                </Grid>
            </Form>
        </OftadehLayout>
    )
}

export default BankMaster
