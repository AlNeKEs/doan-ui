import { INIT_STATE_RFID } from "./state";
import { produce } from "immer";
import { SAVE_RFID } from "./contants";

export default function rfidReducers(state = INIT_STATE_RFID, action) {
  return produce(state, (draf) => {
    switch (action.type) {
      case SAVE_RFID:
        draf.rfid = action.payload.data
        break;
      default:
        return state;
    }
  });
}
