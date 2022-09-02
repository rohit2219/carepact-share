import React from 'react'
import { DistCarepactLog } from '../../components/Logs/DistCarepactLog';
import OftadehLayout from '../../components/OftadehLayout/OftadehLayout';

/**
* @author
* @function LogPage
**/

export const DistCarepactLogPage = (props) => {
  return(
    <>
    <OftadehLayout>
        <DistCarepactLog/>
        {/* <CusomerLog/> */}
    </OftadehLayout>
       
    
    </>
   )

 }