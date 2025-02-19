# 📌 A Simple Web Chat Application
A simple web chat application that allows users to register, log in, and exchange messages.

🎯 Project Goals

The goal of this project was to independently develop a chat application that could be deployed in AWS infrastructure using Terraform. Additional goals included containerizing both frontend and backend, ensuring scalability, and implementing message queueing for efficient chat message processing.

🛠️ Technologies Used

- Backend: Java, Spring Boot
- Frontend: Angular
- Database: PostgreSQL (hosted on AWS RDS)
- Authentication & Authorization: AWS Cognito
- Infrastructure & Deployment: AWS ECS, Terraform, Docker, AWS ECR
- Messaging & Queuing: AWS SQS, AWS Lambda
- Monitoring & Logging: AWS CloudWatch

☁️ AWS Services Used

- ECS – Two separate clusters for backend and frontend
- ECR – Stores Docker images for both frontend and backend
- VPC – Custom network setup with security groups, route table, and internet gateway
- RDS (PostgreSQL) – Stores user and chat message data
- SQS – Message queueing for asynchronous chat message handling
- Lambda – Processes messages from SQS when a user sends a message
- Cognito – Handles user authentication and authorization
- CloudWatch – Monitors application health, logs, and includes an alert system
- EC2 – Initially used before migrating to ECS

👨‍💻 My Contribution

I independently designed and developed this project from scratch, including:
- ✅ Backend Development – Implemented a Spring Boot REST API
- ✅ Infrastructure as Code – Designed and provisioned AWS infrastructure using Terraform
- ✅ Authentication & Security – Configured AWS Cognito for secure user authentication
- ✅ Message Processing – Integrated AWS SQS + Lambda for asynchronous message handling
- ✅ Containerization & Deployment – Dockerized both frontend and backend, deployed using AWS ECS
- ✅ Monitoring & Logging – Configured AWS CloudWatch for system monitoring and alerts
