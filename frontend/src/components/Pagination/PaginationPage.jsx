import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Fab } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  Button :{
    margin:50,
    marginTop:30,
    padding :15,
    fontSize: 18
  },
  fabButton :{
    margin:50,
    marginTop:30,
    padding :30,
    fontSize:18
  },
  flexItem :{
    justifyContent: 'space-between',
    padding: 0,
    margin: 0,
    listStyle: 'none',
    display: 'flex'
  },
  
}));



const PaginationPage = ({showPerPage,onPaginationChange, listLength, changeRowsNo}) => {

    const[counter, setCounter] = React.useState(1)
    const classes = useStyles(); 

     const [start, setStart] = React.useState(0);
     const [end, setEnd] = React.useState(10);
     const [totalPage, setTotalPage] = React.useState(10);


    useEffect(()=>{
      // console.log("counter",counter)
      const value = showPerPage * counter
      // console.log("start value", value-showPerPage)
      // console.log("start value", value);
      setStart(value-showPerPage);
      setEnd(value)
      onPaginationChange(value-showPerPage,value)
      // changeRowsNo(age)
    },[counter])

    const onButtonClick = (type) =>{
      if(type === "prev"){
        if(counter ===1)
        {
          setCounter(1)
        }
        else {
          setCounter(counter-1)
        }
      }
      else if(type === "next"){
        if(Math.ceil(listLength/showPerPage)===counter)
        {
          setCounter(counter)
        }
        else {
          setCounter(counter+1)
        }
      }
    }

   
// console.log(props.showPerPage)
  return(
    <>


<div className={classes.flexItem}>


    

     <Button variant="contained" color="primary"
     
     className={classes.Button}
     onClick={()=>
      onButtonClick("prev")
      // setCounter(counter-1) 
    }
     >
  Prev
</Button>
    <Fab size="large" color="transparent" variant="extended" className={classes.fabButton}>
          {`${start+1} - ${end} of ${listLength}`}
    </Fab>
     

<Button className={classes.Button} variant="contained" color="primary"
 onClick={()=>
  onButtonClick("next")
//  setCounter(counter+1)
 }
>
  next
</Button>

</div>
</>
   )
  }


export default PaginationPage