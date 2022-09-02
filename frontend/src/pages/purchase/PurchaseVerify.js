import axios from 'axios'
import React, { useState, useEffect,useStyles } from 'react'
import { Grid,Paper,Table,TableContainer,TableHead,TableCell,TableRow,TableBody } from '@material-ui/core'
import { useForm, Form } from '../../components/UseForm';
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import { useParams } from "react-router-dom";
import { InputLabel,TextField } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import GenericPdfDownloader from  '../../components/PDFdownload/pdf'
import Moment from 'moment';
import CheckIcon from '@material-ui/icons/Check';

const SaleReturn = (props) => {

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
            axios.get(`http://localhost:5000/api/purchase/getUploadpurchase/${id}`, config)
                .then(response => {
                    // console.log(response.data);
                    setInvoicedata(response.data)
                    setpdata(response.data.products)
                })
            } catch (error) {
                console.log(error)
            }
    
      }, []);

    const handleSubmit = e => {
    
        console.log(invoiceData, "invoice details")
        console.log(productData)

       
    }
    
  console.log(invoiceData.verify_complete);
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});
const classes = useStyles();
    
    return (
        <OftadehLayout>
                 {/* <GenericPdfDownloader 
          downloadFileName={invoiceData.invoiceno} 
          rootElementId="testId" 
        /> */}

        
            <Form onSubmit={handleSubmit} id="testId" >
            {/* <Grid container spacing={3}> */}
                  
                <Grid container spacing={3} >
                    <Grid item xs={6} sm={9} >
                        <h1 style={{marginTop:20}}>Purchase Details </h1> 
                        <h4 variant="outlined" color="primary"  >Invoice No: &nbsp;{invoiceData.invoiceno}&nbsp;</h4>
                        <h4 variant="outlined" color="secondary">Grand Total: &nbsp; {invoiceData.grand_total}</h4>
                    </Grid>
                    {invoiceData.verify_complete == true ?
                    <Grid item xs={6} sm={3} >
                    <GenericPdfDownloader 
                      downloadFileName={invoiceData.invoiceno} 
                      rootElementId="testId" 
                      style={{"margin-Top" : 5}}
                    />
                    <h4 variant="outlined" color="primary"  >Status: &nbsp; {invoiceData.verify_complete== false ? "Not verified":<b style={{color:"green"}}>Verified</b>}</h4>                        
                    <h4 variant="outlined" color="secondary">Verified Date: &nbsp;{Moment(invoiceData.updatedAt).format("DD-MM-YYYY h:mm:ss a")} </h4>
                    </Grid> 
                    :
                    ""}
                </Grid>         
            {/* <h2 variant="outlined" color="primary"   style={{"margin-Top" : 30,"margin-left" : 300, "margin-bottom" : 13}} >
             Invoice No: &nbsp;{invoiceData.invoiceno}&nbsp;</h2>
             <h2 variant="outlined" color="secondary"   style={{"margin-Top" : 30,"margin-left" : 300, "margin-bottom" : 13}} >
              Grand Total: &nbsp; {invoiceData.grand_total}</h2> */}
                    
                        
                {/* <div style={{marginLeft:100}}><b>Status: &nbsp; {invoiceData.verify_complete== false ? "Not verified":"verified"}</b></div>
                <br></br>
                <br></br>
                <div style={{marginLeft:10}}><b>Verified Date: &nbsp;{Moment(invoiceData.updatedAt).format("DD-MM-YYYY")}  </b></div> */}

                                
                        
             {/* </Grid>  */}
           
                {/*Joe*/}
                <Grid container >                            
                
                    <Grid item xs={12}>
                        <TableContainer >
                            <Table  className={classes.table} aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell ><b>Product Name</b></StyledTableCell>
                                    <StyledTableCell><b>Rate</b></StyledTableCell>
                                    <StyledTableCell ><b>Quantity</b></StyledTableCell>
                                    <StyledTableCell ><b>Batch No</b></StyledTableCell>
                                    <StyledTableCell><b>Expiry</b></StyledTableCell>  
                                    {(invoiceData.verify_complete === true)?                                
                                    <StyledTableCell><b>verified_status</b></StyledTableCell>
                                    :
                                    ""}
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {productData.map((d, i) => (
                                    <StyledTableRow key={d.pid}>
                                        <StyledTableCell >
                                            {d.itemname}
                                        </StyledTableCell>
                                        <StyledTableCell >{d.pur_rate}</StyledTableCell>
                                        <StyledTableCell >{d.qty}</StyledTableCell>
                                        <StyledTableCell >{d.batchno}</StyledTableCell>
                                        <StyledTableCell >{d.exp_date}</StyledTableCell>
                                        {(invoiceData.verify_complete === true)? <StyledTableCell align="center" size="small"> <CheckIcon style={{ color: 'green' }}/></StyledTableCell>:""}
                                    </StyledTableRow>
                                ))}  
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    
                     
                </Grid>   
                <br></br>
               
            </Form>
        </OftadehLayout>
        
        )

}

export default SaleReturn