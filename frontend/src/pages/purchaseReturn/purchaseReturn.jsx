import SupplierReturn from '../purchaseReturn/SupplierReturn';
import ReturnList from '../purchaseReturn/returnList';
import ReturnDetails from '../purchaseReturn/returndetails';
import ItemReturn from '../purchaseReturn/ItemReturn';
import DebitNote from '../purchaseReturn/debitNote';

export const SupplierReturnConfig = {
    routes: [
      {
        path: "/pages/purchaseReturn/supplierreturn",
        exact: true,
        component: SupplierReturn
      }
    ]
  };
  export const ReturnListConfig = {
    routes: [
      {
        path: "/pages/purchaseReturn/returnlist",
        exact: true,
        component: ReturnList
      }
    ]
  };
  export const ReturnDetailsConfig = {
    routes: [
      {
        path: "/pages/purchaseReturn/returndetails/:id",
        // path: "/pages/orders/orderdetails",
        exact: true,
        component: ReturnDetails
      }
    ]
  };
  export const ItemReturnConfig = {
    routes: [
      {
        path: "/pages/purchaseReturn/itemreturn",
        exact: true,
        component: ItemReturn
      }
    ]
  };
  export const DebitNoteConfig = {
    routes: [
      {
        path: "/pages/purchaseReturn/debitnote/:id",
        exact: true,
        component: DebitNote
      }
    ]
  };