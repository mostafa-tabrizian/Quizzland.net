import { createStore, createHook  } from 'react-sweet-state';
import { log } from '../components/base';

const UserStoreCode = createStore({
    initialState: {
        userDetail: null,
    },
    actions: {
        setUser:
            (userDetail) =>
            ({ setState, getState }) => {
                setState({userDetail});
            },
        // updatePlaylist:
        //     (updatedPlaylist) =>
        //     ({ setState, getState }) => {
        //         setState(
        //             {
        //                userDetail:  {...getState().userDetail, watch_list: updatedPlaylist}
        //             }
        //         )
        //     }
        
    },
    name: 'userDetail',
});

const UserStore = createHook(UserStoreCode)

export default UserStore