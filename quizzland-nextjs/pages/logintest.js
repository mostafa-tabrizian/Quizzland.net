import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useSelector, useDispatch } from 'react-redux'
import { register } from '../actions/auth'

import BackBtn from '../components/backBtn'
import Layout from '../components/layout'

const pathRed = '../images/bubbles.png'

const PrivacyPolicy = () => {

    useEffect(() => {
        document.querySelector('html').style=`background: #0a0d13 url(${pathRed}) center center scroll !important`
    }, [])

    const dispatch = useDispatch()
    const register_success = useSelector(state => state.auth.register_success)
    const loading = useSelector(state => state.auth.loading)

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '', 
        username: '',
        password: '',
        re_password: ''
    })
    
    const {
        first_name,
        last_name,
        username,
        password,
        re_password,
    } = formData

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value })

    const onSubmit = e => {
        e.preventDefault()

        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(register(first_name, last_name, username, password, re_password))
        }
    }

    return (
        <>
            <Layout>
                <Head>
                    <title>حریم خصوصی | کوییزلند</title>
                    <meta name="description" content="حریم خصوصی در کوییزلند" />
                    <meta name="keywords" content="حریم خصوصی, کوییزلند" />
                </Head>

                <div>
                    <h1>Content Data</h1>
                    <div>
                        <p>
                            {/* {
                                quizzes
                            } */}
                        </p>
                    </div>
                </div>

                <div>
                    <h1>Register</h1>
                    <form onSubmit={onSubmit}>
                        <input type="text" name='first_name' placeholder='first_name' onChange={onChange} value={first_name} required />
                        <input type="text" name='last_name' placeholder='last_name' onChange={onChange} value={last_name} required />
                        <input type="text" name='username' placeholder='username' onChange={onChange} value={username} required />
                        <input type="text" name='password' placeholder='password' onChange={onChange} value={password} required />
                        <input type="text" name='re_password' placeholder='re_password' onChange={onChange} value={re_password} required />
                        <button type="submit"> Submit </button>
                    </form>
                </div>

            </Layout>
        </>
    );
}
 
export default PrivacyPolicy;