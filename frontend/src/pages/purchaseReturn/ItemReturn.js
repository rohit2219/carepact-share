import React, { useState, useEffect } from "react";
import { Grid, MenuItem, Table, TextField, Button } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/UseForm";
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';

import axios from "axios";
import {
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
// import Select from "@material-ui/core/Select";
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import AddShoppingCartSharpIcon from "@material-ui/icons/AddShoppingCartSharp";
import LibraryAddCheckSharpIcon from "@material-ui/icons/LibraryAddCheckSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Checkbox from "@material-ui/core/Checkbox";
import { Select} from '@material-ui/core';
import { useHistory } from "react-router-dom";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

axios.get("http://localhost:5000/api/sale/getdata", {
  params: {},
});

const genderItems = [
  { id: "cash", title: "Cash" },
  { id: "card", title: "Card" },
  { id: "credit", title: "Credit" },
];

const initialFValues = {
  id: 0,
  fullName: "",
  email: "",
  mobile: "",
  city: "",
  gender: "male",
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
  var history = useHistory();

  const [list1, setList1] = useState([]);
  const [open, setOpen] = React.useState(false);

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
  
  const [supp, setsupp] = React.useState("");
  const [address, setaddress] = React.useState("");
  const [phoneno, setphoneno] = React.useState("");
  const [notes, setnotes] = React.useState("");
  const [invoiceno, setinv] = React.useState("");
  const [qty, setqty] = React.useState("");
  const [disper, setper] = React.useState("");
  const [mrp, setmrp] = React.useState("");
  const [disamnt, setdisamnt] = React.useState("");
  const [tax, settax] = React.useState("");
  const [taxam, settaxamnt] = React.useState("");
  const [taxable, settaxable] = React.useState("");
  const [total, settotal] = React.useState("");
  const [netam, setnet] = React.useState("");
  const [billdate, setbilldate] = React.useState("");
  const [billtime, setbilltime] = React.useState("");
  const [gd, setgrand] = React.useState(0);
  

  let qy = parseFloat(qty);
  let mpr = parseFloat(mrp);
  let discp = parseFloat(disper);
  // let disamount = mpr * (discp / 100);
  let newprice = mpr - disamnt;
  let taxpercent = parseFloat(tax);
  // let taxamount = newprice * (taxpercent / 100);
  // let taxableamntt = newprice - taxamount;
  // let cesamnt = taxableamntt * (1 / 100);
  // let ntamount = (taxableamntt + taxamount) * qy;
  // let rnt = ntamount.toFixed(2);
  // let grd=parseInt(gd)+parseInt(rnt);
  const [supplier, setSupplier] = useState('');
  const [supplierName, setSupplierName] = useState('');

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getData = () => {
        axios.get('http://localhost:5000/api/purchaseReturn/getdata')
        .then(res => {
        //   console.log(res.data);
            setPosts(res.data);
        })
        
        .catch(err => console.log(err));

    };
    getData();
}, []);

  

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [list, setList] = useState([]);
  
  

  const [suggestions, setSuggestion] = useState([]);
  const [itemcode, setItemcode] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemqty, setItemqty] = useState("");
  const [itemmrp, setItemmrp] = useState("");
  const [itemhsn, setItemhsn] = useState("");
  const [itemptr, setPtr] = useState("");
  const [batch, setBatch] = useState([]);
  const [itemtaxrate, setTaxrate] = useState("");
  const getDetails = (item) => {
    setItemcode(item.itemcode);
    setItemName(item.item_name);
    setItemqty(item.stock_qty);
    setItemmrp(item.mrp);
    setItemhsn(item.hsn);
    setPtr(item.rate);
    setTaxrate(item.tax_per);
    setSuggestion([]);
    setBatch(item.batch);
  };
  let price=itemptr*qty
  let disamount = price * (discp / 100);
  let taxable_amnt = price-disamount;
  let taxamount = taxable_amnt * (itemtaxrate / 100);
  let taxableSubtotal= taxable_amnt+taxamount;
  const asuggestions = suggestions.map((item) => {
    console.log(item);
    return (
      <TableRow onClick={() => getDetails(item)}>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>{item.item_name}</TableCell>
        <TableCell>{item.rate}</TableCell>
        <TableCell>{item.stock_qty}</TableCell>
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
            <b>pur_rate</b>
          </TableCell>
          <TableCell>
            <b>stock_qty</b>
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
              
              onClick={() => getDetails(item)}
            >
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{item.item_name}</TableCell>
             <TableCell>{item.rate}</TableCell>
             <TableCell>{item.stock_qty}</TableCell>
             <TableCell>{item.itemmrp}</TableCell>
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
    fetch("http://localhost:5000/api/purchaseReturn/suggestions", {
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

  const main_add =event => {
    identity = identity + 1;
    // console.log(identity);

    setContactArray([
      ...contactArray,

      {
        itemcode:itemcode,
        batchno:batch,
        itemname:itemName,
        pur_rate:itemptr,
        qty:qty,
        dis_amnt:disamount,
        invoiceno:invoiceno,
        mrp:itemmrp,
        gst:itemtaxrate,
        total_quantity:itemqty,
        discount:disper,
        tax_amnt:taxamount,
        // tax_amount:taxable_amnt,
        subtotal:taxableSubtotal,
        SupplierId :supplier,
        // date:billdate,
        // time:billtime,
        // grand:grd
       
       
      },
    ]);

    alert("adding new row...");
    // console.log(contactArray);
    // setgrand(gd+parseFloat(rnt))
    event.preventDefault();
  };

  const mainSubmit = (event) => {
    var front = 'DB';
    const currentYear = new Date().getFullYear();
    // const currentTime = new Date().getTime();
    var rand = front+"."+currentYear+"."+Math.floor(Math.random() * 10000);

    const dataValues ={
      debitNo      : rand,
      SupplierId   : supplier,
      Supplier     : supplierName,  
      paymentMethod: "Credit", 
      returnType   : "IR",
      }
    axios({
      url: "http://localhost:5000/api/purchaseReturn/addReturn",
      method: "POST",
      data: {dataValues, contactArray},
    }).then((response) => {
      alert(response.data.data);
      handleClose();
      setContactArray([]);
      history.push("/pages/purchaseReturn/returnlist");

    });
    event.preventDefault();
  };

 

  

  const getData = () => {
    fetch("http://localhost:5000/api/sale/getdata", {
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
  } = useForm( true, validate);

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

  // useEffect(() => {
  //   try {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };
  //     axios
  //       .get("http://localhost:5000/api/purchase/productview", config)
  //       .then((response) => {
  //         // console.log(response.data);
  //         setList1(response.data);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

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
                <ul >
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
            <b>pur_rate</b>
          </TableCell>
          <TableCell>
            <b>stock_qty</b>
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

      <h1>Item Return</h1>
      <Grid
        item
        xs={12}
        sm={12}
        md={8}
        style={{ marginLeft: 150, width: 200, marginTop: -50 }}
      >
        {/* <MonetizationOnIcon /> */}
      </Grid>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={3}>
           
           
             <Grid
              item
              xs={12}
              sm={12}
              md={17}
              style={{ marginLeft: 2, width: 490, marginTop: 20 }}
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
                label="Batch"
                name="batch"
                value={batch}
                size="small"
                error={errors.manuf}
                style={{ marginTop: -60 }}
              />
              
               <Controls.Input
                label="TotalQuantity"
                name="totalqty"
                value={itemqty}
                size="small"
                error={errors.manuf}
                style={{ marginTop: -60 }}
              />
             </Grid> 
             <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 230, width: 240, marginTop: -165 }}
            >
             
              <Controls.Input
                name="qty"
                label="Quantity"
               
                size="small"
                style={{ marginLeft: 260, marginTop: -130 }}
                onChange={(e) => setqty(e.target.value)}
              />

              <Controls.Input
                label="Ptr"
                name="mrp"
                size="small"
                value={itemptr}
                error={errors.qty}
                style={{ marginLeft: 256, marginTop: -202 }}
                onChange={(e) => setmrp(e.target.value)}
              />
              <Controls.Input
                label="dis%"
                name="disper"
                size="small"
                style={{ marginLeft: 503, marginTop: -221 }}
                onChange={(e) => setper(e.target.value)}
              />
              
            </Grid> 
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 406, width: 240, marginTop: -166 }}
            >
              {/* <Controls.Input
                label="DisAmount"
                name="disamnt"
                size="small"
                value={disamount}
                error={errors.taxper}
                style={{ marginLeft: 503, marginTop: -235 }}
                // onChange={(e) => setdisamnt(e.target.value)}
              /> */}

              {/* <Controls.Input
                label="DisAmount"
                name="disamnt"
                size="small"
                value={disamount}
                error={errors.taxper}
                style={{ marginLeft: 503, marginTop: -235 }}
                onChange={(e) => setdisamnt(e.target.value)}
              /> */}
              <Controls.Input
                name="tax"
                label="Tax%"
                size="small"
                value={itemtaxrate}
                style={{ marginTop: 20 }}
                onChange={(e) => settax(e.target.value)}
              />
              <FormControl variant="outlined" placeholder="Select Supplier">
                <Select onChange={(e) => setSupplier(e.target.value)} value={supplier} >
                {posts.map(post =>(
              <MenuItem value={post.supplierId} name={post.supplierName}>{post.supplierName}</MenuItem>
               ))}
                </Select>
                </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: -3, width: 240, marginTop: -277 }}
            >
             
            </Grid> 
             <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 590, width: 270, marginTop:110 }}
            >
              
              {/* <div style={{ marginTop: 14 }}>
                <Controls.Input
                  name="taxable"
                  label="TaxableAmount"
                  size="small"
                  // value={taxableamntt.toFixed(2)}
                  placeholder="As per the Bill"
                  style={{ marginLeft: 509, marginTop: -176, width: 200 }}
                  onChange={(e) => settaxable(e.target.value)}
                />
              </div> */}
              {/* <div style={{ marginTop: -1 }}>
                <Controls.Input
                  name="total"
                  label="Total"
                  size="small"
                  placeholder="As per the Bill"
                  style={{ marginLeft: 509, marginTop: -176, width: 200 }}
                  onChange={(e) => settotal(e.target.value)}
                />
              </div> */}
              {/* <Controls.Input
                name="netam"
                size="small"
                label="Net Amnt"
                // value={rnt}
                style={{ marginLeft: 740, marginTop: -140, width: 205 }}
                onChange={(e) => setnet(e.target.value)}
              /> */}
            </Grid> 
            
           

          <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 317, width: 150, marginTop: 20 }}
            >
              <div style={{ marginLeft: 90, marginTop: 390, width: 250 }}>
                <Controls.Button
                  type="submit"
                  text="Save"
                    onClick={mainSubmit}
                  style={{ height: 40 }}
                />
                <Controls.Button
                  text="AddItem"
                  color="default"
                  onClick={main_add}
                  style={{ height: 40 }}
                />
              </div>
              {/* <Grid
                item
                xs={12}
                sm={12}
                md={9}
                style={{ marginLeft: 1, width: 240, marginTop: 10 }}
              > */}
                {/* <div style={{ marginLeft: 550, width: 419, marginTop: -60 }}> */}
                  
                  {/* <Button
                    type="submit"
                    style={{
                      marginLeft: -70,
                      width: 188,
                      marginTop: -136,
                      height: 55,
                      background:"#5167f8"
                    }}
                  >
                     <h1>{gd.toFixed(2)}</h1>
                  </Button> */}
                {/* </div> */}
              {/* </Grid> */}
            </Grid>  
          </Grid>
        </Grid>

         {/* <Grid
          item
          xs={12}
          sm={12}
          md={8}
          style={{ marginLeft: 10, width: 200, marginTop: 20}}
        > */}
          <TableContainer component={Paper}>
          <Table  aria-label="simple table" id="ptable">
          <TableHead id="tablehead">
            <TableRow>
           
                        <TableCell align="center">PROdUCT</TableCell>
                        <TableCell align="center">BATCH No</TableCell>
                        <TableCell align="center">QTY</TableCell>
                        <TableCell align="center">PTR</TableCell>
                        <TableCell align="center">MRP</TableCell>
                        <TableCell align="center">DISCOUNT</TableCell>
                        <TableCell align="center">GST</TableCell>
                        <TableCell align="center">SUBTOTAL</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {contactArray.map(number => {
                            return  (
                <TableRow>
                  <TableCell align="center">{number.itemname}</TableCell>
                  <TableCell align="center">{number.batchno}</TableCell>
                  <TableCell align="center">{number.qty}</TableCell>

                  <TableCell align="center">{number.pur_rate}</TableCell>
                  <TableCell align="center">{number.mrp}</TableCell>
                  {/* <TableCell>{number.total_quantity}</TableCell> */}
                  <TableCell align="center">{number.discount}</TableCell>
                  <TableCell align="center">{number.gst}</TableCell>
                  {/* <TableCell>{number.taxableSubtotal}</TableCell> */}
                  <TableCell align="center">{number.subtotal}</TableCell>
                </TableRow>
             ); })}
            </TableBody>
          </Table>
          </TableContainer>
        {/* </Grid>  */}
      </Form>
    </OftadehLayout>
  );
}
