import { isEmailValid, isPasswordValid } from "../../helpers/util";

export const INITIAL_STATE = {
  values: {
    email: "",
    password: ""
  },
  isValid: {
    email: true,
    password: true
  },
  isReadyToSubmit: false
};

export function formReducer(state, action) {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        values: {
          ...state.values,
          ...action.payload
        }
      };
    case "SUBMIT": {
      const passwordValidity = isPasswordValid(state.values.password);
      const emailValidity = state.values.email && isEmailValid(state.values.email.trim());
      return {
        ...state,
        isValid: {
            password: passwordValidity,
            email: emailValidity
        },
        isReadyToSubmit: passwordValidity && emailValidity
      };
    }
  }
}
