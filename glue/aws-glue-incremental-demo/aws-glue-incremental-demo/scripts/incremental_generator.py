#!/usr/bin/env python3
import argparse, csv, io, random
from datetime import datetime, timezone
import boto3
PRODUCTS=['P101','P102','P103','P104','P105','P106','P107','P108','P109','P110']
STATUSES=['NEW','COMPLETED','SHIPPED']
p=argparse.ArgumentParser()
p.add_argument('--bucket',required=True); p.add_argument('--prefix',default='source/orders/')
p.add_argument('--batch',type=int,required=True); p.add_argument('--records',type=int,default=10)
p.add_argument('--start-order-id',type=int,default=None); p.add_argument('--status',choices=STATUSES,default=None)
a=p.parse_args()
start=a.start_order_id or (1000+(a.batch-1)*100); now=datetime.now(timezone.utc)
out=io.StringIO(); w=csv.writer(out)
w.writerow(['order_id','customer_id','product_id','quantity','amount','status','last_updated'])
for i in range(a.records):
    oid=start+i; qty=random.randint(1,5); amount=round(random.choice([450,600,850,1200,1500,1800,2100,2400,3250])*qty/2,2)
    ts=now.replace(microsecond=0).isoformat().replace('+00:00','Z')
    w.writerow([str(oid),f'C{oid-1000:03d}',random.choice(PRODUCTS),qty,f'{amount:.2f}',a.status or random.choice(STATUSES),ts])
key=f'{a.prefix.rstrip("/")}/batch-{a.batch:03d}.csv'
boto3.client('s3').put_object(Bucket=a.bucket,Key=key,Body=out.getvalue().encode(),ContentType='text/csv')
print(f'Generated s3://{a.bucket}/{key}'); print(f'Records: {a.records}')
