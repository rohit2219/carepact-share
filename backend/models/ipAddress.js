import mongoose from 'mongoose'

const ipAddressSchema = mongoose.Schema({
        ipaddress: { type: String, unique: true }
    }

)

const IpAddress = mongoose.model('ipaddress', ipAddressSchema)

export default IpAddress