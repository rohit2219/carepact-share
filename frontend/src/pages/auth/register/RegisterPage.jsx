import React from "react";
import axios from 'axios'
import { makeStyles, Typography, Button, TextField } from "@material-ui/core";
import { useForm, Form } from '../../../components/UseForm';
import Controls from "../../../components/controls/Controls";
import { Grid } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    background: "#0d131d",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  mBottom: {
    marginBottom: ".5rem"
  },
  button: {
    marginTop: ".85rem"
  },
  loginCard: {
    width: "275px",
    borderRadius: 5,
    background: "#fff",
    padding: ".85rem"
  }
}));

const userTypes = [
  { id: 'S', title: 'Sale' },
  { id: 'A', title: 'Admin' },
  { id: 'SA', title: 'Super Admin' },
  { id: 'AC', title: 'Accounts' }
]
const initialFValues = {
  userName: '',
  password: '',
  email: '',
  rpassword: '',
  userType: ''
}

const RegisterPage = props => {
  const classes = useStyles();
  const { history } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors }  
    if ('email' in fieldValues)
    
      temp.email = (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/).test(fieldValues.email) ? "" : "Email is not valid."
    if ('password' in fieldValues)
      temp.password = fieldValues.password.length >= 8 ? "" : "Password must have at least 8 characters."
    
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
    //console.log(values);
    e.preventDefault();

    if (validate()) {
        console.log(values);
        var username = values.userName.trim();
        var password = values.password;
        var email = values.email;
        var rpassword = values.rpassword;
        var userType = values.userType;

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
          }
          axios.post('http://localhost:5000/api/auth/register', { username,password,email,rpassword,userType }, config)
          .then(response => {
              console.log(response.data);
              alert('User register Succesfull')
              localStorage.setItem('userInfo', JSON.stringify(response.data))
              history.push("/")
          })
          .catch(function (error) {     
            console.log(error)  
            alert('User already exists')
            history.push("/register")         
        })
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.loginCard}>
        <Typography variant="h5" component="h1">
          Register
        </Typography>
        {/* <Typography className={classes.brand} variant="h5" component="h1">
          Login
        </Typography> */}
        <Typography className={classes.mBottom} variant="body1">
          Create your account
        </Typography>
        <Form onSubmit={handleSubmit}>
          <Grid container>
              <Grid item xs={12} sm={12} md={12}>
                <Controls.Input
                  name="userName"
                  label="Username"
                  value={values.userName}
                  onChange={handleInputChange}
                  error={errors.userName}
                  fullWidth
                  />
                  <Controls.Input
                  name="email"
                  label="Email"
                  value={values.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
                <Controls.Password
                  name="password"
                  label="Password"
                  value={values.password}
                  onChange={handleInputChange}
                  error={errors.password}
                />
                <Controls.Password
                  name="rpassword"
                  label="Repeat password"
                  value={values.rpassword}
                  onChange={handleInputChange}
                  error={errors.rpassword}
                />
                <Controls.Select
                    label="User Type"
                    name="userType"
                    value={values.userType}
                    onChange={handleInputChange}
                    options={userTypes}
                    error={errors.userType}
                />
              </Grid>
          </Grid>    
         
          <div className={classes.mBottom}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className={classes.button}
              type="submit"
            >
              Register
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              className={classes.button}
              onClick={() => history.push("/")}
            >
              Sign in
            </Button>
          </div>
          </Form>
        <Typography variant="caption">&copy; Carepact</Typography>
      </div>
      {/* <Typography variant="h3" gutterBottom>
        Oops! <span className={classes.statusCode}>404</span>
      </Typography>
      <Typography variant="body1">
        The page you are looking for was not found.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => history.push("/")}
      >
        Back to Home
      </Button> */}
    </div>
  );
};

export default RegisterPage;
