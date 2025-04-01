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
            required: 1
        },
        {
            group: 1,
            ordr: 3,
            field: "ingrTypeName",
            dbCol: "name",
            label: "Name",
            width: 200,
            dataType: "STRING",
            required: 1,
            setVar: ":ingrTypeName"
        }
    ]
};
