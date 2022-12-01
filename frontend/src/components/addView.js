import axios from '../components/axiosApi';
import { log } from './base'

const AddView = (content, contentID) => {

    const updateView = async () => {
        const payload = {
            type: content,
            id: contentID
        }
        await axios.post(`/api/add_view`, payload)
            .then((res) => {
                log(res)
            })
    }
    
    updateView()
}

export default AddView;