import PurchaseForm from "./PurchaseForm";
import PurchaseEntry from "./PurchaseEntry";
import PurchaseHistory from "./PurchaseHistory";
import PurchaseEdit from "./PurchaseEdit";
import PurchaseView from "./PurchaseView";
import PurchaseUpload from "./PurchaseUpload";
import PurchasVerify from "./PurchaseVerify";


export const PurchaseentryConfig = {
  routes: [
    {
      path: "/pages/purchase/purchaseentry",
      exact: true,
      component: PurchaseForm
    }
  ]
};
export const PurchaseuploadConfig = {
  routes: [
    {
      path: "/pages/purchase/purchaseupload",
      exact: true,
      component: PurchaseUpload
    }
  ]
};
export const NewentryConfig = {
  routes: [
    {
      path: "/pages/purchase/newEntry",
      exact: true,
      component: PurchaseEntry
    }
  ]
};
export const historyConfig = {
  routes: [
    {
      path: "/pages/purchase/history",
      exact: true,
      component: PurchaseHistory
    }
  ]
};
export const PurchaseEditConfig = {
  routes: [
    {
      path: "/pages/purchase/edit/:id",
      exact: true,
      component: PurchaseEdit
    }
  ]
};
export const PurchaseViewConfig = {
  routes: [
    {
      path: "/pages/purchase/view/:id",
      exact: true,
      component: PurchaseView
    }
  ]
};
export const PurchaseVerifyConfig = {
  routes: [
    {
      path: "/pages/purchaseupload/verify/:id",
      exact: true,
      component: PurchasVerify
    }
  ]
};

