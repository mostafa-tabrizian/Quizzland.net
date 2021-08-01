import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver'
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

import Header from './header'

import { log } from './base'

const MonthlyRecord = () => {
    const [recordStartStatue_1, setRecordStartStatue_1] = useState()
    const [recordStartStatue_2, setRecordStartStatue_2] = useState()
    const [recordStartStatue_3, setRecordStartStatue_3] = useState()
    const [recordStartStatue_4, setRecordStartStatue_4] = useState()
    const [recordStartStatue_5, setRecordStartStatue_5] = useState()

    const getAllQuizzes = async () => {
        setRecordStartStatue_1('Getting Data...')
        const quizzes = await axios.get('/dbQuizzland$M19931506/new_quiz/')
        setRecordStartStatue_2('Getting Data Completed!')
        saveInExcel(quizzes)
    }
    
    const saveInExcel = async (quizzes) => {
        const Excel = require('exceljs')
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Quizzland-Record");

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

        setRecordStartStatue_5('Creating Excel Record \n Downloading The File')
        restartTheMonthlyViews(quizzes)
    }

    const restartTheMonthlyViews = async (quizzes) => {
        setRecordStartStatue_3('Restarting Data...')
        await quizzes.data.map(async quiz => {
            if (quiz.monthly_views !== 0) {
                log(quiz)
                const restartMonthlyViews = await axios.patch(`/dbQuizzland$M19931506/new_quiz/${quiz.id}/`, {monthly_views: 0})
                return restartMonthlyViews
            }
        })
        setRecordStartStatue_4('Restarting Completed!')
    }
        
    useEffect(() => {
        getAllQuizzes()
    }, [])

    return (
        <React.Fragment>

            <Header />

            <div className='basicPage wrapper-sm'>
                <h1 className='space-sm'> {recordStartStatue_1} </h1>
                <h1 className='space-sm'> {recordStartStatue_2} </h1>
                <h1 className='space-sm'> {recordStartStatue_3} </h1>
                <h1 className='space-sm'> {recordStartStatue_4} </h1>
                <h1 className='space-sm'> {recordStartStatue_5} </h1>
            </div>

        </React.Fragment>
    );
}
 
export default MonthlyRecord;