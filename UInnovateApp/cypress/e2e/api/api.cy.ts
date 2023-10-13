/// <reference types="cypress" />
// About API testing: https://docs.cypress.io/api/commands/request#Method-and-URL
describe("Check http://localhost:5173/ request", () => {
    it("Get 200 status", () => {
        cy.request({
            method: "GET",
            url: `http://localhost:5173/`,
        }).as("getEntries");

        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        cy.get("@getEntries").should((response: any) => {
            expect(response.status).to.eq(200);
            expect(response).to.have.property("headers");
        });
    });
});