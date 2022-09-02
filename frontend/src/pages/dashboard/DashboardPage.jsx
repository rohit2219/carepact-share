import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import { Paper, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useState, useEffect } from 'react'
import axios from "axios";

const useStyles = makeStyles((them) => ({
  paddingPaper: {
    padding: "10px 5px 5px 10px",
  },
  mt: {
    marginTop: 13,
  },
  titlePaper: {
    marginBottom: "16px",
  },
  visitorChart: {
    // height: "150px"
  },
}));

const DashboardPage = (props) => {

  const { history } = props;
  const classes = useStyles();
  
  useEffect(() => {

    try {

      var loginUser = localStorage.getItem("userInfo");
      var parsedloginuser = JSON. parse(loginUser)

      const config = {
        headers: {
          Authorization: `Bearer ${parsedloginuser.token}`,
        },
      }

      axios.get(`http://localhost:5000/api/auth/${parsedloginuser._id}`,config)
          .then(response => {
              console.log(response.data);             
          })
      } catch (error) {
          console.log(error)
          history.push("/login")
      }

  }, []);

  return (
    <OftadehLayout>
      <h1>Dashboard</h1>
      
    </OftadehLayout>
  );
};

export default DashboardPage;
