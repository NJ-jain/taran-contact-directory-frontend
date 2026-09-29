import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    registerUser, 
    loginUser, 
    registerAdminUser, 
    loginUserAdmin, 
    forgotPassword, 
    resetPassword 
} from '../../api/authApi';

export const registerUserThunk = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerUser(userData);
            return response;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message || 'Registration failed' });
        }
    }
);

export const registerAdminThunk = createAsyncThunk(
    'auth/registerAdmin',
    async (adminData, { rejectWithValue }) => {
        try {
            const response = await registerAdminUser(adminData);
            return response;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message || 'Admin registration failed' });
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
            return rejectWithValue(error.response?.data || { message: error.message || 'Admin login failed' });
        }
    }
);

export const loginUserThunk = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await loginUser(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message || 'Login failed' });
        }
    }
);

export const forgotPasswordThunk = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await forgotPassword(email);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message || 'Failed to send OTP' });
        }
    }
);

export const resetPasswordThunk = createAsyncThunk(
    'auth/resetPassword',
    async (resetData, { rejectWithValue }) => {
        try {
            const response = await resetPassword(resetData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message || 'Failed to reset password' });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        forgotPasswordSuccess: false,
        resetPasswordSuccess: false,
    },
    reducers: {
        clearForgotPasswordState: (state) => {
            state.forgotPasswordSuccess = false;
            state.error = null;
        },
        clearResetPasswordState: (state) => {
            state.resetPasswordSuccess = false;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.error = null;
            localStorage.removeItem('authorization');
            localStorage.removeItem('adminAuthorization');
        }
    },
    extraReducers: (builder) => {
        builder
            // User Register
            .addCase(registerUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                if (action.payload?.token) {
                    localStorage.setItem('authorization', action.payload.token);
                }
            })
            .addCase(registerUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // User Login
            .addCase(loginUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                if (action.payload?.token) {
                    localStorage.setItem('authorization', action.payload.token);
                }
            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Forgot Password
            .addCase(forgotPasswordThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordSuccess = false;
            })
            .addCase(forgotPasswordThunk.fulfilled, (state) => {
                state.loading = false;
                state.forgotPasswordSuccess = true;
                state.error = null;
            })
            .addCase(forgotPasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.forgotPasswordSuccess = false;
            })

            // Reset Password
            .addCase(resetPasswordThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.resetPasswordSuccess = false;
            })
            .addCase(resetPasswordThunk.fulfilled, (state) => {
                state.loading = false;
                state.resetPasswordSuccess = true;
                state.error = null;
            })
            .addCase(resetPasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.resetPasswordSuccess = false;
            })

            // Admin Register
            .addCase(registerAdminThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAdminThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                if (action.payload?.token) {
                    localStorage.setItem('adminAuthorization', action.payload.token);
                }
            })
            .addCase(registerAdminThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Admin Login
            .addCase(loginAdminThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdminThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                if (action.payload?.token) {
                    localStorage.setItem('adminAuthorization', action.payload.token);
                }
            })
            .addCase(loginAdminThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearForgotPasswordState, clearResetPasswordState, logout } = authSlice.actions;
export default authSlice.reducer;