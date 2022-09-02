import React, { useState, useEffect } from "react";
import { Grid, MenuItem, Table, TextField, Button } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/UseForm";
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import { DatePicker } from "@material-ui/pickers";
import axios from "axios";
import {
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";

// import Select from "@material-ui/core/Select";
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import LibraryAddCheckSharpIcon from "@material-ui/icons/LibraryAddCheckSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Checkbox from "@material-ui/core/Checkbox";
import { Select} from '@material-ui/core';
import { useHistory } from "react-router-dom";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

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
  const [expDate, setexpDate] = useState("");
  const [rack, setRack] = useState("");
  const [subrack, setSubrack] = useState("");
  const [fridge, setFridge] = useState("");

  const getDetails = (item) => {
    setItemcode(item.Itemcode);
    setItemName(item.product);
    setItemmrp(item.mrp);
    setItemhsn(item.hsn);
    setRack(item.rack);
    setSubrack(item.subrack);
    setFridge(item.fridge);
    setSuggestion([]);
    // setBatch(item.batch);
  };
  
  const asuggestions = suggestions.map((item) => {
    // console.log(item);
    return (
      <TableRow onClick={() => getDetails(item)}>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>{item.product}</TableCell>
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
    fetch("http://localhost:5000/api/inventory/suggestions", {
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
        batch:batch,
        item_name:itemName,
        rate:itemptr,
        stock_qty:itemqty,
        mrp:itemmrp,
        taxper:itemtaxrate,
        exp_date:expDate,
        hsn:itemhsn,
        rack:rack,
        subrack:subrack,
        fridge:fridge,
      },
    ]);

    alert("adding new row...");
    console.log(contactArray);
    event.preventDefault();
  };

  const mainSubmit = (event) => {
    console.log(contactArray);

    axios({
      url: "http://localhost:5000/api/inventory/addInventory",
      method: "POST",
      data: {contactArray},
    }).then((response) => {
      alert(response.data.data);
      handleClose();
      setContactArray([]);
    //   history.push("/pages/purchaseReturn/returnlist");

    });
    event.preventDefault();
  };

 

  

//   const getData = () => {
//     fetch("http://localhost:5000/api/sale/getdata", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     })
//       .then((res) => {
//         // console.log(res);
//         return res.json();
//       })
//       .then((apiResponse) => {
//         // alert('success')
//         // console.log(apiResponse);
//         if (apiResponse.length) {
//           setList(apiResponse);
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   useEffect(() => {
//     //alert(1)
//     getData();
//   }, []);
  const closeButton = { position: "absolute", display: "flex" };
  const { addOrEdit, recordForEdit } = props;

 
  // const {
  //   values,
  //   setValues,
  //   errors,
  //   setErrors,
  //   handleInputChange,
  //   resetForm,
  // } = useForm( true, validate);

  const handleSubmit = (e) => {
    // e.preventDefault();
    // if (validate()) {
    //   addOrEdit(values, resetForm);
    // }
  };

  // useEffect(() => {
  //   if (recordForEdit != null)
  //     setValues({
  //       ...recordForEdit,
  //     });
  // }, [recordForEdit]);

  
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

      <h1>Inventory Add</h1>
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
                label="Quantity"
                name="qty"
                value={itemqty}
                size="small"
                onChange={(e) => setItemqty(e.target.value)}
                style={{ marginTop: -60 }}
              />
              
             </Grid> 
             <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 260, width: 240, marginTop: -110 }}
            >
             
              <Controls.Input
                name="batch"
                label="Batch"
                value={batch}
                size="small"
                style={{ marginLeft: 260, marginTop: -130 }}
                onChange={(e) => setBatch(e.target.value)}
              />

              <Controls.Input
                label="HSN code"
                name="hsn"
                size="small"
                value={itemhsn}
                // error={errors.qty}
                style={{ marginLeft: 256, marginTop: -202 }}
                onChange={(e) => setItemhsn(e.target.value)}
              />
                         
            </Grid> 
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              style={{ marginLeft: 460, width: 240, marginTop: -110 }}
            >
              

              <Controls.Input
                label="Ptr"
                name="ptr"
                size="small"
                value={itemptr}
                // error={errors.taxper}
                style={{ marginLeft: 503, marginTop: -235 }}
                onChange={(e) => setPtr(e.target.value)}
              />
              <TextField
                variant="outlined"
                type="date"
                name="expDate"
                label="Exp Date"
                size="small"
                value={expDate}
                style={{ marginTop: 20 }}
                onChange={(e) => setexpDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
              />
                
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={17}
              style={{ marginLeft: 650, width: 240, marginTop: -120 }}
            >
              <TextField
                variant="outlined"
                label="Mrp"
                name="mrp"
                value={itemmrp}
                size="small"
                onChange={(e) => setItemmrp(e.target.value)}
              /> 
              <Controls.Input
                label="Tax %"
                name="tax_per"
                value={itemtaxrate}
                size="small"
                
                style={{ marginTop: -60 }}
                onChange={(e) => setTaxrate(e.target.value)}
              />
              
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
              
            </Grid>  
          </Grid>
        </Grid>

        
          <TableContainer component={Paper}>
          <Table  aria-label="simple table" id="ptable">
          <TableHead id="tablehead">
            <TableRow>
           
                        <TableCell align="center">PRODUCT</TableCell>
                        <TableCell align="center">QTY</TableCell>
                        <TableCell align="center">BATCH No</TableCell>
                        <TableCell align="center">HSN CODE</TableCell>
                        <TableCell align="center">EXP DATE</TableCell>
                        <TableCell align="center">PTR</TableCell>
                        <TableCell align="center">MRP</TableCell>
                        <TableCell align="center">TAX RATE</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {contactArray.map(number => {
                return  (
                <TableRow>
                  <TableCell align="center">{number.item_name}</TableCell>
                  <TableCell align="center">{number.stock_qty}</TableCell>
                  <TableCell align="center">{number.batch}</TableCell>
                  <TableCell align="center">{number.hsn}</TableCell>
                  <TableCell align="center">{number.exp_date}</TableCell>
                  <TableCell align="center">{number.rate}</TableCell>
                  <TableCell align="center">{number.mrp}</TableCell>
                 
                  <TableCell align="center">{number.taxper}</TableCell>
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
