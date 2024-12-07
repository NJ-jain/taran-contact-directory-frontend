import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import memberReducer from '../features/member/memberSlice'; // Import the memberSlice reducer

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    member: memberReducer, // Add the member reducer
    // Add other reducers here
});

export default rootReducer;