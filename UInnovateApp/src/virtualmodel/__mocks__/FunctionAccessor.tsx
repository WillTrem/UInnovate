import { vi } from "vitest";

export class FunctionAccessorMock {
  function_name: string = "";
  constructor(function_name?: string) {
    if (function_name) {
      this.function_name = function_name;
    }
  }

  setBody = vi.fn().mockImplementation(() => {
    console.log("setBody in FunctionAccessor mock was called");
  });

  executeFunction = vi.fn().mockImplementation(() => {
    console.log("executeFunction in FunctionAccessor mock was called");

    switch(this.function_name){
      case "verify_signup": return Promise.resolve({status: 200});
      default: return Promise.resolve(); 
    }
  });

}
