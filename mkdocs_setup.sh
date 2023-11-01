#!/bin/bash

# Make sure docker is running & open a terminal

# Change directory to 'documentation'
cd documentation

# Pull the Docker image 'polinux/mkdocs'
docker pull polinux/mkdocs

# Build a Docker container with the image and tag it as 'polinux/mkdocs'
docker build -t polinux/mkdocs .

# Run the Docker container in interactive mode, mapping port 8080 on the host to port 8000 in the container
docker run -it -p 8080:8000 polinux/mkdocs