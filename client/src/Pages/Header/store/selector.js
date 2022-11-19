import { createSelector } from "reselect";
import { INIT_STATE_USER } from "./state";

const selectUser = (state) => state.userReducers || INIT_STATE_USER;

const selectLoading = createSelector(selectUser, (state) => state.isLoading);
export{selectLoading}