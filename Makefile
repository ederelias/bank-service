export ENVIRONMENT_NAME?=dev
export DOCKER_DEFAULT_PLATFORM?=$(shell docker info --format '{{.OSType}}/{{.Architecture}}')
export BUILD_VERSION?=lastest
export APP_NAME?=bank-service
export IMAGE_NAME=$(APP_NAME):$(BUILD_VERSION)

.PHONY: install build test start docker-build docker-run docker-test

install:
	npm install

build:
	npm run build

test:
	npm run test

deploy:
	@echo "Deploying ✅ -> 🌏 $(APP_NAME) "


# Docker commands
dockerBuild:
	docker build -t bank-system .

dockerBuild:  ## 🐳 Build Docker Image
	@echo "Building 🐳🏗️ $(APP_NAME)... for $(DOCKER_DEFAULT_PLATFORM)"
	docker build -t bank-service --build-arg ROLE=$(APP_NAME) -f Dockerfile -t ${IMAGE_NAME} .
.PHONY: dockerBuild

# Run tests in Docker
dockerTest:
	@echo "Testing 🥊️ $(APP_NAME)"
	docker run --rm -it bank-service npm test
.PHONY: dockerTest

#  Build and Run tests in Docker
dockerRunTests: dockerBuild dockerTest
.PHONY: dockerRunTests

dockerDeploy: dockerBuild dockerTest
	@echo "Deploying ✅ -> 🌏 $(APP_NAME)"
.PHONY: dockerDeploy

# Stop all running containers
dockerStop:
	docker stop $$(docker ps -q)
.PHONY: stop

# Remove all stopped containers
dockerClean:
	docker rm $$(docker ps -a -q)
.PHONY: clean

# Remove all images (use with caution!)
dockerRemoveImages:
	docker rmi $$(docker images -q)
.PHONY: remove-images
