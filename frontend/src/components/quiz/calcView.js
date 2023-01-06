import axios from "../axiosApi"
import { log } from '../base'

const calcView = async (range) => {
    const now = new Date().getTime()
    return await axios.get(`/api/calcView?timestamp=${now}&dateRange=${range}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            log(err)
            log(err.response)
        })
}

export default calcView