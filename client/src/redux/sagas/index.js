import { all } from "redux-saga/effects";
import * as Device from "../../Pages/Home/store/saga";
import * as User from "../../Pages/Header/store/saga";
import * as Rfid from "../../Pages/Scan/store/saga";
// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([Device.myDevice(), User.myUser(), Rfid.myRfid()]);
}
