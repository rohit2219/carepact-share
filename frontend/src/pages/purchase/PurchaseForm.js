import React, { useState, useEffect } from "react";
import { Grid, MenuItem, Table, TextField, Button } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/UseForm";
import { styles } from "./style";
import axios from "axios";
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
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';

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
  const [list1, setList1] = useState([]);
  const [open, setOpen] = React.useState(false);
  //mychange
  //
  const { history } = props;

  var [invoiceNo, setInvoice] = React.useState();
  var [billfile, setFile] = React.useState();
  const [uopen, setuOpen] = React.useState(false);

  useEffect(() => {

    var loginUser = localStorage.getItem("userInfo");
    if(loginUser==null) 
    {
        history.push("/pages/auth/login")
    }

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
  const [qun, setqun] = React.useState(0);
  const [mr, setmr] = React.useState(0);
  const [pur, setpur] = React.useState(0);
  const [exp, setexp] = React.useState("");
  const [hs, seths] = React.useState("");
  const [inv, setinv] = React.useState("");
  const [invdate, setinvdate] = React.useState("");
  const [supp, setsupp] = React.useState("");
  const [suppName, setsuppName] = React.useState("");
  const [payment, setpayment] = React.useState("");
  const [tax, settax] = React.useState(0);
  const [dis, setdis] = React.useState(0);
  const [frqty, setfree] = React.useState(0);
  const [disam, setdisam] = React.useState(0);
  const [sgs, setsgs] = React.useState();
  const [cgs, setcgs] = React.useState();
  const [ces, setces] = React.useState();
  const [totalgs, settotalgs] = React.useState(0);
  const [taxam, settaxam] = React.useState(0);
  const [netam, setnetam] = React.useState(0);
  const [gd, setgrand] = React.useState(0);

  let cqty = parseFloat(qun);
  let cpur = parseFloat(pur); //purchase rate
  let new_pr = cpur * cqty;
  let cdis = parseFloat(dis); //discount percentage
  let discountamount = new_pr * cdis / 100;
  let taxableamount = new_pr - discountamount;
  let taxpe = parseFloat(sgs);
  let sgs_g = parseFloat(sgs);
  let cgs_g = parseFloat(cgs);
  let taxper = sgs_g + cgs_g;
  let taxamountt = taxableamount * taxper /100;
  let netamount = taxableamount + taxamountt;
  let roundnet = netamount.toFixed(2);
  let grd = parseInt(gd) + roundnet;

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
   const [suggestions, setSuggestion] = useState([]);
  const [itemcode, setItemcode] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemmrp, setItemmrp] = useState("");
  const [itemhsn, setItemhsn] = useState("");
  const [itemrack, setItemrack] = useState("");
  const [itemsubrack, setItemsubrack] = useState("");
  const [itemfridge, setItemfridge] = useState("");
  const [manuf, setmanuf] = React.useState("");

  const getDetails = (item) => {
    setItemcode(item.Itemcode);
    setItemName(item.product);
    setItemmrp(item.mrp);
    setItemhsn(item.hsn);
    setItemrack(item.rack);
    setItemsubrack(item.subrack);
    setItemfridge(item.fridge);
    setmanuf(item.manufacture);
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
  // const handleChangeDate = e => {
  //   console.log("haii");
  //   console.log(e.target.value);
  //   setExpDate(e.target.value);
  // };
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
    // console.log(props.target.value);
    fetch("http://localhost:5000/api/purchase/suggestions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: props.target.value }),
    })
      .then((res) => {
        // console.log(res);
        return res.json();
      })
      .then((sug) => {
        if (sug.length) {
          setSuggestion(sug);
        }
        // console.log(sug);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addSave = (event) => {
    console.log(contactArray);
    axios({
      url: "http://localhost:5000/api/purchase/purchase_save_data",
      method: "POST",
      data: contactArray,
    }).then((response) => {
      alert(response.data.data);
      handleClose();
      setContactArray([]);
      // window.location.reload(false);
    });
    event.preventDefault();
  };
  
  const main_add = () => {
    identity = identity + 1;
    // console.log(identity);

    setContactArray([
      ...contactArray,

      {
        supplierId:supp,
        supplierName:suppName,
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
        rack:itemrack,
        subrack:itemsubrack,
        fridge:itemfridge,
        invoiceno: inv,
        payment: payment,
        taxamount: round_tax_amnt,
        disper: dis,
        disamnt: round_discount_amnt,
        sgst: sgs,
        cgst: cgs,
        taxper: taxper,
        total_gst: totalgs,
        taxable_amnt: round_taxable_amnt,
        netamnt: roundnet,
        grand_total: Math.round(grd),
      },
    ]);

    alert("adding new row...");
    // console.log(contactArray);
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
    // console.log(contactArray)
    axios.post('http://localhost:5000/api/purchase/mainform_data', {contactArray}, config)
    .then(response => {
      alert(response.data.data);
      handleClose();
      setContactArray([]);
      window.location.reload(false);
    })

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
        // console.log(res);
        return res.json();
      })
      .then((apiResponse) => {
        // alert('success')
        // console.log(apiResponse);
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
    if (validate()) {
      addOrEdit(values, resetForm);
    }
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
          // console.log(response.data);
          setList1(response.data);
          
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const choosesupplier = (event) => {
    setsupp(event.target.value)
    var sdata=list.find(obj => obj.supplierId === event.target.value)
    setsuppName(sdata.supplierName)
  }

  const handleuClickOpen = () => {
    setuOpen(true);
  };

  const handleuClose = () => {
    setuOpen(false);
  };

  const handleUpload = e => {
    const file = e.target.files[0]
    setFile(file)    
  }

  const handleuploadSubmit = e => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('billfile', billfile)
    formData.append('invoiceNo', invoiceNo)
    formData.append('supplierName', suppName)
    
    try {
      axios.post(
        'http://localhost:5000/api/purchase/uploadPurchase',
        formData
      ).then(response => {
        console.log(response.data);
        alert('Purchase uploaded')
        setuOpen(false);
        window.location.reload(); 
      })
    } catch (ex) {
      console.log(ex);
    }
    
  }

  function handleSuppliertselect(e) 
  {      
      const selectedsupplierdata = list.filter(sdata => sdata.supplierId == e.target.value);
      
      var sid = selectedsupplierdata[0].supplierId
      var sname = selectedsupplierdata[0].supplierName

      setsupp(sid)
      setsuppName(sname) 
  }

  const paperStyle={padding :20, margin :'20px auto 20px 20px'}

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
      style={{ marginLeft: 10, width: 20, marginTop: 1 }}
    >
      <Table style={{ marginBottom: 180, width: 12 }}>
        <TableRow>
          <TableCell>
        <div style={{marginLeft:35}}> <b>itemname</b></div> 
          </TableCell>
          <TableCell >
          <div style={{marginLeft:27}}><b>uom</b></div>
          </TableCell>
          <TableCell>
          <div style={{marginLeft:22}}>  <b>hsn</b></div>
          </TableCell>
          <TableCell>
          <div style={{marginLeft:15}}> <b>mrp</b></div>
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
          {/* <Button
            onClick={handlegClose}
            color="primary"
            style={closeButton}
            align="left"
            style={{ marginLeft: 260, marginTop: -577 }}
          >
            <LibraryAddCheckSharpIcon />
          </Button> */}
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      

      <h1>Purchase Entry</h1>
    
      <Grid
        item
        xs={12}
        sm={12}
        md={8}
        style={{ marginLeft: 210, width: 200, marginTop: -50 }}
      >
        <AddShoppingCartSharpIcon />
      </Grid>
      <Button color="secondary" variant="contained" style={{marginLeft:900,width:100,marginTop:-55}}
        onClick={addSave}>
             Save
          </Button>

          <Button variant="outlined" color="primary" onClick={handleuClickOpen} startIcon={<AddOutlinedIcon />} style={{"margin-left" : 0, "margin-bottom" : 0}} >
            Upload File
        </Button>
        <Dialog open={uopen} onClose={handleuClose} aria-labelledby="form-dialog-title">
            <Button onClick={handleuClose} color="primary" style={closeButton} align="right">
              <CancelIcon />
            </Button>
            <DialogContent>
              <form autocomplete="off" onSubmit={handleuploadSubmit}> 
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
                              <FormControl style={{minWidth: 250}}>
                                <InputLabel>Choose Supplier</InputLabel>                 
                                <Select onChange={e => handleSuppliertselect(e)}>
                                    {list.map(sdata => (
                                        <MenuItem value={sdata.supplierId}>{sdata.supplierName}</MenuItem>
                                    ))} 
                                </Select> 
                              </FormControl>                              
                              <br></br><br></br>
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
      <Form onSubmit={handleSubmit}>
        <Grid container> 
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          style={{ marginLeft: 10, width: 200, marginTop: -10 }}
        >
          <Table style={{ marginBottom: 180, width: 120 }}>
           
          <TableRow>
            </TableRow>
            <TableBody>
              <TableRow>
              <TableCell>
              <div style={{ marginLeft: -44, marginTop: -206, width: 333 }}>
              {" "}
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
                    onChange={choosesupplier}
                    style={{ width: 400, wordBreak: "break-all", height: 52 }}
                  >
                    {optionItems}
                  </select>
                </lable>
              </div>
            </FormControl>
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: 67, marginTop: -210, width: 333 }}>
              {" "}
              <div style={{ marginLeft: -4, marginTop: 25, width: 333 }}>
              {" "}
              <TextField
                variant="outlined"
                type="date"
                name="expDate"
                label="Invoice Date"
                size="small"
                value={invDate}
                // style={{ marginLeft: 30, marginTop: 10 }}  
                onChange={handleChangebillDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/* <Controls.DateSelect
                id="outlined-basic"
                label="BillDate"
                variant="outlined"
                name="billDate"
                onChange={handleChangebillDate}
              /> */}
            </div>
            </div>
            
              </TableCell>
              <TableCell>
              <div style={{ marginLeft: -67, marginTop: -210, width: 333 }}>
              {" "}
              <div style={{ marginLeft: -4, marginTop: 25, width: 333 }}>
              {" "}
              <TextField
                variant="outlined"
                type="date"
                name="expDate"
                label="Exp Date"
                size="small"
                value={expDate}
                style={{ marginLeft: 30, marginTop: 10 }}  
                onChange={(e) => setExpDate(e.target.value)}
                // onChange={handleChangeDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/* <Controls.DateSelect
                  name="expDate"
                  label="EXP_Date"
                  size="small"
                  value={expDate}
                  onChange={handleChangeDate}
                  style={{ marginLeft: 930, marginTop: -260 }}
                /> */}
            </div>
            </div>
            
              </TableCell>
            <TableCell>
              <div style={{ marginLeft: -1095, marginTop: -119, width: 333 }}>
              {" "}
              <TextField
                variant="outlined"
                label="ItemName"
                name="item"
                value={itemName}
                size="small"
                onClick={handleClickOpen}
              />
            </div>
            
              </TableCell>
              <TableCell>
              <div style={{ marginLeft: -850, marginTop: -119, width: 333 }}>
              {" "}
              <Controls.Input
                  label="InvoiceNo"
                  name="inv"
                  value={inv}
                  size="small"
                  onChange={(e) => setinv(e.target.value)}
                  error={errors.invoice}
                  style={{ marginLeft: 8, marginTop: -45 }}
                />
            </div>
            
              </TableCell>
              <TableCell>
              <div style={{ marginLeft: -605, marginTop: -118, width: 333 }}>
              {" "}
              <Controls.Input
                label="Pur_Rate"
                name="pur"
                size="small"
                value={pur}
                onChange={(e) => setpur(e.target.value)}
                error={errors.pur_rate}
                style={{ marginLeft: 8, marginTop: -33 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -350, marginTop: -116, width: 333 }}>
              {" "}
              <Controls.Input
                name="dis"
                label="dis_per(%)"
                size="small"
                value={dis}
                onChange={(e) => setdis(e.target.value)}
              />
            </div>
            </TableCell>
            {/* <TableCell>
              <div style={{ marginLeft: -88, marginTop: -2, width: 333 }}>
              {" "}
              <Controls.RadioGroup
                name="payment"
                label="Payment"
                value={values.payment}
                onChange={(e) => setpayment(e.target.value)}
                items={paymentItems}
                style={{ marginLeft: 900, marginTop: -269 }}
              />
            </div>
            </TableCell> */}
            <TableCell>
              <div style={{ marginLeft: -1224, marginTop: -70, width: 333 }}>
              {" "}
              <Controls.Input
                label="BatchNo"
                name="batchno"
                value={batchno}
                size="small"
                onChange={(e) => setbatchno(e.target.value)}
                error={errors.email}
                style={{ marginLeft: 255, marginTop: -107 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -980, marginTop: -70, width: 333 }}>
              {" "}
              <Controls.Input
                label="Quantity"
                name="qun"
                value={qun}
                size="small"
                onChange={(e) => setqun(e.target.value)}
                error={errors.qty}
                style={{ marginLeft: 256, marginTop: -202 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -730, marginTop: -70, width: 333 }}>
              {" "}
              <Controls.Input
                label="SGST"
                name="sgs"
                size="small"
                onChange={(e) => setsgs(e.target.value)}
                error={errors.sgst}
                style={{ marginLeft: 255, marginTop: -104 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -480, marginTop: -70, width: 333 }}>
              {" "}
              <Controls.Input
                name="disam"
                label="dis_amnt"
                size="small"
                value={round_discount_amnt}
                onChange={(e) => setdisam(e.target.value)}
                style={{ marginLeft: 260, marginTop: -136 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -1351, marginTop:19, width: 333 }}>
              {" "}
              <TextField
              variant="outlined"
                label="Manufacturer"
                name="manuf"
                value={manuf}
                size="small"
                error={errors.manuf}
                style={{ marginTop: 10 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -1107, marginTop:19, width: 333 }}>
              {" "}
              <Controls.Input
                label="Free_Qty"
                name="frqty"
                value={frqty}
                size="small"
                onChange={(e) => setfree(e.target.value)}
                error={errors.free}
                style={{ marginLeft: 503, marginTop: -221 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -858, marginTop:19, width: 333 }}>
              {" "}
              <Controls.Input
                label="CGST"
                name="cgs"
                size="small"
                onChange={(e) => setcgs(e.target.value)}
                error={errors.cgst}
                style={{ marginLeft: 503, marginTop: -124 }}
              />
            </div>
            </TableCell>

            <TableCell>
              <div style={{ marginLeft: -608, marginTop:19, width: 333 }}>
              {" "}
              <Controls.Input
                name="tax"
                label="tax_amnt"
                size="small"
                value={round_tax_amnt}
                onChange={(e) => settax(e.target.value)}
                style={{ marginTop: 20 }}
              />
            </div>
            </TableCell>

            <TableCell>
              <div style={{ marginLeft: -1480, marginTop:125, width: 333 }}>
              {" "}
              <Controls.Input
                label="HSNCode"
                name="hs"
                value={itemhsn}
                size="small"
                error={errors.hs}
                onChange={(e) => seths(e.target.value)}
                style={{ marginLeft: 503, marginTop: -145 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -1235, marginTop:125, width: 333 }}>
              {" "}
              <Controls.Input
                label="MRP"
                name="mr"
                size="small"
                value={itemmrp}
                onChange={(e) => setmr(e.target.value)}
                error={errors.mrp}
                style={{ marginLeft: 256, marginTop: -215 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -987, marginTop:125, width: 333 }}>
              {" "}
              <Controls.Input
                label="TaxPer"
                name="sgs"
                value={taxper}
                size="small"
                onChange={(e) => setsgs(e.target.value)}
                error={errors.taxper}
                style={{ marginLeft: 503, marginTop: -235 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -736, marginTop:125, width: 333 }}>
              {" "}
              <Controls.Input
                name="taxam"
                label="taxable_amnt"
                size="small"
                value={round_taxable_amnt}
                onChange={(e) => settaxam(e.target.value)}
                style={{ marginLeft: 260, marginTop: -869 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -1580, marginTop:250, width: 333 }}>
              {" "}
              <Controls.RadioGroup
                name="payment"
                label="Payment"
                value={payment}
                onChange={(e) => setpayment(e.target.value)}
                items={paymentItems}
                style={{ marginLeft: 900, marginTop: -269 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -1362, marginTop:240, width: 333 }}>
              {" "}
              <Controls.Input
                  name="netam"
                  label="Total"
                  size="small"
                  placeholder="As per the Bill"
                  style={{ marginLeft: 509, marginTop: 176, width: 200 }}
                />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -1114, marginTop:240, width: 333 }}>
              {" "}
              <Controls.Input
                name="netam"
                size="small"
                label="Net Amnt"
                value={roundnet}
                onChange={(e) => setnetam(e.target.value)}
                style={{ marginLeft: 740, marginTop: -146, width: 205 }}
              />
            </div>
            </TableCell>
            <TableCell>
              <div style={{ marginLeft: -859, marginTop:370, width: 333 }}>
              {" "}
              <Button
                    type="submit"
                    style={{
                      marginLeft: 10,
                      width: 170,
                      marginTop: -136,
                      height: 55,
                      background:"#5167f8"
                    }}
                  >
                     <h1>{gd.toFixed(2)}</h1>
                  </Button>
            </div>
            </TableCell>

            <TableCell>
              <div style={{ marginLeft: -1160, marginTop:370, width: 333 }}>
              {" "}
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
            </TableCell>
          
            
           </TableRow>
          
            </TableBody>
          </Table>
          </Grid>
         
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          style={{ marginLeft: 10, width: 200, marginTop: -160 }}
        >
          <Table style={{ marginBottom: 180, width: 110 }}>
            <TableRow>
              <TableCell size="small">
                <b>ItemName</b>
              </TableCell>
              <TableCell size="small">
                <b>InvoiceNo</b>
              </TableCell>
              <TableCell size="small">
                <b>Batchno</b>
              </TableCell>
              <TableCell size="small">
                <b>HSN</b>
              </TableCell>
              <TableCell size="small">
                <b>Exp Date</b>
              </TableCell>
              <TableCell size="small">
                <b>Pur_rate</b>
              </TableCell>
              <TableCell size="small">
                <b>Qty</b>
              </TableCell>
              <TableCell size="small">
                <b>dis%</b>
              </TableCell>
              <TableCell size="small">
                <b>Tax%</b>
              </TableCell>
              <TableCell size="small">
                <b>Tax Amt</b>
              </TableCell>
              <TableCell size="small">
                <b>Taxable Amt</b>
              </TableCell>

              <TableCell size="small">
                <b>Net_amnt</b>
              </TableCell>
            </TableRow>

            <TableBody>
            {contactArray.map(number => {
                            return  (
                <TableRow>
                  <TableCell>{number.item}</TableCell>
                  <TableCell>{number.invoiceno}</TableCell>
                  <TableCell>{number.batchno}</TableCell>
                  <TableCell>{number.hsn}</TableCell>
                  <TableCell>{number.exp_date}</TableCell>
                  <TableCell>{number.pur_rate}</TableCell>
                  <TableCell>{number.qty}</TableCell>
                  <TableCell>{number.disper}</TableCell>
                  <TableCell>{number.taxper}</TableCell>
                  <TableCell>{number.taxamount}</TableCell>
                  <TableCell>{number.taxable_amnt}</TableCell>
                  <TableCell>{number.netamnt}</TableCell>
                </TableRow>
             ); })}
            </TableBody>
          </Table>
        </Grid>
      </Form>
    </OftadehLayout>
  );
}
