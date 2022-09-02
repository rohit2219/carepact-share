import React from "react";
import { Redirect } from "react-router-dom";

import { DashboardPageConfig } from "../pages/dashboard/DashboardPageConfig";
import { AboutPageConfig } from "../pages/about/AboutPageConfig";
import { AddPostPageConfig } from "../pages/posts/add-post/AddPostPageConfig";
import { AllPostsPageConfig } from "../pages/posts/all-posts/AllPostsPageConfig";
import { CalendarPageConfig } from "../pages/calendar/CalendarPageConfig";
import { ForgotPasswordPageConfig } from "../pages/auth/forgot-password/ForgotPasswordPageConfig";
import { LoginPageConfig } from "../pages/auth/login/LoginPageConfig";

import { LogPageConfig } from "../pages/Logs/LogConfig";
import { RegisterPageConfig } from "../pages/auth/register/RegisterPageConfig";
import { Error404PageConfig } from "../pages/errors/404/Error404PageConfig";
import { Error500PageConfig } from "../pages/errors/500/Error500PageConfig";
import { AddUserConfig,AccountMasterConfig } from "../pages/users/UsersConfig";
import { PurchaseentryConfig,NewentryConfig,historyConfig,PurchaseEditConfig,PurchaseViewConfig,PurchaseuploadConfig,PurchaseVerifyConfig } from "../pages/purchase/PurchaseConfig";
import { BankRegisterConfig} from "../pages/register/RegisterConfig";
import { SupplierReturnConfig, ReturnListConfig, ReturnDetailsConfig, ItemReturnConfig, DebitNoteConfig} from "../pages/purchaseReturn/purchaseReturn";
import {InventoryViewConfig, InventoryEditConfig, InventoryAddConfig, TestConfig} from "../pages/inventory/inventoryConfig"
import {ItemViewConfig} from "../pages/itemMaster/itemMasterConfig";
import {backupconfig} from "../pages/backup/backupConfig";
// import { DocumentationConfig } from "../pages/documentation/DocumentationConfig";

const routeConfigs = [
  ...DashboardPageConfig.routes,
  ...AllPostsPageConfig.routes,
  ...AddPostPageConfig.routes,
  ...CalendarPageConfig.routes,
  ...ForgotPasswordPageConfig.routes,
  ...LoginPageConfig.routes,
  ...RegisterPageConfig.routes,
  ...Error404PageConfig.routes,
  ...Error500PageConfig.routes,
  ...AboutPageConfig.routes,
  ...AddUserConfig.routes,
  ...AccountMasterConfig.routes,
  ...PurchaseentryConfig.routes,
  ...NewentryConfig.routes,
  ...historyConfig.routes,
  ...PurchaseEditConfig.routes,
  ...BankRegisterConfig.routes,
  ...SupplierReturnConfig.routes,
  ...ReturnListConfig.routes,
  ...ReturnDetailsConfig.routes,
  ...ItemReturnConfig.routes,
  ...DebitNoteConfig.routes,
  ...InventoryViewConfig.routes,
  ...InventoryEditConfig.routes,
  ...InventoryAddConfig.routes,
  ...TestConfig.routes,
  ...PurchaseViewConfig.routes,
  ...PurchaseuploadConfig.routes,
  ...PurchaseVerifyConfig.routes,
  ...ItemViewConfig.routes,
  ...LogPageConfig.routes,
  ...backupconfig.routes
];

const routes = [
  ...routeConfigs,
  {
    component: () => <Redirect to="/pages/errors/error-404" />
  }
  // {
  //   path: "/test",
  //   exact: true,
  //   component: <Example />
  // }
];

export default routes;
