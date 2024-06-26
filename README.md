# UInnovate

- [UInnovate](#uinnovate)
  - [Setting up Docker](#setting-up-docker)
    - [PostgreSQL server \& pgAdmin containers](#postgresql-server--pgadmin-containers)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Supported Testing](#supported-testing)
    - [Unit Tests](#unit-tests)
    - [Component Tests](#component-tests)
    - [Integration Tests](#integration-tests)
    - [Cypress Component Testing](#cypress-component-testing)
  - [Coverage Reports](#coverage-reports)
  - [Start vite server and run cypress](#start-vite-server-and-run-cypress)
  - [Available Scripts](#available-scripts)
  - [Refresh Database Script](#refresh-database-script)
  - [Postman Endpoint Testing](#postman-endpoint-testing)
  - [Configuration](#configuration)
    - [Adding new configuration properties](#adding-new-configuration-properties)
  - [MkDocs Set up with docker](#mkdocs-set-up-with-docker)
  - [PostGOAT Website Deployment](#postgoat-website-deployment)
  - [Running the Postgoat Docker container](#running-the-postgoat-docker-container)


## Setting up Docker

> :warning: Prior to following the steps below, ensure you have: <br/> 1. Installed Docker on your machine.
> <br/> 2. Cloned the repository.

### PostgreSQL server & pgAdmin containers

1. Open the repository in the code editor of your liking.
2. Make a copy of the file `.env.template`.
3. Rename the copy to `.env`.
4. Replace all the fields within '<>' by actual values (not keeping the <>). They can be any of your choosing.
   > 💡 Note that you don't have to create any account or credentials prior to this setup. It will be done automatically when you first run the containers.
5. Add the domain(s) where your PostGOAT instance(s) run from to the PLATFORM_DOMAIN environment variable in `.env`. Example:
    ```
    PLATFORM_DOMAIN=http://localhost:5173, http://localhost:8080
    ```
   > ⚠️ Ensure that you don't put an extra `/` at the end of your domain(s), as they will not be recognized that way.

6. Run the `generate_jwt_secret.sh` script. This should add a JWT_SECRET to your .env file. Leave it as is.
7. Open a terminal window in the root directory of the repository (UInnovate).
8. Run `docker compose --profile tool up` to start the containers.  
   You can stop them at any time by running `docker compose --profile tool stop`.

   > 💡 Note that the pgadmin container will only be targeted by a docker compose command if you specify `--profile tool` as shown above. Otherwise, only the PostgreSQL and the PostgREST containers will be affected. Leaving it out can become handy if you try to reset the database, but you don't want to lose your server connection on pgadmin!

9.  Run `./db.sh -r` from the scipting folder in your terminal to populate the db with the default use case. (Note: \ on Windows, / on Linux AND add `-f '/useCaseXYZ'` to specify a different use case folder. ex: `./db.sh -r -f '/useCase1'` )
   > 💡 Note: To run bash commands on windows you need to:
   - Enable WSL on window
   - A linux distro installed from the windows store
   - see this [link](https://www.thetechedvocate.org/how-to-install-and-run-bash-on-windows-11/) or [video](https://youtu.be/sUsTQTJFmjs?si=qx6QiqUiYSZ8W-6U) for more help
     > 💡 Note: You may run into this error "The command 'docker' could not be found in this WSL 2 distro.""
   - Update your docker desktop to the latest version.
   - Go to Settings > Resources > WSL integration > check "Enable integration with my default WSL distro" or manually toggle the linux distro from the list
     > 💡 Note: You may need to shut down the db and server containers and restart them after running the refresh database command. To do so, use `docker compose stop && docker compose up  -d` in your terminal after the `./db.sh -r` command
10. In a web browser window, access to localhost:5050
11. Log in to pgAdmin with the credentials you provided in your `.env` file.
12. On the home page, click on "Add New Server".
13. In the "General" tab, enter a Name for your local PostgreSQL server (e.g. "UInnovate Local PostgreSQL").
14. In the "Connection" tab, fill the fields with the following values :

    1. Host name/address: db (the name of the PostreSQL container)
    2. Port: 5432 (should be by default)
    3. Maintenance database: postgres (by default, leave untouched)
    4. Username: \<value of POSTGRES_USER in .env>
    5. Password: \<value of POSTGRES_PASSWORD in .env>

    Leave the other fields/settings untouched.

15. Press the save button.

16. You should be able to access the PostgREST API from `localhost:3000` on your browser: to view `table_x` in your database, you would go to
    `localhost:3000/table_x`

    Note: Because of the way PostgREST works, if you specified multiple schemas to be exposed in your compose file (`PGRST_DB_SCHEMAS`), you will only have direct
    access to the tables of the first schema specified. To have access to a table from say the 2nd schema (`schema_Y`), you will need to specify the `Accept-Profile` header in your GET request with the value `schema_Y` as shown in the Postman request below

    ![Postman request](postman_example_request.png)

You should be good to go now :smile:

## Getting Started

The set of steps to follow in order to run the app locally on your machine.

### Prerequisites

1. You will need a [stable](https://nodejs.org/en/download) version of Node.js, hence install the LTS version of Node.js.

2. Install NPM, if you don't have it already on your machine.

### Installation

1. If you already cloned the project during "Setting up Docker", you can omit this step.

```bash
git clone https://github.com/WillTrem/UInnovate.git
```

2. Open the project via your preferred editor/IDE and go to the project directory.

```bash
cd UInnovateApp
```

3. Install all the dependencies.

```bash
npm install
```

4. Start the server.

```bash
npm run dev
```

## Supported Testing

The supported types of tests are:

1. Unit Tests using Vitest
2. Integration Tests using Cypress
3. API testing with SoapUI

### Unit Tests

The unit tests will be written using [Vitest](https://vitest.dev/guide/) in the `tests/unit` directory.

To run the unit tests

```bash
npm run test:unit
```

## Coverage Reports

Our current coverage reports only support Vitest unit tests by running

```bash
npm run coverage
```

## Start vite server and run cypress

To run the vite server and run the cypress application at the same time

```bash
npm run cy:e2e
```

## Available Scripts

You can run the following scripts with `npm run <script>`.

| Script              | Description                        |
| ------------------- | ---------------------------------- |
| `build`             | Builds the project for production. |
| `dev`               | Starts the development server.     |
| `preview`           | Preview of the application.        |
| `lint`              | Runs ESLint on the project.        |
| `test:unit`         | Runs unit tests.                   |
| `coverage`          | Coverage report for Vitest.        |

Additionally, you can run the script `npx cypress open`

## Refresh Database Script

The refresh_database.sh script allows for the application developer to
refresh the schema, tables, and data within the database fo each different use cases. To run the
refresh script, follow the steps below:

1. Open a terminal
2. Change directories to the UInnovate folder where the refresh_database.sh is located
3. From a terminal, run:

   💡 _.\refresh_database.sh_ for the default use case 1 folder.

   💡 _.\refresh_database.sh --folder '/useCase2'_ for instance to change to use case 2 folder.

   💡 _.\refresh_database.sh -f '/useCase2'_ will yield to the same result as _./refresh_database.sh --folder '/useCase2'_

4. A log file will be generated to see everything that was done to the DB and any errors that occurred

## SoapUI Endpoint Testing

To use SoapUI for testing the PostgREST API corrrectly accessing the database:

1. Have SoapUI downloaded on your local machine.
2. Load the xml file within the api_testing folder
3. Navigate through the UI, and click on any individual tests you would like to run

## Configuration

### Adding new configuration properties

To add a new configuration property to the database, simply add an entry for it in `meta_data.sql` (under ./database) where indicated. Then, simply refresh the database using the `refresh_database.sh` script.

Also, don't forget to add an entry for it in the enum of the `ConfigProperties.ts` file to use it within the code itself.

## MkDocs Set up with docker

Open a terminal & make sure docker is running.

Follow the following steps:

```bash
cd documentation
```

```bash
docker pull polinux/mkdocs
```

Create the image.

```bash
docker build -t polinux/mkdocs .
```

Run the container.

```bash
docker run -it -p 8080:8000  polinux/mkdocs
```

You should be able to see the mkdocs website: http://localhost:8080/
You can go also through docker to open it but don't use http://0.0.0.0:8000/

If you want to add pages, they should go under documentation/docs.

## PostGOAT Website Deployment

Link to repo: https://github.com/MariaR001/PostGoat
<br>
Link to website: https://uinnovate.netlify.app/

## Running the Postgoat Docker container



First you'll need to go inside your .env file and add the following to the PLATFORM_DOMAIN variable:

```http://localhost:8080
```
This ensures we expose the PostgREST API to the frontend. This enables the frontend to make requests to the PostgREST API, which allows you to see the containerized application when running the Postgoat container.

Then, follow the steps below:

1. From root, `cd UInnovateApp` and run `npm run build`
2. Notice there is a new folder called 'build' inside the UInnovate repo. This folder containers the minified JS for the frontend that will be served as a static web page.

3. `cd ../` back to root and run the following command to build the docker image from the Dockerfile.goat file, which is at root level:

```
DOCKER_BUILDKIT=1 docker build -f Dockerfile.goat -t goat-dock .
```

Note; this can take up to a few minutes the first time, it's normal.

4. `docker run -p 8080:80 goat-dock` to run the container. This will serve the minified js as a static web page on an Nginx server.

5. Visit localhost:8080 to see Postgoat container running on your local machine.

## Diversity Statement
At UInnovate, we believe:
- That diversity comes in many different forms which we welcome 
- In having an environment where anyone can contribute their talents and ideas into the project
- In the importance of your data being safe and secure from outside breaches
- That while using our software, your data will retain its confidentiality and integrity


