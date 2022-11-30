import { createSelector } from "reselect";
import { INIT_STATE_RFID } from "./state";

const selectMyRfid = (state) => state.rfidReducers || INIT_STATE_RFID;

const selectRfid = createSelector(selectMyRfid, (state)=> state.rfid);
export{selectRfid}