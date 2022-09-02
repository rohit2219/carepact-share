import React, { useEffect, useState } from 'react'

/**
* @author
* @function IpAddress
**/

const IpAddress = (props) => {
    const [serverIp, setServerIP] = useState(null);

    useEffect(() => {
        serverIpAddress()
    }, [])
    
    
    const serverIpAddress =()=>{
        fetch("http://localhost:5000/api/ipadd/ipaddress")
        .then(response => response.json())
        .then(data => {
            setServerIP(data)
            console.log("server IPPPPPPPPPPPPPPP",data)
        })

    }
  return(
    <>
           Server IP :  {serverIp}
    </>
   )

 }

export default IpAddress






// 

// import React, { useEffect, useState } from 'react'

// /**
// * @author
// * @function IpAddress
// **/

// const IpAddress = (props) => {
//     const [details, setDetails] = useState(null);

//     useEffect(() => {
//         IpAddress()
//     }, [])
//     const IpAddress =()=>{
//         fetch("https://geolocation-db.com/json/e4f42070-ad2d-11eb-adf1-cf51da9b3410")
//         .then(response => response.json())
//         .then(data => setDetails(data))
//     }
//   return(
//     <>
//      {details && <p className="m-3">IP Address {details.IPv4}</p>   }
        
//     </>
//    )

//  }

// export default IpAddress