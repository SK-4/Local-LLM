# Architecture Overview — Healthcare Data Integration

## Components
- Ingest: FHIR adapters, SFTP pulls, HL7 listeners
- Normalization: ETL jobs (Spark)
- Storage: Encrypted object storage + Redshift for analytics
- Access Layer: RBAC APIs with strict consent checks

## Security Notes
- Encrypt data at rest and in transit
- Audit all schema changes and data exports
