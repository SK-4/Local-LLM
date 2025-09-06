# Architecture Overview — AI Chatbot Platform

## High-level Components
- **Frontend**: React-based agent console & customer widget
- **API Gateway**: Routes SDK calls and enforces rate limits
- **Conversation Service**: FastAPI service managing sessions & context
- **Retrieval Layer**: Qdrant for vector search of knowledge base & past chats
- **LLM Layer**: Local or cloud LLM (inference service) for generation
- **Storage**: PostgreSQL (metadata), S3 (transcripts), Redis (session/cache)
- **Observability**: Prometheus + Grafana, ELK for logs

## Data Flow
1. User message arrives → API Gateway → Conversation Service
2. Conversation Service assembles context, calls Retrieval (Qdrant)
3. Retrieved docs + user message → LLM service → Response returned
4. Transcript stored in S3; metadata in Postgres

## Notes
- Use request-id propagation for traceability.
- Implement deduplication using Redis for idempotent actions.
