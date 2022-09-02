import AddUser from "./AddUser";
import AccountMaster from "./AccountMaster";

export const AddUserConfig = {
  routes: [
    {
      path: "/pages/users/addcust",
      exact: true,
      component: AddUser
    }
  ]
};

export const AccountMasterConfig = {
  routes: [
    {
      path: "/pages/users/addsupplier",
      exact: true,
      component: AccountMaster
    }
  ]
};
