import Logger from "../../virtualmodel/Logger";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

let mock: MockAdapter;

beforeAll(() => {
    mock = new MockAdapter(axios);
});

afterAll(() => { 
    mock.restore();
});

describe("Logger", () => {
    it("should log user action", async () => {
        const mockResponse = {
            id: 1,
            timestamp: "2021-09-08T07:00:00.000Z",
            user_id: "admin",
            action: "login",
            details: "user logged in",
            schema_name: "meta",
            table_name: "user_logs",
        };

        mock.onPost("http://localhost:3000/").reply(200, mockResponse);

    });
});

