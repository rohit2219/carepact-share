import React, { useState, useEffect } from "react";
import { Grid, MenuItem, Table, TextField, Button ,Link} from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/UseForm";
import { styles } from "./style";
import axios from "axios";
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useLocation } from "react-router-dom";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import Popup from "../../components/Popup";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  FormHelperText,
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import AddShoppingCartSharpIcon from "@material-ui/icons/AddShoppingCartSharp";
import LibraryAddCheckSharpIcon from "@material-ui/icons/LibraryAddCheckSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Checkbox from "@material-ui/core/Checkbox";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import moment from 'moment';

axios.get("http://localhost:5000/api/purchase/getdata", {
  params: {},
});

const paymentItems = [
  { id: 'cash', title: 'Cash' },
  { id: 'card', title: 'Card' },
]

const initialFValues = {
  id: 0,
  fullName: "",
  email: "",
  mobile: "",
  city: "",
  payment:'cash',
  departmentId: "",
  hireDate: new Date(),
  isPermanent: false,
};
const headCells = [
  { id: "ItemName", label: "Item Name" },
  { id: "Quantity", label: "Quantity" },
  { id: "Pur_rate", label: "Pur_rate" },
  { id: "dis%", label: "dis%" },
  { id: "Tax_amnt", label: "Tax_amnt" },
  { id: "Taxable_amnt", label: "Taxable_amnt" },
  { id: "Net_amnt", label: "Net_amnt" },
];
export default function EmployeeForm(props) {
  var [page, setPage] = React.useState(1);
  const location = useLocation();
  const [purchaseData, setPurchasedata] = useState([]);
  var { id } = useParams();
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
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '60%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  table: {
        minWidth: 700,
      },
      mb3: {
          margin: "1.3rem 0"
        },
  }));

  const [list1, setList1] = useState([]);
  const [open, setOpen] = React.useState(false);
  const { history } = props;
  const [gd, setgrand] = React.useState(0);
  const [invoiceNo, setInvoiceno] = React.useState("");

  useEffect(() => {

    var loginUser = localStorage.getItem("userInfo");
    if(loginUser==null) 
    {
        history.push("/pages/auth/login")
    }
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        }
        axios.get(`http://localhost:5000/api/purchase/itemview/${id}`, config)
        .then(response => {
            console.log(response.data);
            setList1(response.data)
            setgrand(response.data[0].grand_total)
            setInvoiceno(response.data[0].invoiceno)
        })
   
  }, []);


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handlegClose = () => {
    setOpen(false);
  };
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTable(headCells, filterFn);
  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.fullName.toLowerCase().includes(target.value)
          );
      },
    });
  };
  
  const [contactArray, setContactArray] = useState([]);
  let identity = 0;
  const [temp, settemp] = useState([]);
  //const [name,setname]=useState([]);
  const [state, setState] = useState({
    name: "",
  });
  const[billno,setBillno]=React.useState("");
  const[billdate,setBilldate]=React.useState("");
  const [batchno, setbatchno] = React.useState("");
  const [manuf, setmanuf] = React.useState("");
  const [qun, setqun] = React.useState(0);
  const [mr, setmr] = React.useState(0);
  const [pur, setpur] = React.useState(0);
  const [exp, setexp] = React.useState("");
  const [hs, seths] = React.useState("");
  const [inv, setinv] = React.useState("");
  const [invdate, setinvdate] = React.useState("");
  const [supp, setsupp] = React.useState("");
  const [payment, setpayment] = React.useState("");
  const [tax, settax] = React.useState(0);
  const [dis, setdis] = React.useState(0);
  const [frqty, setfree] = React.useState(0);
  const [disam, setdisam] = React.useState(0);
  const [sgs, setsgs] = React.useState(0);
  const [cgs, setcgs] = React.useState();
  const [ces, setces] = React.useState();
  const [totalgs, settotalgs] = React.useState(0);
  const [taxam, settaxam] = React.useState(0);
  const [netam, setnetam] = React.useState(0);

  let cqty = parseFloat(qun);
  let cpur = parseFloat(pur); //purchase rate
  let new_pr = cpur * cqty;
  let cdis = parseFloat(dis); //discount percentage
  let discountamount = new_pr * (cdis / 100);
  let taxableamount = new_pr - discountamount;
  let taxpe = parseFloat(sgs);
  let sgs_g = parseFloat(cgs);
  let cgs_g = parseFloat(ces);
  let taxper = sgs_g + cgs_g;
  let taxamountt = (taxper / 100) * taxableamount;
  let netamount = taxableamount + taxamountt;
  let roundnet = netamount.toFixed(2);
  let grd = parseInt(gd) + parseInt(roundnet);

  let round_discount_amnt = discountamount.toFixed(2);
  let round_tax_amnt = taxamountt.toFixed(2);
  let round_taxable_amnt = taxableamount.toFixed(2);

  let cmrp = parseFloat(mr); //mrp
  let cessamount = taxableamount * (1 / 100);

  let tgst = parseFloat(totalgs);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [list, setList] = useState([]);
  let optionItems = list.map((planet) => (
    <option
      key={planet.supplierName}
      style={{ fontSize: 15, overflow: "scroll" }}
      value={planet.supplierId}
    >
      {planet.supplierName}
    </option>
  ));
 
  const classes = useStyles();
   const [suggestions, setSuggestion] = useState([]);
  const [itemcode, setItemcode] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemmrp, setItemmrp] = useState("");
  const [itemhsn, setItemhsn] = useState("");
  const [manufacture, setManufacture] = useState("");

  const getDetails = (item) => {
    setItemcode(item.Itemcode);
    setItemName(item.product);
    setItemmrp(item.mrp);
    setItemhsn(item.hsn);
    setManufacture(item.manufacture);
    setSuggestion([]);
  };

  const [expDate, setExpDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [invDate, setinvDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [billDate, setbillDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  // handles when user changes input in date inputfield
  const handleChangeDate = e => {
    setExpDate(e.target.value);
  };
  const handleChangeinvDate = e => {
    setinvDate(e.target.value);
  };
  const handleChangebillDate = e => {
    setbillDate(e.target.value);
  };
  

  const asuggestions = suggestions.map((item) => {
    return (
      <TableRow style={styles.suggestionLi} onClick={() => getDetails(item)}>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>{item.product}</TableCell>
        <TableCell>{item.uom}</TableCell>
        <TableCell>{item.hsn}</TableCell>
        <TableCell>{item.mrp}</TableCell>
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          style={{ marginLeft: 10, width: 1, marginTop: 20 }}
        >
         
        </Grid>
      </TableRow>
    );
  });
  const autoSuggestion = suggestions.map((item) => (
    <Grid
      item
      xs={12}
      sm={12}
      md={8}
      style={{ marginLeft: 10, width: 700, marginTop: 10 }}
    >
      <Table style={{ marginBottom: 180, width: 520,width:700 }}>
        <TableRow>
          <TableCell>
            <b>
              <LibraryAddCheckSharpIcon style={{ marginLeft: 10,marginTop:-180 }} />
            </b>
          </TableCell>
          <TableCell>
            <b>itemname</b>
          </TableCell>
          <TableCell>
            <b>uom</b>
          </TableCell>
          <TableCell>
            <b>hsn</b>
          </TableCell>
          <TableCell>
            <b>mrp</b>
          </TableCell>
        </TableRow>
      </Table>

      <Table>
        <TableBody>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            style={{ marginLeft: 10, width: 200, marginTop: -180 }}
          >
            <TableRow
              style={styles.suggestionLi}
              onClick={() => getDetails(item)}
            >
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{item.product}</TableCell>
              <TableCell>{item.uom}</TableCell>
              <TableCell>{item.hsn}</TableCell>
              <TableCell>{item.mrp}</TableCell>
              <Grid
                item
                xs={12}
                sm={12}
                md={8}
                style={{ marginLeft: 10, width: 200, marginTop: 20 }}
              >
                <Table>
                  <Button>
                    <AddCircleOutlineIcon></AddCircleOutlineIcon>
                  </Button>
                </Table>
              </Grid>
            </TableRow>
          </Grid>
        </TableBody>
      </Table>
    </Grid>
  ));
  const optionchange = (props) => {
    setSuggestion([]);
    setItemName(props.target.value);
    console.log(props.target.value);
    fetch("http://localhost:5000/api/purchase/suggestions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: props.target.value }),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((sug) => {
        if (sug.length) {
          setSuggestion(sug);
        }
        console.log(sug);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  
  const main_add = () => {
    identity = identity + 1;
    console.log(identity);
    console.log(list1);

    let my_obj={};
    my_obj.supplierId = supp;
    my_obj.billno = billno;
    my_obj.billdate = billdate;
    my_obj.itemname = itemName;
    my_obj.batchno = batchno;
    my_obj.manufacture = manufacture;
    my_obj.qty = cqty;
    my_obj.mrp = itemmrp;
    my_obj.pur_rate = pur;
    my_obj.exp_date = expDate;
    my_obj.hsncode = itemhsn;
    my_obj.invoiceno = inv;
    my_obj.invoicedate = invDate;
    my_obj.payment = payment;
    my_obj.taxamount = round_tax_amnt;
    my_obj.disper = dis;
    my_obj.disamnt = round_discount_amnt;
    my_obj.sgst = taxper;
    my_obj.cgst = cgs;
    my_obj.cess = ces;
    my_obj.taxper = taxper;
    my_obj.total_gst = totalgs;
    my_obj.taxable_amnt = round_taxable_amnt;
    my_obj.netamnt = roundnet;
    my_obj.grand_total = grd;
    setContactArray([
      ...contactArray,

      {
        supplierId:supp,
        billno:billno,
        billdate:billDate,
        item: itemName,
        itemcode:itemcode,
        batchno: batchno,
        manufacture: manuf,
        qty: cqty,
        mrp: itemmrp,
        pur_rate: pur,
        exp_date: expDate,
        hsn: itemhsn,
        invoiceno: inv,
        invoicedate: invDate,
        payment: payment,
        taxamount: round_tax_amnt,
        disper: dis,
        disamnt: round_discount_amnt,
        sgst: taxper,
        cgst: cgs,
        cess: ces,
        taxper: taxper,
        total_gst: totalgs,
        taxable_amnt: round_taxable_amnt,
        netamnt: roundnet,
        grand_total: grd,
      },
    ]);

    let obj = list1.find(o => o.itemcode === itemcode);

    if(obj)
    {
      alert("Product already added");
    }
    else
    {
      list1.push(my_obj);
      setList1(list1)
      alert("New product added");
    }

    setgrand(gd + parseFloat(roundnet));
  };

  const mainSubmit = (event) => {
   
    var loginUser = localStorage.getItem("userInfo");
    var parsedloginuser = JSON. parse(loginUser)

    const config = {
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${parsedloginuser.token}`,
      },
    }
    console.log(contactArray)
    axios.post(`http://localhost:5000/api/purchase/purchase_edit_update/${id}`, { contactArray,list1 }, config)
                    .then(response => {
                        console.log(response.data);
                        alert('New Record Added')
                        //window.location.reload(false);
                    })
    // axios.post('http://localhost:5000/api/purchase/mainform_data', {contactArray}, config)
    // .then(response => {
    //   alert(response.data.data);
    //   handleClose();
    //   setContactArray([]);
    //   window.location.reload(false);
    // })

    event.preventDefault();
  };

  const getData = () => {
    fetch("http://localhost:5000/api/purchase/getdata", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((apiResponse) => {
        // alert('success')
        console.log(apiResponse);
        if (apiResponse.length) {
          setList(apiResponse);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    //alert(1)
    getData();
  }, []);
  const closeButton = { position: "absolute", display: "flex" };
  const { addOrEdit, recordForEdit } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("fullName" in fieldValues)
      temp.fullName = fieldValues.fullName ? "" : "This field is required.";
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email)
        ? ""
        : "Email is not valid.";
    if ("mobile" in fieldValues)
      temp.mobile =
        fieldValues.mobile.length > 9 ? "" : "Minimum 10 numbers required.";
    if ("departmentId" in fieldValues)
      temp.departmentId =
        fieldValues.departmentId.length != 0 ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
  
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  useEffect(() => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios
        .get("http://localhost:5000/api/purchase/productview", config)
        .then((response) => {
          console.log(response.data);
         
          
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  function deleteEntry(pid){
    
    alert(pid)
  
    var removeIndex = list1.map(function(item) { return item.itemcode; }).indexOf(pid);
    alert(removeIndex)

    // remove object
    list1.splice(removeIndex, 1);
    console.log(list1)

    document.getElementById("myTable").deleteRow(removeIndex);
    setList1(list1);
      
    }

  return (
    <OftadehLayout>
      <Dialog
        open={open}
        onClose={handlegClose}
        aria-labelledby="form-dialog-title"
        style={{ width: 900, marginLeft: 400 }}
      >
        <Button
          onClick={handlegClose}
          color="primary"
          style={closeButton}
          align="right"
        >
          <CancelIcon />
        </Button>
        <DialogContent >
          <form>
            <Grid
              item
              xs={12}
              sm={12}
              md={19}
              style={{ marginLeft: 30, width: 940, height: 300, marginTop: 5 }}
            >
              <Controls.Input
                name="fullName"
                type="search"
                label="search"
                size="small"
                value={itemName}
                onChange={optionchange}
                style={{marginBottom:'20px'}}
              />
              {suggestions.length > 0 ? (
                <ul style={styles.suggestionUl}>
                  <Grid
      item
      xs={12}
      sm={12}
      md={8}
      style={{ marginLeft: 10, width: 20, marginTop: 10 }}
    >
      <Table style={{ marginBottom: 180, width: 12 }}>
        <TableRow>
          <TableCell>
            <b>
              <LibraryAddCheckSharpIcon style={{ marginLeft: 10 }} />
            </b>
          </TableCell>
          <TableCell>
            <b>itemname</b>
          </TableCell>
          <TableCell >
            <b>uom</b>
          </TableCell>
          <TableCell>
            <b>hsn</b>
          </TableCell>
          <TableCell>
            <b>mrp</b>
          </TableCell>

        </TableRow>
      </Table>

      <Table>
        <TableBody>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            style={{ marginLeft: 10, width: 1, marginTop: -180 }}
          >
            {asuggestions}
          </Grid>
        </TableBody>
      </Table>
    </Grid>
                </ul>
              ) : (
                ""
              )}
            </Grid>
          </form>
          <Button
            onClick={handlegClose}
            color="primary"
            style={closeButton}
            align="left"
            style={{ marginLeft: 260, marginTop: -577 }}
          >
            <LibraryAddCheckSharpIcon />
          </Button>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <h1>Purchase Edit</h1>
      <Grid
        item
        xs={12}
        sm={12}
        md={8}
        style={{ marginLeft: 200, width: 200, marginTop: -50 }}
      >
        <AddShoppingCartSharpIcon />
      </Grid>
      <Accordion style={{width:1000}}>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Add Record</Typography>
      </AccordionSummary>
      <AccordionDetails>
      
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={3}>
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label"></InputLabel>
              <div>
                <lable>
                  Choose Supplier
                  <select
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="choose supplier"
                    label="Supplier"
                    name="supp"
                    value={supp}
                    onChange={(e) => setsupp(e.target.value)}
                    style={{ width: 400, wordBreak: "break-all", height: 52 }}
                  >
                    {optionItems}
                  </select>
                </lable>
              </div>
            </FormControl>
            <div style={{ marginLeft: 420, marginTop: -70, width: 325 }}>
              {" "}
              <TextField
                id="outlined-basic"
                label="InvoiceNo"
                variant="outlined"
                name="inv"
                // onChange={(e) => setinv(e.target.value)}
                error={errors.invoiceNo}
                value={invoiceNo}
              />
              
            </div>
            <div style={{ marginLeft: 700, marginTop: -70, width: 333 }}>
              {" "}
              <Controls.DateSelect
                id="outlined-basic"
                label="Invoice Date"
                variant="outlined"
                name="invDate"
                onChange={handleChangeinvDate}
              />
              
            </div>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 2, width: 240, marginTop: -5 }}
            >
              <TextField
                variant="outlined"
                label="ItemName"
                name="item"
                value={itemName}
                size="small"
                onClick={handleClickOpen}
              />

              <Controls.Input
                label="BatchNo"
                name="batchno"
                value={batchno}
                size="small"
                onChange={(e) => setbatchno(e.target.value)}
                error={errors.email}
                style={{ marginLeft: 255, marginTop: -107 }}
              />
              <Controls.Input
                label="Manufacturer"
                name="manuf"
                value={manufacture}
                size="small"
                onChange={(e) => setmanuf(e.target.value)}
                error={errors.manuf}
                style={{ marginTop: -60 }}
              />
              <Controls.Input
                label="HSNCode"
                name="hs"
                value={itemhsn}
                size="small"
                error={errors.hs}
                onChange={(e) => seths(e.target.value)}
                style={{ marginLeft: 503, marginTop: -145 }}
              />
              <Controls.Input
                name="dis"
                label="dis_per(%)"
                size="small"
                value={dis}
                onChange={(e) => setdis(e.target.value)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 220, width: 240, marginTop: -270 }}
            >
              <Controls.Input
                label="Pur_Rate"
                name="pur"
                size="small"
                value={pur}
                onChange={(e) => setpur(e.target.value)}
                error={errors.pur_rate}
                style={{ marginLeft: 8, marginTop: -33 }}
              />
              <Controls.Input
                label="MRP"
                name="mr"
                size="small"
                value={itemmrp}
                onChange={(e) => setmr(e.target.value)}
                error={errors.mrp}
                style={{ marginLeft: 256, marginTop: -215 }}
              />

              <Controls.Input
                label="Quantity"
                name="qun"
                value={qun}
                size="small"
                onChange={(e) => setqun(e.target.value)}
                error={errors.qty}
                style={{ marginLeft: 256, marginTop: -202 }}
              />
              <Controls.Input
                label="Free_Qty"
                name="frqty"
                value={frqty}
                size="small"
                onChange={(e) => setfree(e.target.value)}
                error={errors.free}
                style={{ marginLeft: 503, marginTop: -221 }}
              />
              <Controls.Input
                name="disam"
                label="dis_amnt"
                size="small"
                value={round_discount_amnt}
                onChange={(e) => setdisam(e.target.value)}
                style={{ marginLeft: 260, marginTop: -136 }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 420, width: 240, marginTop: -278 }}
            >
              <Controls.Input
                label="SGST"
                name="cgs"
                value={cgs}
                size="small"
                onChange={(e) => setcgs(e.target.value)}
                error={errors.sgst}
                style={{ marginLeft: 255, marginTop: -104 }}
              />
              <Controls.Input
                label="CGST"
                name="ces"
                value={ces}
                size="small"
                onChange={(e) => setces(e.target.value)}
                error={errors.cgst}
                style={{ marginLeft: 503, marginTop: -124 }}
              />

              <Controls.Input
                label="TaxPer"
                name="sgs"
                value={taxper}
                size="small"
                onChange={(e) => setsgs(e.target.value)}
                error={errors.taxper}
                style={{ marginLeft: 503, marginTop: -235 }}
              />
              <Controls.Input
                name="tax"
                label="tax_amnt"
                size="small"
                value={round_tax_amnt}
                onChange={(e) => settax(e.target.value)}
                style={{ marginTop: 20 }}
              />
              <Controls.Input
                name="taxam"
                label="taxable_amnt"
                size="small"
                value={round_taxable_amnt}
                onChange={(e) => settaxam(e.target.value)}
                style={{ marginLeft: 260, marginTop: -86 }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: -3, width: 240, marginTop: -277 }}
            >
              <div style={{ marginLeft: 630, marginTop: -220, width: 260 }}>
                <Controls.DateSelect
                  name="expDate"
                  label="EXP_Date"
                  size="small"
                  onChange={handleChangeDate}
                  style={{ marginLeft: 730, marginTop: -260 }}
                />
                 <Controls.RadioGroup
                name="payment"
                label="Payment"
                value={values.payment}
                onChange={(e) => setpayment(e.target.value)}
                items={paymentItems}
                style={{  marginLeft: 8, marginTop: -45}}
              />
                {/* <Controls.Input
                  label="InvoiceNo"
                  name="inv"
                  value={inv}
                  size="small"
                  onChange={(e) => setinv(e.target.value)}
                  error={errors.invoice}
                  style={{ marginLeft: 8, marginTop: -45 }}
                /> */}
                {/* <Controls.DateSelect
                  name="invDate"
                  label="Invoice Date"
                  size="small"
                  onChange={handleChangeinvDate}
                  style={{ marginLeft: 252, marginTop: -230, height: 120 }}
                /> */}
                <Controls.Input
                name="netam"
                size="small"
                label="Net Amnt"
                value={roundnet}
                onChange={(e) => setnetam(e.target.value)}
                style={{ marginLeft: 252, marginTop: -230, height: 120 }}
              />
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 850, width: 270, marginTop: -190 }}
            >
              {/* <Controls.RadioGroup
                name="payment"
                label="Payment"
                value={values.payment}
                onChange={(e) => setpayment(e.target.value)}
                items={paymentItems}
                style={{ marginLeft: 900, marginTop: -269 }}
              /> */}
              {/* <div style={{ marginTop: -14 }}>
                <Controls.Input
                  name="netam"
                  label="Total"
                  size="small"
                  placeholder="As per the Bill"
                  style={{ marginLeft: 509, marginTop: -176, width: 200 }}
                />
              </div> */}
              {/* <Controls.Input
                name="netam"
                size="small"
                label="Net Amnt"
                value={roundnet}
                onChange={(e) => setnetam(e.target.value)}
                style={{ marginLeft: 740, marginTop: -146, width: 205 }}
              /> */}
            </Grid>
            {/* <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 1, width: 240, marginTop: 105 }}
            >
              <Controls.Input
                name="dis"
                label="dis_per(%)"
                size="small"
                value={dis}
                onChange={(e) => setdis(e.target.value)}
              />
            </Grid> */}

            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 117, width: 240, marginTop: 200 }}
            >
              <div style={{ marginLeft: 520, marginTop: -180, width: 350 }}>
                <Controls.Button
                  type="submit"
                  text="Save"
                    onClick={mainSubmit}
                  style={{ height: 65 }}
                />
                <Controls.Button
                  text="AddItem"
                  color="default"
                  onClick={main_add}
                  style={{ height: 65 }}
                />
              </div>
              <Grid
                item
                xs={12}
                sm={12}
                md={9}
                style={{ marginLeft: 1, width: 240, marginTop: -30 }}
              >
                <div style={{ marginLeft: 810, width: 400, marginTop: 45 }}>
                  <Button
                    type="submit"
                    style={{
                      marginLeft: -70,
                      width: 120,
                      marginTop: -120,
                      height: 65,
                      background:"#5167f8"
                    }}
                  >
                     <h1>{gd.toFixed(2)}</h1>
                  </Button>
                </div>
              </Grid>
            </Grid> 
          </Grid>
        </Grid>
        </Form> 
        </AccordionDetails>
        </Accordion>  
           <TableContainer component={Paper} style={{marginTop:20}}>
      <Table className={classes.table} aria-label="customized table" id="myTable">
        <TableHead>
            <StyledTableCell align="center">Sl No</StyledTableCell>
            <StyledTableCell align="center">itemname</StyledTableCell>
            <StyledTableCell align="center">BatchNo</StyledTableCell>
            <StyledTableCell align="center">Rate</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">HSN</StyledTableCell>
            <StyledTableCell align="center">Exp Date</StyledTableCell>
            <StyledTableCell align="center">Dis amt</StyledTableCell>
            <StyledTableCell align="center">Tax amt</StyledTableCell>
            <StyledTableCell align="center">Taxable amt</StyledTableCell>
            <StyledTableCell align="center">Net amt</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>

            {/* <StyledTableCell align="center">Delivery Type</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell> */}
        </TableHead>
        <TableBody>
             {list1.map(pdata => (
               
            <StyledTableRow >
              {/* <StyledTableCell component="th" scope="row" dataKey="serial" cellDataGetter={() => this.getSerial()}>
                {/* <Button variant="outlined" size="small" color="primary" onClick={e => handleClick(row._id)}>View</Button> */}
              {/* </StyledTableCell> */} 
              <StyledTableCell align="center" key="index">{page++}</StyledTableCell>
              <StyledTableCell align="center">{pdata.itemname}</StyledTableCell>
              <StyledTableCell align="center">{pdata.batchno}</StyledTableCell>
              <StyledTableCell align="center">{pdata.pur_rate}</StyledTableCell>
              <StyledTableCell align="center">{pdata.qty}</StyledTableCell>
              <StyledTableCell align="center">{pdata.hsncode}</StyledTableCell>
              <StyledTableCell align="center">{moment(pdata.exp_date).format("DD-MM-YYYY")}</StyledTableCell>
              <StyledTableCell align="center">{pdata.disamnt}</StyledTableCell>
              <StyledTableCell align="center">{pdata.taxamount}</StyledTableCell>
              <StyledTableCell align="center">{pdata.taxable_amnt}</StyledTableCell>
              <StyledTableCell align="center">{pdata.netamnt}</StyledTableCell>

              {/* const dateString = moment(row.createdAt).format("DD-MM-YYYY"); */}
              <Link><DeleteIcon  onClick={e => deleteEntry(pdata.itemcode)} style={{marginTop:22,marginLeft:0}} /></Link>  
            </StyledTableRow>
             
             ))} 
        </TableBody>
      </Table>
    </TableContainer>
     
    </OftadehLayout>
  );
}
