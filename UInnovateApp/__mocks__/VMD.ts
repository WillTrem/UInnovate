import DataAccessorMock from "./DataAccessor";

export default {
  VirtualModelDefinition: class {
    getRowsDataAccessor() {
      console.log("getRowsDataAccessor in VMD mock was called");
      return DataAccessorMock;
    }
    getSchemas() {
      console.log("getSchemas in VMD mock was called");
      return [
        { schema_name: "mock schema name" },
        { schema_name: "mock schema name 2" },
      ];
    }
  },
};
