import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import { useSnackbar } from 'notistack'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';

import { log } from '../../../../components/base';
import axiosInstance from '../../../../components/axiosAuthApi';
import UserStore from '../../../../store/userStore';

const OverviewTrivia = () => {
    const [tableRows, setTableRows] = useState([])

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('publishDate');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const { enqueueSnackbar } = useSnackbar()

    const insertTable = (id, title, slug, subcategory, category, likes, comments, monthlyViews, totalViews, publishDate, publicAccess) => {
        return {id, title, slug, subcategory, category, likes, comments, monthlyViews, totalViews, publishDate, publicAccess };
    }

    useEffect(() => {
        fetchQuizzes()
        fetchLikes()
        fetchComments()
    }, []);

    const [userProfile, userActions] = UserStore()

    const now = new Date().getTime()
    let likes
    let comments

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

    const fetchQuizzes = async () => {        
        await axiosInstance.get(`/api/quizView/?timestamp=${now}`)
            .then(res => { 
                let preTablesRows = []

                res.data.reverse().map(quiz => {

                    const quizLikes = likes.filter(x => x.trivia_id?.id == quiz.id || x.test_id?.id == quiz.id)
                    const quizComments = comments.filter(x => x.trivia_id?.id == quiz.id || x.test_id?.id == quiz.id)

                    preTablesRows.push(insertTable(quiz.id, quiz.title, quiz.slug, quiz.subCategory, quiz.categoryKey.title_persian, quizLikes.length, quizComments.length, quiz.monthly_views, quiz.views, quiz.publish, quiz.public))
                })
                setTableRows(preTablesRows)
            })
            .catch(err => {
                log('err: fetchQuizzes')
                log(err)
                log(err.response)
            })
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }

        if (b[orderBy] > a[orderBy]) {
          return 1;
        }

        return 0;
    }
    
    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const headCells = [
        {
          id: 'title',
          label: 'عنوان',
        },
        {
            id: 'subcategory',
            label: 'زیرکتگوری',
        },
        {
            id: 'category',
            label: 'کتگوری',
        },
        {
            id: 'likes',
            label: 'لایک ها'
        },
        {
            id: 'comments',
            label: 'کامنت ها'
        },
        {
            id: 'monthlyViews',
            label: 'بازدید ماهانه',
        },
        {
            id: 'totalViews',
            label: 'بازدید کل',
        },
        {
            id: 'publishDate',
            label: 'تاریخ انتشار',
        },
        {
            id: 'publicAccess',
            label: 'عمومی'
        }
    ];

    EnhancedTableHead.propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };
    
      const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelected = tableRows.map((n) => n.name);
          setSelected(newSelected);
          return;
        }
        setSelected([]);
      };
    
      const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
    
        setSelected(newSelected);
      };
    
      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    
      // Avoid a layout jump when reaching the last page with empty rows.
      const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableRows.length) : 0;
    

    function EnhancedTableHead(props) {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

        const createSortHandler = (property) => (event) => {
          onRequestSort(event, property);
        };

        return (
            <TableRow>
                {
                    headCells.map((headCell) => (
                        <tableCell
                            key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}
                            sx={{fontFamily: 'IRANYekanBold, sans-serif, serif', color: 'white'}}
                            // align="right"
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        </tableCell>
                    ))
                }
            </TableRow>
        )
    }

    const changePublicAccessStatue = async (data) => {
        const publicAccessStatue = data.publicAccess
        const quizId = data.id

        const payload = {
            public: publicAccessStatue ? false : true
        }

        const now = new Date().getTime()

        await axiosInstance.put(`/api/quizView/${quizId}/?timestamp=${now}`, payload)
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
                <div>
                    <TableContainer sx={{background: 'transparent'}} component={Paper}>

                        <Table
                            // size='small'
                            sx={{ minWidth: 750 }}
                            aria-labelledby="quiz overview"
                            aria-label="quiz overview"
                        >

                            <EnhancedTableHead  
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={tableRows.length}
                            />

                            <TableBody>
                                
                                {
                                    tableRows.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) 
                                    .map((row, index) => {
                                        return (
                                            <TableRow
                                                key={row.name}
                                                sx={{
                                                    '&:last-child td, &:last-child th': { border: 0 },  display: 'table-row-group',
                                                    color: 'white', fontFamily: 'IRANYekanBold, sans-serif, serif !imporatnt',

                                                }}
                                                hover
                                                onClick={(event) => handleClick(event, row.name)}
                                                tabIndex={-1}
                                            >
                                                <TableCell sx={{color: 'white', fontFamily: 'IRANYekanRegular, sans-serif, serif'}} align="right">
                                                    <a href={`/quiz/${row.slug}`}>
                                                        {row.title}
                                                    </a>
                                                </TableCell>
                                                <TableCell sx={{color: 'white', fontFamily: 'IRANYekanRegular, sans-serif, serif'}} align="right">{row.subcategory}</TableCell>
                                                <TableCell sx={{color: 'white', fontFamily: 'IRANYekanRegular, sans-serif, serif'}} align="right">{row.category}</TableCell>
                                                <TableCell sx={{color: 'white', fontFamily: 'IRANYekanRegular, sans-serif, serif'}} align="right">{row.likes}</TableCell>
                                                <TableCell sx={{color: 'white', fontFamily: 'IRANYekanRegular, sans-serif, serif'}} align="right">{row.comments}</TableCell>
                                                <TableCell sx={{color: 'white', fontFamily: 'IRANYekanRegular, sans-serif, serif'}} align="right">{row.monthlyViews}</TableCell>
                                                <TableCell sx={{color: 'white', fontFamily: 'IRANYekanRegular, sans-serif, serif'}} align="right">{row.totalViews}</TableCell>
                                                <TableCell sx={{color: 'white', fontFamily: 'IRANYekanRegular, sans-serif, serif'}} align="right">{row.publishDate}</TableCell>
                                                <TableCell sx={{color: 'white', fontFamily: 'IRANYekanRegular, sans-serif, serif'}} align="right">
                                                    <button onClick={() => changePublicAccessStatue(row)}>
                                                        {
                                                            row.publicAccess ? '✅':'⛔'
                                                        }
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }

                                {
                                    emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (52) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        component="div"
                        count={tableRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
                :
                <h1>
                    not staff. sorry!
                </h1>
            }   
        </React.Fragment>
    );
}
 
export default OverviewTrivia;