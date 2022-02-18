import React, { useEffect } from 'react'
import Head from 'next/head'

import Layout from '../components/layout'

const owlPage = '../images/owlPage.webp'

const WelcomePage = () => {
    
    useEffect(() => {
        document.querySelector('body').style = `
        background: url('${owlPage}');
        background-position: center center;
        background-size: contain !important;
        background-attachment: fixed;
    `
    }, []);
    
    return (
        <>
            <Layout>
                <Head>
                    <meta name="robots" content="noindex" />
                </Head>

                <div style={{marginBottom: '80rem'}}></div>
            </Layout>
        </>
    );
}
 
export default WelcomePage;