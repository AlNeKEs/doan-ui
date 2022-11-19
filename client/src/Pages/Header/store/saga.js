import { takeLatest, put, call} from "redux-saga/effects";
import { CREATE_USER } from "./contants";
import { registerUser } from "../../../api";
import { setLoading } from "./action";

function* createDeviceSaga({ payload, resolve, reject }) {
  try {
    yield put(setLoading(true));
    const response = yield call(registerUser, payload);
    console.log(response);
    resolve(response.data);
    yield put(setLoading(false));
  } catch (e) {
    reject(e)
    yield put(setLoading(false));
  }
}
export function* myUser() {
  yield takeLatest(CREATE_USER, createDeviceSaga);
}
