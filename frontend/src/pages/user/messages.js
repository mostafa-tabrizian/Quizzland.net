import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";

import axiosInstance from '../../components/axiosAuthApi'
import { log, getTheme } from '../../components/base';

const Messages = () => {
    const [messages, setMessages] = useState()

    useEffect(() => {
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'}`
        fetchMessages()
    }, []);

    const fetchMessages = async () => {
        const now = new Date().getTime()

        await axiosInstance.get(`/api/messagesView/?timestamp=${now}`)
            .then(res => {
                setMessages(res.data)
                checkMessagesReadStatus(res.data)
            })
            .catch(err => {
                log(err)
                log(err.response)
            })

        return true
    }

    const checkMessagesReadStatus = (messages) => {
        for (const message in messages) {
            const messageData = messages[message]
            if (messageData.has_read == false) {
                updateMessageStateToRead(messageData.id)
            }
        }
    }

    const updateMessageStateToRead = async (messageId) => {
        const payload = {
            has_read: true
        }
        
        await axiosInstance.patch(`/api/messagesView/${messageId}/`, payload)
            // .then(res => log(res))
            .catch(err => log(err.response))
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
                <li className='flex shadow-[0_0_10px_#48484887] rounded-lg p-3 items-center relative'>
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

            <div className='mx-4 min-h-[30vh] md:w-[40rem] md:mx-auto'>
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