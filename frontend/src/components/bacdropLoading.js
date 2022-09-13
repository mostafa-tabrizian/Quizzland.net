import { useState, useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { log } from './base'

const BackdropLoading = (props) => {
    const [open, setOpen] = useState(props.loadingStatue);

    useEffect(() => {
        changeBackdropStatus()
    }, [props.loadingStatue]);

    const changeBackdropStatus = () => {
        setOpen(props.loadingStatue);
    };

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <CircularProgress color="error" />
        </Backdrop>
    );
}
 
export default BackdropLoading;