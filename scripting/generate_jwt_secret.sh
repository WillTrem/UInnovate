#!/bin/bash

# generate a 32 characters random secret
export LC_CTYPE=C
jwt_secret="$(< /dev/random tr -dc A-Za-z0-9 | head -c32)" 

# output it in .env (append if doesn't exist and updates if exists)
if grep -q "JWT_SECRET=" ../.env; then	
	sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$jwt_secret/" "../.env"
else
	echo "" >> ../.env
	echo "# Authentication" >> ../.env
	echo "# YOU NEED TO DELETE YOUR DB VOLUMES IF YOU MODIFY THE JWT_SECRET" >> ../.env
	echo "JWT_SECRET=$jwt_secret" >> ../.env
fi

echo "New JWT secret generated. Please delete all db volumes and recreate your containers."