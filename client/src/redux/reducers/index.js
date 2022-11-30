import { combineReducers } from "redux";
import deviceReducers from "../../Pages/Home/store/reducer";
import userReducers from "../../Pages/Header/store/reducer";
import rfidReducers from "../../Pages/Scan/store/reducer"
export default function createReducer(){
    const rootReducer = combineReducers({
      deviceReducers,
      userReducers,
      rfidReducers
    })
    return rootReducer;
}
