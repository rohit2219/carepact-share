import axios from 'axios'
import React,{useRef,useState,useEffect} from 'react'
import OftadehLayout from "../../components/OftadehLayout/OftadehLayout";
import { makeStyles } from "@material-ui/core/styles";
import { Grid,Button} from '@material-ui/core'
import BackupIcon from '@material-ui/icons/Backup';
import RestoreIcon from '@material-ui/icons/Restore';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import fileDownload from 'js-file-download';
import moment from 'moment'

const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
      borderRadius: "5em"
    },
    input: {
        display: "none"
    }
}));


const Backup = (props) => {
    
    const classes = useStyles();
    // const inputFile = useRef(null) 
    const [open, setOpen] =  useState(false);
    const [file, setFile] = useState(null)

const handleUpload = e => {
    const tempfile = e.target.files[0]
    setFile(tempfile)    
}

const handlerestore = e => {
if(file!==null){
    e.preventDefault();
        const formData = new FormData()
        formData.append('restorefile',file )
    try {
    axios.post(
        'http://localhost:5000/api/Dbfunction/restore',
        formData
    ).then(response => {
        alert(response.data.message)
        setOpen(false);
    })
    } catch (error) {
        console.log(error);
    }
  }
}


    
const handlebackup=async(e)=>{
  const date=moment().format("dddd MMMM Do YYYY h-mm-ss a").toString()
   const filename=`DistScanning_DB_backup${date}.gzip`

   await axios({
        url: "http://localhost:5000/api/Dbfunction/backup",
        method: "GET",
        responseType:"blob"
      }).then((response) => {
        console.log(response.status)
        if(response.status===200){
          alert("DB Backup success ")
          fileDownload(response.data,filename)
        }
      });
}


// pop close
const handleClose = (value) => {
    setOpen(false);
};
const handleOpen = (value) => {
    setOpen(true);
};
    return (
        <OftadehLayout>
            <h1>DB Backup/Restore</h1>

     <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Select Restore File</DialogTitle>
          <div style={{padding:"1.2rem",margin:"1rem"}}>
          <form autocomplete="off" onSubmit={handlerestore}> 
            <input type="file" id="folder" name="restorefile"  onChange={(e)=>handleUpload(e)} />
            <Button type="submit" color="secondary" variant="contained">Restore</Button>
          </form> 
          </div>   
     </Dialog>
             <Grid
                container
                spacing={0}
                direction="row"
                alignItems="center"
                style={{ minHeight: '90vh' }}

                >

                <Grid item xs={6}
                item
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{ minHeight: '30vh' }}
                >
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                    >
                        <Button variant="contained" size="large" color="primary"
                         className={classes.button}  onClick={()=>handlebackup()}
                         style={{ minHeight: '10vh',minWidth:'15rem' }}>
                        Backup   <BackupIcon style={{margin:"10px"}} />
                        </Button>
                        <h4>Take Backup</h4>
                    
                   </Grid>   
                </Grid>   

                <Grid item xs={6}
                item
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{ minHeight: '30vh' }}
                >
                     <Grid
                     container
                     direction="column"
                     alignItems="center"
                     >
                       <Button variant="contained" size="large" color="secondary"
                        className={classes.button} onClick={()=>handleOpen()}
                         style={{ minHeight: '10vh',minWidth:'15rem' }} >
                          Restore <RestoreIcon style={{margin:"10px"}}/>
                        </Button>
                        <h4>Restore Backup</h4>
                   </Grid>   
                </Grid>   
                
                </Grid> 
       </OftadehLayout>
 )

}

export default Backup