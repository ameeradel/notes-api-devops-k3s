# 🚀 Ingress Controller (K3s - ServiceLB)

## 📖 Overview

This project uses **NGINX Ingress Controller** deployed on a **K3s cluster running on AWS EC2**.

Unlike managed Kubernetes services, K3s does **not integrate with cloud providers by default**, so it relies on an internal load balancer called:

👉 **ServiceLB (klipper-lb)**

This component is responsible for exposing services externally.

---

## 🔥 How Traffic is Exposed

The Ingress Controller service is defined as:

```yaml
type: LoadBalancer
```

In a typical cloud environment, this would provision a managed load balancer.

However, in K3s:

* A **ServiceLB (klipper-lb) pod is created**
* Ports **80 and 443 are bound directly to the node**
* Traffic is exposed using the **EC2 public IP**

---

## 🌐 Traffic Flow (End-to-End)

```
User
 ↓
http://<EC2-Public-IP>:80
 ↓
ServiceLB (klipper-lb)
 ↓
ingress-nginx-controller (Service - LoadBalancer)
 ↓
kube-proxy
 ↓
Ingress Controller Pod (NGINX)
 ↓
Ingress Rules (Routing Layer)
 ↓
app-service (ClusterIP)
 ↓
Application Pods
 ↓
db-service (ClusterIP)
 ↓
Database Pod
```

---

## ⚙️ Key Components Explained

### 1. Ingress Controller (NGINX)

* Acts as the **entry point** to the cluster
* Routes incoming traffic based on **Ingress rules**

### 2. ServiceLB (klipper-lb)

* K3s built-in replacement for cloud load balancers
* Binds ports directly on the host node
* Forwards traffic to Kubernetes services

### 3. kube-proxy

* Handles **internal networking**
* Routes traffic from services → pods

### 4. ClusterIP Services

* Internal-only services:

  * `app-service`
  * `db-service`
* Not exposed outside the cluster

---

## 📌 Important Notes

* No external load balancer is used
* Traffic is exposed directly via:

  ```
  http://<EC2-Public-IP>
  ```
* Ports **80/443 are opened on the node itself**
* This is ideal for:

  * Learning
  * Small setups
  * Cost-efficient environments

---

## ⚠️ Limitations (Not Production Ready)

* ❌ No real load balancing across multiple nodes
* ❌ Single point of failure (one EC2 instance)
* ❌ No high availability
* ❌ No auto-scaling
* ❌ No managed load balancer

---

## 🏭 Production Architecture (EKS)

In a production-grade setup, this architecture evolves into:

```
User
 ↓
DNS (Route53)
 ↓
AWS Load Balancer (ELB / ALB)
 ↓
Ingress Controller (Service: LoadBalancer)
 ↓
Ingress Controller Pods
 ↓
ClusterIP Services
 ↓
Application Pods
 ↓
RDS (Managed Database)
```

---

## 🔄 K3s vs EKS (Comparison)

| Feature           | K3s (Current Setup)    | EKS (Production)      |
| ----------------- | ---------------------- | --------------------- |
| Load Balancer     | ServiceLB (klipper-lb) | AWS ELB / ALB         |
| Exposure          | EC2 Public IP          | Managed Load Balancer |
| High Availability | ❌ No                   | ✅ Yes                 |
| Scaling           | ❌ Manual               | ✅ Auto Scaling        |
| Reliability       | ❌ Single Node          | ✅ Multi-Node Cluster  |
| Database          | Pod (PVC)              | RDS (Managed)         |

---

## 🧠 Key Learning Outcome

This setup demonstrates:

* How Kubernetes networking works **without cloud abstractions**
* How traffic flows from **user → ingress → service → pod**
* The difference between:

  * `LoadBalancer` in **K3s vs Cloud**
  * Internal vs external traffic routing

---

## 📎 Summary

This architecture is:

* ✅ Perfect for learning DevOps & Kubernetes internals
* ❌ Not suitable for production workloads

➡️ Next step: Move to **EKS + AWS Load Balancer + RDS** for a production-ready system.
