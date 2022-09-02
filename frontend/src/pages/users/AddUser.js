import React, { useState, useEffect } from 'react'
import axios from 'axios';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Avatar, Button, Grid, Paper, TextField, FormControlLabel, FormLabel, RadioGroup, FormControl} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CancelIcon from '@material-ui/icons/Cancel';
import Radio from '@material-ui/core/Radio';
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";


const AddCustomer=(props) =>{

  const [open, setOpen] = React.useState(false);

  const { history } = props;

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

  const handleClose = () => {
    setOpen(false);
  };


  const [values, setValues] = useState({

    cust_name: "",
    phn_no: "",
    email:"",
    address: "",
    city: "",
    state: "",
    country: "",
    prescription:"",
    gst:"",
    delivery_option:""
    
});
const {cust_name, phn_no, email, address, city, state, country, prescription, gst, delivery_option} = values

const handleChange = name => event=> {
    setValues({...values, error: false, [name]: event.target.value});
    //console.log({cust_name}, "hello on handle change")
};

const onSubmit = event=> {
    event.preventDefault();
    console.log({cust_name, phn_no, email, address, city, state, country, prescription, gst, delivery_option})
    // event.preventDefault();
    setValues({...values, error: false}) // Seems more like a precautioonary step this is where the onhandle change information gets stored
    console.log({cust_name, phn_no, email, address, city, state, country, prescription, gst, delivery_option}, "hello world")
    //signup({name, email, password}) // Call to  backend method 
    const customerData = {
        customerName : cust_name,
        phone_no     : phn_no,
        email        : email,
        address      : address,
        city         : city,
        state        : state,
        country      : country,
        prescription : prescription,
        gst          : gst,
        delivery_option:delivery_option
    }
    
    //axios
    
    var loginUser = localStorage.getItem("userInfo");
    var parsedloginuser = JSON.parse(loginUser)

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${parsedloginuser.token}`,
        },
    }

    axios.post('http://localhost:5000/api/user/addUser', {customerData},config)
        .then(response =>  alert(response.data.data));
         

    // .then (data=>{
    //     if (data.error) {
    //         return setValues({...values, error:data.error, success:false})
    //     } else{
    //         return setValues({cust_name : "", phn_no : "", email:"", address: "", city: "", state: "", country: "", prescription: "", success: true})        

    //     }
    // })
    // .catch ( console.log ("Error in signup"));

}



  const btnStyle={margin :'8px 0'}
//   const paperStyle={padding :20,height :'90vh',width:350,margin :'20px auto'}
  const avatarStyle={backgroundColor : '#2E8B57'}
  const paperStyle={padding :20, margin :'20px auto 20px 20px'}

  const closeButton = {position: 'absolute', display:'flex'}
  return (
    <OftadehLayout>
      <Button variant="outlined" color="primary" onClick={handleClickOpen} startIcon={<AddOutlinedIcon />} style={btnStyle}>
        Add Customer </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <Button onClick={handleClose} color="primary" style={closeButton} align="right">
          <CancelIcon />
          </Button>
        <DialogContent>
          
        <form > 
            <Grid container>
            {/* <Paper elevation={10} style={paperStyle}> */}
                <Grid item xs={12} align="center">
                    <Avatar style={avatarStyle}><LockIcon/></Avatar>
                        <h2>Customer details</h2>
                    </Grid> 
                    <Grid item xs={6}>
                        <Paper elevation={10} style={paperStyle}>
                        <TextField label="Customername" name="cust_name" onChange={handleChange("cust_name")} value={cust_name} placeholder="Enter name" fullWidth required/>  
                        <TextField label="Phone no" name="phn_no" onChange={handleChange("phn_no")} value={phn_no} placeholder="Enter phone no" fullWidth required/>  
                        <TextField label="Email" name="email"  onChange={handleChange("email")} value={email} placeholder="Enter email" fullWidth required/>  
                        <TextField label="Address" name="address" onChange={handleChange("address")} value={address} placeholder="Enter address" fullWidth required/> 
                        <br></br>
                        <br></br>
                        <FormLabel >If gstin</FormLabel>
                        <TextField label="gst" name="gst" onChange={handleChange("gst")} value={gst} placeholder="Enter gstno" fullWidth required/> 
                      
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                    <Paper elevation={10} style={paperStyle}>
                        <TextField label="City" name="city" onChange={handleChange("city")} value={city} placeholder="Enter city" fullWidth required/>  
                        <TextField label="State" name="state" onChange={handleChange("state")} value={state} placeholder="Enter state" fullWidth required/>  
                        <TextField label="Country" name="country" onChange={handleChange("country")} value={country} placeholder="Enter country" fullWidth required/>  
                        <TextField label="Prescription" name="prescription" onChange={handleChange("prescription")} value={prescription} placeholder="Enter prescription" fullWidth required/> 
                        <br></br>
                        <br></br>
                        <FormControl component="fieldset">
                          <FormLabel >Need Home Delivery</FormLabel>
                          <RadioGroup row aria-label="position" name="delivery_option" defaultValue="yes" onChange={handleChange("delivery_option")}>
                          <FormControlLabel
                              value="yes"
                              control={<Radio color="primary" />}
                              label="Yes"
                              labelPlacement="start"
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio color="primary" />}
                              label="No"
                              labelPlacement="start"
                            />
                            
                          </RadioGroup>
                        </FormControl>
                        </Paper>
                    </Grid>
                    
                    <Button type="submit" color="primary" variant="contained" style={btnStyle} fullWidth onClick={onSubmit}>Submit details</Button>
                    
                    
            {/* </Paper> */}
        </Grid> 
       </form>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose} color="primary">
            Cancel
          </Button> */}
          
        </DialogActions>
      </Dialog>
    </OftadehLayout>
  );
}

 export default AddCustomer;
// const AddCustomer = ()=>{
//     const btnStyle={margin :'8px 0'}

//     return(

//       <Button color="primary" variant="outlined" startIcon={<AddOutlinedIcon />} style={btnStyle} >Add Customer</Button>  
//     )
// }

// export default AddCustomer;
