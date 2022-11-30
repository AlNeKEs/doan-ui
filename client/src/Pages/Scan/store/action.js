import {
  SCAN_RFID,
  SAVE_RFID
} from "./contants";

export const scanRfid = (payload, resolve) => {
  return {
    type: SCAN_RFID,
    payload,
    resolve
  };
};

export function asyncScanRfidAction(dispatch) {
  return function returnAsync(payload) {
      return new Promise((resolve) =>
          dispatch(scanRfid(payload, resolve))
      );
  };
}

export const saveRfid = (payload) => {
  return {
    type: SAVE_RFID,
    payload,
  };
};



