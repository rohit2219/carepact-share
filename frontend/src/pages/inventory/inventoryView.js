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
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import { Link, Typography, Button, Grid, Fab} from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { useHistory } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CancelIcon from '@material-ui/icons/Cancel';
import PaginationPage from '../pagination/PaginationPage';
import Moment from 'moment';
//for showing last upload time
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import { red } from '@material-ui/core/colors';

TimeAgo.addDefaultLocale(en)

const InventoryView= () => {

  const[showPerPage, setShowPerPage] = React.useState(10)
  const[pagination, setPagination] = React.useState({
    start : 0,
    end : showPerPage
  })

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

    const closeButton = {position: 'absolute', display:'flex'}

    const paperStyle={padding :20, margin :'20px auto 20px 20px', width: 600}

    var history = useHistory();

    const [open, setOpen] = React.useState(false);

    const [inventoryData, setInventoryData] = useState([]);

    var [updated_date, setdate] =  useState(null);

    var [billfile, setFile] = React.useState();

    var [color, setColor] = React.useState("");

    useEffect(() => {   
        axios.get(`http://localhost:5000/api/inventory/getinventory`)
        .then(res => {
            console.log(res.data);

            setInventoryData(res.data);
            
          })
          
          .catch(err => console.log(err)); 
          axios.get('http://localhost:5000/api/inventory/gettime')
          .then(res => {
            // console.log(res.data[0].date);
            setdate(res.data[0].date);
            var endTime =  Moment();
              var startTime = Moment(res.data[0].date).format('YYYY-MM-DD HH:mm:ss');            
              var hoursDiff = endTime.diff(startTime, 'hours');
              console.log('Hours:' + hoursDiff);
              if (hoursDiff > 6) {
                setColor("#E87722");
              }
               else {
                setColor("#008240")
              } 
          })
          
          .catch(err => console.log(err)); 
     
    }, []);


    const handleClick = e => {
      history.push("/pages/inventory/inventory_add");

    }
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    function handleUpload(e) {
      const file = e.target.files[0]
    setFile(file)  
    }


    function upload(e) {
      e.preventDefault();

    const formData = new FormData()
    formData.append('billfile', billfile)
    

     axios.post(`http://localhost:5000/api/inventory/uploadInventoryDetails`,formData)
        .then(res => {
           // console.log(res.data);

            alert("Inventory Updated");
            window.location.reload(); 
          })
          
          .catch(err => console.log(err)); 
           //window.location.reload(); 

    };
const onPaginationChange = (start, end) =>{
    console.log(start, end);
    setPagination({
      start: start,
      end : end
    })

  }
  const listLength = inventoryData.length;
  
     
    return (
        <OftadehLayout>
          <Grid container spacing={3} >
              <Grid item xs={6} sm={9} >
              <h1 style={{marginTop:20}}>Inventory Details </h1> 
            <h3>Last uploaded time : {updated_date && <ReactTimeAgo date={updated_date} locale="en-US" style={{color:color}}/>}</h3>
              </Grid>
              <Grid item xs={6} sm={3} >
            <Button variant="outlined" color="primary" onClick={handleClickOpen} startIcon={<AddOutlinedIcon />} >
             upload file 
             </Button>
             </Grid>
            </Grid>
            {/* <Button variant="outlined" color="primary" startIcon={<AddOutlinedIcon />} style={{"margin-left" : 800, "margin-bottom" : 13}} onClick={handleClick}>
            Add Inventory </Button> */}
            
             
             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Button onClick={handleClose} color="primary" style={closeButton} align="right">
                    <CancelIcon />
                  </Button>
                  <DialogContent>
                  <Grid item xs={12} align="center">
                      <Grid item xs={6} style={paperStyle}>
                        <TableRow>
                          <TableCell ><input type="file" size="small" name="fileName" onChange={handleUpload}/></TableCell>
                          <TableCell >
                            <Button variant="outlined" color="primary" onClick={upload}>upload</Button>
                           </TableCell>
                        </TableRow>
                      
                      </Grid>  
                  </Grid>
                  </DialogContent>
                  <DialogActions>
                    
                  </DialogActions>
              </Dialog>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Sl No</StyledTableCell>
                            <StyledTableCell align="center">Product</StyledTableCell>
                            <StyledTableCell align="center">Batch No</StyledTableCell>
                            <StyledTableCell align="center">Quantity</StyledTableCell>
                            <StyledTableCell align="center">Price</StyledTableCell>
                            <StyledTableCell align="center">Mrp</StyledTableCell>
                            {/* <StyledTableCell align="center"></StyledTableCell>                           */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {inventoryData.filter((row)=>{
                       
                          return row
                       
                      }).slice(pagination.start,pagination.end).map((row,ind) => (
                        // {inventoryData.map(row => {
                        //   return(
                        <StyledTableRow >
                          
                          <StyledTableCell align="center" key="index">{ind+1+pagination.start}</StyledTableCell>
                          <StyledTableCell align="center">{row.item_name}</StyledTableCell>
                          <StyledTableCell align="center">{row.batch}</StyledTableCell>
                          <StyledTableCell align="center">{row.stock_qty}</StyledTableCell>
                          <StyledTableCell align="center">{row.rate}</StyledTableCell>
                          <StyledTableCell align="center">{row.mrp}</StyledTableCell>
                          {/* <StyledTableCell align="center"><Link href={'/pages/inventory/inventory_edit/'+row.itemcode+'/'+row.batch}><EditIcon/></Link></StyledTableCell> */}
                          
                          {/* <Link href={'/pages/orders/orderdetails/'+row._id}><Button variant="outlined" size="small" color="primary" style={{"margin-top" : 6}}>View</Button></Link>   */}
                        </StyledTableRow>
                        ))} 
                    </TableBody>
                </Table>
            </TableContainer>
            <PaginationPage showPerPage={showPerPage} onPaginationChange={onPaginationChange} listLength={listLength} />

        </OftadehLayout>

    );
}

export default InventoryView;



// function myFunction() {
//   var d = new Date();
//   var x;
//   var day = ("0" + date_ob.getDate()).slice(-2);

//   let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

//   let year = date_ob.getFullYear();

//   var h = d.getHours()
//   var m = d.getMinutes()
//   var s = d.getSeconds()
//   var ms = d.getMilliseconds()
//   x = day+"-"+month+"-"+year+"_"+h + ":" + m + ":" + s + ":" + ms;
//   //console.log(x)
//   return (x)
// }

// var time=myFunction();

// let SocketImgName = `ProductImg${PurchaseId+"_"+time}.png`