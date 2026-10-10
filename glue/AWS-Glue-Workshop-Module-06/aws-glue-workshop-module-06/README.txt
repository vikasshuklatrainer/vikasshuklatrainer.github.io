AWS Glue Workshop Module 06 - Workflows & Triggers

Creates an orchestration layer around existing Module 3 jobs.

CloudFormation:
- AWS::Glue::Workflow
- AWS::Glue::Trigger (ON_DEMAND)
- AWS::Glue::Trigger (CONDITIONAL)

Prerequisite:
Module 3 jobs must already exist:
- glue-module3-s3-sales-etl
- glue-module3-rds-to-s3-etl

Carry forward:
KEEP Module 1 S3 bucket, Glue database, AWSGlueWorkshopRole.
KEEP Module 3 ETL jobs during this module.
OPTIONALLY KEEP Module 4 Visual ETL jobs for later branching exercises.
OPTIONALLY KEEP Module 5 notebook for development.
DELETE Module 2 RDS crawler after discovery.
DELETE Module 2 RDS/VPC/Glue Connection only after all PostgreSQL exercises are complete.
