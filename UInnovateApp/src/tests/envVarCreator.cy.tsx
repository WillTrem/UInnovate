// envVarCreator.cy.ts

describe("Environment Variable Creator", () => {
	beforeEach(() => {
		cy.visit("/settings/scripting"); // Navigate to the scripting tab in settings
	});

	it("allows creating a new environment variable", () => {
		// Open modal to add the new new env var
		cy.get("button").contains("New Environment Variable").click();

		// Fill out form to create the var
		cy.get('input[name="name"]').type("TestVariable");
		cy.get('input[name="value"]').type("TestValue");

		// Submit modal
		cy.get("button").contains("Save").click();

		// Verify that the new variable appears in the list
		cy.get(".env-var-list").should("contain", "TestVariable");
		cy.get(".env-var-list").should("contain", "TestValue");

		cy.contains("Environment variable saved successfully.").should("exist");
	});
});
