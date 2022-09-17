import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";

import axiosInstance from '../../components/axiosAuthApi'
import { log } from '../../components/base';

const Messages = () => {
    const [messages, setMessages] = useState()

    useEffect(() => {
        fetchMessages()
    }, []);

    const fetchMessages = async () => {
        const now = new Date().getTime()

        await axiosInstance.get(`/api/messagesView/?timestamp=${now}`)
            .then(res => {
                log(res.data)
                setMessages(res.data)
            })
            .catch(err => {
                log(err)
                log(err.response)
            })

        return true
    }

    const returnNotifications = () => {
        return messages?.map((message) => {
            let messageType
            switch(message?.type) {
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
                <li className='flex shadow-[0_0_10px_#484848] rounded-lg p-3 items-center relative'>
                    <div className='ml-1 text-2xl'>{messageType}</div>
                    <p className='text-sm'>
                        {message?.message}
                    </p>
                    <div className='absolute right-[-.25rem] top-[-.25rem]'>
                        <div className={`${!message?.has_read && 'bg-yellow-400'} w-3 h-3 rounded-full animate-ping absolute`}></div>
                        <div className={`${!message?.has_read && 'bg-yellow-400'} w-3 h-3 rounded-full`}></div>
                    </div>
                </li>
            )
        })
    }

    return (
        <React.Fragment>

            <Helmet>
                <title>پیام ها | کوییزلند</title>
                <meta name="description" content="پیام های شما" />
            </Helmet>

            <h1 className='mt-5 mb-8 text-center title'>پیام های شما</h1>

            <div className='mx-4 min-h-[30vh]'>
                {
                    messages == 'False' ?
                    <p className='text-sm'>
                        هیچ اطلاعیه ای ندارید
                    </p>
                    :
                    <ul className='space-y-5'>
                        {returnNotifications()}
                    </ul>
                }
            </div>

        </React.Fragment>
    );
}
 
export default Messages;