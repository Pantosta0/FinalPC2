module.exports = Object.freeze({
    data: {
        message: "available methods",
        data: [
            {
                description: "check database connection",
                path: "/checkConnection"
            },
            {
                description: "create new hash",
                path: "/hash/:id"
            },
            {
                description: "validate hash",
                path: "/validate/:id?hash=:hash"
            },
            {
                description: "get all s table info",
                path: "/stable"
            },
            {
                description: "get all a table info",
                path: "/atable"
            },
            {
                description: "delete all info",
                path: "/delete"
            }
        ]
    }
});
