import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import { useSnackbar } from 'notistack'

import PropTypes from 'prop-types';
import Popper from '@mui/material/Popper';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';

import { log } from '../../../../components/base';
import calcView from '../../../../components/quiz/calcView'
import axiosInstance from '../../../../components/axiosAuthApi';
import UserStore from '../../../../store/userStore';

const OverviewTrivia = () => {
    const [tableRows, setTableRows] = useState([])

    const { enqueueSnackbar } = useSnackbar()

    const insertTable = (id, title, slug, subcategory, category, likes, comments, monthlyViews, totalViews, publishDate, publicAccess) => {
        return {id, title, slug, subcategory, category, likes, comments, monthlyViews, totalViews, publishDate, publicAccess };
    }

    useEffect(async () => {
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
        
        await fetchLikes()
        await fetchComments()
        await fetchViews()
        await fetchQuizzes()
    }, []);

    const [userProfile, userActions] = UserStore()

    const now = new Date().getTime()
    let likes
    let comments
    let views
    let monthlyViews

    const fetchLikes = async () => {
        await axiosInstance.get(`/api/likeView/?timestamp=${now}`)
          .then(res => {
              likes = res.data
          })
    }

    const fetchComments = async () => {
        await axiosInstance.get(`/api/commentView/?timestamp=${now}`)
          .then(res => {
              comments = res.data
          })
    }

    const fetchViews = async () => {
      const quizzesView = await calcView()
      const quizzesMonthlyView = await calcView('monthly')

      views = quizzesView
      monthlyViews= quizzesMonthlyView
    }

    const fetchQuizzes = async () => {  
      await axiosInstance.get(`/api/quizV2View/?timestamp=${now}`)
        .then(res => { 
          let preTablesRows = []
        
          res.data.reverse().map(quiz => {
            const quizView = views[quiz.slug]
            const quizMonthlyView = monthlyViews[quiz.slug]
            const quizLikes = likes?.filter(x => x.quizV2_id?.id == quiz.id)
            const quizComments = comments?.filter(x => x.quizV2_id == quiz.id)

            preTablesRows.push(insertTable(quiz.id, quiz.title, quiz.slug, quiz.subCategory, quiz.categoryKey.title_persian, quizLikes?.length, quizComments?.length, quizMonthlyView, quizView, quiz.publish, quiz.public))
          })

          setTableRows(preTablesRows)
        })
        .catch(err => {
            log('err: fetchQuizzes')
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
            field: 'title',
            headerName: 'عنوان',
            renderCell: renderCellExpand,
            width: 150
        },
        {
            field: 'category',
            headerName: 'کتگوری',
            renderCell: renderCellExpand,
            width: 150
        },
        {
            field: 'likes',
            headerName: 'لایک ها',
            renderCell: renderCellExpand,
            width: 75
        },
        {
            field: 'comments',
            headerName: 'کامنت ها',
            renderCell: renderCellExpand,
            width: 75
        },
        {
            field: 'monthlyViews',
            headerName: 'بازدید ماهانه',
            renderCell: renderCellExpand,
            width: 100
        },
        {
            field: 'totalViews',
            headerName: 'بازدید کل',
            renderCell: renderCellExpand,
            width: 100
        },
        {
            field: 'publishDate',
            headerName: 'تاریخ انتشار',
            renderCell: (params) => params.row.publishDate.slice(0, 16),
            width: 150
        },
        {
            field: 'publicAccess',
            headerName: 'عمومی',
            renderCell: renderCellExpand,
            renderCell: (params) => <button onClick={() => changePublicAccessStatue(params.row)}>{params.row.publicAccess ? '✅':'⛔'}</button>,
            width: 75
        }
    ];

    const changePublicAccessStatue = async (data) => {
        const publicAccessStatue = data.publicAccess
        const quizId = data.id

        const payload = {
            public: publicAccessStatue ? false : true
        }

        const now = new Date().getTime()

        await axiosInstance.put(`/api/quizV2View/${quizId}/?timestamp=${now}`, payload)
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
                    <div style={{flex: '1', width: '250vw', height: 500}}>
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