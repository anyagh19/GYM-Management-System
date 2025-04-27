import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    status: localStorage.getItem("status") ? JSON.parse(localStorage.getItem("status")) : false,
    userData: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null,
    role: localStorage.getItem("role") || null,
  };
  

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.role = action.payload.role;
            localStorage.setItem("status", JSON.stringify(true));
            localStorage.setItem("userData", JSON.stringify(action.payload.userData));
            localStorage.setItem("role", action.payload.role);
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.role = null;
            localStorage.setItem("status", JSON.stringify(false)); 
            localStorage.removeItem("userData");
            localStorage.removeItem("role");
        },
    },
});

export const {login, logout} = AuthSlice.actions;

export default AuthSlice.reducer;