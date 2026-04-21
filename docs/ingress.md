🚀 Ingress Controller (K3s - ServiceLB)
Overview

In this setup, we are using NGINX Ingress Controller deployed on a K3s cluster running on AWS EC2.

Since K3s does not integrate with a cloud provider by default, it uses an internal load balancer implementation called ServiceLB (klipper-lb).

🔥 How traffic is exposed

The Ingress Controller service is defined as:

type: LoadBalancer

In K3s, this triggers:

Creation of a ServiceLB (klipper-lb) pod
Binding ports 80 and 443 directly on the node
🌐 Traffic Flow
User
 ↓
http://<EC2-Public-IP>:80
 ↓
ServiceLB (klipper-lb)
 ↓
ingress-nginx-controller (Service)
 ↓
kube-proxy
 ↓
Ingress Controller Pod
 ↓
Ingress Rules
 ↓
app-service (ClusterIP)
 ↓
Application Pods
⚙️ Key Components
Ingress Controller: NGINX
Service Type: LoadBalancer (K3s ServiceLB)
ServiceLB (klipper-lb): Exposes ports on the node
kube-proxy: Handles internal routing to pods
📌 Important Notes
This setup works without a real cloud load balancer
Traffic is exposed directly via the EC2 public IP
Ports 80 and 443 are bound on the host by ServiceLB
⚠️ Limitations (Not Production Ready)
No real load balancing across multiple nodes
Single point of failure (single EC2 instance)
No managed Load Balancer (like AWS ELB)
🏭 Production Approach

In production (EKS), this setup will be replaced with:

AWS Load Balancer (ELB)
Ingress Controller Service type LoadBalancer
Multi-node high availability