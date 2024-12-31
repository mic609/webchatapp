resource "aws_db_instance" "webchatapp_db" {
  allocated_storage       = 20
  max_allocated_storage   = 1000
  storage_type            = "gp2"
  engine                  = "postgres"
  engine_version          = "16.3"
  instance_class          = "db.t4g.micro"
  identifier              = "webchatapp-db-terraform"
  username                = "postgres"
  password                = "Samsunek1#"
  db_name                 = "messageapp"
  db_subnet_group_name    = aws_db_subnet_group.main.name
  publicly_accessible     = false
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  port                    = 5432
  availability_zone       = "us-east-1a"
  backup_retention_period = 1
  backup_window           = "02:00-02:30"
  maintenance_window      = "sun:04:00-sun:04:30"
  copy_tags_to_snapshot   = true
  skip_final_snapshot     = true ### If set to false, you can't delete RDS instance
  deletion_protection     = false
  multi_az                = false
  auto_minor_version_upgrade = true
  storage_encrypted       = true
  monitoring_interval     = 0

  tags = {
    Name = "webchatapp-db-terraform"
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "webchatapp-db-subnet-group-terraform"
  subnet_ids = [
    aws_subnet.main.id,
    aws_subnet.main2.id,
    aws_subnet.main3.id
  ]

  tags = {
    Name = "webchatapp-db-subnet-group-terraform"
  }
}