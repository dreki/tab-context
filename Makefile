# Run docker-compose.yml, building if necessary
run:
	docker-compose up --build

# Shell into container with name 'app'
shell:
	docker exec -it app bash
