output "public_ip" {
  value = aws_instance.k3s_server.public_ip
}

output "ssh_command" {
  value = "ssh -i <your-key>.pem ubuntu@${aws_instance.k3s_server.public_ip}"
}