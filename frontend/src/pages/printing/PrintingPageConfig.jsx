import PrintingPage from "./SaleInvoice";

export const PrintingPageConfig = {
  routes: [
    {
      path: "/print/:id",
      exact: true,
      component: PrintingPage
    }
  ]
};
