import { vi } from "vitest";
import { Row } from "../DataAccessor";
import { ConfigProperty } from "../ConfigProperties";
import { Role } from "../../redux/AuthSlice";

export { Row };
export class DataAccessorMock {
  data_url: string = "";
  constructor(data_url?: string) {
    if (data_url) {
      this.data_url = data_url;
    }
  }

  fetchRows = vi.fn().mockImplementation(() => {
    console.log("fetchRows in DataAccessor mock was called");
    if (this.data_url === "For List View") {
      return Promise.resolve([
        {
          Column1: 1,
          Column2: "mock row",
          Column3: "mock description",
        },
        {
          Column1: 2,
          Column2: "mock row 2",
          Column3: "mock description 2",
        },
        {
          Column1: 3,
          Column2: "mock row 3",
          Column3: "mock description 3",
        },
      ]);
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

  upsert = vi.fn().mockImplementation(() => {
    console.log("upsert in DataAccessor mock was called");
    return Promise.resolve();
  });

  addRow = vi.fn().mockImplementation(() => {
    console.log("addRow in DataAccessor mock was called");
    return Promise.resolve();
  })

  put = vi.fn().mockImplementation(() => {
    console.log("put in DataAccessor mock was called");
    return Promise.resolve();
  })
}

const userInfoMock =  [
  {
    email: "test@test.com",
    first_name: "first_name",
    last_name: "last_name",
    role: "administrator", // Default role
    is_active: true,
    schema_access: ["mock schema name", "mock schema name 2"]
  }
];