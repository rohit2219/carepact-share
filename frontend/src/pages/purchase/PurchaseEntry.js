import React, { useState, useEffect } from 'react'
import { Grid, MenuItem, Table, TextField, Button } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/UseForm';
import { styles } from "./style"
import axios from "axios";
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "../../components/useTable";
import Popup from '../../components/Popup';
import { FormControl, InputLabel, Select as MuiSelect, FormHelperText } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddPostRightPanelsAutoComplete from "../../components/extra/AddPostRightPanels/AddPostRightPanelsAutoComplete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DateRangeIcon from "@material-ui/icons/DateRange";
import OfflinePinIcon from "@material-ui/icons/OfflinePin";
import { id } from 'date-fns/locale';

axios.get("http://localhost:5000/api/purchase/getdata", {
  params: {}
});
const lockItems = [
  { id: '1', title: 'Yes' },
  { id: '0', title: 'No' },

]
const Items = [

  { id: '1', title: 'Yes' },
  { id: '0', title: 'No' },
]

const initialFValues = {
  id: 0,
  fullName: '',
  email: '',
  mobile: '',
  city: '',
  gender: 'male',
  departmentId: '',
  hireDate: new Date(),
  isPermanent: false,
}
const headCells = [
  { id: 'ItemName', label: 'Item Name' },
  { id: 'Quantity', label: 'Quantity' },
  { id: 'Pur_rate', label: 'Pur_rate' },
  { id: 'dis%', label: 'dis%' },
  { id: 'Tax_amnt', label: 'Tax_amnt' },
  { id: 'Taxable_amnt', label: 'Taxable_amnt' },
  { id: 'Net_amnt', label: 'Net_amnt' },
]
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  mb3: {
    marginBottom: "1.3rem"
  },
  mb1: {
    marginBottom: ".85rem"
  },
  my1: {
    margin: ".85rem 0"
  }
}));
export default function EmployeeForm(props) {
  const [expanded, setExpanded] = React.useState(true);
  const classes = useStyles();
  const handleExpandedChange = () => {
    setExpanded(!expanded);
  };
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(headCells, filterFn);

  const [contactArray, setContactArray] = useState([]);
  let identity = 0;
  const [temp, settemp] = useState([]);
  //const [name,setname]=useState([]);
  const [state, setState] = useState({
    name: ""
  });
  

  const [iname, setName] = React.useState();
  const [mcontent, setMcontent] = React.useState();
  const [group, setGroup] = React.useState();
  const [schname, setSchname] = React.useState();
  const [itemcat, setitemcat] = React.useState();
  const [pack, setPack] = React.useState();
  const [rack, setRack] = React.useState();
  const [subrack, setSubrack] = React.useState();
  const [uom, setUom] = React.useState();
  const [hsn, setHsn] = React.useState();
  const [autoLock, setautoLock] = React.useState();
  const [autoLocks, setautoLocks] = React.useState();
  const [mrp, setMrp] = React.useState();
  

  const [list, setList] = useState([]);
  let optionItems = list.map(planet => (
    <option key={planet.supplierName}>{planet.supplierName}</option>
  ));
  const [suggestions, setSuggestion] = useState([]);
  const [itemName, setItemName] = useState("");
  const [item_group_id, setgroupItemId] = useState("");
  const getgDetails = item => {
    setItemName(item.item_group_name);
    setgroupItemId(item.item_group_id);
    setSuggestion([]);
  };
  const autoSuggestion = suggestions.map(items => (
   
    <li style={styles.suggestionLi} onClick={() => getgDetails(items)}>
      <Grid item  xs={12} sm={12} md={8} style={{marginLeft:10,width:200,marginTop:10}}>
              
              <Table style={{marginTop:-10,width:120}}>
                <TableBody>
              
                    <TableRow>
                    
                  <TableCell>{items.item_group_id}</TableCell>
                  <TableCell>{items.item_group_name}</TableCell>
                 </TableRow>
                </TableBody>
              </Table>
              </Grid>
    </li>
    
  ));
  const optiongchange = props => {
    setSuggestion([]);
    setItemName(props.target.value);
    console.log(props.target.value);
    fetch("http://localhost:5000/api/purchase/group_suggestions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: props.target.value })
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(sug => {
        if (sug.length) {
          setSuggestion(sug);
        }
        console.log(sug);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const [m_suggestions, setM_Suggestion] = useState([]);
  const [itemMName, setMItemName] = useState("");
  const [m_line_id, setItemId] = useState("");
  const getDetails = item => {
    setMItemName(item.manufacture);
    setItemId(item.m_line_id);
    setM_Suggestion([]);
  };
  const autoM_Suggestion = m_suggestions.map(item => (
    <li style={styles.M_suggestionLi} onClick={() => getDetails(item)}>

<Grid item  xs={12} sm={12} md={8} style={{marginLeft:10,width:200,marginTop:10}}>
              
              <Table style={{marginTop:-10,width:120}}>
                <TableBody>
              
                    <TableRow>
                    
                  <TableCell>{item.m_line_id}</TableCell>
                  <TableCell>{item.manufacture}</TableCell>
                 </TableRow>
                </TableBody>
              </Table>
              </Grid>
    </li>
   
  ));
  const optionchange = props => {
    setM_Suggestion([]);
    setMItemName(props.target.value);
    console.log(props.target.value);
    fetch("http://localhost:5000/api/purchase/manuf_suggestions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: props.target.value })
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(sug => {
        if (sug.length) {
          setM_Suggestion(sug);
        }
        console.log(sug);
      })
      .catch(function (error) {
        console.log(error);
      });
  };



  const [i_suggestions, seti_Suggestion] = useState([]);
  const [itemcatName, setiItemName] = useState("");
  const [item_category_id, setItemcatId] = useState("");
  const getiDetails = item => {
    setiItemName(item.item_category_name);
    setItemcatId(item.item_category_id);
    seti_Suggestion([]);
  };
  const autoi_Suggestion = i_suggestions.map(item => (
    <li style={styles.i_suggestionLi} onClick={() => getiDetails(item)}>

<Grid item  xs={12} sm={12} md={8} style={{marginLeft:10,width:200,marginTop:10,fontSize:20}}>
              
              <Table style={{marginTop:-10,width:120}}>
                <TableBody>
              
                    <TableRow>
                    
                  <TableCell>{item.item_category_id}</TableCell>
                  <TableCell>{item.item_category_name}</TableCell>
                 </TableRow>
                </TableBody>
              </Table>
              </Grid>
    </li>
   
  ));
  const optionichange = props => {
    seti_Suggestion([]);
    setiItemName(props.target.value);
    console.log(props.target.value);
    fetch("http://localhost:5000/api/purchase/category_suggestions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: props.target.value })
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(sug => {
        if (sug.length) {
          seti_Suggestion(sug);
        }
        console.log(sug);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const EntrySubmit = event => {
    axios({
      url: "http://localhost:5000/api/purchase/form_data",
      method: "POST",
      data: {
        manufacture:itemMName,
        m_line_id:m_line_id,
        product: iname,
        Itemcode:rand,
        major_content: mcontent,
        group_id:item_group_id,
        schname: schname,
        itemcategoryId:item_category_id,
        pack: pack,
        rack: rack,
        subrack: subrack,
        uom: uom,
        hsn: hsn,
        mrp: mrp,
        strip_sale:autoLock,
        fridge:autoLocks
      }
    }).then(response => {
      alert(response.data.data);
      handleClose();
      window.location.reload(false);
    });
    event.preventDefault();
  };
        

  const mainSubmit = event => {
    axios({
      url: "http://localhost:5000/api/purchase/mainform_data",
      method: "POST",
      data: contactArray
    }).then(response => {
      alert(response.data.data);
      setContactArray([]);
    });
    event.preventDefault();
  };

  const getData = () => {
    fetch("http://localhost:5000/api/purchase/getdata", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(apiResponse => {
        // alert('success')
        console.log(apiResponse);
        if (apiResponse.length) {
          setList(apiResponse);
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    //alert(1)
    getData();
  }, []);
  const { addOrEdit, recordForEdit } = props

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('fullName' in fieldValues)
      temp.fullName = fieldValues.fullName ? "" : "This field is required."
    if ('email' in fieldValues)
      temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
    if ('mobile' in fieldValues)
      temp.mobile = fieldValues.mobile.length > 9 ? "" : "Minimum 10 numbers required."
    if ('departmentId' in fieldValues)
      temp.departmentId = fieldValues.departmentId.length != 0 ? "" : "This field is required."
    setErrors({
      ...temp
    })

    if (fieldValues == values)
      return Object.values(temp).every(x => x == "")
  }

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFValues, true, validate);

  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  }

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit
      })
  }, [recordForEdit])

  const [open, setOpen] = React.useState(false);
  const [gopen, setgOpen] = React.useState(false);
  const [iopen, setiOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handlegClickOpen = () => {
    setgOpen(true);
  };
  const handleiClickOpen = () => {
    setiOpen(true);
  };
  const handlegClose = () => {
    setgOpen(false);
  };
  const handleiClose = () => {
    setiOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
 
    
var front = 'posweb';
var rand = front+Math.floor(Math.random() * 10000);
 
  

  const closeButton = { position: 'absolute', display: 'flex' }

  return (
    <OftadehLayout>
<Dialog open={iopen} onClose={handleiClose} aria-labelledby="form-dialog-title">
        <Button onClick={handleiClose} color="primary" style={closeButton} align="right">
          <CancelIcon />
        </Button>
        <DialogContent>

          <form >
            <Grid item xs={12} sm={12} md={19} style={{ marginLeft: 30, width: 940,height:200, marginTop: 5 }}>
              <Controls.Input
                name="fullName"
                type="search"
                label="search"
                size="small"
                value={itemcatName}
               onChange={optionichange}
               />
               {i_suggestions.length > 0 ? (
                            <ul style={styles.isuggestionUl}>
                              {autoi_Suggestion}
                            </ul>
                          ) : (
                            ""
                          )}
            </Grid>
          </form>
          {/* <Button onClick={handleiClose} color="primary" style={closeButton} align="left" style={{marginLeft:260,marginTop:-380}} >
        <CheckCircleTwoToneIcon/>
        </Button> */}
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>

<div>
<Dialog open={gopen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <Button onClick={handlegClose} color="primary" style={closeButton} align="right">
          <CancelIcon />
        </Button>
        <DialogContent>

          <form >
            <Grid item xs={12} sm={12} md={19} style={{ marginLeft: 30, width: 940,height:260, marginTop: 5 }}>
              <Controls.Input
                name="fullName"
                type="search"
                label="search"
                size="small"
                value={itemName}
               onChange={optiongchange}
               />
               {suggestions.length > 0 ? (
                            <ul style={styles.suggestionUl}>
                              {autoSuggestion}
                            </ul>
                          ) : (
                            ""
                          )}
            </Grid>
          </form>
          {/* <Button onClick={handlegClose} color="primary" style={closeButton} align="left" style={{marginLeft:260,marginTop:-380}} >
        <CheckCircleTwoToneIcon/>
        </Button> */}
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog></div>


      <Dialog open={open} onClose={handlegClose} aria-labelledby="form-dialog-title">
        <Button onClick={handleClose} color="primary" style={closeButton} align="right">
          <CancelIcon />
        </Button>
        <DialogContent>

          <form >
            <Grid item xs={12} sm={12} md={19} style={{ marginLeft: 30, width: 940,height:200, marginTop: 5 }}>
              <Controls.Input
                name="fullName"
                type="search"
                label="search"
                size="small"
                value={itemMName}
               onChange={optionchange}
               />
               {m_suggestions.length > 0 ? (
                            <ul style={styles.M_suggestionUl}>
                              {autoM_Suggestion}
                            </ul>
                          ) : (
                            ""
                          )}
            </Grid>
          </form>
          {/* <Button onClick={handleClose} color="primary" style={closeButton} align="left" style={{marginLeft:260,marginTop:-380}} >
        <CheckCircleTwoToneIcon/>
        </Button> */}
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>

      <Form onSubmit={handleSubmit}  >
        <h1>New Item Entry</h1><Grid item xs={12} sm={12} md={8} style={{ marginLeft: 210, width: 200, marginTop: -50 }}><PlaylistAddIcon /></Grid>
        <Grid container >

          <Grid item xs={12} sm={12} md={8} style={{ marginLeft: 200, width: 200, marginTop: 15 }}>
            <TextField
              variant="outlined"
              label="Manufacture"
              name="manufacture"
              value={itemMName}
              size="small"
              onClick={handleClickOpen}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={8} style={{ marginLeft: 200, width: 200, marginTop: -5 }}>
            <Controls.Input
              name="iname"
              type="search"
              label="Item-Name"
              size="small"
              value={iname}
              onChange={e => setName(e.target.value)}
              error={errors.fullName}
              style={{ height: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={8} style={{ marginLeft: 200, width: 200, marginTop: -5 }}>
            <Controls.Input
              type="search"
              label="MajorContent"
              size="small"
              name="mcontent"
              onChange={e => setMcontent(e.target.value)}
              value={mcontent}
              error={errors.fullName}
              style={{ height: 100 }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={8} style={{ marginLeft: 200, width: 200, marginTop: -6 }}>
          <TextField
              variant="outlined"
              label="Group"
              name="group"
              value={itemName}
              size="small"
              onClick={handlegClickOpen}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={8} style={{ marginLeft: 200, width: 200, marginTop: -3 }}>
            <Controls.Input
              type="search"
              label="ScheduleName"
              size="small"
              name="schname"
              value={schname}
              onChange={e => setSchname(e.target.value)}
              error={errors.fullName}
              style={{ height: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={8} style={{ marginLeft: 200, width: 200, marginTop: -5 }}>
          <TextField
              variant="outlined"
              label="Item-Category"
              name="group"
              value={itemcatName}
              size="small"
              onClick={handleiClickOpen}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} style={{ marginLeft: 206, width: 210, marginTop: -6 }}>
            <Controls.Input
              type="search"
              label="Pack"
              size="small"
              name="pack"
              onChange={e => setPack(e.target.value)}
              value={pack}
              error={errors.fullName}
              style={{ height: 100 }}
            />
            <Grid item xs={12} sm={12} md={19} style={{ marginLeft: 200, width: 280, marginTop: -55 }}>
              <Controls.Input
                type="search"
                label="Rack"
                size="small"
                name="rack"
                onChange={e => setRack(e.target.value)}
                value={rack}
                error={errors.fullName}
                style={{ height: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={19} style={{ marginLeft: 400, width: 280, marginTop: -55 }}>
              <Controls.Input
                type="search"
                label="SubRack"
                size="small"
                name="subrack"
                onChange={e => setSubrack(e.target.value)}
                value={subrack}
                error={errors.fullName}
                style={{ height: 100 }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={19} style={{ marginLeft: 400, width: 280, marginTop: -9 }}>
              <Controls.Input
                type="search"
                label="MRP"
                size="small"
                name="mrp"
                onChange={e => setMrp(e.target.value)}
                value={mrp}
                error={errors.fullName}
                style={{ height: 100 }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={19} style={{ marginLeft: 1, width: 280, marginTop: -59 }}>
              <Controls.Input
                type="search"
                label="UOM"
                size="small"
                name="uom"
                onChange={e => setUom(e.target.value)}
                value={uom}
                error={errors.fullName}
                style={{ height: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={19} style={{ marginLeft: 200, width: 280, marginTop: -53 }}>
              <Controls.Input
                type="search"
                label="HSN"
                size="small"
                name="hsn"
                value={hsn}
                onChange={e => setHsn(e.target.value)}
                error={errors.fullName}
                style={{ height: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={19} style={{ marginLeft: -37, width: 320, marginTop: 120 }}>
              <div style={{ marginLeft: 500, marginTop: -120, width: 570 }}>
                <Controls.Button
                  type="submit"
                  text="Save"
                  onClick={EntrySubmit}
                  style={{ height: 45 }} />
              </div>
            </Grid>
            <ExpansionPanel className={classes.mb3} style={{width:200,marginTop:-57,marginLeft:10}}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Strip_Sale</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <Controls.RadioGroup
                onChange={handleInputChange}
                items={lockItems}
                name="autoLock"
                value={autoLock}
                onChange={e => setautoLock(e.target.value)}
              />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel className={classes.mb3} style={{width:200,marginLeft:220,marginTop:-66}}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Fridge</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <Controls.RadioGroup
                name="autolocks"
                value={autoLocks}
                onChange={e => setautoLocks(e.target.value)}
                items={Items}
              />
        </ExpansionPanelDetails>
      </ExpansionPanel>
          </Grid>

        </Grid>
      </Form>
    </OftadehLayout>
  )
}
