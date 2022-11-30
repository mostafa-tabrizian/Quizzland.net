import axios from '../components/axiosApi';
import { log } from './base'

const AddView = (content, contentID) => {
    let lastView
    let lastMonthly

    const getLastViewCount = async () => {
        const now = new Date().getTime()
        await axios.get(`/api/${content}/${contentID}/?timestamp=${now}`)
            .then((res) => {
                lastMonthly = res.data.monthly_views
                lastView = res.data.views
            })
    }

    const updateView = async () => {
        const view = {
            monthly_views: lastMonthly + 1,
            views: lastView + 1
        }

        await axios.put(`/api/${content}/${contentID}/`, view)
            .then(res => {
                // log(res)
            })
            .catch(err => {
                log(err)
                log(err.response)
            })
    }

    getLastViewCount()
        .then(() => {
            updateView()
        })
}

export default AddView;