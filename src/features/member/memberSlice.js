import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createMember, getAllMembers, getMember, searchMembers, updateMember } from '../../api/memberApi';
import { updateFromMember } from '../user/userSlice';

export const createMemberThunk = createAsyncThunk(
    'member/createMember',
    async ({ memberData, token }, {dispatch , rejectWithValue }) => {
        try {
            const response = await createMember(memberData, token);
            dispatch(updateFromMember(response));
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getAllMembersThunk = createAsyncThunk(
    'member/getAllMembers',
    async (token, { rejectWithValue }) => {
        try {
            const response = await getAllMembers(token);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getMemberThunk = createAsyncThunk(
    'member/getMember',
    async ({id}, { rejectWithValue }) => {
        try {
            const response = await getMember(id);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateMemberThunk = createAsyncThunk(
    'member/updateMember',
    async ({ memberId, memberData, token }, { dispatch , rejectWithValue }) => {
        try {
            const response = await updateMember(memberId, memberData, token);
            dispatch(updateFromMember(response));
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
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
            return rejectWithValue(err.response.data);
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
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createMemberThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMemberThunk.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createMemberThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllMembersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllMembersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(getAllMembersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
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
            .addCase(updateMemberThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemberThunk.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateMemberThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(searchMembersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchMembersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload; // Assuming you want to store the search results in the members array
            })
            .addCase(searchMembersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default memberSlice.reducer;