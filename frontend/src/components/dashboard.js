import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import Header from './header'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import { ProfileDetail } from './profileChecker'

const axiosLimited = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 150 })

const pathRed = '/static/img/bubbles.png'

const PrivacyPolicy = () => {
    const [profileDetail, setProfileDetail] = useState(null)

    useEffect(() => {
        const userDetaInPromise = ProfileDetail()
        userDetaInPromise.then((x) => {
            setProfileDetail(x)
        })

        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>
            
            <Header linkType='Link'/>

            <Helmet>
                <title>پروفایل | کوییزلند</title>
                <meta name="description" content="پروفایل شما در کوییزلند" />
                <meta name="keywords" content="پروفایل, کوییزلند" />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="dashboard wrapper-med">
                <div className="flex flex-ai-c">
                    <div className='dashboard_profile'>
                        <img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" />
                    </div>
                    <div>
                        <div className='flex flex-ai-c'>
                            <div>
                                <h1>
                                    {profileDetail && profileDetail.username}
                                </h1>
                            </div>
                            <div className='dashboard_points'>
                                <h1>
                                    امتیاز: ‌‌ {profileDetail && profileDetail.points} 
                                </h1>
                            </div>
                        </div>
                        <div className='space-sm'>
                            Joined  Posts   Comments
                        </div>
                    </div>
                </div>
                
                <h4>کتگوری های مورد علاقه</h4>
                <div>
                    <div>
                        <ul className='flex flex-jc-c flex-ai-c'>
                            <li><img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" /></li>
                            <li><img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" /></li>
                            <li><img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" /></li>
                            <li><img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" /></li>
                            <li><img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" /></li>
                        </ul>
                    </div>
                </div>

                <h4>کوییز های لایک شده</h4>
                <div>
                    <div>
                        <ul className='flex flex-jc-c flex-ai-c'>
                            <li><img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" /></li>
                            <li><img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" /></li>
                            <li><img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" /></li>
                            <li><img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" /></li>
                            <li><img src="https://s3.ir-thr-at1.arvanstorage.com/quizzland2/defaultAvatar.jpg?AWSAccessKeyId=006922c8-9ee1-49cb-9c5d-176af3147366&Signature=7jImYnwyr2mehnXtvgQ%2BaPupEjk%3D&Expires=1637935924" alt="" /></li>
                        </ul>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}
 
export default PrivacyPolicy;