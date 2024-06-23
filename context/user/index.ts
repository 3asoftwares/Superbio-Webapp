import { createSlice } from "@reduxjs/toolkit";
import {
    login,
    register,
    getUser,
    loginUsingGoogle,
} from "./network"


export interface IUserState {
    user: User;
    token: string | null;
    loading: boolean;
    members: User[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
    campaignType: string;
}


let initialState: IUserState = {
    user: {
        name: '',
        email: '',
        password: '',
        role: '',
        mobileNo: '',
        profilePic: '',
    },
    token: null,
    loading: false,
    members: [],
    meta: {
        total: 0,
        page: 0,
        limit: 0,
    },
    campaignType: ''
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setMembers: (state, action) => {
            state.members = action.payload;
        },
        setUserMeta: (state, action) => {
            state.meta = action.payload;
        },
        setCampaignType: (state, action) => {
            state.campaignType = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(login.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(register.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(register.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(getUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(getUser.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(loginUsingGoogle.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loginUsingGoogle.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(loginUsingGoogle.rejected, (state) => {
            state.loading = false;
        });
    },
});

export const { setUser, setToken, setMembers, setUserMeta, setCampaignType } = userSlice.actions;