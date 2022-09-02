import React, { useState, useEffect } from "react";
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link, Typography, Button, Grid, Fab} from '@material-ui/core';


const ItemView= () => {
    const StyledTableCell = withStyles((theme) => ({
        head: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        body: {
          fontSize: 14,
        },
      }))(TableCell);
      
    const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }))(TableRow);
    const useStyles = makeStyles({
                table: {
                minWidth: 700,
                },
                mb3: {
                    margin: "1.3rem 0"
                },
                
                
            });
      
    const classes = useStyles();
    return (
        <OftadehLayout>
            <Typography component="h1" variant="h5" className={classes.mb3} >Item View</Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Sl No</StyledTableCell>
                            <StyledTableCell align="center">Product</StyledTableCell>
                            <StyledTableCell align="center">Category</StyledTableCell>
                            <StyledTableCell align="center">Uom</StyledTableCell>                          
                            <StyledTableCell align="center">Mrp</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    </Table>
            </TableContainer>
        </OftadehLayout>
    );
}

export default ItemView;
