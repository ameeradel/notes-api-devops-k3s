provider "aws" {
  region = var.region
}

resource "random_password" "k3s_token" {
  length  = 48
  special = false
}

resource "aws_security_group" "k3s_sg" {
  name = "k3s-sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
  from_port   = 6443
  to_port     = 6443
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

  ingress {
    from_port   = 10250
    to_port     = 10250
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  ingress {
    from_port   = 8472
    to_port     = 8472
    protocol    = "udp"
    cidr_blocks = [var.vpc_cidr]
  }

  ingress {
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "k3s-sg"
  }
}

resource "aws_instance" "k3s_server" {
  ami           = var.ami_id
  instance_type = var.server_instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.k3s_sg.id]

  user_data = templatefile("${path.module}/user-data-server.sh", {
    k3s_token = random_password.k3s_token.result
  })

  tags = {
    Name = "k3s-control-plane"
    Role = "control-plane"
  }
}

resource "aws_eip" "k3s_eip" {
  domain = "vpc"

  tags = {
    Name = "k3s-control-plane-eip"
  }
}

resource "aws_eip_association" "k3s_eip_assoc" {
  instance_id   = aws_instance.k3s_server.id
  allocation_id = aws_eip.k3s_eip.id
}

resource "aws_instance" "k3s_worker" {
  count = 2

  ami           = var.ami_id
  instance_type = var.worker_instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.k3s_sg.id]

  user_data = templatefile("${path.module}/user-data-worker.sh", {
    k3s_token       = random_password.k3s_token.result
    k3s_server_ip   = aws_instance.k3s_server.private_ip
    worker_hostname = "k3s-worker-${count.index + 1}"
  })

  depends_on = [aws_instance.k3s_server]

  tags = {
    Name = "k3s-worker-${count.index + 1}"
    Role = "worker"
  }
}

