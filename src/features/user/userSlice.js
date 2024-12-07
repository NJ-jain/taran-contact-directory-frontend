import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUser, updateUser } from '../../api/userApi'; // Assume these functions are defined in userApi.js





export const getUserThunk = createAsyncThunk(
    'user/getUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getUser();
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
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
            return rejectWithValue(err.response.data);
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

// ... existing code ...

// Export the action to be used in components
export const { updateFromMember } = userSlice.actions;

// Export the reducer as the default export
export default userSlice.reducer;