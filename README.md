# Incident Mangement System
## Project Overview

The Incident Management System (IMS) is a resilient and scalable platform designed to monitor distributed systems and handle high-volume failure signals in real time.

The system ingests signals asynchronously, processes and groups incidents intelligently, stores structured and unstructured data separately, and provides a workflow-driven dashboard for incident resolution with mandatory Root Cause Analysis (RCA).

This project was implemented using:

- Node.js + Express
- RabbitMQ
- PostgreSQL
- MongoDB
- Redis
- React
- Docker Compose
- WSL (Ubuntu)
## Requirements
| Requirement | Status |
## Requirement Coverage

| Requirement | Status |
| :--- | :---: |
| High-throughput ingestion | ✅ |
| Async processing | ✅ |
| Debouncing logic | ✅ |
| Raw signal audit log | ✅ |
| Source of truth DB | ✅ |
| Real-time cache layer | ✅ |
| Workflow engine | ✅ |
| RCA validation | ✅ |
| MTTR calculation | ✅ |
| Dashboard UI | ✅ |
| Rate limiting | ✅ |
| Health endpoint | ✅ |
| Sample data simulation | ✅ |
| Docker Compose setup | ✅ |
