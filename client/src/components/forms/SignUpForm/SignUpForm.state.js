import { isEmailValid, isPasswordValid } from "../../../helpers/util";

export const INITIAL_STATE = {
  values: {
    lastName: "",
    firstName: "",
    patronymic: "",
    email: "",
    password: "",
    repeatPassword: "",
    country: "",
    employment: "",
    themes: "",
    status: ""
  },
  isValidTab0: {
    lastName: true,
    firstName: true,
    email: true
  },
  isValidTab1: {
    password: true,
    repeatPassword: true
  },
  isValidTab2: {
    country: true,
    employment: true
  },
  isReadyToSubmitTab0: false,
  isReadyToSubmitTab1: false,
  isReadyToSubmitTab2: false,
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
    case "SUBMIT_TAB_0": {
      const lastNameValidity = state.values.lastName?.trim().length > 0;
      const firstNameValidity = state.values.firstName?.trim().length > 0;
      const emailValidity =
        state.values.email && isEmailValid(state.values.email.trim());
      return {
        ...state,
        isValidTab0: {
          lastName: lastNameValidity,
          firstName: firstNameValidity,
          email: emailValidity
        },
        isReadyToSubmitTab0:
          lastNameValidity && firstNameValidity && emailValidity
      };
    }
    case "SUBMIT_TAB_1": {
      const passwordValidity = isPasswordValid(state.values.password);
      const repeatPasswordValidity =
        state.values.password === state.values.repeatPassword;
      return {
        ...state,
        isValidTab1: {
          password: passwordValidity,
          repeatPassword: repeatPasswordValidity
        },
        isReadyToSubmitTab1: passwordValidity && repeatPasswordValidity
      };
    }
    case "SUBMIT_TAB_2": {
      const countryValidity = state.values.country?.trim().length > 0;
      const employmentValidity = state.values.employment?.trim().length > 0;
      return {
        ...state,
        isValidTab2: {
          country: countryValidity,
          employment: employmentValidity
        },
        isReadyToSubmitTab2:
          countryValidity && employmentValidity
      };
    }
    case "SUBMIT": {
      return {
        ...state,
        isReadyToSubmit: true
      };
    }
    case "RESET_READINESS": {
      return {
        ...state,
        isReadyToSubmit: false
      };
    }
  }
}
