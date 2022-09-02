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

import { getRole } from "../../pages/auth/hepler/index";

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

const DistCarepactLog = (props) => {
  const [CarepactData, setCarepactData] = useState([]);
  const classes = useStyles();
  const history = useHistory();
  const [list, setList] = useState([]);
  const [imagePath, setImagepath] = useState("");

  const userType = getRole();
  // alert(userType)
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

  const Data = () => {
    fetch("http://localhost:5000/api/carepactlogs/carelogs")
      .then((response) => response.json())
      .then((result) => {
        //  console.log("resullllllllll",result)
        setCarepactData(result.data);
        setImagepath(process.env.REACT_APP_IMAGE_PATH);
        console.log("result.data.carepact", result.data);
        setList(result.data);
      });
  };
  useEffect(() => {
    Data();
  }, []);

  const downloadImage = (img) => {
    saveAs(`${img}`, "image.jpg"); // Put your image url here.
  };

  //  console.log(process.env.REACT_APP_IMAGE_PATH+"dddddddddddd")
  return (
    <>
      <Button onClick={() => history.goBack()} startIcon={<ArrowBackIcon />}>
        Back{" "}
      </Button>

      <div className={classes.flexItem}>
        {userType === "SA" ? (
          <>
            {" "}
            <h1 style={{ marginTop: 20 }}>Carepact_Logs</h1>
            <div style={{ width: 300 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push("/components/Logs/MoreSearch")}
              >
                More Search
              </Button>
            </div>
          </>
        ) : (
          <h1 style={{ marginTop: 20 }}>Customer_Logs</h1>
        )}

        <div style={{ width: 300 }}>
          <TextField
            id="outlined-basic"
            label="search here"
            variant="outlined"
            // style={{ width: 300, marginBottom:20  }}
            onChange={(e) => {
              setSearchItem(e.target.value);
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
              {userType === "SA" ? (
                <StyledTableCell>ProductsNI</StyledTableCell>
              ) : (
                ""
              )}

              <StyledTableCell>Date_Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {CarepactData &&
              CarepactData.filter((pdata) => {
                if (searchItem === "") {
                  return pdata;
                } else if (
                  pdata.purchase_invoice_number
                    .toLowerCase()
                    .includes(searchItem.toLowerCase()) ||
                  pdata.purchaseId
                    .toLowerCase()
                    .includes(searchItem.toLowerCase())
                ) {
                  return pdata;
                } else if (
                  pdata.customer_name
                    .toLowerCase()
                    .includes(searchItem.toLowerCase()) ||
                  pdata.date.toLowerCase().includes(searchItem.toLowerCase())
                ) {
                  return pdata;
                }
              })

                .slice(pagination.start, pagination.end)
                .map((data, ind) => {
                  return (
                    <>
                      <StyledTableRow>
                        <StyledTableCell>
                          {pagination.start + ind + 1}
                        </StyledTableCell>
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
                        {userType === "SA" ? (
                          <StyledTableCell>
                            {data.productsNI.length !== 0 ? (
                              <NavLink
                                to={`/components/Logs/distproductni/${ind}`}
                              >
                                {data.productsNI.length}
                              </NavLink>
                            ) : (
                              data.productsNI.length
                            )}
                          </StyledTableCell>
                        ) : (
                          ""
                        )}

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
export { DistCarepactLog };
