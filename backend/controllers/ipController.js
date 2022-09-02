import ip from 'ip'
const getIpAddress = (req, res) => {

            const ipAdd = ip.address();

        if (ipAdd) {
            res.json(ipAdd)
        } else if (err) {
            res.status(404).json({ Mess: 'IpAddress not found' })
        }
}


export {

    getIpAddress
}