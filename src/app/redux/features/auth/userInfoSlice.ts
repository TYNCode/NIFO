import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserInfo } from "../../../interfaces"


interface UserState {
  userInfo:UserInfo
}

const initialState: UserState = {
  userInfo :null
}

const userSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
      setUserInfo(state, action: PayloadAction<any>) {
        state.userInfo = action.payload;
      },
      clearUserInfo(state) {
        state.userInfo = null;
      },
    },
  });
  
  export const { setUserInfo, clearUserInfo } = userSlice.actions;
  export default userSlice.reducer;