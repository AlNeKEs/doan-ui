import { INIT_STATE_USER } from "./state";
import { produce } from "immer";
import { SET_LOADING} from "./contants";

export default function userReducers(state = INIT_STATE_USER, action) {
  return produce(state, (draf) => {
    switch (action.type) {
      case SET_LOADING:
        draf.isLoading = action.payload;
        break;
      default:
        return state;
    }
  });
}
