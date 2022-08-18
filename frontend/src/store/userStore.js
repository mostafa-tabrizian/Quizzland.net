
import { createStore, createHook  } from 'react-sweet-state';
import { log } from '../components/base';

const UserStore = createStore({
    initialState: {
        userDetail: null,
    },
    actions: {
        setUser:
            (userDetail) =>
            ({ setState, getState }) => {
                setState({userDetail});
            },
        updatePlaylist:
            (updatedPlaylist) =>
            ({ setState, getState }) => {
                setState(
                    {
                       userDetail:  {...getState().userDetail, watch_list: updatedPlaylist}
                    }
                )
            }
    },
    name: 'userDetail',
});

const useUser = createHook(UserStore)

export default useUser


// create function for adding and removing like to the state