import React, { useState, useRef } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from 'notistack'
import Dialog from '@mui/material/Dialog';

import UserStore from '../../store/userStore';
import axiosInstance from '../axiosAuthApi';
import { log } from '../base'

const CommentsMenu = (props) => {
    const [MenuState, setMenu] = useState(null);
    const [openEditForm, setOpenEditForm] = useState(false);

    const editedComment = useRef()

    const [userProfile, userActions] = UserStore()

    const { enqueueSnackbar } = useSnackbar()

    const open = Boolean(MenuState);

    const handleClickMenu = (event) => {
        setMenu(event.currentTarget);
    };
    
    const handleCloseMenu = () => {
        setMenu(null);
    };

    const handleClickOpenEditForm = () => {
      setOpenEditForm(true);
    };
  
    const handleCloseEditForm = () => {
      setOpenEditForm(false);
    };

    const deleteComment = async () => {
        const commentId = props.comment.id

        await axiosInstance.delete(`/api/commentView/${commentId}/`)
            .then(res => {
                enqueueSnackbar('کامنت شما با موفقیت حذف گردید.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            })
            .catch(err => {
                if (err.response.status === 404) {
                    enqueueSnackbar('این کامنت حذف شده است.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                    
                } else {
                    enqueueSnackbar('در حذف کامنت خطایی رخ داد! لطفا مجددا تلاش کنید.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                }

                // log(err)
                // log(err.response)
            })

        handleCloseMenu()
    }

    const checkIfCommentValid = () => {
        const commentLength = editedComment.current.innerText.trim().length
        if (commentLength == 0) {
            enqueueSnackbar('کامنت می‌بایست خالی نباشد!', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            return false
        } else if (commentLength < 2) {
            enqueueSnackbar('کامنت شما کافی نمی‌باشد!', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            return false
        } else if (255 <= commentLength) {
            enqueueSnackbar('کامنت شما بیش از حد مجاز بلند است!', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            return false
        } else {
            return true
        }
    }

    const saveCommentEdit = async () => {
        const commentId = props.comment.id
        const payload = {comment_text: editedComment.current.innerText}

        if (checkIfCommentValid()){
            await axiosInstance.patch(`/api/commentView/${commentId}/`, payload)
                .then(res => {
                    enqueueSnackbar('کامنت شما با موفقیت تغییر یافت.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                })
                .catch(err => {
                    enqueueSnackbar('در تغییر کامنت خطایی رخ داد! لطفا مجددا تلاش کنید.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                })
    
            handleCloseMenu()
            handleCloseEditForm()
        }
    }
        
    return (
        userProfile.userDetail.id !== undefined &&
        props.comment.submitter_id?.id !== undefined &&
        props.comment.submitter_id?.id == userProfile.userDetail.id &&
    
        <React.Fragment>
            <button onClick={handleClickMenu}>
                <svg class="h-4 w-4 text-zinc-400"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <circle cx="12" cy="12" r="1" />  <circle cx="12" cy="5" r="1" />  <circle cx="12" cy="19" r="1" /></svg>
            </button>
            
            <Menu
                id={props.comment.id}
                anchorEl={MenuState}
                open={open}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {/* <div> */}
                    <MenuItem onClick={deleteComment}>حذف</MenuItem>
                    <MenuItem onClick={handleClickOpenEditForm}>ویرایش</MenuItem>
                    {/* <MenuItem onClick={handleCloseMenu}>گزارش تخلف</MenuItem> */}
                {/* </div> */}
            </Menu>

            <Dialog
                open={openEditForm}
                onClose={handleCloseEditForm}
                fullWidth={true}
                maxWidth={'sm'}
            >
                <h2>ویرایش</h2>
                <div className='my-10'>
                <pre>
                        <h2 contenteditable="true" ref={editedComment} className='p-3 border-b border-gray-700'>
                            {props.comment.comment_text}
                        </h2>
                    </pre>
                </div>
                <div className='absolute px-3 space-x-5 space-x-reverse left-2 bottom-2'>
                    <button onClick={saveCommentEdit} className='px-3 py-1 border-2 border-green-600 rounded-xl'>ثبت تغییرات</button>
                    <button onClick={handleCloseEditForm}>لغو</button>
                </div>
            </Dialog>

        </React.Fragment>
    );
}
 
export default CommentsMenu;