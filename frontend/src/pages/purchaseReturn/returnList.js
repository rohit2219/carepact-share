import React, {useState, useEffect} from 'react'
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link, Typography, Button} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import Moment from 'moment';
import PrintIcon from '@material-ui/icons/Print';
import axios from 'axios';

const ReturnList= () => {
  var netAmount=0;
  const [returnrData, setReturnData] = useState([]);
  var [page, setPage] = React.useState(1);

  useEffect(() => {
    const getData = () => {
        axios.get('http://localhost:5000/api/purchaseReturn/getreturn')
        .then(res => {
          console.log(res.data);
          setReturnData(res.data);
        })
        
        .catch(err => console.log(err));

    };
    getData();
  }, []);


////////
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
//////////////


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
      
        const classes = useStyles();
    return (
        <OftadehLayout>
            <Typography component="h1" variant="h5" className={classes.mb3} > Return List</Typography>
            <Button variant="outlined" size="small"  color="primary" startIcon={<AddOutlinedIcon />}  onClick={handleClick} style={{"margin-left" : 800}}>New Return</Button>
                    {/* <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                Open Menu
              </Button> */}
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                   <Link href={'/pages/purchaseReturn/supplierreturn'}>Supplier Return</Link> 
                </MenuItem>
                <MenuItem onClick={handleClose} >
                  <Link href={'/pages/purchaseReturn/itemreturn'}>Item Return</Link> 
                </MenuItem>
              </Menu>
           
            <br></br>
            <br></br>
            <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Sl No</StyledTableCell>
            <StyledTableCell align="center">Debit Note No.</StyledTableCell>
            <StyledTableCell align="center">Supplier Name</StyledTableCell>
            <StyledTableCell align="center">Return Date</StyledTableCell>
            <StyledTableCell align="center">Net Amount</StyledTableCell>
            <StyledTableCell align="center">Return Type</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell></StyledTableCell>

            {/* <StyledTableCell align="center">Delivery Type</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
        {returnrData.map(row => {
           {row.productarray.map(det => {
            {netAmount=netAmount+det.subtotal}
          })}
              return(
            <StyledTableRow >
              <StyledTableCell align="center">{page++}</StyledTableCell>
              <StyledTableCell align="center"><Link href={'/pages/purchaseReturn/returndetails/'+row.debitNo}>{row.debitNo}</Link></StyledTableCell>
              <StyledTableCell align="center">Leo Distributor</StyledTableCell>
              <StyledTableCell align="center"> {Moment(row.date).format("DD-MM-YYYY")}</StyledTableCell>
             
              <StyledTableCell align="center">{Math.round(netAmount)}</StyledTableCell>
              <StyledTableCell align="center">{row.returnType == "IR"? "Item Return":"Supplier Return"}</StyledTableCell>
              <StyledTableCell align="center">{(row.returnStatus == 'P') ? "Processing": (row.returnStatus === 'A') ? "Approved" :"Cancelled"}</StyledTableCell>
              {/* <StyledTableCell component="th" scope="row">
                 <Link href={'/pages/purchaseReturn/returndetails/'+row.debitNo}>View</Link> 
              </StyledTableCell> */}
              <StyledTableCell component="th" scope="row">
                 <Link href={'/pages/purchaseReturn/debitnote/'+row.debitNo}><PrintIcon/></Link> 
              </StyledTableCell>
            </StyledTableRow>
             )
            })}
        </TableBody>
      </Table>
    </TableContainer>
        </OftadehLayout>
        );
    }

export default ReturnList;
