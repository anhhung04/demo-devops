.PHONY: setup_env up down log db clean_db test
setup_env:
	pip3 install virtualenv
	virtualenv demo_devops_backend
	source demo_devops_backend/bin/activate
	pip3 install -r requirements.txt
	pip3 install -r requirements-dev.txt

up:
	docker compose up -d --build

down:
	docker compose down

log:
	docker compose logs

db:
	docker run -p5432:5432 --name=dev_demo_devops_db -d -e POSTGRES_USER=dev_user -e POSTGRES_PASSWORD=secret -e POSTGRES_DATABASE=dev_demo_devops postgres:13

clean_db:
	docker stop dev_demo_devops_db
	docker rm dev_demo_devops_db
test:
	cd ./src && PYTHONPATH=./ pytest  --disable-warnings