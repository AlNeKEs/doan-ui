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

export const createUser = (payload, resolve, reject) => {
  return {
    type: CREATE_USER,
    payload,
    resolve, 
    reject
  };
};

export function asyncCreateUserAction(dispatch) {
  return function returnAsync(payload) {
      return new Promise((resolve, reject) =>
          dispatch(createUser(payload, resolve, reject))
      );
  };
}
