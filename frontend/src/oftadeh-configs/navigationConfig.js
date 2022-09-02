const saleNavigationconfig = [{
        id: "Main",
        title: "",
        type: "group",
        children: [

            {
                id: "Purchase",
                title: "Purchase Upload",
                type: "item",
                url: "/pages/purchase/purchaseupload",
                exact: true
            },
        ]
    }, {
        id: "Inventory",
        title: "Inventory Management",
        type: "item",
        url: "/pages/inventory/inventory_view",
        exact: true
    },

];

const accountNavigationconfig = [{
        id: "Main",
        title: "",
        type: "group",
        children: [{
                id: "dashboard",
                title: "Dashboard",
                type: "item",
                url: "/dashboard",
                exact: true
            },

        ]
    }, {
        id: "",
        title: "",
        type: "group",
        children: [{
                id: "ledgers",
                title: "Ledgers",
                type: "collapse",
                children: [{
                    id: "ledgers",
                    title: "Supplier Ledger",
                    type: "item",
                    url: "/pages/ledgers/LedgersList",
                    exact: true
                }, {
                    id: "ledgers",
                    title: "Bank Ledgers",
                    type: "item",
                    url: "/pages/ledgers/BankLedgers",
                    exact: true
                }, {
                    id: "ledgers",
                    title: "Cash Ledgers",
                    type: "item",
                    url: "/pages/ledgers/CashLedgers",
                    exact: true
                }, ]
            },

        ]
    }, {
        id: "",
        title: "",
        type: "group",
        children: [{
                id: "registration",
                title: "Registration",
                type: "collapse",
                children: [{
                    id: "bank register",
                    title: "Bank Register",
                    type: "item",
                    url: "/pages/register/registerbank",
                    exact: true
                }, ]
            },

        ]
    },

];


const adminNavigationconfig = [{
    id: "Main",
    title: "",
    type: "group",
    children: [{
            id: "Logs",
            title: "Logs ",
            type: "item",
            url: "/components/Logs/distcarepactlog",
            exact: true
        }, {
            id: "Purchase",
            title: "Purchase Upload",
            type: "item",
            url: "/pages/purchase/purchaseupload",
            exact: true
        }, {
            id: "Inventory",
            title: "Inventory Management",
            type: "item",
            url: "/pages/inventory/inventory_view",
            exact: true
        }, {

            id: "Backup",
            title: "Backup",
            type: "item",
            url: "/pages/Backup",
            exact: true
        },

    ]
}];

const superAdminNavigationconfig = [{
    id: "Main",
    title: "",
    type: "group",
    children: [{
            id: "Logs",
            title: "Logs ",
            type: "item",
            url: "/components/Logs/distcarepactlog",
            exact: true
        }, {
            id: "Purchase",
            title: "Purchase Upload",
            type: "item",
            url: "/pages/purchase/purchaseupload",
            exact: true
        }, {
            id: "Inventory",
            title: "Inventory Management",
            type: "item",
            url: "/pages/inventory/inventory_view",
            exact: true

        },

    ]
}];

export {
    saleNavigationconfig,
    accountNavigationconfig,
    adminNavigationconfig,
    superAdminNavigationconfig
}