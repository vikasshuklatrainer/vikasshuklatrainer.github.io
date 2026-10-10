import sys
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from pyspark.sql.functions import col, to_timestamp

args = getResolvedOptions(sys.argv, ['JOB_NAME', 'SOURCE_PATH', 'TARGET_PATH'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

dyf = glueContext.create_dynamic_frame.from_options(
    connection_type='s3',
    connection_options={'paths': [args['SOURCE_PATH']], 'recurse': True},
    format='csv',
    format_options={'withHeader': True, 'separator': ','},
    transformation_ctx='orders_source'
)

count = dyf.count()
print(f'BOOKMARKED INPUT RECORD COUNT: {count}')
if count > 0:
    df = dyf.toDF()
    df = (df.withColumn('quantity', col('quantity').cast('int'))
            .withColumn('amount', col('amount').cast('decimal(18,2)'))
            .withColumn('last_updated', to_timestamp('last_updated'))
            .withColumn('ingestion_run', col('order_id')))
    df.write.mode('append').format('parquet').save(args['TARGET_PATH'])
    print(f'WROTE {count} RECORDS TO {args["TARGET_PATH"]}')
else:
    print('NO NEW INPUT DATA DETECTED BY JOB BOOKMARK.')
job.commit()
print('JOB COMMITTED; BOOKMARK STATE UPDATED.')
