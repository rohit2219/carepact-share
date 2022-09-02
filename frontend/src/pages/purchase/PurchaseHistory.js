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

export default function EmployeeForm(props) {
  const [open, setOpen] = React.useState(false);
  const [list, setList] = useState([]);
  var [page, setPage] = React.useState(1);
  const [userData, setUserData] = useState([]);
  const { history } = props;
  var [invoiceNo, setInvoice] = React.useState();
  var [billfile, setFile] = React.useState();


  useEffect(() => {
    

    try {

      const config = {
          headers: {
              'Content-Type': 'application/json',
          },
      }
      axios.get('http://localhost:5000/api/purchase/purchasehistory', config)
          .then(response => {
              console.log(response.data);
              setList(response.data)
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
  
      axios.get(`http://localhost:5000/api/purchase/deleteOrderById/${cid}`,config)
     // alert("deleted");
      window.location.reload(); 
   
  }
  const classes = useStyles();


    return (

      <OftadehLayout>
          <h1 style={{marginTop:20}}>Purchase History</h1><Grid item  xs={12} sm={12} md={8} style={{marginLeft:240,width:200,marginTop:-50}}><StorageIcon/></Grid>

        <TableContainer component={Paper} style={{marginTop:20}}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Sl No</StyledTableCell>
            <StyledTableCell align="center">SupplierId</StyledTableCell>
            <StyledTableCell align="center">InvoiceNo</StyledTableCell>
            <StyledTableCell align="center">BillDate</StyledTableCell>
            <StyledTableCell align="center">DeviceId</StyledTableCell>
            <StyledTableCell align="center">Payment</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Edit</StyledTableCell>
            <StyledTableCell align="center">Delete</StyledTableCell>
            {/* <StyledTableCell align="center">Delivery Type</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
             {list.map(pdata => (
            <StyledTableRow >
              {/* <StyledTableCell component="th" scope="row" dataKey="serial" cellDataGetter={() => this.getSerial()}>
                {/* <Button variant="outlined" size="small" color="primary" onClick={e => handleClick(row._id)}>View</Button> */}
              {/* </StyledTableCell> */} 
              <StyledTableCell align="center" key="index">{page++}</StyledTableCell>
              <StyledTableCell align="center">{pdata.supplierId}</StyledTableCell>

              <StyledTableCell align="center"><Link href={'/pages/purchase/view/'+pdata._id}>{pdata.invoiceno}</Link></StyledTableCell>
              <StyledTableCell align="center">{pdata.billdate}</StyledTableCell>
              <StyledTableCell align="center">111</StyledTableCell>
              <StyledTableCell align="center">{pdata.payment}</StyledTableCell>
             
              <StyledTableCell align="center">{pdata.type}</StyledTableCell>
              
              {
                (pdata.status === 'p') ? 
                <StyledTableCell align="center" style={{color:"green"}}><Link href={'/pages/purchase/edit/'+pdata._id}><b>Processing</b></Link></StyledTableCell> : (pdata.status === 'd') ?
                <StyledTableCell align="center" style={{color:"red"}}><b>Cancelled</b></StyledTableCell> : 
                 
                <StyledTableCell align="center" style={{color:"green"}}><b>Confirmed</b></StyledTableCell>
              }

              {/* const dateString = moment(row.createdAt).format("DD-MM-YYYY"); */}
              <StyledTableCell align="center">
                <Link href={'/pages/purchase/edit/'+pdata._id}><EditIcon/></Link>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Link><DeleteIcon  onClick={event => deleteItem(pdata._id)}/></Link>
              </StyledTableCell>
            </StyledTableRow>
             
             ))} 
        </TableBody>
      </Table>
    </TableContainer>
       
       
       
       
       
       
       
       
        {/* <Form>
 
               <Grid item  xs={12} sm={12} md={8} >
              
                <Table>
                  <TableRow>
                    <TableCell><b>Supplier Id</b></TableCell>
                    <TableCell><b>InvoiceNo</b></TableCell>
                    <TableCell><b>Bill date</b></TableCell>
                    <TableCell><b>Payment Method</b></TableCell>
                    <TableCell><b>Net amnt</b></TableCell>            
                  </TableRow>
                  
                  <TableBody>
                  {list.map(pdata => (
                      <TableRow>
                          <TableCell >{pdata.supplierId}</TableCell>
                          <TableCell >{pdata.mrp}</TableCell>
                          <TableCell >{pdata.invoiceno}</TableCell>
                          <TableCell >{pdata.billdate}</TableCell>
                          <TableCell >{pdata.payment}</TableCell>
                          <TableCell >{pdata.grand_total}</TableCell>
                      </TableRow>
                  ))}  
                  </TableBody>
                </Table>
                </Grid>      
        </Form> */}
      </OftadehLayout>  
    )
}
