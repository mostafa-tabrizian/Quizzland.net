import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";

import axiosInstance from '../axiosApi'
import { log, replaceFunction } from '../base'

const Notifications = (props) => {
    const [notifications, setNotifications] = useState()

    useEffect(() => {
        fetchNotifications()
    }, []);

    const fetchNotifications = async () => {
        const now = new Date()

        await axiosInstance.get(`/api/notification/?user=${props.user}&has_read=false&timestamp=${now}`)
            .then(res => {
                setNotifications(res.data.reverse()[0])
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
                notifications ?
                returnNotifications()
                :
                <p className='text-sm'>
                    هیچ اطلاعیه ای ندارید
                </p>
            }
        </React.Fragment>
    );
}
 
export default Notifications;