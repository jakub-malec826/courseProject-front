import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import GetAllUsers from "../../../connectWithServer/GetAllUsers";

import UserDataIF from "../../../interfaces/UserDataIF";

const initialState = {
    users: <UserDataIF[]>[],
};

export const GetAllDataUsers = createAsyncThunk("users/allusers", async () => {
    return await GetAllUsers();
});

export const UsersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    
    extraReducers(builder) {
        builder.addCase(GetAllDataUsers.fulfilled, (state, action) => {
            state.users = action.payload;
        });
    },
});

export default UsersSlice.reducer;
