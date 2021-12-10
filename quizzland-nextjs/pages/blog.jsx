import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'
import rateLimit from 'axios-rate-limit';
import Link from 'next/link'
import Image from 'next/image'

import { log, replaceFunction, datePublishHandler } from '../components/base'
import Layout from '../components/layout'

// import Tools from './tools'
// import PageTravel from './pageTravel'
// import LoadingScreen from './loadingScreen'
// import SkeletonLoading from './skeletonLoading';

const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

const Blog = () => {
    const [blogContentData, setBlogContentData] = useState([])
    const [contentLoaded, setContentLoaded] = useState(false)

    const getBlogsFromDb = async () => {
        const contentData = await axiosLimited.get('http://localhost:8000/dbAPI/new_article/')
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
                                <Link href={`/blog/${replaceFunction(blog.title, ' ', '+')}`}>
                                    <a>
                                        <div className='blog-container'>
                                            <div className='blog-thumbnail'>
                                                <Image
                                                    src={blog.thumbnail}
                                                    width={256}
                                                    height={144}
                                                    alt={`${blog.title}`}
                                                    blurDataURL={blog.thumbnail}
                                                    placeholder='blur'
                                                />
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
                                </Link>
                            </article>
                        </li>
                        
                        <hr />
                    </div>
                )
            })
        )
    }

    
    return (
        <>
            <Layout>

                <Head>
                    <title>{`وبلاگ | ‌کوییزلند`}</title>
                    <meta name="description" content={`وبلاگ کوییزلند`} />
                    <meta name="keywords" content={`وبلاگ`} />
                </Head>
                
                <h3 className='lowTitle'>Quizzland Blog</h3>
                <h3 className='title'>وبلاگ کوییزلند</h3>

                {/* <Tools
                    numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                    sortType={sortType} setSortType={setSortType}
                /> */}

                {
                    !(contentLoaded) &&
                    <ul className={`quizContainer flex wrapper-med`}>
                        <li className='skeletonLoading skeletonLoading__blog'></li>
                        <li className='skeletonLoading skeletonLoading__blog'></li>
                        <li className='skeletonLoading skeletonLoading__blog'></li>
                    </ul>
                }

                <ul className="blog quizContainer__minHeight wrapper-med">
                    {blogContent()}
                </ul>

                {/* <PageTravel
                    pageTravel={pageTravel} setPageTravel={setPageTravel}
                    numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                    offset={offset} setOffset={setOffset}
                /> */}

            </Layout>

        </>
    );
}
 
export default Blog;