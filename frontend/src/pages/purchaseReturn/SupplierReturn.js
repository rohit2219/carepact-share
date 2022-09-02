import React, {useState, useEffect} from 'react'
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import {Grid,MenuItem, FormControl, Avatar, Radio, Checkbox, FormLabel, Button, TextField, FormControlLabel, Select} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useForm, Form } from '../../components/UseForm';
import { useHistory } from "react-router-dom";
import Moment from 'moment';

import axios from 'axios';

// const initialValues = {
//     debitNo: '',
//     SupplierId: ' ',
//     Supplier:'',
//     paymentMethod: '',
// }

const SupplierReturn= () => {
    var history = useHistory();
    const [supplier, setSupplier] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [contactArray, setContactArray] = useState([]);
    const [itemName, setItemName] = useState("");
    const [netAmount, setNetamount] = useState("");

    // const [values, setValues] = useState(initialValues);
   
//    const [values, setValues] = useState({

//         debitNo: "",
//         SupplierId: "",
//         Supplier:"",
//         paymentMethod: "",       
//     });

   var subtotal=0;

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

    const optionItems = posts.map(post =>(
        <MenuItem value={post.supplierId} name={post.supplierName}>{post.supplierName}</MenuItem>
    ))
   
    const [product, setProduct] = useState([]);
    const handleChange = (event) => {
          setSupplier(event.target.value);
          var id =event.target.value;
        setSupplierName(event.target.name);
       
        axios.get(`http://localhost:5000/api/purchaseReturn/getproducts/${id}`)
        // axios.get(`http://localhost:5000/api/purchaseReturn/getproducts`)
        .then(res => {
          var productarray= res.data;
          console.log(res.data);
          setProduct(res.data);
     
         // for(var i = 0; i < productarray.length; i++) {
            //console.log(productarray[i]);                    
            // productsArray.push({
            //             // product:productarray[i].itemcode,
            //             product:productarray[i].itemname,
            //             batch:productarray[i].batchno,
            //             ptr:productarray[i].pur_rate,
            //             quantity:productarray[i].qty,
            //             gst:productarray[i].pur_rate,
            //             discount:productarray[i].pur_rate,
            //             Supplier:id,
            //             subtotal:productarray[i].pur_rate          
            //             }); 
                                    
         // } 
         })
         
         setProduct(
          product.map(d => {
            return {
              select: false,
              itemcode: d.itemcode,
              itemname: d.itemname,
              batchno: d.batchno,
              qty: d.qty,
              pur_rate: d.pur_rate,
              gst: d.pur_rate,
              discount: d.pur_rate,
              subtotal: d.pur_rate,
              Supplier:id 
            };
          })
        );
      
    }
    // console.log(contactArray);
    // const [values, setValues] = useState({

    //     itemname: "",
    //     batch: "",
    //     stock_qty:"",
    //     rate: "",
    //     tax_per: "",
    //     discount: ""        
    // });
    // const {itemname, batch, stock_qty, rate, tax_per, discount} = values

    // const main_add = event => {
    //     event.preventDefault();
     
    //     axios.post('http://localhost:5000/api/purchaseReturn/addReturn', {productsArray})
    //     .then(response =>  alert(response.data.data));
     
    // }

    const handleSubmit = e => {
        var front = 'DB';
        const currentYear = new Date().getFullYear();
        // const currentTime = new Date().getTime();
        var rand = front+"."+currentYear+"."+Math.floor(Math.random() * 10000);
        setNetamount(product.qty*product.pur_rate);
 
        const dataValues ={
            debitNo      : rand,
            SupplierId   : supplier,
            Supplier     : supplierName,  
            paymentMethod: "Credit",  
            returnType   : "SR",
            }
      console.log(product);
    //   console.log(rand)
      // try {        
      //     const config = {
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //     }
          axios.post('http://localhost:5000/api/purchaseReturn/insertReturn',{dataValues, product})
          .then(response => {
              console.log(response.data);
              alert('Product returned succesfully')
            //   window.location.reload(false);
              history.push("/pages/purchaseReturn/returnlist");
            })
      //   } catch (error) {
         
      //     console.log(error)
      
      // }
      e.preventDefault();    
  }
    const selectStyle={width:'50%'}
    const paperStyle={padding :20, margin :'20px auto 20px 20px'}
    const btnStyle={margin :'20px 20px',height:"25%"}	

    return (
        <OftadehLayout>
            <Form onSubmit={handleSubmit}>
            <Grid container>
            <FormControl variant="outlined" style={selectStyle} placeholder="Select Supplier">
                    <Select onChange={handleChange} >
                      {optionItems}
                    </Select>
                    </FormControl>
            </Grid>
            <br></br>
            <TableContainer component={Paper}>
                <Table aria-label="simple table" id="ptable">
                    <TableHead id="tablehead">
                    <TableRow>
                       <TableCell align="center"></TableCell>
                        <TableCell align="center">PRODUCT</TableCell>
                        <TableCell align="center">BATCH No</TableCell>
                        <TableCell align="center">QTY</TableCell>
                        <TableCell align="center">EXP DATE</TableCell>
                        <TableCell align="center">PTR</TableCell>
                        <TableCell align="center">GST</TableCell>
                        <TableCell align="center">DISCOUNT</TableCell>
                        <TableCell align="center">SUBTOTAL</TableCell>

                    </TableRow>
                    </TableHead>
                     <TableBody>
                         
                     {product.map((d, i) => {
                        return(
                                <TableRow>
                                <TableCell >
                                    <Checkbox 
                                        color="primary"
                                        value={d.select}
                                        onChange={e => {
                                            let checked = e.target.checked
                                            setProduct(
                                              product.map(data => {
                                                if (d.itemname === data.itemname) {
                                                    data.select = checked
                                                    data.netamount = parseFloat(d.taxable_amnt)+parseFloat(d.tax_amnt)
                                                }
                                                return data;
                                                })
                                            );
                                            }
                                        }
                                    />                                   
                                        </TableCell>
                                    <TableCell align="center">{d.itemname}</TableCell>
                                    <TableCell align="center">{d.batchno}</TableCell>
                                    {/* <TableCell><input type="number" pattern="[0-9]*" inputmode="numeric" name="return_qty[{number.itemname}]" id="return_qty" max="{number.qty}" min="1"/></TableCell> */}
                                    <TableCell align="center">{d.qty}</TableCell>
                                    <TableCell align="center">{Moment(d.exp_date).format("DD-MM-YYYY")}</TableCell>
                                    <TableCell align="center">{d.pur_rate}</TableCell>
                                    <TableCell align="center">{d.taxper}</TableCell>
                                    <TableCell align="center">{d.dis_per}</TableCell>
                                    <TableCell align="center">{subtotal=parseFloat(d.taxable_amnt)+parseFloat(d.tax_amnt)}</TableCell>

                                </TableRow>
                               )
                              })}
                    </TableBody>
                </Table>
                </TableContainer>
            <Button type="submit" color="primary" variant="contained" style={btnStyle} >Add</Button>  
            </Form>
        </OftadehLayout>
    );
}

export default SupplierReturn;
