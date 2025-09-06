# Project: E-Commerce Analytics — Design Specification

## Overview
Platform to aggregate storefront events, compute KPIs, and suggest merchandising actions using ML.

## Features
- Real-time dashboard for sales & conversion
- Cohort analysis and A/B test reporting
- Personalized product recommendation engine

## Data Sources
- Clickstream (Kafka)
- Orders (Postgres)
- Inventory (ERP sync)

## SLAs & Ops
- Data freshness: 60s near-real-time for dashboards
- End-to-end pipeline monitored with alerts and runbooks
