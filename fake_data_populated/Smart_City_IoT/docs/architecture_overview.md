# Architecture Overview — Smart City IoT

## Components
- Edge Gateway (runs at cell towers) -> collects devices
- Message Bus: MQTT + Kafka bridge
- Stream Processing: Apache Flink
- Storage: Time-series DB (InfluxDB) for telemetry, Postgres for metadata
- Visualization: Grafana + custom map UI

## Data Flow Highlights
- Devices -> Edge Gateway -> MQTT -> Kafka -> Stream Jobs -> Outputs (alerts, TSDB)
