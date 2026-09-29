import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createMember, getAllMembers, getMember, searchMembers, updateMember } from '../../api/memberApi';
import { updateFromMember } from '../user/userSlice';

export const createMemberThunk = createAsyncThunk(
    'member/createMember',
    async ({ memberData }, { dispatch, rejectWithValue }) => {
        try {
            const response = await createMember(memberData);
            dispatch(updateFromMember(response));
            return response;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message || 'Failed to create member' });
        }
    }
);

export const getAllMembersThunk = createAsyncThunk(
    'member/getAllMembers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllMembers();
            return response;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message || 'Failed to fetch members' });
        }
    }
);

export const getMemberThunk = createAsyncThunk(
    'member/getMember',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await getMember(id);
            return response;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message || 'Failed to fetch member details' });
        }
    }
);

export const updateMemberThunk = createAsyncThunk(
    'member/updateMember',
    async ({ memberId, memberData }, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateMember(memberId, memberData);
            dispatch(updateFromMember(response));
            return response;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message || 'Failed to update member' });
        }
    }
);

export const searchMembersThunk = createAsyncThunk(
    'member/searchMembers',
    async (searchQuery, { rejectWithValue }) => {
        try {
            const response = await searchMembers(searchQuery);
            return response;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message || 'Search failed' });
        }
    }
);

const memberSlice = createSlice({
    name: 'member',
    initialState: {
        members: [],
        member: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearMemberDetails: (state) => {
            state.member = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createMemberThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMemberThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createMemberThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All
            .addCase(getAllMembersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllMembersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.members = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllMembersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Single
            .addCase(getMemberThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMemberThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.member = action.payload;
            })
            .addCase(getMemberThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateMemberThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemberThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateMemberThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Search
            .addCase(searchMembersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchMembersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.members = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(searchMembersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMemberDetails } = memberSlice.actions;
export default memberSlice.reducer;