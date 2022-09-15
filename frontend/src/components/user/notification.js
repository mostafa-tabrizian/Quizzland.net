import React, { useState, useEffect } from 'react'

import axiosInstance from '../axiosAuthApi'
import { log } from '../base'

const Notifications = (props) => {
    const [notifications, setNotifications] = useState()
    
    useEffect(() => {
        fetchNotifications()
    }, []);

    const fetchNotifications = async () => {
        await axiosInstance.get(`/api/notificationView/`)
            .then(res => {
                setNotifications(res.data[0])
            })
            .catch(err => {
                log(err)
                log(err.response)
            })

        return true
    }

    const returnNotifications = () => {
        let messageType
        switch(notifications?.type) {
            case 'congrat':
                messageType = '👑'
                break
            case 'info':
                messageType = 'ℹ'
                break
            case 'warning':
                messageType = '⚠️'
                break
        }

        return (
            <div className='flex'>
                <div className='ml-1'>{messageType}</div>
                <p className='text-sm'>
                    {notifications?.message}
                </p>
            </div>
        )
    }

    return (
        <React.Fragment>
            {
                notifications == 'False' ?
                <p className='text-sm'>
                    هیچ اطلاعیه ای ندارید
                </p>
                :
                returnNotifications()
            }
        </React.Fragment>
    );
}
 
export default Notifications;