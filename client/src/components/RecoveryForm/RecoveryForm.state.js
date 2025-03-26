import { isEmailValid, isPasswordValid, isCodeValid } from "../../helpers/util";

export const INITIAL_STATE = {
  values: {
    email: "",
    code: "",
    password: "",
    repeatPassword: ""
  },
  isValidStep0: true,
  isValidStep1: true,
  isValidStep2: {
    password: true,
    repeatPassword: true
  },
  isReadyToSubmitStep0: false,
  isReadyToSubmitStep1: false,
  isReadyToSubmitStep2: false
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
    case "RESET_READINESS_STEP_0": {
      return {
        ...state,
        isReadyToSubmitStep0: false
      };
    }
    case "RESET_READINESS_STEP_1": {
      return {
        ...state,
        isReadyToSubmitStep1: false
      };
    }
    case "RESET_READINESS_STEP_2": {
      return {
        ...state,
        isReadyToSubmitStep2: false
      };
    }
    case "RESET_FORM":
      return INITIAL_STATE;
    case "SUBMIT_STEP_0": {
      const emailValidity =
        state.values.email && isEmailValid(state.values.email.trim());
      return {
        ...state,
        isValidStep0: emailValidity,
        isReadyToSubmitStep0: emailValidity
      };
    }
    case "SUBMIT_STEP_1": {
      const codeValidity = isCodeValid(state.values.code.trim());
      return {
        ...state,
        isValidStep1: codeValidity,
        isReadyToSubmitStep1: codeValidity
      };
    }
    case "SUBMIT_STEP_2": {
      const passwordValidity = isPasswordValid(state.values.password);
      const repeatPasswordValidity =
        state.values.password === state.values.repeatPassword;
      return {
        ...state,
        isValidStep2: {
          password: passwordValidity,
          repeatPassword: repeatPasswordValidity
        },
        isReadyToSubmitStep2: passwordValidity && repeatPasswordValidity
      };
    }
  }
}
