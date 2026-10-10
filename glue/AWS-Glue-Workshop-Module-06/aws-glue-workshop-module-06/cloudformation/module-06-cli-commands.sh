# Module 6 - Useful AWS CLI commands

# 1. Start the workflow
aws glue start-workflow-run \
  --name glue-module6-sales-workflow

# 2. Inspect workflow runs
aws glue get-workflow-runs \
  --name glue-module6-sales-workflow

# 3. Inspect workflow graph
aws glue get-workflow \
  --name glue-module6-sales-workflow \
  --include-graph

# 4. Inspect triggers
aws glue get-triggers \
  --workflow-name glue-module6-sales-workflow

# 5. Manually fire the on-demand start trigger
aws glue start-trigger \
  --name glue-module6-start

# 6. Inspect a specific job
aws glue get-job \
  --job-name glue-module3-s3-sales-etl

# NOTE:
# Do not pass passwords/secrets as trigger arguments.
# Use Glue Connections / Secrets Manager for credentials.
