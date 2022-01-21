import React, { useState, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head'
import { saveAs } from 'file-saver'
import { sha256 } from 'js-sha256'

import { log } from '../components/base'
import Layout from '../components/layout'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const QuizMonthlyRecord = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState(null)
    const passwordInput = useRef(null)

    const getAllQuizzes = async () => {
        const quizzes = await axios.get(`${API_URL}/dbAPI/quiz_new/`)
        quizDataSaveInExcel(quizzes)
    }

    const getAllPointyQuizzes = async () => {
        const pointyQuizzes = await axios.get(`${API_URL}/dbAPI/pointy_new/`)
        pointyQuizDataSaveInExcel(pointyQuizzes)
    }
    
    const getAllCategories = async () => {
        const categories = await axios.get(`${API_URL}/dbAPI/category_new/`)
        categoryDataSaveInExcel(categories)
    }

    const getAllBlogs = async () => {
        const blogs = await axios.get(`${API_URL}/dbAPI/new_blog/`)
        blogDataSaveInExcel(blogs)
    }

    
    const quizDataSaveInExcel = async (quizzes) => {
        const Excel = require('exceljs')
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Quizzland-Record(Quizzes)");

        worksheet.columns = [
            {header: 'Id', key: 'id', width: 5},
            {header: 'Title', key: 'title', width: 30}, 
            {header: 'Views', key: 'views', width: 10},
            {header: 'Monthly_views', key: 'monthly_views', width: 10},
            {header: 'Publish', key: 'publish', width: 35}
        ];
        
        quizzes.data.forEach(quiz => {
            if (quiz.monthly_views !== 0) {
                return worksheet.addRow({
                    id: quiz.id,
                    title: quiz.title,
                    views: quiz.views,
                    monthly_views: quiz.monthly_views,
                    publish: quiz.publish
                });
            }
        })
        
        const date = new Date();
        const xls64 = await workbook.xlsx.writeBuffer({ base64: true })
        saveAs(
            new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            `${date.getMonth()}-${date.getFullYear()}-quiz`
        )
    }

    const pointyQuizDataSaveInExcel = async (quizzes) => {
        const Excel = require('exceljs')
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Quizzland-Record(Pointies)");

        worksheet.columns = [
            {header: 'Id', key: 'id', width: 5},
            {header: 'Title', key: 'title', width: 30}, 
            {header: 'Views', key: 'views', width: 10},
            {header: 'Monthly_views', key: 'monthly_views', width: 10},
            {header: 'Publish', key: 'publish', width: 35}
        ];
        
        quizzes.data.forEach(quiz => {
            if (quiz.monthly_views !== 0) {
                return worksheet.addRow({
                    id: quiz.id,
                    title: quiz.title,
                    views: quiz.views,
                    monthly_views: quiz.monthly_views,
                    publish: quiz.publish
                });
            }
        })
        
        const date = new Date();
        const xls64 = await workbook.xlsx.writeBuffer({ base64: true })
        saveAs(
            new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            `${date.getMonth()}-${date.getFullYear()}-pointy`
        )
    }

    const categoryDataSaveInExcel = async (categories) => {
        const Excel = require('exceljs')
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Quizzland-Record(Categories)");

        worksheet.columns = [
            {header: 'Id', key: 'id', width: 5},
            {header: 'Title', key: 'title', width: 30}, 
            {header: 'subCategory', key: 'subCategory', width: 30}, 
            {header: 'Views', key: 'views', width: 10},
            {header: 'Monthly_views', key: 'monthly_views', width: 10},
            {header: 'Publish', key: 'publish', width: 35}
        ];
        
        categories.data.forEach(category => {
            if (category.monthly_views !== 0) {
                return worksheet.addRow({
                    id: category.id,
                    subCategory: category.subCategory,
                    title: category.title,
                    views: category.views,
                    monthly_views: category.monthly_views,
                    publish: category.publish
                });
            }
        })
        
        const date = new Date();
        const xls64 = await workbook.xlsx.writeBuffer({ base64: true })
        saveAs(
            new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            `${date.getMonth()}-${date.getFullYear()}-category`
        )
    }

    const blogDataSaveInExcel = async (Blogs) => {
        const Excel = require('exceljs')
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Quizzland-Record(Blogs)");

        worksheet.columns = [
            {header: 'Id', key: 'id', width: 5},
            {header: 'Title', key: 'title', width: 30}, 
            {header: 'Views', key: 'views', width: 10},
            {header: 'Monthly_views', key: 'monthly_views', width: 10},
            {header: 'Publish', key: 'publish', width: 35}
        ];
        
        Blogs.data.forEach(article => {
            if (article.monthly_views !== 0) {
                return worksheet.addRow({
                    id: article.id,
                    title: article.title,
                    views: article.views,
                    monthly_views: article.monthly_views,
                    publish: article.publish
                });
            }
        })
        
        const date = new Date();
        const xls64 = await workbook.xlsx.writeBuffer({ base64: true })
        saveAs(
            new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            `${date.getMonth()}-${date.getFullYear()}-blog`
        )
    }

    const adminCheckerForStartRecord = () => {
        const InputValueHashed = sha256(passwordInput.current.value)
        const password = '4717a31189f18bd8313df862bd052c8ab02f8b83831864f3aeb5343a2919f8cf'

        if(InputValueHashed === password) {
            startRecord()
        }
    }

    const startRecord = () => {
        setMessage('Start Recording.....')
        getAllQuizzes()
        getAllPointyQuizzes()
        getAllCategories()
        getAllBlogs()
    }

    const adminCheckerForRestartMonthlyViews = () => {
        const InputValueHashed = sha256(passwordInput.current.value)
        const password = '4717a31189f18bd8313df862bd052c8ab02f8b83831864f3aeb5343a2919f8cf'

        if(InputValueHashed === password) {
            restartMonthlyViews()
        }
    }

    const restartMonthlyViews = () => {
        window.location.replace(window.location.origin + '/re$tartEveryMonthlyViewsDone');
    }

    return (
        <>
            <Layout>

                <Head>
                    <meta name="robots" content="noindex" />
                </Head>

                <h3 className='tx-al-c'>💜 Enter The Password Fucker</h3>
                <div className="flex flex-jc-c">
                    <input type={showPassword ? 'string' : 'password'} style={{fontSize: '1.5rem', padding: '1rem', background: 'transparent', border: '1px solid gray', borderRadius: '15px', boxShadow: '0 0 15px #8080803d'}}
                    ref={passwordInput} onChange={adminCheckerForStartRecord} />
                    <button onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)} style={{marginLeft: '1rem', background: 'transparent', border: 'none'}}>Show Input</button>
                </div>

                <div className='space-sm flex flex-jc-c'>
                    <button onClick={adminCheckerForRestartMonthlyViews} className='btn__grad'>Restart Monthly Views</button>
                </div>

                <div className='basicPage wrapper-med'>
                    {message}
                </div>

            </Layout>
        </>
    );
}
 
export default QuizMonthlyRecord;