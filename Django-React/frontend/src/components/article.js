import React, { useEffect, useState } from 'react'

import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import axios from 'axios'

import {InlineReactionButtons, InlineShareButtons, StickyShareButtons} from 'sharethis-reactjs';

import { log, replaceFunction, makeDatePublishFormatForQuizDetail } from './base'

import LoadingScreen from '../components/loadingScreen'
import Header from '../components/header'

const logo = '/static/img/Q-small.png'



const Article = (props) => {
    const [article, setArticle] = useState([])
    const [loadState, setLoadState] = useState(false)

    const getBlogContentFromDb = async () => {
        const contentTitle = props.match.params.title
        const contentData = await axios.get(`/api/new_blog/?title__iexact=${contentTitle}&limit=1`)
        setArticle(contentData.data.results[0])
        setLoadState(true)
    }

    useEffect(async () => {
        getBlogContentFromDb()
    }, [])

    const currentUrl = () => {
        if (article.title) {
            return `https://www.quizzland.net/blog/${replaceFunction(article.title, ' ', '+')}`
        }
    }

    const description = () => {
        if (article.content) {
            return article.content.split('\n')[0].slice(3, -5)
        }
    }

    return (
        <React.Fragment>
            
            <LoadingScreen loadState={loadState} />

            <Header />

            {article &&
                <Helmet>
                    <link rel="canonical" href={currentUrl()} />
                    
                    <title>{`کوییزلند | ${article.title}`}</title>
                    <meta name="description" content={description()} />
                    <meta name="keywords" content="کوییزلند" />
                    <meta name="msapplication-TileImage" content={article.thumbnail} />
                    <meta property="og:site_name" content="کوییزلند" />
                    <meta property="og:title" content={article.title} />
                    <meta property="og:description" content={description()} />
                    <meta property="og:image" content={article.thumbnail} />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="300" />
                    <meta property="og:image:height" content="300" />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={currentUrl()} />

                    <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": "${article.title}",
                            "image": [
                                "${article.thumbnail}",
                            ],
                            "datePublished": "${article.publish}",
                            "dateModified": "${article.publish}",
                            "author": {
                                "@type": "Person",
                                "name": "مصطفی تبریزیان",
                                "url": "https://www.quizzland.net/contact"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "کوییزلند",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://www.quizzland.net${logo}"
                                }
                            }
                        }
                    `}
                    </script>
                </Helmet>
            }

            <div className='article wrapper-med text-center'>
                <h1>
                    {article.title}
                </h1>

                <h5 className='article-publish'>
                    {makeDatePublishFormatForQuizDetail(article.publish)}
                </h5>

                <div className='wrapper-p'
                    dangerouslySetInnerHTML={{
                        __html: article.content
                    }}>
                </div>

                {
                    article.title &&
                    <div className='space-med'>
                        <h5 className='wrapper-sm'>
                            اگه فکر میکنید این مقاله میتونه برای یکی از دوستات جالب و مفید باشه ممنون میشیم براشون بفرستی
                        </h5>

                        <div>
                            <InlineShareButtons
                                config={{
                                    alignment: 'center', 
                                    color: 'social',     
                                    enabled: true,       
                                    font_size: 16,       
                                    labels: 'null',       
                                    language: 'en',      
                                    networks: [          
                                        'whatsapp',
                                        'telegram',
                                        'twitter',
                                        'sharethis',
                                    ],
                                    padding: 10,         
                                    radius: 10,           
                                    show_total: false,
                                    size: 45,            

                                
                                    url: currentUrl(),
                                    image: article.thumbnail, 
                                    title: article.title,           
                                }}
                            />
                        </div>

                        <h5 className='space-sm'>
                            و نظرت رو برامون بزاری
                        </h5>

                        <div>
                            <InlineReactionButtons
                                config={{
                                    alignment: 'center', 
                                    enabled: true,       
                                    language: 'en',      
                                    min_count: 0,        
                                    padding: 12,         
                                    reactions: [         
                                        'slight_smile',
                                        'heart_eyes',
                                        'laughing',
                                        'astonished',
                                        'sob',
                                        'rage'
                                    ],
                                    size: 45,            
                                    spacing: 8,          

                            
                                url: currentUrl(),
                                image: article.thumbnail, 
                                title: article.title,           
                                }}
                            />
                        </div>
                            
                        <div>
                            <StickyShareButtons
                                config={{
                                    alignment: 'left',   
                                    color: 'social',     
                                    enabled: true,       
                                    font_size: 16,       
                                    hide_desktop: false, 
                                    labels: 'counts',    
                                    language: 'en',      
                                    min_count: 10,        
                                    networks: [          
                                        'whatsapp',
                                        'telegram',
                                        'twitter',
                                        'sms',
                                        'sharethis',
                                    ],
                                    padding: 12,         
                                    radius: 15,           
                                    show_total: true,    
                                    show_mobile: true,   
                                    show_toggle: false,   
                                    size: 48,            
                                    top: 250,            
                                    url: currentUrl()
                                }}
                            />
                        </div>
                    </div>
                }

                {/* <div>
                    Suggestions
                </div> */}
            </div>
            

        </React.Fragment>
    );
}
 
export default Article;