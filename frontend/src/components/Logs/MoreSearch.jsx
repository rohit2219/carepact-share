import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button, TextField } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PaginationPage from "../Pagination/PaginationPage";
import { saveAs } from "file-saver";

import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
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
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  flexItem: {
    justifyContent: "space-between",
    padding: 0,
    margin: 0,
    listStyle: "none",
    display: "flex",
  },
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

/**
 * @author
 * @function CarepactLog
 **/

const MoreSearch = (props) => {
  const [customerData, setCustomerData] = useState([]);
  const classes = useStyles();
  const history = useHistory();
  const [list, setList] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [productName, setProductName] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [date, setDate] = useState("");
  const [newdate, setNewDate] = useState("");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // pagination
  const [showPerPage, setShowPerPage] = React.useState(10);
  const [pagination, setPagination] = React.useState({
    start: 0,
    end: showPerPage,
  });

  // pagination end

  /// pagination search

  const onPaginationChange = (start, end) => {
    //  console.log(start, end);
    setPagination({
      start: start,
      end: end,
    });
  };

  const changeRowsNo = (totalPageNo) => {
    setShowPerPage(totalPageNo);
  };
  const listLength = list.length;
  // search item
  const [searchItem, setSearchItem] = useState("");
  //search item end

  
  
  useEffect(async() => {
    const result = await axios.get(
        `http://localhost:5000/api/carepactlogs/carelogs/${invoiceNo}`
      );
      if (result && result.data.data && result.data.data.length !== 0) {
        setCustomerData(result.data.data);
        setList(result.data);
      } else {
        setCustomerData([]);
      }
  }, [invoiceNo]);

  useEffect(async() => {
    const result = await axios.get(
        `http://localhost:5000/api/carepactlogs/carelogs/${invoiceNo}/${productName}`
      );
      if (result && result.data.data && result.data.data.length !== 0) {
        setCustomerData(result.data.data);
        setList(result.data);
      } else {
        setCustomerData([]);
      }
  }, [invoiceNo, productName]);
  
  useEffect(async() => {
    const result = await axios.get(
        `http://localhost:5000/api/carepactlogs/carelogs/date/${invoiceNo}/${productName}/${newdate}`
      );
      if (result && result.data.data && result.data.data.length !== 0) {
        setCustomerData(result.data.data);
        setList(result.data);
      } else {
        setCustomerData([]);
      }
  }, [invoiceNo, productName, newdate]);
  
  useEffect(async() => {
    const result = await axios.get(
        `http://localhost:5000/api/carepactlogs/carelogs/${invoiceNo}/${productName}/${batchNo}/${date}`
      );
      if (result && result.data.data && result.data.data.length !== 0) {
        setCustomerData(result.data.data);
        setList(result.data);
      } else {
        setCustomerData([]);
      }
  }, [invoiceNo, productName, batchNo, date]);

  const downloadImage = (img) => {
    saveAs(`${img}`, "image.jpg"); // Put your image url here.
  };

  //  console.log(process.env.REACT_APP_IMAGE_PATH+"dddddddddddd")
  return (
    <>
      <Button onClick={() => history.goBack()} startIcon={<ArrowBackIcon />}>
        Back
      </Button>
      <h1>
        {invoiceNo} {productName} {batchNo} {date} {newdate}
      </h1>
      <div className={classes.flexItem}>
        <h1 style={{ marginTop: 20 }}>More_Search</h1>
      </div>

      <div className={classes.flexItem}>
        <h3 style={{ marginBottom: 10 }}>invoiceno/productname/date</h3>
        <div style={{ marginBottom: 10 }}>
          <TextField
            id="outlined-basic"
            label="Invoice No"
            variant="outlined"
            style={{ marginRight: 5 }}
            onChange={(e) => {
                setInvoiceNo(e.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Product Name"
            variant="outlined"
            style={{ marginRight: 5 }}
            onChange={(e) => {
              setProductName(e.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Date"
            variant="outlined"
            style={{ marginRight: 5 }}
            onChange={(e) => {
              setNewDate(e.target.value);
            }}
          />
        </div>
      </div>

      <div className={classes.flexItem}>
        <h3 style={{ marginBottom: 10 }}>invoiceno/productname/batchno/date</h3>
        <div style={{ marginBottom: 10 }}>
          <TextField
            id="outlined-basic"
            label="Invoice No"
            variant="outlined"
            style={{ marginRight: 5 }}
            onChange={(e) => {
              setInvoiceNo(e.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Product Name"
            variant="outlined"
            style={{ marginRight: 5 }}
            onChange={(e) => {
              setProductName(e.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Batch No"
            variant="outlined"
            style={{ marginRight: 5 }}
            onChange={(e) => {
              setBatchNo(e.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Date"
            variant="outlined"
            style={{ marginRight: 5 }}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>SN</StyledTableCell>
              <StyledTableCell>Purchase_Invoice_No</StyledTableCell>
              <StyledTableCell>customer_name</StyledTableCell>
              <StyledTableCell>Products</StyledTableCell>
              <StyledTableCell>Date_Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customerData
            //   .filter(data=>{return data.products.length !== 0 })  
              .slice(pagination.start, pagination.end) 
              .map((data, ind) => {
                return (
                  <>
                    <StyledTableRow>
                      <StyledTableCell>{pagination.start+ind + 1}</StyledTableCell>
                      <StyledTableCell>
                        {data.purchase_invoice_number}
                      </StyledTableCell>
                      <StyledTableCell>{data.customer_name}</StyledTableCell>
                      <StyledTableCell>
                        {data.products.length !== 0 ? (
                          <NavLink to={`/components/Logs/distproduct/${ind}`}>
                            {data.products.length}
                          </NavLink>
                        ) : (
                          data.products.length
                        )}
                      </StyledTableCell>
                      <StyledTableCell>{data.date_time}</StyledTableCell>
                    </StyledTableRow>
                  </>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationPage
        showPerPage={showPerPage}
        onPaginationChange={onPaginationChange}
        listLength={listLength}
        changeRowsNo={changeRowsNo}
      />
    </>
  );
};
export { MoreSearch };
