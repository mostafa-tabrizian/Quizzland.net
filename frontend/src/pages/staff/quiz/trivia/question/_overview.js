import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import PropTypes from 'prop-types';
import Popper from '@mui/material/Popper';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';

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
        await axiosInstance.get(`/api/questionsV2View/?timestamp=${now}&limit=100`)
            .then(res => { 
                let preTablesRows = []
                
                res.data.results.reverse().map(question => {
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

    
    function isOverflown(element) {
        return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
        );
    }

    const GridCellExpand = React.memo(function GridCellExpand(props) {
        const { width, value } = props;
        const wrapper = React.useRef(null);
        const cellDiv = React.useRef(null);
        const cellValue = React.useRef(null);
        const [anchorEl, setAnchorEl] = React.useState(null);
        const [showFullCell, setShowFullCell] = React.useState(false);
        const [showPopper, setShowPopper] = React.useState(false);
      
        const handleMouseEnter = () => {
          const isCurrentlyOverflown = isOverflown(cellValue.current);
          setShowPopper(isCurrentlyOverflown);
          setAnchorEl(cellDiv.current);
          setShowFullCell(true);
        };
      
        const handleMouseLeave = () => {
          setShowFullCell(false);
        };
      
        React.useEffect(() => {
          if (!showFullCell) {
            return undefined;
          }
      
          function handleKeyDown(nativeEvent) {
            // IE11, Edge (prior to using Bink?) use 'Esc'
            if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
              setShowFullCell(false);
            }
          }
      
          document.addEventListener('keydown', handleKeyDown);
      
          return () => {
            document.removeEventListener('keydown', handleKeyDown);
          };
        }, [setShowFullCell, showFullCell]);
      
        return (
          <Box
            ref={wrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
              alignItems: 'center',
              lineHeight: '24px',
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
            }}
          >
            <Box
              ref={cellDiv}
              sx={{
                height: '100%',
                width,
                display: 'block',
                position: 'absolute',
                top: 0,
              }}
            />
            <Box
              ref={cellValue}
              sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {value}
            </Box>
            {showPopper && (
              <Popper
                open={showFullCell && anchorEl !== null}
                anchorEl={anchorEl}
                style={{ width, marginLeft: -17 }}
              >
                <Paper
                  elevation={1}
                  style={{ minHeight: wrapper.current.offsetHeight - 3 }}
                >
                  <p>
                    {value}
                  </p>
                </Paper>
              </Popper>
            )}
          </Box>
        );
    });

    GridCellExpand.propTypes = {
        value: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
    };
      
    function renderCellExpand(params) {
        return (
          <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
        );
    }
      
    renderCellExpand.propTypes = {
        /**
         * The column of the row that the current cell belongs to.
         */
        colDef: PropTypes.object.isRequired,
        /**
         * The cell value.
         * If the column has `valueGetter`, use `params.row` to directly access the fields.
         */
        value: PropTypes.string,
    };
    
    const columns = [
        {
            field: 'id',
            headerName: 'ویرایش',
            renderCell: (params) => <a href={`/adminTheKingAlexanderJosef/frontend/questions_v2/${params.row.id}/change/`} target='_blank'>✒️</a>,
            width: 75,
        },
        {
            field: 'publicAccess',
            headerName: 'عمومی',
            editable: false,
            renderCell: (params) => <button onClick={() => changePublicAccessStatue(params.row)}>{params.row.publicAccess ? '✅':'⛔'}</button>,
            width: 75,
        },
        {
            field: 'quiz',
            headerName: 'کوییز',
            editable: true,
            renderCell: renderCellExpand,
            width: 100,
        },
        {
            field: 'question',
            headerName: 'سوال',
            editable: true,
            renderCell: renderCellExpand,
            width: 200,
        },
        {
            field: 'questionImg',
            headerName: 'تصویر سوال',
            editable: false,
            renderCell: (params) => params.value.includes('undefined') ? '' : <a href={params.value} target='_blank'><img src={params.value} /></a>,
            width: 100,
        },
        {
            field: 'option_1st',
            headerName: 'گزینه ۱',
            editable: true,
            renderCell: renderCellExpand,
            width: 150,
        },
        {
            field: 'option_2nd',
            headerName: 'گزینه ۲',
            editable: true,
            renderCell: renderCellExpand,
            width: 150,
        },
        {
            field: 'option_3rd',
            headerName: 'گزینه ۳',
            editable: true,
            renderCell: renderCellExpand,
            width: 150,
        },
        {
            field: 'option_4th',
            headerName: 'گزینه ۴',
            editable: true,
            renderCell: renderCellExpand,
            width: 150,
        },
        {
            field: 'option_img_1st',
            headerName: 'تصویر گزینه ۱',
            editable: true,
            renderCell: (params) => params.value?.includes('undefined') ? '' : <a href={params.value} target='_blank'><img src={params.value} /></a>,
            width: 100,
        },
        {
            field: 'option_img_2nd',
            headerName: 'تصویر گزینه ۲',
            editable: true,
            renderCell: (params) => params.value?.includes('undefined') ? '' : <a href={params.value} target='_blank'><img src={params.value} /></a>,
            width: 100,
        },
        {
            field: 'option_img_3rd',
            headerName: 'تصویر گزینه ۳',
            editable: true,
            renderCell: (params) => params.value?.includes('undefined') ? '' : <a href={params.value} target='_blank'><img src={params.value} /></a>,
            width: 100,
        },
        {
            field: 'option_img_4th',
            headerName: 'تصویر گزینه ۴',
            editable: true,
            renderCell: (params) => params.value?.includes('undefined') ? '' : <a href={params.value} target='_blank'><img src={params.value} /></a>,
            width: 100,
        },
        {
            field: 'submitter',
            headerName: 'ثبت کننده',
            editable: false,
            width: 100,
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
                <Box>
                    <div style={{flex: '1', width: '400vw', height: 500}}>
                        <DataGrid
                            rows={tableRows}
                            columns={columns}
                            pageSize={20}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            disableSelectionOnClick
                            experimentalFeatures={{ newEditingApi: true }}
                            autoWidth
                            sx={{fontFamily: 'IRANYekanBold, sans-serif, serif', color: 'white'}}
                        />
                    </div>
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