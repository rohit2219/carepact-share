import React, {useState, useEffect,useRef} from 'react'
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import { useParams } from "react-router-dom";
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import Moment from 'moment';

const DebitNote= () => {
    // const paperStyle={padding :20, margin :'20px auto auto 20px', height :'80vh',  minWidth: 700}
    var { id } = useParams();
    const printRef = useRef();
  
    const pageStyle = `
    @page {
      size: 80mm 50mm;
    }
  
    @media all {
      .pagebreak {
        display: none;
      }
    }
  
    @media print {
      .pagebreak {
        page-break-before: always;
      }
    }
  `;
      const useStyles = makeStyles({
        paperStyle: {
          minWidth: 300,
          marginLeft : "4.3rem",
         
   
        },
        mb3: {
            // margin: "1.3rem 0"
            marginBottom :"1.3rem",
            borderBottom: 1,
            borderColor:"black",
            
          },
        mb4: {
        // margin: "1.3rem 0"
            marginBottom :"1.3rem",
            marginLeft : "30.3rem"
        },
          padding: {
            // padding: `0 ${theme.spacing.unit * 2}px`,
            minWidth: 900,
            backgroundColor: "black",
            color :"white",
            // height: 27,
            align : "right",
            margin: "1.3rem 0"
          }, 
          hStyle : {
            alignItems : "center",
            margin: "0 21.3rem 0"
          },
          thStyle : {
            padding: "0.5em",
            marginLeft : "-0.3rem"
            // position: "relative"
          },
          
      });
      const classes = useStyles();

      var loginUser = localStorage.getItem("userInfo");
      var parsedloginuser = JSON. parse(loginUser);
      var userId=parsedloginuser._id;
      console.log(userId);

      var [customerData, setCustomerData] = useState([]);
      var [supplierData, setSupplierData] = useState([]);
      var [supplierId,setSupplierId] = useState("");
      var [paymentMethod,setPayment] = useState("");
      var [date,setDate] = useState("");
      var [returnDetailsData, setReturnDetailsData] = useState([]);
      var netAmount=0;

      useEffect(() => {   
        axios.get(`http://localhost:5000/api/purchaseReturn/customerdetails/${userId}`)
        .then(res => {
            console.log(res.data);

            setCustomerData(res.data);
          })
          
          .catch(err => console.log(err)); 
     
    }, []);

      useEffect(() => {   
        axios.get(`http://localhost:5000/api/purchaseReturn/getsupplier/${id}`)
        .then(res => {
            // console.log(res.data);
          const sid=res.data.SupplierId;
            setSupplierId(res.data.SupplierId);
            setPayment(res.data.paymentMethod);
            setDate(res.data.date);
            axios.get(`http://localhost:5000/api/purchaseReturn/supplierDetails/${sid}`)
            .then(res => {
                // console.log(res.data);

                setSupplierData(res.data);
                // console.log(res.data);
              })
              
              .catch(err => console.log(err)); 
          })
          
          .catch(err => console.log(err)); 
     
    }, []);

    useEffect(() => {   
        axios.get(`http://localhost:5000/api/purchaseReturn/getreturndetails/${id}`)
        .then(res => {
            // console.log(res.data);

            setReturnDetailsData(res.data);
          })
          
          .catch(err => console.log(err)); 
     
    }, []);
   
    const handlePrint = useReactToPrint({
      content: () => printRef.current,
    });


    // style={{paperStyle}}
    return (
        <OftadehLayout>
            {/* <Grid container border={1}> */}
            <div style={{width: "1000px",height: "700px",}} ref={printRef}>

            <Box display="flex" justifyContent="center"  border={1} className={classes.paperStyle} >
                <Grid align="center"  >
                {/* <Paper elevation={5} > */}
                        <button onClick={handlePrint}>Print this out!</button>
                        <Badge className={classes.padding}  alignItems="center">
                            {/* Debit Note */}
                                <h2 className={classes.hStyle}>Debit Note</h2>
                        </Badge>
                        <Table border={2} style={{borderTop:"none"}}>
                            <TableRow>
                              
                            <TableCell style={{borderBottom:"none"}} width="30">
                            <div style={{marginLeft:40,marginTop:-30}}>
                               <h3><b> {customerData.userName}</b></h3>
                               Phone:- &nbsp;{customerData.phone_no}<br/>
                               Email:- &nbsp;{customerData.email}<br/>
                               GST:- &nbsp;{customerData.gst}<br/>
                               Dl No:- &nbsp;{customerData.dlNo}
                               </div>
                        </TableCell>
                        <TableCell style={{borderBottom:"none"}} width="30">
                        <Table  >
                        <TableRow style={{ fontWeight: 'bold' }} className={classes.hStyle}>
                           
                        </TableRow>
                            <div style={{marginLeft:40,marginTop:-30,width:200}}>
                               <h4><b> Bill to<br/> {supplierData.supplierName}</b></h4><br/>
                              <div style={{marginTop:-20}}> {supplierData.address},&nbsp;<br/> {supplierData.city}, &nbsp;{supplierData.pincode}</div><br/>
                               Phone:- &nbsp;{supplierData.mobile}<br/>
                               Email:- &nbsp;{supplierData.email}<br/>
                               GSTIN:- &nbsp;{customerData.gst}<br/>
                               Dl No:- &nbsp;{customerData.dlNo}
                               </div>
                            
                        </Table>
                        </TableCell>
                        <TableCell  style={{borderBottom:"none"}} width="80" >
                        <Table >
                           
                         
                          <TableRow >
                               <Grid style={{marginLeft:20,marginTop:60,width:250}}>
                              
                              <h3>Debit Note No   :- &nbsp;{id}<br/>
                                   Date            :- &nbsp;{Moment(date).format("DD-MM-YYYY")}<br/>
                                  Payment Method  :- &nbsp;{paymentMethod}<br/>
                                  Return status   :- &nbsp;{customerData.dlNo}
                              
                                  </h3> <br/>
                              <br/>
                              
                              
                               </Grid>
                           
                            </TableRow>
                        </Table>
                        </TableCell>
                        </TableRow>
                        </Table>
                        <br></br>
                        <TableContainer>
                        {/* <Table align="left" style={{"width" : 50}} >
                        <TableRow>
                            <h2>Bill to</h2>
                        </TableRow>
                             <TableRow >
                            <TableCell align="left"  style={{borderBottom:"none"}}>Name</TableCell>
                            <TableCell align="right" style={{borderBottom:"none"}}>:-</TableCell>
                            <TableCell align="left" style={{borderBottom:"none"}}>{supplierData.supplierName}</TableCell>
                            </TableRow>
                            
                            <TableRow>
                            <TableCell align="left" style={{borderBottom:"none"}}>Address</TableCell>
                            <TableCell align="right" style={{borderBottom:"none"}}>:-</TableCell>
                            <TableCell align="left" style={{borderBottom:"none"}}>{supplierData.address}</TableCell>
                            </TableRow>
                            
                            <TableRow>
                            <TableCell align="left" style={{borderBottom:"none"}}>Phone</TableCell>
                            <TableCell align="right" style={{borderBottom:"none"}}>:-</TableCell>
                            <TableCell align="left" style={{borderBottom:"none"}}>{supplierData.mobile}</TableCell>
                            </TableRow>
        
                            <TableRow>
                            <TableCell align="left" style={{borderBottom:"none"}}>Email</TableCell>
                            <TableCell align="right" style={{borderBottom:"none"}}>:-</TableCell>
                            <TableCell align="left" style={{borderBottom:"none"}}>{supplierData.email}</TableCell>
                            </TableRow>

                        </Table> */}
                        </TableContainer>
                    <TableContainer>
                        <Table  className={classes.mb3 } border={1} >
                            <TableHead style={{borderColor:"black"}}>
                                <TableCell style={{ fontWeight: 'bold' , borderColor:"black"}}>Product</TableCell>
                                <TableCell style={{ fontWeight: 'bold', borderColor:"black" }}>Qty</TableCell>
                                <TableCell style={{ fontWeight: 'bold' , borderColor:"black"}}>PTR</TableCell>
                                <TableCell style={{ fontWeight: 'bold', borderColor:"black" }}>EXP Date </TableCell>
                                <TableCell style={{ fontWeight: 'bold', borderColor:"black" }}>MRP</TableCell>
                                <TableCell style={{ fontWeight: 'bold' , borderColor:"black"}}>Batch No</TableCell>
                                <TableCell style={{ fontWeight: 'bold', borderColor:"black" }}>Disc Amt</TableCell>
                                <TableCell style={{ fontWeight: 'bold', borderColor:"black" }}>Tax Amt</TableCell>
                                <TableCell style={{ fontWeight: 'bold' , borderColor:"black"}}>GST %</TableCell>
                                <TableCell style={{ fontWeight: 'bold' ,borderColor:"black"}}>GST</TableCell>
                                <TableCell style={{ fontWeight: 'bold',borderColor:"black" }}>Net Amt</TableCell>
                            </TableHead>
                            <TableBody>
                            {returnDetailsData.map(row => { 
                                 
                                {netAmount=netAmount+row.subtotal}
                                return( 
                                <TableRow style={{borderColor:"black"}}>
                                    <TableCell border={1} style={{borderColor:"black"}}>{row.itemname}</TableCell>
                                    <TableCell style={{borderColor:"black"}}>{row.qty}</TableCell>
                                    
                                    <TableCell style={{borderColor:"black"}}>{row.pur_rate}</TableCell>
                                    <TableCell style={{borderColor:"black"}}>{Moment(row.exp_date).format("DD-MM-YYYY")}</TableCell>
                                    <TableCell style={{borderColor:"black"}}>10.00</TableCell>
                                    <TableCell style={{borderColor:"black"}}>{row.batchno}</TableCell>
                                    <TableCell style={{borderColor:"black"}}>{row.dis_amnt}</TableCell>
                                    <TableCell style={{borderColor:"black"}}>{(row.qty*row.pur_rate)-(row.dis_amnt)}</TableCell>
                                    <TableCell style={{borderColor:"black"}}>{row.gst}</TableCell>
                                    <TableCell style={{borderColor:"black"}}>{Math.round(row.tax_amnt)}</TableCell>
                                    <TableCell style={{borderColor:"black"}}>{row.subtotal}</TableCell>
                                </TableRow>
                                  )
                                })} 
                              
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid alignContent="right" className={classes.mb4}>
                    <TableRow >
                        <TableCell style={{borderBottom:"none"}}>Total Amount</TableCell>
                        <TableCell style={{borderBottom:"none"}}>:-</TableCell>
                        <TableCell style={{borderBottom:"none"}}>{netAmount}</TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{borderBottom:"none"}}>Total Amount(Rounded)</TableCell>
                        <TableCell style={{borderBottom:"none"}}>:-</TableCell>
                       
                        <TableCell style={{borderBottom:"none"}}>{Math.round(netAmount).toFixed(2)}</TableCell>
                    </TableRow>
                    </Grid>
                    {/* </Paper> */}
                </Grid>
                </Box>
            </div>
            {/* </Grid> */}
        </OftadehLayout>
         );
        }
        
export default DebitNote;