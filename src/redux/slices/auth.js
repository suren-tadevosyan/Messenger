import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: !!localStorage.getItem("userId"),
  email: null,
  token: null,
  id: null,
  name: null,
  photo: null,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, ) {
      state.isLoggedIn = !!localStorage.getItem("userId");
    },
    setUser(state, action) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.photo = action.payload;
    },
    removeUser(state) {
      state.email = null;
      state.token = null;
      state.id = null;
      state.name = null;
      state.photo = null;
    },
    updatePhoto(state, action) {
      state.photo = action.payload;
    },
  },
});

const { actions, reducer } = authSlice;
export const { loginUser, setUser, removeUser, updatePhoto } = actions;
export default reducer;
