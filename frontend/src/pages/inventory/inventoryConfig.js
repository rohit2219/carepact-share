import InventoryView from './inventoryView'
import InventoryEdit from './inventoryEdit'
import InventoryAdd from './inventoryAdd'
import TestEdit from './testEdit'

export const InventoryViewConfig = {
    routes: [
      {
        path: "/pages/inventory/inventory_view",
        exact: true,
        component: InventoryView
      }
    ]
  };
export const InventoryEditConfig = {
  routes: [
    {
      path: "/pages/inventory/inventory_edit/:id/:batch",
      exact: true,
      component: InventoryEdit
    }
  ]
};
export const InventoryAddConfig = {
  routes: [
    {
      path: "/pages/inventory/inventory_add",
      exact: true,
      component: InventoryAdd
    }
  ]
};

export const TestConfig = {
  routes: [
    {
      path: "/pages/inventory/test",
      exact: true,
      component: TestEdit
    }
  ]
};