# Module 7 - Advanced Trigger / Workflow commands

# Inspect the workflow graph
aws glue get-workflow \
  --name glue-module7-event-orchestration \
  --include-graph

# Inspect triggers
aws glue get-triggers \
  --workflow-name glue-module7-event-orchestration

# Enable the scheduled trigger for testing
aws glue start-trigger \
  --name glue-module7-scheduled-start

# Disable it after the exercise
aws glue stop-trigger \
  --name glue-module7-scheduled-start

# Start a workflow run directly (useful for testing)
aws glue start-workflow-run \
  --name glue-module7-event-orchestration

# Inspect workflow runs
aws glue get-workflow-runs \
  --name glue-module7-event-orchestration

# IMPORTANT:
# Do not put passwords, API keys or other secrets into trigger Arguments.
# Glue job arguments can be logged. Use Glue Connections / Secrets Manager.
