import React, { useState, useEffect } from 'react'
import { Grid, MenuItem, Table, TextField, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/UseForm';
import { styles } from "./style"
import axios from "axios";
import { Paper, Avatar,FormLabel,makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "../../components/useTable";
import Popup from '../../components/Popup';
import { FormControl, InputLabel, Select as MuiSelect, FormHelperText } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import AddShoppingCartSharpIcon from '@material-ui/icons/AddShoppingCartSharp';
import { Link, Typography, Button} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import StorageIcon from '@material-ui/icons/Storage';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import CancelIcon from '@material-ui/icons/Cancel';
import LockIcon from '@material-ui/icons/Lock';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import SearchBar from "material-ui-search-bar";

export default function EmployeeForm(props) {
  const [open, setOpen] = React.useState(false);
  const [list, setList] = useState([]);
  var [page, setPage] = React.useState(1);
  const [userData, setUserData] = useState([]);
  const { history } = props;
  var [invoiceNo, setInvoice] = React.useState();
  var [customerName, setCustomerName] = React.useState();
  var [billTotal, setBillTotal] = React.useState();
  var [billfile, setFile] = React.useState();
  const [supp, setsupp] = React.useState("");
  const [suppName, setsuppName] = React.useState("");
  var [supplierdata, setSupplierdata] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
   const [searched, setSearched] = useState("");
  const [rows, setRows] = useState(list);  





  useEffect(() => {
    

    try {

      const config = {
          headers: {
              'Content-Type': 'application/json',
          },
      }
      axios.get('http://localhost:5000/api/purchaseReturn/uploadedpurchases', config)
          .then(response => {
              console.log(response.data);
              setList(response.data)
              setRows(response.data)
          })
      } catch (error) {
          console.log(error)
      }

      try {

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        axios.get('http://localhost:5000/api/purchase/getdata', config)
            .then(response => {
                console.log(response.data);
                setSupplierdata(response.data)
            })
        } catch (error) {
            console.log(error)
        } 

  }, []);
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
    mb3: {
        margin: "1.3rem 0"
      },
     
    
  });

  function deleteItem(cid){
    alert(cid);
    var loginUser = localStorage.getItem("userInfo");
        var parsedloginuser = JSON.parse(loginUser)
  
        const config = {
          headers: {
            Authorization: `Bearer ${parsedloginuser.token}`,
          },
        }
  
      axios.get(`http://localhost:5000/api/purchase/deleteUploadedOrderById/${cid}`,config)
      alert("deleted");
      window.location.reload(); 
   
  }

  function manualVerification(cid){
    //alert(cid);
    var loginUser = localStorage.getItem("userInfo");
        var parsedloginuser = JSON.parse(loginUser)
  
        const config = {
          headers: {
            Authorization: `Bearer ${parsedloginuser.token}`,
          },
        }
  
      axios.post(`http://localhost:5000/api/purchase/verifypurchase/${cid}`,config)
      alert("Verification Complete");
      window.location.reload(); 
   
  }
  const classes = useStyles();

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

  const handleUpload = e => {
    const file = e.target.files[0]
    setFile(file)    
  }

  const handleSubmit = e => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('billfile', billfile)
    formData.append('invoiceNo', invoiceNo)
    formData.append('customerName', customerName)
    formData.append('billTotal', billTotal)
    // JMformData.append('supplierName', suppName)

    const tableReloadUpload = async()=> {
          try {

      const config = {
          headers: {
              'Content-Type': 'application/json',
          },
      }
      axios.get('http://localhost:5000/api/purchaseReturn/uploadedpurchases', config)
          .then(response => {
              console.log(response.data);
              setList(response.data)
          })
      } catch (error) {
          console.log(error)
      }

    }
    const billUploadChecker = async( ) => {
   console.log("hello testing spinner")
   setLoading(true);
   setOpen(false);
    try {
     const data = await  axios.post(
        'http://localhost:5000/api/purchase/uploadPurchase',
        formData
      ).then(response => {
        //console.log(response.data);
        setLoading(false);
        alert('Purchase uploaded')     
        //setList(response.data)
        //setRows(response.data)
       window.location.reload(); 
        
        //alert('Purchase uploaded')
      //  setList(response.data)
       
      })
      
     // window.location.reload(); 
    } catch (ex) {
      console.log(ex);
    }
    
  }

    billUploadChecker();
   // tableReloadUpload();
  }

  function handleSuppliertselect(e) 
  {      
      const selectedsupplierdata = supplierdata.filter(sdata => sdata.supplierId == e.target.value);
     
     var sid = selectedsupplierdata[0].supplierId
     var sname = selectedsupplierdata[0].supplierName
     setsupp(sid)
     setsuppName(sname) 
  }

  const avatarStyle={backgroundColor : '#2E8B57'}
  const paperStyle={padding :20, margin :'20px auto 20px 20px'}
  const btnStyle={margin :'8px 0',marginLeft:900}
  const closeButton = {position: 'absolute', display:'flex'}
  //Joe Start 5

 
  const requestSearch = (searchedVal) => {
    const filteredRows = list.filter((pdata) => {
      return pdata.invoiceno.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
    console.log("hello filteredrows")
  };

  const cancelSearch = () => {
    setSearched(" ");
    requestSearch(searched);
  };
//Joe End 5
    return (
      
      <OftadehLayout>
      
     
          <h1 style={{marginTop:20}}>Uploaded Purchases </h1><Grid item  xs={12} sm={12} md={8} style={{marginLeft:240,width:200,marginTop:-50}}></Grid>
          <Button variant="outlined" color="primary" onClick={handleClickOpen} startIcon={<AddOutlinedIcon />} style={{"margin-left" : 800, "margin-bottom" : 13}} >
             Upload File
          </Button>
          
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <Button onClick={handleClose} color="primary" style={closeButton} align="right">
                <CancelIcon />
              </Button>
             
              <DialogContent>
                 
                <form autocomplete="off" onSubmit={handleSubmit}> 
                    <Grid container>
                        <Grid item xs={12} align="center">
                            <h2>Purchase Upload</h2>
                        </Grid> 
                        <Grid item xs={12} align="center">
                            <Paper elevation={10} style={paperStyle}>                 
                              <Controls.Input
                                  name="invoiceNo"
                                  label="Invoice No"
                                  value={invoiceNo}
                                  onChange={(e) => setInvoice(e.target.value)}/>
                              <br></br><br></br>
                              <Controls.Input
                                  name="customerName"
                                  label="Customer Name"
                                  value={customerName}
                                  onChange={(e) => setCustomerName(e.target.value)}/>
                              <br></br><br></br>
                              <Controls.Input
                                  name="billTotal"
                                  label="Total Amount"
                                  value={billTotal}
                                  onChange={(e) => setBillTotal(e.target.value)}/>
                              <br></br><br></br>
                              {/*  JM<FormControl style={{minWidth: 250}}>
                                <InputLabel>Choose Supplier</InputLabel>                 
                                <Select value={supplierdata.find(obj => obj.supplierName === suppName)} onChange={e => handleSuppliertselect(e)}>
                                    {supplierdata.map(sdata => (
                                        <MenuItem value={sdata.supplierId}>{sdata.supplierName}</MenuItem>
                                    ))} 
                                </Select> 
                              </FormControl>                              
                              <br></br><br></br> */}
                              <input type="file" size="small" name="billfile" onChange={handleUpload}/>
                              <br></br><br></br>
                              <Button type="submit" color="primary" variant="contained">Upload</Button>
                             
                            </Paper>
                        </Grid> 
                    </Grid> 
                </form>
              
              </DialogContent>
              
              <DialogActions>
                
              </DialogActions>
          </Dialog>
         {/*  Joe*/}
        <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
         {/*  JoeEND*/}
        <TableContainer component={Paper} style={{marginTop:20}}>
            {/*  Joe*/}
           {loading == true ? (<div className = {classes.table}><LinearProgress  /></div>): (
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Sl No</StyledTableCell>
            <StyledTableCell align="center">Customer</StyledTableCell>
            <StyledTableCell align="center">InvoiceNo</StyledTableCell>
            <StyledTableCell align="center">Date</StyledTableCell>
            <StyledTableCell align="center">Grand Total</StyledTableCell>
            <StyledTableCell align="center">Verified</StyledTableCell>
            <StyledTableCell align="center">Delete</StyledTableCell>
            <StyledTableCell align="center">Manual</StyledTableCell>
            {/* <StyledTableCell align="center">Delivery Type</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell> */}
          </TableRow>
        </TableHead>
       
        <TableBody>
             {rows.map(pdata => (
               
            <StyledTableRow key={pdata.invoiceno} >
              {/* <StyledTableCell component="th" scope="row" dataKey="serial" cellDataGetter={() => this.getSerial()}>
                {/* <Button variant="outlined" size="small" color="primary" onClick={e => handleClick(row._id)}>View</Button> */}
              {/* </StyledTableCell> */} 
              <StyledTableCell align="center" key="index">{page++}</StyledTableCell>
              <StyledTableCell align="center">{pdata.customername}</StyledTableCell>
              {
                (pdata.verify_complete == false) ? 
                <StyledTableCell align="center" style={{color:"green"}}><Link href={'/pages/purchaseupload/verify/'+pdata._id}><b>{pdata.invoiceno}</b></Link></StyledTableCell>
                : <StyledTableCell align="center" component="th" scope="pdata">{pdata.invoiceno}</StyledTableCell>
              }              
              <StyledTableCell align="center">{Moment(pdata.billdate).format("DD-MM-YYYY")}</StyledTableCell>
              <StyledTableCell align="center">{pdata.grand_total}</StyledTableCell>
              {
                (pdata.verify_complete == false) ? 
                <StyledTableCell align="center" style={{color:"green"}}><Link href={'/pages/purchaseupload/verify/'+pdata._id}><b>Pending</b></Link></StyledTableCell>
                : <StyledTableCell align="center" style={{color:"green"}}><b>Complete</b></StyledTableCell>
                }
              <StyledTableCell align="center">
                <Link><DeleteIcon  onClick={event => deleteItem(pdata._id)}/></Link>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Link><Button variant="contained" onClick={event => manualVerification(pdata._id)} size="small" color="primary" className={classes.margin}>
          Veirfy
        </Button></Link>
              </StyledTableCell>
            </StyledTableRow>
             
             ))} 
        </TableBody>
       
      </Table>
        ) }{/*  Joe*/}      
    </TableContainer>
    
             
      </OftadehLayout>  
      
    )
}
