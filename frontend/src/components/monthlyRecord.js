import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver'
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

import Header from './header'

import { log } from './base'

const QuizMonthlyRecord = () => {
    const [recordStartStatue_1, setRecordStartStatue_1] = useState()
    const [recordStartStatue_1_2, setRecordStartStatue_1_2] = useState()

    const [recordStartStatue_2, setRecordStartStatue_2] = useState()
    const [recordStartStatue_2_2, setRecordStartStatue_2_2] = useState()

    const [recordStartStatue_3, setRecordStartStatue_3] = useState()
    const [recordStartStatue_3_2, setRecordStartStatue_3_2] = useState()

    const getAllQuizzes = async () => {
        setRecordStartStatue_1('Getting Quiz Data...')
        const quizzes = await axios.get('/dbQuizzland$M19931506/new_quiz/')
        quizDataSaveInExcel(quizzes)
    }
    
    const getAllCategories = async () => {
        setRecordStartStatue_1_2('Getting Category Data...')
        const categories = await axios.get('/dbQuizzland$M19931506/new_category/')
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

        setRecordStartStatue_3('Creating Quizzes Excel - Downloading')
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
                    id: quiz.id,
                    subCategory: quiz.subCategory,
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
            `${date.getMonth()}-${date.getFullYear()}-category`
        )

        setRecordStartStatue_3_2('Creating Categories Excel - Downloading')
        restartCategoryMonthlyViews(categories)
    }

    const restartQuizMonthlyViews = async (quizzes) => {
        setRecordStartStatue_2('Restarting Quizzes Data...')
        await quizzes.data.map(async quiz => {
            if (quiz.monthly_views !== 0) {
                log(quiz)
                const restartQuizMonthlyViews = await axios.patch(`/dbQuizzland$M19931506/new_quiz/${quiz.id}/`, {monthly_views: 0})
                return restartQuizMonthlyViews
            }
        })
    }

    const restartCategoryMonthlyViews = async (categories) => {
        setRecordStartStatue_2_2('Restarting Categories Data...')
        await categories.data.map(async category => {
            if (category.monthly_views !== 0) {
                log(category)
                const restartCategoryMonthlyViews = await axios.patch(`/dbQuizzland$M19931506/new_category/${quiz.id}/`, {monthly_views: 0})
                return restartCategoryMonthlyViews
            }
        })
    }
        
    useEffect(() => {
        getAllQuizzes()
        getAllCategories()
    }, [])

    return (
        <React.Fragment>

            <Header />

            <div className='basicPage wrapper-med'>
                <h1 className='space-sm tx-al-l'> {recordStartStatue_1} </h1>
                <h1 className='space-sm tx-al-l'> {recordStartStatue_1_2} </h1>

                <h1 className='space-sm tx-al-l'> {recordStartStatue_2} </h1>
                <h1 className='space-sm tx-al-l'> {recordStartStatue_2_2} </h1>

                <h1 className='space-sm tx-al-l'> {recordStartStatue_3} </h1>
                <h1 className='space-sm tx-al-l'> {recordStartStatue_3_2} </h1>
            </div>

        </React.Fragment>
    );
}
 
export default QuizMonthlyRecord;