# Architecture Overview — E-Commerce Analytics

## Components
- Event Ingestion: Kafka + Kafka Connect
- Stream Processing: Flink
- Feature Store: Feast
- Storage: BigQuery / Redshift for analytics
- Model Serving: Seldon / KFServing for recommendations

## Flow
1. Frontend events → Kafka
2. Stream job enriches & stores events → Feature store + Data warehouse
3. BI dashboards read from warehouse; ML models read features for inference
