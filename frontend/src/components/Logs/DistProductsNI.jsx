import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useHistory, useParams } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PaginationPage from "../Pagination/PaginationPage";

import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

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

export const DistProductsNI = (props) => {
  const [carepactData, setCarepactData] = useState([]);
  const [imgName, setImgName] = useState('');
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
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
    console.log(start, end);
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
        //   console.log("main data",result.data)
        //   console.log("productsNI data",result.data[id].productsNI)
        //   console.log("productsNI data",result.data[id].productsNI.length)
        //   console.log("productsNI data",result.data[id].productsNI[result.data[id].productsNI.length-1].imageName)
        // setCarepactData(result.data)
        setCarepactData(result.data[id].productsNI);
        setList(result.data[id].productsNI);
        setImgName(result.data[id].productsNI[result.data[id].productsNI.length-1].imageName)
      });
  };
  useEffect(() => {
    Data();
  }, []);

  return (
    <>
      <Button onClick={() => history.goBack()} startIcon={<ArrowBackIcon />}>
        Back{" "}
      </Button>

      <div className={classes.flexItem}>
        <h1 style={{ marginTop: 20 }}>Dist_Carepact_Logs_ProductsNI </h1>
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
      <div style={{textAlign: 'center'}}>
                     <Button onClick={handleClickOpen}>
                       <img src ={`http://localhost:5000/uploads/SocketImg/${imgName}`} style={{height: '450px', width:"450px"}} alt ={imgName}/>
                     </Button>
                     <Dialog maxWidth= 'xl' onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                         <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                           Product Image
                         </DialogTitle>
                         <DialogContent  >
                         <img src ={`http://localhost:5000/uploads/SocketImg/${imgName}`} style={{height: '635px', width:"800px"}} alt ={imgName} />
                         </DialogContent>              
                     </Dialog>
                </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>SN</StyledTableCell>
              <StyledTableCell>ProductName</StyledTableCell>
              <StyledTableCell>Mrp</StyledTableCell>
              <StyledTableCell>Batchno</StyledTableCell>
              <StyledTableCell>TimeStamps</StyledTableCell>
              <StyledTableCell>Date_Time</StyledTableCell>
              <StyledTableCell>Expiry date</StyledTableCell>
              <StyledTableCell>Grade</StyledTableCell>
              <StyledTableCell>Duplicate_Grade</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carepactData
              .filter((pdata) => {
                if (searchItem === "") {
                  return pdata;
                } else if (
                  pdata.expiry_date
                    .toLowerCase()
                    .includes(searchItem.toLowerCase()) ||
                  pdata.product_name
                    .toLowerCase()
                    .includes(searchItem.toLowerCase())
                ) {
                  return pdata;
                } else if (
                  pdata.mrp.toLowerCase().includes(searchItem.toLowerCase()) ||
                  pdata.grade
                    .toLowerCase()
                    .includes(searchItem.toLowerCase()) ||
                  pdata.batchno.toLowerCase().includes(searchItem.toLowerCase())
                ) {
                  return pdata;
                }
              })

              .slice(pagination.start, pagination.end)
              .map((data, ind) => {
                return (
                  <>
                    {carepactData.length !== ind + 1 ? (
                      <StyledTableRow key={ind}>
                        <StyledTableCell>{pagination.start+ind + 1}</StyledTableCell>
                        <StyledTableCell>{data.product_name}</StyledTableCell>
                        <StyledTableCell>{data.mrp}</StyledTableCell>
                        <StyledTableCell>{data.batchno}</StyledTableCell>
                        <StyledTableCell>{data.time_stamp}</StyledTableCell>
                        <StyledTableCell>{data.date_time}</StyledTableCell>
                        <StyledTableCell>{data.expiry_date}</StyledTableCell>
                        <StyledTableCell>{data.grade}</StyledTableCell>
                        <StyledTableCell>{data.duplicateGrade}</StyledTableCell>
                      </StyledTableRow>
                    ) : (
                      ""
                    )}
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
