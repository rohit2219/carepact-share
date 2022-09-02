import React, { useState, useEffect } from 'react'
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link, Typography} from '@material-ui/core';
import {Grid,MenuItem, Fab, FormControl, Avatar, Radio, Checkbox, FormLabel, Button, TextField, FormControlLabel, Select} from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { useForm, Form } from '../../components/UseForm';
import { useParams } from "react-router-dom";
import axios from 'axios';
import Moment from 'moment';

const ReturnDetails = () => {
    var [returnDetailsData, setReturnDetailsData] = useState([]);
    var [orderData, setOrderData] = useState([]);
    var [supplierId,setSupplierId] = useState("");
    var [paymentMethod,setPayment] = useState("");
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [filename, setFile] = React.useState("");
    const [uploading, setUploading] = useState(undefined);
    var [returnStatus,setStatus] = useState("");

    var netAmount=0;

    const [values, setValues] = useState({
      fileName: '',
      creditAmount: '',
      creditNo: '',
    });
    const {fileName, creditAmount, creditNo} = values
    const handleChange = name => event=> {
      setValues({...values, error: false, [name]: event.target.value});
      // console.log({creditAmount}, "hello on handle change")
  };
  
    var { id } = useParams();

    const cancel = (e) => {
      try {        
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
        axios.post(`http://localhost:5000/api/purchaseReturn/cancelitem/${id}`,{returnDetailsData},config)
        .then(response => {
            // console.log(response.data);
            alert('cancelled succesfully')
            window.location.reload(false);
        })
      } catch (error) {
       
        console.log(error)
    
    }
    e.preventDefault(); 
    }

    function handleUpload(e) {
      
      const file = e.target.files[0];
      // console.log(file)
      setFile(e.target.files[0].name);
      // setImage(e.target.value);
      var formData = new FormData();

      formData.append('image', file);
      console.log(formData.get('image'))

      setSelectedFiles(e.target.files);
      console.log(selectedFiles); 

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      const { data } = axios.post('http://localhost:5000/api/upload',formData, config)

    }

    const handleSubmit =  e => {
      e.preventDefault();

      setValues({...values, error: false}) 
    
      const customerData = {
        fileName      : filename,
        creditAmount  : creditAmount,
        creditNo      : creditNo
    }
   
    const ledgerData = {
      supplierId : supplierId,
      payment    : paymentMethod,
      Date       : new Date().toLocaleString(),
      grand_total: creditAmount,

    }
      axios.post('http://localhost:5000/api/purchaseReturn/returnLedger',{ledgerData})
    //  console.log(ledgerData);
    .then(response =>  alert(response.data.data));
     console.log(customerData);

    axios.post(`http://localhost:5000/api/purchaseReturn/creditupdate/${id}`,{customerData})
    .then(response =>  alert(response.data.data));

    alert('Credit Note details updated')

    };

  
    useEffect(() => {   
            axios.get(`http://localhost:5000/api/purchaseReturn/getreturndetails/${id}`)
            .then(res => {
                // console.log(res.data);

                setReturnDetailsData(res.data);
              })
              
              .catch(err => console.log(err)); 
         
        }, []);

        useEffect(() => {   
          axios.get(`http://localhost:5000/api/purchaseReturn/getsupplier/${id}`)
          .then(res => {
            const sid=res.data.SupplierId;
              setSupplierId(res.data.SupplierId);
              setPayment(res.data.paymentMethod);
              setStatus(res.data.returnStatus);
              // console.log(res.data.returnStatus);

              axios.get(`http://localhost:5000/api/purchaseReturn/supplierDetails/${sid}`)
              .then(res => {
                  // console.log(res.data);

                  setOrderData(res.data);
                })
                
                .catch(err => console.log(err)); 
            })
            
            .catch(err => console.log(err)); 
       
      }, []);

    //   useEffect(() => {   
    //     console.log(supplierId);
    //     // axios.get(`http://localhost:5000/api/purchaseReturn/supplierDetails/${supplierId}`)
    //     // .then(res => {
    //     //     console.log(res.data);

    //     //     setOrderData(res.data);
    //     //   })
          
    //     //   .catch(err => console.log(err)); 
     
    // }, []);

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
      
     
      
      const setStyles = makeStyles({
        table: {
          minWidth: 700,
        },
        mb3: {
            margin: "1.3rem 0"
          },
      });
      
        const classes = setStyles();
    return(
        <OftadehLayout>
          <Table align="right" style={{"width" : 400}}>
                <TableRow>
                <TableCell align="left" style={{"width" : 50}}>Supplier</TableCell>
                <TableCell align="right">:-</TableCell>
                <TableCell align="left">{orderData.supplierName}</TableCell>
                </TableRow>
                
                <TableRow>
                <TableCell align="left">Address</TableCell>
                <TableCell align="right">:-</TableCell>
                <TableCell align="left">{orderData.address}</TableCell>
                </TableRow>
                
                <TableRow>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="right">:-</TableCell>
                <TableCell align="left">{orderData.mobile}</TableCell>
                </TableRow>

                <TableRow>
                <TableCell align="left">Email</TableCell>
                <TableCell align="right">:-</TableCell>
                <TableCell align="left">{orderData.email}</TableCell>
                </TableRow>

 
            </Table>
            
            {/* <Button type="submit" color="primary" variant="contained"  ><input type="file" /></Button>   */}
           <Typography component="h1" variant="h5" className={classes.mb3} > Return Details</Typography>
         
           {
                (returnStatus == 'P')  ? 
         
              <Button
            variant="contained"
            component="label"
            className={classes.mb3}
            color="secondary"
            aria-label="add"
            size="small"
            onClick={cancel}
            >
           Cancel Return
            
            </Button> :
            ""
          
          }
           
              

            <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell> </StyledTableCell>
            <StyledTableCell align="center">Product Name</StyledTableCell>
            <StyledTableCell align="center">Batch No</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Exp Date</StyledTableCell>
            <StyledTableCell align="center">Ptr</StyledTableCell>
            <StyledTableCell align="center">GST</StyledTableCell>
            <StyledTableCell align="center">Discount</StyledTableCell>
            <StyledTableCell align="center">Subtotal</StyledTableCell>

           
          </TableRow>
        </TableHead>
        <TableBody>
        {returnDetailsData.map(row => {   
          {netAmount=netAmount+row.subtotal}
           return( 
            <StyledTableRow >
            <StyledTableCell align="center"></StyledTableCell>
              <StyledTableCell align="center">{row.itemname}</StyledTableCell>
              <StyledTableCell align="center">{row.batchno}</StyledTableCell>
              <StyledTableCell align="center">{row.qty}</StyledTableCell>
              <StyledTableCell align="center">{Moment(row.exp_date).format("DD-MM-YYYY")}</StyledTableCell>
              <StyledTableCell align="center">{row.pur_rate}</StyledTableCell>
              <StyledTableCell align="center">{row.gst}</StyledTableCell>
              <StyledTableCell align="center">{row.discount}</StyledTableCell>
              <StyledTableCell align="center">{row.subtotal}</StyledTableCell>

            </StyledTableRow>
            
           )
          })} 
        
        </TableBody>
      </Table>
    </TableContainer>
    <Table align="left" style={{"width" : 300, "marginTop":50}}>
                <TableRow style={{fontWeight: 'bold'}}>SUMMARY</TableRow>
                <TableRow></TableRow>
                <TableRow>
                <TableCell align="left" style={{"width" : 50}}>Payment Method</TableCell>
                <TableCell align="right">:-</TableCell>
                <TableCell align="left">{paymentMethod}</TableCell>
                </TableRow>
                
                <TableRow>
                <TableCell align="left">Net Amount</TableCell>
                <TableCell align="right">:-</TableCell>
                <TableCell align="left">{netAmount}</TableCell>
                </TableRow>
                
            </Table>
            {
                (returnStatus == 'P')  ? 
         
            <Form onSubmit={handleSubmit}>
           
            <Table align="right" style={{"width" : 500, "marginTop":50}}>
                {/* <TableRow style={{fontWeight: 'bold'}}>SUMMARY</TableRow> */}
                <TableRow></TableRow>
                <TableRow>
                <TableCell align="left" style={{"width" : 50}}>Upload Credit Note</TableCell>
                <TableCell align="right">:-</TableCell>
                <TableCell align="left"><input type="file" size="small" name="fileName" onChange={handleUpload}/></TableCell>
                </TableRow>
                
                <TableRow>
                <TableCell align="left">Credit Note No</TableCell>
                <TableCell align="right">:-</TableCell>
                <TableCell align="left"><input type="text" size="small" name="creditNo" onChange={handleChange("creditNo")} value={creditNo}/></TableCell>
                </TableRow>

                <TableRow>
                <TableCell align="left">Total Credit Amount</TableCell>
                <TableCell align="right">:-</TableCell>
                <TableCell align="left"><input type="text" size="small" name="creditAmount" onChange={handleChange("creditAmount")} value={creditAmount}/></TableCell>
                </TableRow>
                <Button type="submit" color="primary" variant="contained">Add</Button>  
            </Table>
            </Form> :
            ""
              }
              
        </OftadehLayout>
        )
}

export default ReturnDetails;