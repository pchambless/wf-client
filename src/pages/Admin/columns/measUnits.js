export const MeasUnits = {
  dbTable: 'global_measure_units',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "measID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ":measID",
    },
    {
      group: 1,
      ordr: 2,
      field: "name",
      dbCol: "value",
      label: "Name",
      width: 200,
      dataType: "STRING",
      required: 1,
      setVar: ":name",
    },
    {
      group: 1,
      ordr: 3,
      field: "abbrev",
      dbCol: "hover_text",
      label: "Abbrev",
      width: 150,
      dataType: "STRING",
      required: 1,
      setVar: ":abbrev",
    }
  ]
};

export default MeasUnits;
