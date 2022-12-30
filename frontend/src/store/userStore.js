import { createStore, createHook  } from 'react-sweet-state';
import { log } from '../components/base';

const UserStoreCode = createStore({
    initialState: {
        userDetail: false,
        QCoins: false
    },
    actions: {
        setUser:
            (userDetail) =>
            ({ setState, getState }) => {
                setState({userDetail});
            },
        updateQCoins:
            (QCoinsLeft) =>
            ({ setState }) => {
                setState(
                    {
                        QCoins: QCoinsLeft
                    }
                )
            }
        
    },
    name: 'userDetail',
});

const UserStore = createHook(UserStoreCode)

export default UserStore