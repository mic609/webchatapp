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

🛠️ Deployment instruction

You need to have Terraform installed, configured AWS CLI and Docker running. Once you got these tools, simply navigate to ```terraform/``` folder of the project and start the deployment with ```terraform plan```, ```terraform apply```. This process might take a while. To delete the infrastructure use ```terraform destroy```. If you want to access the website go to the AWS console. Search for ECS service. Then find "frontend-cluster". Go to tasks and choose the one which is running. You should be able to find the public ip of the site.

🖼️ Preview

![image](https://github.com/user-attachments/assets/4ddb1704-f7e4-4937-b547-19a6329f9c41)
![image](https://github.com/user-attachments/assets/acc3eb07-3d6b-448d-866c-84ebef0bcd39)
