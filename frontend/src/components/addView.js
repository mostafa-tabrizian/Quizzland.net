import axios from 'axios'
import { log } from './base'

const AddView = (content, contentID) => {
    let lastView
    let lastMonthly

    const getLastViewCount = async () => {
        const now = new Date().getTime()
        await axios.get(`/api/${content}/${contentID}/?timestamp=${now}`)
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

        await axios.put(`/api/${content}/${contentID}/`, view)
    }

    getLastViewCount()
        .then(() => {
            updateView()
        })
}

export default AddView;