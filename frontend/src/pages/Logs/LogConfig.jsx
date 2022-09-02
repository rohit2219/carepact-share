
import { DistCarepactLogPage } from "./DistCarepactLogPage";
import { DistProductsPage } from "./DistProductPage";
import { DistProductsNIPage } from "./DistProductsNIPage";
import { MoreSearchPage } from "./MoreSearchPage";

export const LogPageConfig = {
  routes: [
    {
      path: "/components/Logs/distcarepactlog",
      exact: true,
      component: DistCarepactLogPage
    },
   
     {
      path: "/components/Logs/distproduct/:id",
      exact: true,
      component: DistProductsPage
    },
     {
      path: "/components/Logs/distproductni/:id",
      exact: true,
      component: DistProductsNIPage
    },
     {
      path: "/components/Logs/MoreSearch",
      exact: true,
      component: MoreSearchPage
    },
  ]
};
