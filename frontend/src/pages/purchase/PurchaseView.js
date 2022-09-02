import axios from 'axios'
import React, { useState, useEffect,useStyles } from 'react'
import { Grid,Paper,Table,TableContainer,TableHead,TableCell,TableRow,TableBody,Link,Button } from '@material-ui/core'
import { useForm, Form } from '../../components/UseForm';
import Controls from "../../components/controls/Controls";
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import { useParams } from "react-router-dom";
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';

const SaleView = (props) => {

    const [invoiceData, setInvoicedata] = useState([]);

    const [productData, setpdata] = useState([]);

    var { id } = useParams();

    useEffect(() => {


      }, []);

      useEffect(() => {

          try {
    
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            axios.get(`http://localhost:5000/api/purchase/getOrderById/${id}`, config)
                .then(response => {
                    console.log(response.data.products);
                    setInvoicedata(response.data)
                    setpdata(response.data.products)
                })
            } catch (error) {
                console.log(error)
            }
    
      }, []);
    
 const cancelSale = (e) => {
    try {        
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
        axios.get(`http://localhost:5000/api/sale/cancelitem/${id}`,config)
        .then(response => {
            console.log(response.data);
            alert('cancelled succesfully')
            window.location.reload(false);
        })
      } catch (error) {
       
        console.log(error)
    
    }
    e.preventDefault(); 
      };
    const onChangehandler = e => {
        const { name, value, type, checked } = e.target
    
        setpdata({
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleSubmit = e => {
        console.log(productData)
        console.log(invoiceData)
        
        try {        
            const config = {
              headers: {
                'Content-Type': 'application/json',
              },
            }
            axios.post('http://localhost:5000/api/sale/return',{  },config)
            .then(response => {
                console.log(response.data);
                alert('Order returned succesfully')
                window.location.reload(false);
            })
          } catch (error) {
           
            console.log(error)
        
        }
        e.preventDefault();    
    }
    
    return (
        <OftadehLayout>

         <h1 style={{marginTop:20}}>Purchase View</h1><Grid item  xs={12} sm={12} md={8} style={{marginLeft:170,width:200,marginTop:-50}}></Grid>
        
    
         <br></br>
         <br></br>

            <Form onSubmit={handleSubmit}>

            <Grid container>
                <Grid item xs={12} sm={12} md={6}>
                    <Grid item  xs={12} sm={12} md={9}>
                    <div style={{marginLeft:10}}><b>Invoice No</b></div>
                        <Controls.Input
                            name="orderId"
                            value={invoiceData.invoiceno}
                        />  
                    </Grid>
                
                </Grid> 
                <Grid item xs={12} sm={12} md={6}>
                    <Grid item  xs={12} sm={12} md={7}>
                    <div style={{marginLeft:10}}><b>Date</b></div>
                        <Controls.Input
                            name="orderDate"
                            value={invoiceData.billdate}
                        />
                    </Grid>               
                </Grid> 
            </Grid> 
            <Grid container>
                <Grid item xs={12} sm={12} md={6}>
                    <Grid item  xs={12} sm={12} md={9}>
                    <div style={{marginLeft:10}}><b>Supplier ID</b></div>
                        <Controls.Input
                            name="custName"
                            value={invoiceData.supplierName}
                        /> 
                    </Grid>
                
                </Grid> 
            </Grid> 

      <br></br>      
                <Grid container>                            
                
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                <TableCell ><b>PRODUCT NAME</b></TableCell>
                                    <TableCell ><b>QUANTITY</b></TableCell>
                                    <TableCell ><b>HSN</b></TableCell>
                                    <TableCell ><b>BatchNo</b></TableCell>
                                    <TableCell><b>MRP</b></TableCell>
                                    <TableCell><b>DISC-AMOUNT</b></TableCell>
                                    <TableCell><b>TAX %</b></TableCell>
                                    <TableCell><b>TAX-AMOUNT</b></TableCell>
                                    <TableCell><b>TAXABLE-AMOUNT</b></TableCell>
                                    <TableCell><b>NET_AMOUNT</b></TableCell>
                                    <TableCell><b>VERIFIED STATUS</b></TableCell>

                                    
                                   
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {productData.map((d, i) => (
                                    <TableRow key={d.pid}>
                                        <TableCell >
                                            {d.itemname}
                                        </TableCell>
                                        <TableCell >{d.qty}</TableCell>
                                        <TableCell >{d.hsncode}</TableCell>
                                        <TableCell >{d.batchno}</TableCell>
                                        <TableCell >{d.mrp}</TableCell>
                                        <TableCell >{d.dis_amnt}</TableCell>
                                        <TableCell >{d.taxper}</TableCell>
                                        <TableCell >{d.tax_amnt}</TableCell>
                                        <TableCell >{d.taxable_amnt}</TableCell>
                                        <TableCell >{d.netamount}</TableCell>
                                        <TableCell >{(d.verifyStatus === true)? <CheckIcon style={{ color: 'green' }}/>:<ClearIcon style={{ color: 'red' }}/>}</TableCell>

                                       
                                    </TableRow>
                                ))}  
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    
                </Grid>    
            </Form>
        </OftadehLayout>
        
        )

}

export default SaleView