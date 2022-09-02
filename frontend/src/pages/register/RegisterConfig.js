import BankRegister from "./BankRegister.js";

export const BankRegisterConfig = {
  routes: [
    {
      path: "/pages/register/registerbank",
      exact: true,
      component: BankRegister
    }
  ]
};
