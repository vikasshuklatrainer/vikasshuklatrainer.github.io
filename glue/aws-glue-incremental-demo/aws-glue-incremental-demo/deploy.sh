#!/usr/bin/env bash
set -euo pipefail
STACK_NAME="${1:-glue-incremental-demo}"
REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-1}}"
aws cloudformation deploy --stack-name "$STACK_NAME" --template-file cloudformation/glue-incremental-demo.yaml --parameter-overrides ProjectName=glue-incremental-demo --capabilities CAPABILITY_NAMED_IAM --region "$REGION"
BUCKET=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)
aws s3 cp scripts/glue_incremental_orders.py "s3://${BUCKET}/scripts/glue_incremental_orders.py" --region "$REGION"
aws s3 cp sample-data/batch-001.csv "s3://${BUCKET}/source/orders/batch-001.csv" --region "$REGION"
aws s3 cp sample-data/batch-002.csv "s3://${BUCKET}/source/orders/batch-002.csv" --region "$REGION"
echo "Bucket: $BUCKET"
