import React, { useEffect, useState } from 'react'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import Head from 'next/head'
import { useRouter } from 'next/router'
// import {InlineReactionButtons, InlineShareButtons, StickyShareButtons} from 'sharethis-reactjs';

import { log, replaceFunction, makeDatePublishFormatForQuizDetail } from '../../components/base'
import Layout from '../../components/layout'

// import LoadingScreen from './loadingScreen'

const logo = '../images/Q-small.png'

const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })
const API_URL = process.env.NEXT_PUBLIC_API_URL

const Article = () => {
    const router = useRouter()
    const { articleTitle } = router.query

    const [article, setArticle] = useState(null)
    const [loadState, setLoadState] = useState(false)

    const getArticleContentFromDb = async () => {
        await axiosLimited.get(`${API_URL}/dbAPI/blog_new/?title__iexact=${articleTitle}&limit=1`).then((res) => {
            setArticle(res.data.results[0])
            setArticle(res.data.results[0])
        })
        // setLoadState(true)
    }

    useEffect(() => {
        getArticleContentFromDb()
    }, [articleTitle])

    const currentUrl = () => {
        return `https://www.quizzland.net/blog/${replaceFunction(article.title, ' ', '+')}`
    }

    const description = () => {
        return article.content.split('\n')[0].slice(3, -5)
    }

    return (
        <>
            <Layout>
                
                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <link rel="canonical" href={article && currentUrl()} />
                    
                    <title>{`کوییزلند | ${article && article.title}`}</title>
                    <meta name="description" content={article && description()} />
                    <meta name="keywords" content="کوییزلند" />
                    <meta name="msapplication-TileImage" content={article && article.thumbnail} />
                    <meta property="og:site_name" content="کوییزلند" />
                    <meta property="og:title" content={article && article.title} />
                    <meta property="og:description" content={article && description()} />
                    <meta property="og:image" content={article && article.thumbnail} />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="300" />
                    <meta property="og:image:height" content="300" />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={article && currentUrl()} />

                    <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": "${article && article.title}",
                            "image": [
                                "${article && article.thumbnail}",
                            ],
                            "datePublished": "${article && article.publish}",
                            "dateModified": "${article && article.publish}",
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
                </Head>

                <div className='article wrapper-med tx-al-c'>
                    <h1>
                        {articleTitle && replaceFunction(articleTitle, '+' , ' ')}
                    </h1>

                    <h5 className='article-publish'>
                        {makeDatePublishFormatForQuizDetail(article && article.publish)}
                    </h5>

                    <div className='wrapper-p'
                        dangerouslySetInnerHTML={{
                            __html: article && article.content
                        }}>
                    </div>

                    <div className='space-med'>
                        <h5 className='wrapper-sm'>
                            اگه فکر میکنید این مقاله میتونه برای یکی از دوستات جالب و مفید باشه ممنون میشیم براشون بفرستی
                        </h5>

                        {/* <div>
                            <InlineShareButtons
                                config={{
                                    alignment: 'center',  // alignment of buttons (left, center, right)
                                    color: 'social',      // set the color of buttons (social, white)
                                    enabled: true,        // show/hide buttons (true, false)
                                    font_size: 16,        // font size for the buttons
                                    labels: 'null',        // button labels (cta, counts, null)
                                    language: 'en',       // which language to use (see LANGUAGES)
                                    networks: [           // which networks to include (see SHARING NETWORKS)
                                        'whatsapp',
                                        'telegram',
                                        'twitter',
                                        'sharethis',
                                    ],
                                    padding: 10,          // padding within buttons (INTEGER)
                                    radius: 10,            // the corner radius on each button (INTEGER)
                                    show_total: false,
                                    size: 45,             // the size of each button (INTEGER)

                                    // OPTIONAL PARAMETERS
                                    url: article && currentUrl(),
                                    image: article && article.thumbnail,  // (defaults to og:image or twitter:image)
                                    title: article && article.title,            // (defaults to og:title or twitter:title)
                                }}
                            />
                        </div> */}

                        <div className="sharethis-inline-share-buttons"></div>

                        <h5 className='space-sm'>
                            و نظرت رو برامون بزاری
                        </h5>

                        {/* <div>
                            <InlineReactionButtons
                                config={{
                                    alignment: 'center',  // alignment of buttons (left, center, right)
                                    enabled: true,        // show/hide buttons (true, false)
                                    language: 'en',       // which language to use (see LANGUAGES)
                                    min_count: 0,         // hide react counts less than min_count (INTEGER)
                                    padding: 12,          // padding within buttons (INTEGER)
                                    reactions: [          // which reactions to include (see REACTIONS)
                                        'slight_smile',
                                        'heart_eyes',
                                        'laughing',
                                        'astonished',
                                        'sob',
                                        'rage'
                                    ],
                                    size: 45,             // the size of each button (INTEGER)
                                    spacing: 8,           // the spacing between buttons (INTEGER)

                                // OPTIONAL PARAMETERS
                                url: article && currentUrl(),
                                image: article && article.thumbnail,  // (defaults to og:image or twitter:image)
                                title: article && article.title,            // (defaults to og:title or twitter:title)
                                }}
                            />
                        </div>
                            
                        <div>
                            <StickyShareButtons
                                config={{
                                    alignment: 'left',    // alignment of buttons (left, right)
                                    color: 'social',      // set the color of buttons (social, white)
                                    enabled: true,        // show/hide buttons (true, false)
                                    font_size: 16,        // font size for the buttons
                                    hide_desktop: false,  // hide buttons on desktop (true, false)
                                    labels: 'counts',     // button labels (cta, counts, null)
                                    language: 'en',       // which language to use (see LANGUAGES)
                                    min_count: 10,         // hide react counts less than min_count (INTEGER)
                                    networks: [           // which networks to include (see SHARING NETWORKS)
                                        'whatsapp',
                                        'telegram',
                                        'twitter',
                                        'sms',
                                        'sharethis',
                                    ],
                                    padding: 12,          // padding within buttons (INTEGER)
                                    radius: 15,            // the corner radius on each button (INTEGER)
                                    show_total: true,     // show/hide the total share count (true, false)
                                    show_mobile: true,    // show/hide the buttons on mobile (true, false)
                                    show_toggle: false,    // show/hide the toggle buttons (true, false)
                                    size: 48,             // the size of each button (INTEGER)
                                    top: 250,             // offset in pixels from the top of the page
                                    url: article && currentUrl()
                                }}
                            />
                        </div> */}
                    </div>

                    {/* <div>
                        Suggestions
                    </div> */}
                </div>
                
            </Layout>
        </>
    );
}
 
export default Article;