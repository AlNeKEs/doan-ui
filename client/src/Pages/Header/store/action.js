import {
  SET_LOADING,
  CREATE_USER
} from "./contants";
export const setLoading = (payload) => {
  return {
    type: SET_LOADING,
    payload,
  };
};

export const createUser = (payload, resolve) => {
  return {
    type: CREATE_USER,
    payload,
    resolve
  };
};

export function asyncCreateUserAction(dispatch) {
  return function returnAsync(payload) {
      return new Promise((resolve) =>
          dispatch(createUser(payload, resolve))
      );
  };
}
