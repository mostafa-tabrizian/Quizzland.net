import React, { useState, useEffect } from 'react'
import { useCookies } from "react-cookie";

import axiosInstance from '../axiosApi'
import { log } from '../base'

const Notifications = (props) => {
    const [notifications, setNotifications] = useState()

    const [cookies] = useCookies(['USER_ACCESS_TOKEN']);
    
    useEffect(() => {
        cookies.USER_ACCESS_TOKEN &&
        fetchNotifications()
    }, []);

    const fetchNotifications = async () => {
        const payload = {
            access_token: cookies.USER_ACCESS_TOKEN
        }
        
        await axiosInstance.post(`/api/user/notifications`, payload)
            .then(res => {
                setNotifications(res.data)
            })
            .catch(err => {
                log(err)
                log(err.response)
            })

        return true
    }

    // const changeNotificationToHasRead = async (notificationId) => {
    //     const now = new Date()

    //     await axiosInstance.patch(`/api/notification/${notificationId}/?timestamp=${now}`,
    //         {
    //             'has_read': true
    //         }
    //     )
    // }

    const returnNotifications = () => {
        let messageType
        switch(notifications?.type) {
            case 'congrat':
                messageType = '👑'
                break
            case 'info':
                messageType = 'ℹ️'
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