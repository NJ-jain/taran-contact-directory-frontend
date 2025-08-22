import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers, getUserMembers, approveMember } from '../../api/adminApi';

export const getAllUsersThunk = createAsyncThunk(
    'admin/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllUsers();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getUserMembersThunk = createAsyncThunk(
    'admin/getUserMembers',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getUserMembers(userId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const approveMemberThunk = createAsyncThunk(
    'admin/approveMember',
    async (memberId, { rejectWithValue }) => {
        try {
            const response = await approveMember(memberId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        totalUsers: 0,
        selectedUser: null,
        selectedUserMembers: [],
        totalMembers: 0,
        loading: false,
        membersLoading: false,
        error: null,
        membersError: null,
        approvalLoading: false,
        approvalError: null,
    },
    reducers: {
        clearAdminData: (state) => {
            state.users = [];
            state.totalUsers = 0;
            state.selectedUser = null;
            state.selectedUserMembers = [];
            state.totalMembers = 0;
            state.error = null;
            state.membersError = null;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.userArray;
                state.totalUsers = action.payload.totalUsers;
            })
            .addCase(getAllUsersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUserMembersThunk.pending, (state) => {
                state.membersLoading = true;
                state.membersError = null;
            })
            .addCase(getUserMembersThunk.fulfilled, (state, action) => {
                state.membersLoading = false;
                state.selectedUserMembers = action.payload.members;
                state.totalMembers = action.payload.totalMembers;
            })
            .addCase(getUserMembersThunk.rejected, (state, action) => {
                state.membersLoading = false;
                state.membersError = action.payload;
            })
            .addCase(approveMemberThunk.pending, (state) => {
                state.approvalLoading = true;
                state.approvalError = null;
            })
            .addCase(approveMemberThunk.fulfilled, (state, action) => {
                state.approvalLoading = false;
                const updatedMembers = state.selectedUserMembers.map(member => 
                    member._id === action.payload.member._id 
                        ? { ...member, isApproved: action.payload.member.isApproved }
                        : member
                );
                state.selectedUserMembers = updatedMembers;
            })
            .addCase(approveMemberThunk.rejected, (state, action) => {
                state.approvalLoading = false;
                state.approvalError = action.payload;
            });
    },
});

export const { clearAdminData, setSelectedUser } = adminSlice.actions;
export default adminSlice.reducer; 