import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserType } from "~/types/user.types";

interface UserState {
    user: UserType | null;
}

const initialState: UserState = {
    user: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserType | null>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
