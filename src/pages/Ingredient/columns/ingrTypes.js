export const IngrTypes = {
    dbTable: 'ingredient_types',
    columns: [
        {
            group: -1,
            where: 1,
            ordr: 1,
            field: "ingrTypeID",
            dbCol: "id",
            label: "",
            width: 0,
            dataType: "INT",
            value: "",
            setVar: ":ingrTypeID"
        },
        {
            group: 0,
            ordr: 2,
            field: "acctID",
            dbCol: "account_id",
            label: "",
            width: 0,
            dataType: "INT",
            value: "",
            required: true
        },
        {
            group: 1,
            ordr: 3,
            field: "ingrTypeName",
            dbCol: "name",
            label: "Name",
            width: 200,
            dataType: "STRING",
            value: "",
            required: true,
            setVar: ":ingrTypeName"
        }
    ]
};
