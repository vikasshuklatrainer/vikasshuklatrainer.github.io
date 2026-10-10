AWS Glue Workshop Module 07 - Advanced Triggers & Event Orchestration

Creates a separate workflow around Module 3 jobs:
- Scheduled start trigger (disabled by default)
- EventBridge start trigger with event batching (disabled by default)
- Conditional success trigger
- Conditional failure branch

Prerequisite:
Module 3 ETL jobs must exist:
- glue-module3-s3-sales-etl
- glue-module3-rds-to-s3-etl

Carry forward:
KEEP Module 1 S3 bucket, Glue database, AWSGlueWorkshopRole, Module 3 ETL jobs.
OPTIONALLY DELETE Module 6 workflow after the basic orchestration exercise.
OPTIONALLY DELETE Module 4 Visual ETL jobs and Module 5 notebook.
DELETE Module 2 RDS crawler after discovery.
DELETE Module 2 VPC/RDS/Glue Connection only after all PostgreSQL exercises are complete.

Important:
Scheduled and EventBridge triggers are created disabled by default to prevent accidental recurring job execution.
EventBridge-to-Glue integration requires the appropriate Glue notifyEvent permission.
