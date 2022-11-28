import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')

import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import axiosInstance from '../../../../../components/axiosAuthApi';
import { log } from '../../../../../components/base';
import UserStore from '../../../../../store/userStore';

const OverviewTrivia = () => {
    const [tableRows, setTableRows] = useState([])

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('publishDate');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const { enqueueSnackbar } = useSnackbar()

    const insertTable = (
        id,
        publicAccess,
        quiz,
        question,
        questionImg,
        option_1st,
        option_2nd,
        option_3rd,
        option_4th,
        option_img_1st,
        option_img_2nd,
        option_img_3rd,
        option_img_4th,
        submitter,
    ) => {
        return {
            id,
            publicAccess,
            quiz,
            question,
            questionImg,
            option_1st,
            option_2nd,
            option_3rd,
            option_4th,
            option_img_1st,
            option_img_2nd,
            option_img_3rd,
            option_img_4th,
            submitter
        };
    }

    useEffect(async () => {
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
        await fetchQuestions()
    }, []);

    const [userProfile, userActions] = UserStore()

    const now = new Date().getTime()

    const fetchQuestions = async () => {        
        await axiosInstance.get(`/api/questionsV2View/?timestamp=${now}`)
            .then(res => { 
                let preTablesRows = []
                
                res.data.reverse().map(question => {
                    preTablesRows.push(insertTable(
                        question.id,
                        question.public,
                        question.quizKey.title,
                        question.question,
                        question.question_img,
                        question.option_1st,
                        question.option_2nd,
                        question.option_3rd,
                        question.option_4th,
                        question.option_img_1st,
                        question.option_img_2nd,
                        question.option_img_3rd,
                        question.option_img_4th,
                        question.submitter_id.username,
                    ))
                })
                setTableRows(preTablesRows)
            })
            .catch(err => {
                log('err: fetchQuestions')
                log(err)
                log(err.response)
            })
    }
    
    const columns = [
        {
            field: 'publicAccess',
            headerName: 'عمومی',
            width: 150,
            editable: false,
            renderCell: (params) => <button onClick={() => changePublicAccessStatue(params.row)}>{params.row.publicAccess ? '✅':'⛔'}</button>
        },
        {
            field: 'quiz',
            headerName: 'کوییز',
            editable: true
        },
        {
            field: 'question',
            headerName: 'سوال',
            width: 500,
            editable: true,
        },
        {
            field: 'questionImg',
            headerName: 'تصویر سوال',
            width: 150,
            editable: false,
            renderCell: (params) => params.value.includes('undefined') ? '' : <a href={params.value} target='_blank'><img src={params.value} /></a>
        },
        {
            field: 'option_1st',
            width: 150,
            headerName: 'گزینه ۱',
            editable: true
        },
        {
            field: 'option_2nd',
            width: 150,
            headerName: 'گزینه ۲',
            editable: true
        },
        {
            field: 'option_3rd',
            width: 150,
            headerName: 'گزینه ۳',
            editable: true
        },
        {
            field: 'option_4th',
            width: 150,
            headerName: 'گزینه ۴',
            editable: true
        },
        {
            field: 'option_img_1st',
            headerName: 'تصویر گزینه ۱',
            editable: true,
            renderCell: (params) => params.value?.includes('undefined') ? '' : <a href={params.value} target='_blank'><img src={params.value} /></a>
        },
        {
            field: 'option_img_2nd',
            headerName: 'تصویر گزینه ۲',
            editable: true,
            renderCell: (params) => params.value?.includes('undefined') ? '' : <a href={params.value} target='_blank'><img src={params.value} /></a>
        },
        {
            field: 'option_img_3rd',
            headerName: 'تصویر گزینه ۳',
            editable: true,
            renderCell: (params) => params.value?.includes('undefined') ? '' : <a href={params.value} target='_blank'><img src={params.value} /></a>
        },
        {
            field: 'option_img_4th',
            headerName: 'تصویر گزینه ۴',
            editable: true,
            renderCell: (params) => params.value?.includes('undefined') ? '' : <a href={params.value} target='_blank'><img src={params.value} /></a>
        },
        {
            field: 'submitter',
            headerName: 'ثبت کننده',
            width: 150,
            editable: false
        },
    ]

    const changePublicAccessStatue = async (data) => {
        const publicAccessStatue = data.publicAccess
        const questionId = data.id

        const payload = {
            public: publicAccessStatue ? false : true
        }

        const now = new Date().getTime()

        await axiosInstance.patch(`/api/questionsV2View/${questionId}/?timestamp=${now}`, payload)
            .then(res => {
                if (res.status === 200) {
                    enqueueSnackbar('تغییر با موفقیت ثبت گردید!', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                }
            })
            .catch(err => {
                enqueueSnackbar('تغییر به مشکل برخورد!', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                log('err: changePUblicAccessStatue')
                log(err)
                log(err.response)
            })
    }
    
    return (
        <React.Fragment>
            <Helmet>
                <title>Trivia Overview</title>
                <meta name='robots' content='noindex' />
            </Helmet>

            {
                userProfile.userDetail?.is_staff ?
                <Box sx={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={tableRows}
                        columns={columns}
                        pageSize={20}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                        sx={{fontFamily: 'IRANYekanBold, sans-serif, serif', color: 'white'}}
                    />
                </Box>
                :
                <h1>
                    not staff. sorry!
                </h1>
            }   
        </React.Fragment>
    );
}
 
export default OverviewTrivia;