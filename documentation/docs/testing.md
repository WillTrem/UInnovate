
## Supported Testing

The supported types of tests are:

1. Unit Tests using Vitest

    In the application, Vitest is used as the testing framework for writing unit tests in TypeScript. Vitest provides functions like `describe`, `it`, `expect`, `beforeAll`, and `afterAll` to define test suites, test cases, assertions, and setup/teardown tasks, respectively. Here are reasons we picked Vitest:

    - **Test Organization:** Tests are organized into suites using the `describe` function, which helps group related tests together. Each test case is defined using the `it` function, focusing on a specific functionality or scenario.

    - **Setup and Teardown:** The `beforeAll` function is used to set up any necessary fixtures or dependencies before running the tests. Conversely, the `afterAll` function is used to clean up resources after all tests have been executed.

    - **Mocking Dependencies:** Vitest allows for easy mocking of dependencies using tools like `axios-mock-adapter` or custom mocks. This is useful for isolating the code under test and controlling the behavior of dependencies.

    - **Assertions:** Inside each `it` block, the `expect` function is used to make assertions about the behavior of the code being tested. These assertions verify that the code behaves as expected under different conditions.

    - **Spying on Functions:** The `spyOn` function can be used to spy on functions or methods to track their calls and optionally mock their behavior. This is helpful for testing interactions with external APIs or modules.

Overall, Vitest provides a flexible and easy-to-use framework for writing and running unit tests in TypeScript, ensuring that the code behaves correctly and meets the specified requirements.

To run the unit tests with Vitest, run the command below in bash:

```bash
npm run test:unit
```

2. Database Unit Tests using PGtap

    In the application, PGtap is used as the testing framework for writing unit tests in SQL, directly on the database. PGtap allows us to perform unit tests at a base level, whenever any changes are made to our database. Here are reasons we used PGtap:

    - **Ensuring Functionality**: We wrote tests using PGTAP to verify the functionality of our database functions. This helped us catch bugs early and ensure that our functions worked as intended.

    - **Improving Code Quality**: By writing tests for our database functions, we improved the overall quality of our code. The tests acted as documentation and ensured that our functions met the specified requirements.

    - **Community Support**: PGTAP's wide usage and strong community of developers provided us with help and resources online when we encountered issues or needed guidance on writing tests.

Using PGTAP helped us ensure the reliability and correctness of our database functions, leading to a more robust and maintainable application.

To run the PGTAP tests from a specific sql file, use the below command in a terminal.

```
psql -f unittest.sql <insert_the_name_of_the_database_you_are_testing>
```

3. API testing with SoapUI
    In the application, SoapUI is used as the testing framework for writing api tests, through a easily readable interface. It is also open-source, and the settings are all stored very visibly within a public xml file. Here are reasons we used SoapUI:

    - **Ensuring API Functionality**: We utilized SoapUI to create comprehensive tests for our APIs, ensuring their functionality and catching any issues early in development.

    - **Integrated Load Tests**: We used this same platform to also setup load tests for the API, so we can get an idea of how much traffic it cant take before getting overloaded. This allows us to make good choices regarding the performance of the API.

    - **Facilitating API Refactoring**: SoapUI tests provided us with confidence when refactoring our APIs, as we could verify that our changes hadn't introduced any regressions.

    - **Community Support**: SoapUI's popularity and strong community of developers provided us with help and resources online, making it easier to troubleshoot issues and write effective tests.

Using SoapUI for API testing helped us ensure the reliability and correctness of our APIs, leading to a more robust and maintainable application.
 To run the tests for the API, open the software for SoapUI (available for free online), and load the xml file corresponding to our tests in the project (api_testing/UInnovate-soapui-project.xml).