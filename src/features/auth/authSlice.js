import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, registerAdminUser, loginUserAdmin } from '../../api/authApi';

export const registerUserThunk = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerUser(userData);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const registerAdminThunk = createAsyncThunk(
    'auth/registerAdmin',
    async (adminData, { rejectWithValue }) => {
        try {
            const response = await registerAdminUser(adminData);

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error);
            }
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


export const loginAdminThunk = createAsyncThunk(
    'auth/loginAdmin',
    async (adminData, { rejectWithValue }) => {
        try {
            const response = await loginUserAdmin(adminData);
            return response;
        } catch (error) { 
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const loginUserThunk = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await loginUser(userData); // Use the loginUser function
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('authorization', action.payload.token); // Store token in local storage
            })
            .addCase(registerUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loginUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('authorization', action.payload.token); // Store token in local storage
            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(registerAdminThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAdminThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('adminAuthorization', action.payload.token);
            })
            .addCase(registerAdminThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loginAdminThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdminThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('adminAuthorization', action.payload.token);
            })
            .addCase(loginAdminThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;