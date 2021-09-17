import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Helmet } from "react-helmet";
import rateLimit from 'axios-rate-limit';
import { Link } from 'react-router-dom'

import { log, replaceFunction, datePublishHandler } from './base'

// import Tools from './tools'
// import PageTravel from './pageTravel'
import Header from './hotHeader'
import LoadingScreen from './loadingScreen'
import SkeletonLoading from './skeletonLoading';

const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

const Blog = (props) => {
    const [blogContentData, setBlogContentData] = useState([])
    const [contentLoaded, setContentLoaded] = useState(false)

    const getBlogsFromDb = async () => {
        const contentData = await axiosLimited.get('/dbAPI/new_blog/')
        setBlogContentData(contentData.data)
    }

    useEffect(async () => {
        getBlogsFromDb()
        setContentLoaded(true)
    }, [])

    const blogContent = () => {
        return (
            blogContentData.map((blog) => {
                return (
                    <div>
                        <li className='space-sm'>
                            <article>
                                <a href={`/blog/${replaceFunction(blog.title, ' ', '+')}`}>
                                    <div className='blog-container'>
                                        <div className='blog-thumbnail'>
                                            <img src="https://media.vanityfair.com/photos/602c3ebab3de5e8d0957c44f/master/pass/VF1421_Taylor_Swift_Tout.jpg" alt="" />
                                        </div>
                                        <div>
                                            <h2 className="blog-title">
                                                {blog.title}
                                            </h2>
                                            <h5 className='blog-publish'>
                                                {datePublishHandler(blog.publish)}
                                            </h5>
                                            <div className='blog-brief'
                                                dangerouslySetInnerHTML={{
                                                    __html: blog.content.split('\n')[0]
                                                }}>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </article>
                        </li>
                        
                        <hr />
                    </div>
                )
            })
        )
    }

    
    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>{`وبلاگ | ‌کوییزلند`}</title>
                <meta name="description" content={`وبلاگ کوییزلند`} />
                <meta name="keywords" content={`وبلاگ`} />
            </Helmet>
            
            <h3 className='lowTitle'>Quizzland Blog</h3>
            <h3 className='title'>وبلاگ کوییزلند</h3>

            {/* <Tools
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                sortType={sortType} setSortType={setSortType}
            /> */}

            <ul className={`quizContainer flex wrapper-med ${contentLoaded ? 'noVis' : ''}`}>
                <li className='skeletonLoading skeletonLoading__blog'></li>
                <li className='skeletonLoading skeletonLoading__blog'></li>
                <li className='skeletonLoading skeletonLoading__blog'></li>
            </ul>

            <ul className="blog quizContainer__minHeight wrapper-med">
                {blogContent()}
            </ul>

            {/* <PageTravel
                pageTravel={pageTravel} setPageTravel={setPageTravel}
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                offset={offset} setOffset={setOffset}
            /> */}

        </React.Fragment>
    );
}
 
export default Blog;