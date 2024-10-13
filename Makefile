export ENVIRONMENT_NAME?=dev
export DOCKER_DEFAULT_PLATFORM?=$(shell docker info --format '{{.OSType}}/{{.Architecture}}')
export BUILD_VERSION?=latest
export APP_NAME?=bank-service
export IMAGE_NAME=$(APP_NAME):$(BUILD_VERSION)

.PHONY: install build test deploy dockerBuild dockerTest dockerRunTests dockerDeploy dockerStop dockerClean dockerRemoveImages

install:
	@echo "Installing dependencies..."
	npm install

build:
	@echo "Building application..."
	npm run build

test:
	@echo "Running tests..."
	npm run test

deploy:
	@echo "Deploying ✅ -> 🌏 $(APP_NAME)"

# Docker commands
dockerBuild:  ## 🐳 Build Docker Image
	@echo "Building 🐳🏗️ $(APP_NAME)... for $(DOCKER_DEFAULT_PLATFORM)"
	docker build --build-arg ROLE=$(APP_NAME) -f Dockerfile -t $(IMAGE_NAME) .

# Run tests in Docker
dockerTest:
	@echo "Testing 🥊️ $(APP_NAME)"
	docker run --rm -it $(IMAGE_NAME) npm test

# Build and Run tests in Docker
dockerRunTests: dockerBuild dockerTest

# Deploy using Docker
dockerDeploy: dockerBuild dockerTest
	@echo "Deploying ✅ -> 🌏 $(APP_NAME)"

# Stop all running containers
dockerStop:
	@echo "Stopping all running containers..."
	docker stop $$(docker ps -q)

# Remove all stopped containers
dockerClean:
	@echo "Cleaning up stopped containers..."
	docker rm $$(docker ps -a -q)

# Remove all images (use with caution!)
dockerRemoveImages:
	@echo "Removing all Docker images..."
	docker rmi $$(docker images -q)
