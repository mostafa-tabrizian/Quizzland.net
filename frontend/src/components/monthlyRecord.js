import React, { useState, useRef } from 'react';
import { saveAs } from 'file-saver'
import axios from 'axios';
import { Helmet } from "react-helmet";

import Header from './header'

import { log } from './base'

let sha256 = require('js-sha256');

const QuizMonthlyRecord = () => {
    const [showPassword, setShowPassword] = useState(false)

    const [recordStartStatue_1, setRecordStartStatue_1] = useState()
    const [recordStartStatue_1_2, setRecordStartStatue_1_2] = useState()

    const [recordStartStatue_2, setRecordStartStatue_2] = useState()
    const [recordStartStatue_2_2, setRecordStartStatue_2_2] = useState()

    const passwordInput = useRef(null)

    const getAllQuizzes = async () => {
        setRecordStartStatue_1('Getting Quiz Data...')
        const quizzes = await axios.get('/dbAPI/new_quiz/')
        quizDataSaveInExcel(quizzes)
    }
    
    const getAllCategories = async () => {
        setRecordStartStatue_1_2('Getting Category Data...')
        const categories = await axios.get('/dbAPI/new_category/')
        categoryDataSaveInExcel(categories)
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

        setRecordStartStatue_2('Creating Quizzes Excel - Downloading')
        restartQuizMonthlyViews(quizzes)
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

        setRecordStartStatue_2_2('Creating Categories Excel - Downloading')
        restartCategoryMonthlyViews(categories)
    }

    const adminCheckerForStartRecord = () => {
        const InputValueHashed = sha256(passwordInput.current.value)
        const password = '4717a31189f18bd8313df862bd052c8ab02f8b83831864f3aeb5343a2919f8cf'

        if(InputValueHashed === password) {
            startRecord()
        }
    }

    const startRecord = () => {
        log('record start')
        getAllQuizzes()
        getAllCategories()
    }

    const adminCheckerForRestartMonthlyViews = () => {
        const InputValueHashed = sha256(passwordInput.current.value)
        const password = '4717a31189f18bd8313df862bd052c8ab02f8b83831864f3aeb5343a2919f8cf'

        if(InputValueHashed === password) {
            restartMonthlyViews()
        }
    }

    const restartMonthlyViews = () => {
        window.location.replace(window.location.origin + '/restartEveryMonthlyViews');
    }

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <meta name="robots" content="noindex" />
            </Helmet>

            <h3 className='tx-al-c'>💜 Enter The Password Fucker</h3>
            <div className="flex flex-jc-c">
                <input type="text" type={showPassword ? 'string' : 'password'} style={{fontSize: '1.5rem', padding: '1rem', background: 'transparent', border: '1px solid gray', borderRadius: '15px', boxShadow: '0 0 15px #8080803d'}}
                ref={passwordInput} onChange={adminCheckerForStartRecord} />
                <button onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)} style={{marginLeft: '1rem', background: 'transparent', border: 'none'}}>Show Input</button>
            </div>

            <div className='space-sm'>
                <button onClick={adminCheckerForRestartMonthlyViews}>Restart Monthly Views</button>
            </div>

            <div className='basicPage wrapper-med'>
                <h1 className='space-sm tx-al-l'> {recordStartStatue_1} </h1>
                <h1 className='space-sm tx-al-l'> {recordStartStatue_1_2} </h1>

                <h1 className='space-sm tx-al-l'> {recordStartStatue_2} </h1>
                <h1 className='space-sm tx-al-l'> {recordStartStatue_2_2} </h1>

                <h1 className='space-sm tx-al-l'> {recordStartStatue_2} </h1>
                <h1 className='space-sm tx-al-l'> {recordStartStatue_2_2} </h1>
            </div>

        </React.Fragment>
    );
}
 
export default QuizMonthlyRecord;