import { vi } from "vitest";
import { Row } from "../DataAccessor";
import { Role } from "../../redux/AuthSlice";

export { Row };
export class DataAccessorMock {
  data_url: string | undefined = "";
  headers = {};
  params: { [key: string]: string } | undefined = {};
  values?: Row;
  constructor(data_url?: string,
    params?: { [key: string]: string },
    values?: Row) {
    if (data_url) {
      this.data_url = data_url;
      this.headers = { Authorization: "Bearer token" };
      this.params = params;
      this.values = values;
    }
  }

  fetchRows = vi.fn().mockImplementation(() => {
    console.log("fetchRows in DataAccessor mock was called");
    if (this.data_url === "/api/data") {
      return Promise.resolve([
        {
          Column1: 1,
          Column2: "mock row",
          Column3: "mock description",
          name: "mock name",
        } as Row,
        {
          Column1: 2,
          Column2: "mock row 2",
          Column3: "mock description 2",
          name: "mock name 2",
        } as Row,
        {
          Column1: 3,
          Column2: "mock row 3",
          Column3: "mock description 3",
          name: "mock name 3",
        } as Row,
      ] as Row[]);
    } else if (this.data_url === 'user_info') {
      return Promise.resolve(userInfoMock);
    }
    else if(this.data_url === 'role_per_schema'){
      return Promise.resolve([{user:"mockConfigurator@test.com", schema: "mock schema name", role: Role.USER}]);
    }
    else {
      return Promise.resolve([]);
    }
  });

  addRow = vi.fn().mockImplementation(() => {
    console.log("addRow in DataAccessor mock was called");
    if (this.data_url === "/api/data" && this.values) {
      return Promise.resolve({
        data: {
          ...this.values,
          Column1: 4,
          Column2: "mock row 4",
          Column3: "mock description 4",
        },
        status: 201,
        statusText: "Created",
        headers: {},
        config: {},
      });
    } else {
      return Promise.resolve({
        data: {},
        status: 201,
        statusText: "Created",
        headers: {},
        config: {},
      });
    }
  });

  updateRow = vi.fn().mockImplementation(() => {
    console.log("updateRow in DataAccessor mock was called");
    return Promise.resolve();
  });

  upsert = vi.fn().mockImplementation(() => {
    console.log("upsert in DataAccessor mock was called");
    return Promise.resolve();
  });

  addRow = vi.fn().mockImplementation(()=>{
    console.log("addRow in DataAccessor mock was called");
    return Promise.resolve();
  })
}
