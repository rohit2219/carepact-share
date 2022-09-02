import React, {useState, useEffect} from 'react'
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
//Joseph
//import { makeStyles } from "@material-ui/core/styles";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
//done
import TableContainer from '@material-ui/core/TableContainer';
//import TableHead from '@material-ui/core/TableHead';
//import TableRow from '@material-ui/core/TableRow';
//import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { useParams } from "react-router-dom";
import Moment from 'moment';
import {Button} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  selectTableCell: {
    width: 60
  },
  tableCell: {
    width: 130,
    height: 40
  },
  input: {
    width: 130,
    height: 40
  }
}));

const createData = (item_name, stock_qty, batch, hsn, exp_date) => ({
  //   id: name.replace(" ", "_"),
    id: batch,
    item_name,
    stock_qty,
    batch,
    hsn,
    exp_date,
    isEditMode: false
  });

  const CustomTableCell = ({ row, name, onChange }) => {
    const classes = useStyles();
    const { isEditMode } = row;
    return (
      <TableCell align="left" className={classes.tableCell}>
        {isEditMode ? (
          <Input
            value={row[name]}
            name={name}
            onChange={e => onChange(e, row)}
            className={classes.input}
          />
        ) : (
          row[name]
        )}
      </TableCell>
    );
  };

const InventoryEdit= (props) => {

    var { id , batch} = useParams();

    var [itemName, setItemItemName]= useState([]);

    var [productData, setProductData]= useState([]);

    var loginUser = localStorage.getItem("userInfo");

    var parsedloginuser = JSON.parse(loginUser)

    var userId = parsedloginuser._id;
    var array = [];
    useEffect(() => {
        const getData = () => {
            axios.get(`http://localhost:5000/api/inventory/getInventoryProduct/${id}/${batch}`)
            .then(res => {
               array = res.data;
                // console.log(res.data);
                setProductData(res.data);
                axios.post(`http://localhost:5000/api/inventory/insertLog`,{array})  
              })
              
              .catch(err => console.log(err));
              
          };
          
          getData();
        }, []);

        function deleteEntry(batch,product){
          // alert(id);
          // alert(batch);
          // alert(product);
          const dataValues ={
            user_id      : userId,
            itemcode     : id,
            itemname     : product,  
            action       : "delete",  
            }

            console.log(dataValues);
            
              const config = {
                headers: {
                  Authorization: `Bearer ${parsedloginuser.token}`,
                },
              }
              axios.post(`http://localhost:5000/api/inventory/deleterecord/${batch}/${id}`, {dataValues} ,config)
              
              alert("deleted");
              window.location.reload(); 

        }

        const [previous, setPrevious] = React.useState({});
        const classes = useStyles();
      
        const onToggleEditMode = id => {
           alert(id)
          setProductData(state => {
            return productData.map(row => {
              if (row.id === id) {
                console.log(row);
                var batchno=row.batch;
                var id=row.itemcode;
                axios.post(`http://localhost:5000/api/inventory/inventoryEdit/${batchno}/${id}`,{row })
                return { ...row, isEditMode: !row.isEditMode };
              }
              // setTest(row);
              return row;
              // console.log(row);
            });
            
          });
         
        };
        // console.log(productData);
        const onChange = (e, row) => {
          if (!previous[row.batch]) {
            setPrevious(state => ({ ...state, [row.batch]: row }));
          }
          const value = e.target.value;
          const name = e.target.name;
          // setValues({...values, error: false, [name]: value});
          
          const { id } = row;
          const newRows = productData.map(row => {
            if (row.batch === id) {
              return { ...row, [name]: value };
            }
            return row;
            // console.log(row);
          });
         
          setProductData(newRows);
        };
        const onRevert = id => {
          const newRows = productData.map(row => {
            if (row.batch === id) {
              return previous[id] ? previous[id] : row;
            }
            return row;
          });
          setProductData(newRows);
          setPrevious(state => {
            delete state[id];
            return state;
          });
          onToggleEditMode(id);
        };
      
      
      //done

    return (
        <OftadehLayout>
      <Paper className={classes.root}>
      <Table className={classes.table} aria-label="caption table">
        <caption>Click on the pencil to edit</caption>
        <TableHead>
          <TableRow>
            <TableCell align="left" size="small">Product</TableCell>
            <TableCell align="left" size="small">Quantity</TableCell>
            <TableCell align="left" size="small">Batch No</TableCell>
            <TableCell align="left" size="small">Hsn Code</TableCell>
            <TableCell align="left" size="small">Exp Date</TableCell>
            <TableCell align="left" size="small">Price</TableCell>
            <TableCell align="left" size="small">Mrp</TableCell>
            <TableCell align="left" size="small">Tax</TableCell>
            <TableCell align="left" size="small">rack</TableCell>
            <TableCell align="left" size="small">Subrack</TableCell>
            <TableCell align="left" size="small"></TableCell>
            <TableCell align="left" size="small"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productData.map(row => (
            <TableRow key={row.itemcode}>
              <CustomTableCell {...{ row, name: "item_name", onChange }} />
              <CustomTableCell {...{ row, name: "stock_qty", onChange }} />
              <CustomTableCell {...{ row, name: "batch", onChange }} />
              <CustomTableCell {...{ row, name: "hsn", onChange }} />
              <CustomTableCell {...{ row, name: "exp_date", onChange }} />
              <CustomTableCell {...{ row, name: "rate", onChange }} />
              <CustomTableCell {...{ row, name: "mrp", onChange }} />
              <CustomTableCell {...{ row, name: "tax_per", onChange }} />
              <CustomTableCell {...{ row, name: "rack", onChange }} />
              <CustomTableCell {...{ row, name: "subrack", onChange }} />

              <TableCell className={classes.selectTableCell}>
                {row.isEditMode ? (
                  <>
                    <IconButton
                      aria-label="done"
                      onClick={() => onToggleEditMode(row.itemcode)}
                    >
                      <DoneIcon />
                    </IconButton>
                    <IconButton
                      aria-label="revert"
                      onClick={() => onRevert(row.id)}
                    >
                      <RevertIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    aria-label="delete"
                    onClick={() => onToggleEditMode(row.id)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
              <TableCell><DeleteIcon  onClick={e => deleteEntry(row.batch,row.item_name)}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
        </OftadehLayout>
    );
}

export default InventoryEdit;
