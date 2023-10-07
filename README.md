# UInnovate

## Setting up Docker
> :warning: Prior to following the steps below, ensure you have: <br/> 1. Installed Docker on your machine. 
<br/> 2. Cloned the repository.
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
    1.  Host name/address: db (the name of the PostreSQL container)
    2.  Port: 5432 (should be by default)
    3.  Maintenance database: postgres (by default, leave untouched)
	4. Username: \<value of POSTGRES_USER in .env>
	5. Password: \<value of POSTGRES_PASSWORD in .env> 

	Leave the other fields/settings untouched.
12. Press the save button. 
13. Back in your terminal window, execute 

```docker exec -i db /usr/bin/pg_restore -U <POSTGRES_USER in .env> -d uinnovate_test_db /dumps/uinnovate-test-db-dump.backup -c --if-exists --no-owner --no-privileges```
    
This will copy the data from the dump into your local database.  
*Make sure that you replace `<POSTGRES_USER in .env>` with the actual value!  
You should be good to go now :smile: 