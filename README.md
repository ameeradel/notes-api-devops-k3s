````markdown
# 🚀 Notes API DevOps Project

A production-focused DevOps project that demonstrates how to build, containerize, provision, deploy, expose, and monitor a Node.js Notes API using modern DevOps practices.

This project simulates a real-world DevOps workflow, covering:

- Infrastructure provisioning with Terraform
- Containerization with Docker
- Kubernetes deployment on K3s
- Ingress-based traffic routing
- CI/CD automation with GitHub Actions
- Secure authentication using OIDC and kubeconfig
- Monitoring and observability

---

# 📌 Project Overview

This repository contains a Notes API built with Node.js and PostgreSQL, deployed on a K3s cluster running on AWS infrastructure provisioned using Terraform.

It includes:

- Health, readiness, and metrics endpoints
- Kubernetes manifests for application and database
- NGINX Ingress Controller for routing
- CI/CD pipeline for automated deployment
- AWS ECR for private container images
- Prometheus and Grafana for monitoring

---

# 🏗️ Architecture

```text
User
 ↓
EC2 Public IP (80 / 443)
 ↓
k3s ServiceLB (internal load balancer)
 ↓
NGINX Ingress Controller Service (NodePort)
 ↓
Ingress Rules
 ↓
app-service (ClusterIP)
 ↓
Notes API Pods
 ↓
db-service (ClusterIP)
 ↓
PostgreSQL Pod + Persistent Volume
````

## Architecture Notes

* Infrastructure is provisioned using **Terraform**
* Kubernetes cluster runs on **K3s**
* No cloud-managed load balancer is used
* Traffic enters through **ports 80 and 443**
* K3s ServiceLB forwards traffic to the **Ingress NodePort service**
* Internal communication uses **ClusterIP**

---

# ⚙️ Tech Stack

## Application

* Node.js
* Express.js
* PostgreSQL

## Infrastructure

* AWS
* Terraform

## Containers

* Docker
* Docker Compose

## Orchestration

* Kubernetes
* K3s
* NGINX Ingress Controller

## CI/CD

* GitHub Actions
* AWS ECR

## Monitoring

* Prometheus
* Grafana

---

# ✨ Features

## Application Features

* CRUD Notes API
* Environment-based configuration
* Structured logging
* Graceful shutdown

## Operational Endpoints

* `/health` → liveness check
* `/ready` → readiness (DB connectivity)
* `/metrics` → Prometheus metrics

## DevOps Features

* Dockerized application
* Kubernetes manifests
* Ingress-based routing
* CI/CD automation
* Monitoring stack

---

# 📂 Repository Structure

```text
.
├── .github/workflows/      # CI/CD pipelines
├── docs/                   # Documentation
├── k8s/                    # Kubernetes manifests
├── monitoring/             # Prometheus config
├── nginx/                  # NGINX config
├── scripts/                # DB init scripts
├── src/                    # Application code
├── terraform/              # Infrastructure as Code
├── Dockerfile
├── docker-compose.local.yml
├── .env.example
└── README.md
```

---

# 🐳 Local Development

```bash
docker compose -f docker-compose.local.yml up --build
```

## Access

* App: [http://localhost:3000](http://localhost:3000)
* Health: [http://localhost:3000/health](http://localhost:3000/health)
* Ready: [http://localhost:3000/ready](http://localhost:3000/ready)
* Metrics: [http://localhost:3000/metrics](http://localhost:3000/metrics)

---

# ☸️ Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

## Verify

```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

---

# 🌐 Traffic Exposure Model

This project uses **NGINX Ingress Controller** as the entry point for external traffic.

## Flow

1. User sends request to EC2 public IP on port 80/443
2. K3s ServiceLB receives the traffic
3. Traffic is forwarded to Ingress Controller (NodePort)
4. Ingress routes request to app-service
5. Request reaches application pods

## Key Point

This setup does NOT use a cloud load balancer.
It relies on **K3s internal load balancing (ServiceLB)**.

---

# 🔄 CI/CD Pipeline

GitHub Actions automates build and deployment.

## Flow

```text
GitHub Actions
  ↓
[OIDC Authentication → AWS IAM Role]
  ↓
Build Docker Image
  ↓
Push Image to AWS ECR
  ↓
[kubeconfig Authentication → Kubernetes Cluster]
  ↓
kubectl set image
  ↓
Rolling Update Deployment
```

## Responsibilities

* Build Docker image
* Authenticate securely to AWS using OIDC
* Push image to ECR
* Authenticate to Kubernetes using kubeconfig
* Update deployment
* Trigger rolling update

---

# 🔐 Authentication & Access Model

This project uses a multi-layer secure authentication approach.

## 1. GitHub → AWS (OIDC)

* Uses OpenID Connect (OIDC)
* No static AWS credentials stored
* GitHub assumes IAM role
* Temporary credentials are issued

## 2. CI/CD → Kubernetes (kubeconfig)

Used for:

* `kubectl apply`
* `kubectl set image`
* `kubectl rollout status`

Defines:

* Cluster endpoint
* Credentials
* Context

## 3. Kubernetes → ECR (Image Pull)

* Cluster pulls images from private ECR
* Access is restricted and controlled

---

## 🔐 Security Summary

* No long-lived credentials
* Temporary AWS access via OIDC
* Controlled cluster access
* Private container registry

---

# 📊 Monitoring & Observability

* Prometheus scrapes `/metrics`
* Grafana visualizes metrics

## Metrics

* HTTP request count
* Request duration
* System/runtime metrics

---

# 🛠️ Infrastructure Provisioning

Infrastructure is provisioned using **Terraform**.

This ensures:

* Repeatability
* Consistency
* Automation of AWS resources

---

# 🧠 DevOps Practices Demonstrated

* Infrastructure as Code (Terraform)
* Containerization
* Kubernetes orchestration
* Ingress routing
* CI/CD automation
* Secure authentication (OIDC + kubeconfig)
* Observability
* Production-ready design

---

# 🚧 Future Improvements

* Migrate to EKS
* Add Helm
* Implement Argo CD (GitOps)
* Use AWS Secrets Manager
* Add Horizontal Pod Autoscaler (HPA)
* Move database to RDS

---

# 👨‍💻 Author

**Ameer Adel**

DevOps-focused engineer building real-world, production-style projects to strengthen skills in Kubernetes, CI/CD, cloud infrastructure, and system design.

---

# ⭐ Why This Project Matters

This is not just a CRUD deployment.

It demonstrates a full DevOps lifecycle:

* Provision infrastructure
* Build and push images
* Deploy to Kubernetes
* Expose services correctly
* Secure the pipeline
* Monitor the system

---

# 💬 Final Note

This project focuses on:

* Deep understanding
* Real-world practices
* Production mindset

It reflects how modern DevOps systems are designed, built, and operated.

