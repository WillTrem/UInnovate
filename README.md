# UInnovate

## Setting up Docker

> :warning: Prior to following the steps below, ensure you have: <br/> 1. Installed Docker on your machine.
> <br/> 2. Cloned the repository.

### PostgreSQL server & pgAdmin containers

1. Open the repository in the code editor of your liking.
2. Make a copy of the file `.env.template`.
3. Rename the copy to `.env`.
4. Replace all the fields within '<>' by actual values (not keeping the <>). They can be any of your choosing.

   > :bulb: Note that you don't have to create any account or credentials prior to this setup. It will be done automatically when you first run the containers.

5. Open a terminal window in the root directory of the repository (UInnovate).
6. Run `docker compose up` to start the containers.  
   You can stop them at any time by running `docker compose stop`.

7. In a web browser window, access to localhost:5050
8. Log in to pgAdmin with the credentials you provided in your `.env` file.
9. On the home page, click on "Add New Server".
10. In the "General" tab, enter a Name for your local PostgreSQL server (e.g. "UInnovate Local PostgreSQL").
11. In the "Connection" tab, fill the fields with the following values :

    1. Host name/address: db (the name of the PostreSQL container)
    2. Port: 5432 (should be by default)
    3. Maintenance database: postgres (by default, leave untouched)
    4. Username: \<value of POSTGRES_USER in .env>
    5. Password: \<value of POSTGRES_PASSWORD in .env>

    Leave the other fields/settings untouched.

12. Press the save button.
13. You should be able to access the PostgREST API from `localhost:3000` on your browser: to view `table_x` in your database, you would go to
    `localhost:3000/table_x`

    Note: Because of the way PostgREST works, if you specified multiple schemas to be exposed in your compose file (`PGRST_DB_SCHEMAS`), you will only have direct
    access to the tables of the first schema specified. To have access to a table from say the 2nd schema (`schema_Y`), you will need to specify the `Accept-Profile` header in your GET request with the value `schema_Y` as shown in the Postman request below

    ![Postman request](postman_example_request.png)

You should be good to go now :smile:
