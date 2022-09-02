import React from "react";
import axios from 'axios';
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

const initialFValues = {
  userName: '',
  password: '',
}

const LoginPage = props => {
  const classes = useStyles();
  const { history } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('password' in fieldValues)
      temp.password = fieldValues.password.length >= 8 ? "" : "Username must be at least 8 chars long."
    if ('userName' in fieldValues)
      temp.userName = fieldValues.userName.length >= 5 ? "" : "password must be at least 5 chars long."
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
    console.log(values);
    e.preventDefault();
    if (validate()) {

        console.log(values);
        var username = values.userName.trim();
        var password = values.password;

        const config = {
          headers: {
              'Content-Type': 'application/json',
          },
        }
        axios.post('http://localhost:5000/api/auth/login', { username,password }, config)
        .then(response => {
              console.log(response.data);
              // alert('Login success')
              localStorage.setItem('userInfo', JSON.stringify(response.data))
              history.push("/pages/purchase/purchaseupload")               
        })
        .catch(function (error) {     
          console.log(error)  
          alert('Invalid username or password') 
          history.push("/")         
      })

    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.loginCard}>
        <Typography variant="h5" component="h1">
          Login
        </Typography>
        {/* <Typography className={classes.brand} variant="h5" component="h1">
          Login
        </Typography> */}
        <Typography className={classes.mBottom} variant="body1">
          Sign In to your account
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
              />
              <Controls.Password
                label="Password"
                name="password"
                value={values.password}
                onChange={handleInputChange}
                error={errors.password}
              />
              <Button
                onClick={() => history.push("/pages/auth/forgot-password")}
                color="primary"
              >
                Forgot password?
                  </Button>
              <div className={classes.mBottom}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={classes.button}
                  type="submit"
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className={classes.button}
                  onClick={() => history.push("/register")}
                >
                  Register Now!
                </Button>
              </div>
            </Grid>
          </Grid>
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

export default LoginPage;
