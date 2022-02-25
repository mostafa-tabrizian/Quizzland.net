import axios from 'axios'
import { log } from './base'

// require('dotenv').config();

const AddView = (contentID) => {

    const adminDetail = {
        username: process.env.ADMINUSERNAME,
        password: process.env.ADMINPASSWORD,
    }
    
    let authToken
    let lastView
    let lastMonthly
    
    const getAuthToken = async () => {
        await axios.post('/api/token/obtain/', adminDetail)
            .then((req) => {
                authToken = req.data.access
            })
            .catch((err) => {
                log(err)
            })
    }

    const getLastViewCount = async () => {
        const now = new Date().getTime()
        await axios.get(`/dbAPI/quiz_new/${contentID}/?&timestamp=${now}`)
            .then((req) => {
                lastMonthly = req.data.monthly_views
                lastView = req.data.views
            })
    }

    const updateView = async () => {
        const view = {
            monthly_views: lastMonthly + 1,
            views: lastView + 1
        }
    
        const headers = {
            'Authorization': "JWT " + authToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    
        await axios.put(`/dbAPI/quiz_new/${contentID}/`, view, { headers})
    }

    getAuthToken()
        .then(() => {
            getLastViewCount()
                .then(() => {
                    updateView()
                })
        })
}
 
export default AddView;