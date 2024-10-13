# Bank Service

## Overview
The Bank System Service is a Node.js-based application that simulates basic bank system functionalities. It is containerized using Docker and can be run locally using either Docker or natively on a machine with Node.js installed.

This project leverages a Makefile to simplify commands, enabling you to build, test, and deploy the service with ease. You can also choose to run the application directly using npm commands.

## Design Choices
- **Containerization with Docker**: Docker is used to containerize the application, making it easily portable and consistent across different environments.
- **Makefile for Automation**: A Makefile is included to help streamline Docker-related operations, allowing you to build, test, and deploy the application with minimal effort.
- **GitHub Actions for CI/CD**: The project includes a GitHub Actions configuration that automatically builds, tests, and deploys the application on every push to the main branch, ensuring reliability and quality.
- **Layered Architecture**: The code is organized using a layered architecture to separate different responsibilities and promote scalability and maintainability.
- **Domain Layer**: Contains the core business logic and domain models, representing the core functionality of the bank system, such as `Account`, `Transaction`, and other business-related entities.

## Requirements
- Docker (optional, if you prefer using Docker)
- Node.js and npm (for running natively)

## Running the Application

### Running with Docker
1. **Build the Docker image**:
   ```sh
   make dockerBuild
   ```
2. **Run tests with Docker**:
   ```sh
   make dockerTest
   ```

### Running Natively
1. **Install Dependencies**:
   ```sh
   npm install
   ```
2. **Build the Application**:
   ```sh
   npm run build
   ```
3. **Run Tests**:
   ```sh
   npm run test
   ```

## Makefile Commands
- **Build Docker Image**: `make dockerBuild`
- **Run Tests in Docker**: `make dockerTest`
- **Build and Run Tests**: `make dockerRunTests`
- **Deploy Docker Container**: `make dockerDeploy`
- **Stop All Containers**: `make dockerStop`
- **Clean Up Containers**: `make dockerClean`
- **Remove All Images**: `make dockerRemoveImages`

## Running Tests
Tests are implemented to ensure that the core functionalities work as expected.
- To run the tests in Docker, use `make dockerTest`.
- To run the tests natively, use `npm run test`.

### Types of Tests
1. **Unit Tests for Domain Classes**: These tests focus on validating the functionality of individual domain classes within the application. They ensure that core banking operations like creating an account, processing transactions, and handling errors are functioning as intended.

2. **Bank Flow Simulation Test**: This test simulates a complete bank flow, including actions like creating an account, making deposits, withdrawing funds, and checking balances. It ensures that the entire flow of the application works seamlessly and that the various components interact correctly.

## Deployment
For deployment, you can either use the `dockerDeploy` Makefile command or GitHub Actions. The GitHub Actions pipeline is configured to automatically run tests and deploy the application on every push to the `main` branch.

## CI/CD Pipeline
This project includes a GitHub Actions workflow for building, testing, and deploying the service. The workflow consists of three main jobs:
1. **Build**: Installs dependencies and builds the application.
2. **Test**: Runs the unit tests to ensure the application is working properly.
3. **Deploy**: Deploys the application if the tests pass and the code is pushed to the `main` branch.
