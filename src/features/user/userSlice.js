import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { approvalRequestApi, getUser, updateUser } from '../../api/userApi';

export const getUserThunk = createAsyncThunk(
    'user/getUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getUser();
            return response;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message || 'Failed to fetch user' });
        }
    }
);

export const updateUserThunk = createAsyncThunk(
    'user/updateUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await updateUser(userData);
            return response;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message || 'Failed to update user' });
        }
    }
);

export const approvalRequestThunk = createAsyncThunk(
    'user/approvalRequest',
    async (_, { rejectWithValue }) => {
        try {
            return await approvalRequestApi();
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message || 'Approval request failed' });
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        updateFromMember: (state, action) => {
            state.data = action.payload;
        },
        clearUserState: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(updateUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { updateFromMember, clearUserState } = userSlice.actions;
export default userSlice.reducer;