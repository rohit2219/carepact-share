import mongoose from 'mongoose'


  const pro_details = mongoose.Schema(
    {
      name: {
          type: String,
          required: true,
           },
      address: {
        type: String,
        required: true,
               },
       email: {
      type: String,
      required: true,
            },
      contact: {
      type: String,
      required: true,
           },         
    },
    
  )
  
  const Sample = mongoose.model('store', pro_details)
  
  export default Sample
  