import { combineReducers } from "redux";
import deviceReducers from "../../Pages/Home/store/reducer";
import userReducers from "../../Pages/Header/store/reducer"
export default function createReducer(){
    const rootReducer = combineReducers({
      deviceReducers,
      userReducers
    })
    return rootReducer;
}
