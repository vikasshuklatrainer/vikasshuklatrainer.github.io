# AWS Glue Incremental Data Copy Demo

## Contents
- cloudformation/glue-incremental-demo.yaml
- scripts/glue_incremental_orders.py
- scripts/incremental_generator.py
- sample-data/batch-001.csv
- sample-data/batch-002.csv
- sample-data/batch-003-update-demo.csv
- docs/AWS-Glue-Incremental-Data-Copy-Workshop.html
- deploy.sh

## Quick start
1. `./deploy.sh`
2. Run the Glue job once.
3. Generate a batch with the generator.
4. Run the Glue job again.
5. Query the Parquet target with Athena.

The Glue ETL is a Spark job because AWS Glue Python Shell jobs do not support Job Bookmarks.
