import { takeLatest, put, call } from "redux-saga/effects";
import {
  SCAN_RFID
} from "./contants";
import {
  scanRfid
} from "../../../api";
import { saveRfid } from "./action";

function* getRfidSaga({ payload, resolve }) {
  try {
    const response = yield call(scanRfid);
    resolve(response.data);
    yield put(saveRfid(response));
  } catch (e) {
  }
}

export function* myRfid() {
  yield takeLatest(SCAN_RFID, getRfidSaga);
}
