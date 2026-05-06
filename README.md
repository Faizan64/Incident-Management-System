# 🚀 Incident Management System (IMS)

# 📌 Project Overview

The Incident Management System (IMS) is a scalable and resilient platform designed to monitor distributed systems and process high-volume failure signals in real time.

The system supports:

- High-throughput signal ingestion
- Asynchronous processing
- Incident workflow management
- Root Cause Analysis (RCA)
- MTTR calculation
- Real-time dashboard monitoring

This project was implemented using:

- Node.js + Express
- RabbitMQ
- PostgreSQL
- MongoDB
- Redis
- React
- Docker Compose
- WSL Ubuntu


# ✅  Requirements Covered

| Requirement | Status |
|---|---|
| High-throughput ingestion | ✅ |
| Async processing | ✅ |
| Debouncing logic | ✅ |
| Raw signal audit log | ✅ |
| Source of truth database | ✅ |
| Cache layer | ✅ |
| Workflow engine | ✅ |
| RCA validation | ✅ |
| MTTR calculation | ✅ |
| Dashboard UI | ✅ |
| Rate limiting | ✅ |
| Health endpoint | ✅ |
| Sample data simulation | ✅ |
| Docker Compose setup | ✅ |


# 🏗️ System Architecture

## 📊 Architecture Diagram

```text
                        ┌─────────────────────┐
                        │     Frontend UI     │
                        │       (React)       │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │   Ingestion API     │
                        │ (Node.js + Express) │
                        └──────────┬──────────┘
                                   │
                     Rate Limiting │
                                   ▼
                        ┌─────────────────────┐
                        │      RabbitMQ       │
                        │    Message Queue    │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │    Worker Service   │
                        │  Async Processing   │
                        └───────┬─────┬───────┘
                                │     │
                    ┌───────────┘     └────────────┐
                    ▼                              ▼
          ┌─────────────────┐          ┌─────────────────┐
          │    MongoDB      │          │   PostgreSQL    │
          │   Raw Signals   │          │   Work Items    │
          └─────────────────┘          └─────────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │      Redis      │
          │ Dashboard Cache │
          │ Debouncing TTL  │
          └─────────────────┘
```



# 🧠 Design Decisions

## Why RabbitMQ?

RabbitMQ was used to decouple signal ingestion from processing.

### Benefits

- Handles burst traffic
- Prevents API blocking
- Supports asynchronous processing
- Improves resilience



## Why MongoDB?

MongoDB stores high-volume unstructured signal data.

### Benefits

- Flexible schema
- Fast writes
- Suitable for audit logs



## Why PostgreSQL?

PostgreSQL acts as the transactional source of truth.

### Benefits

- Strong consistency
- ACID compliance
- Reliable workflow management



## Why Redis?

Redis was used for:

- Debouncing logic
- Dashboard cache
- Real-time state management

### Benefits

- Extremely fast operations
- TTL support
- Reduces DB load



# 🛠️ Complete Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Queue | RabbitMQ |
| NoSQL Database | MongoDB |
| Relational Database | PostgreSQL |
| Cache | Redis |
| Frontend | React |
| Containerization | Docker Compose |
| Development Environment | WSL Ubuntu |



# 📂 Repository Structure

```text
ims-project/
│
├── backend/
│   ├── api/
│   ├── config/
│   ├── workflow/
│   ├── worker/
│   ├── db/
│   ├── utils/
│   └──server.js/
|   |__docker.compose.yml 
│
├── frontend/
│   ├── src/
│   └── public/
│
├── README.md

```

# ⚙️ Environment Setup (WSL)
Note: can use different envs like aws,windows but I am comfortable with linux and do most of my projects with linux so I choose wsl
## Step 1: Install WSL

```bash
wsl --install
```

---

## Step 2: Update Ubuntu

```bash
sudo apt update && sudo apt upgrade -y
```

---

## Step 3: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

---

## Step 4: Install Docker

```bash
sudo apt install docker.io -y
sudo usermod -aG docker $USER
```

---

## Step 5: Install Docker Compose

```bash
sudo apt install docker-compose -y
```

---

# 🐳 Docker Compose Setup

## docker-compose.yml

```yaml
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  postgres:
    image: postgres
    environment:
      POSTGRES_USER: ims
      POSTGRES_PASSWORD: ims123
      POSTGRES_DB: imsdb
    ports:
      - "5432:5432"

  mongodb:
    image: mongo
    ports:
      - "27017:27017"

  redis:
    image: redis
    ports:
      - "6379:6379"
```

---

# ▶️ Start Docker Services

```bash
docker-compose up -d
```

Verify containers:

```bash
docker ps

```
<img width="1903" height="815" alt="Image" src="https://github.com/user-attachments/assets/4415a439-a943-4e2e-8d0a-7ca0833b582c" />
---

# 🔥 PHASE 1 — Backend Setup

## Create Backend

```bash
mkdir backend
cd backend
npm init -y
```

---

## Install Dependencies

```bash
npm install express amqplib mongoose pg redis express-rate-limit dotenv
```

---

## Create Basic Structure

```bash
mkdir api config utils workflow worker db
```

---

# 🚦 PHASE 2 — Signal Ingestion API

## 📌 Objective

This phase focused on:

- REST API creation
- Signal ingestion
- Rate limiting
- RabbitMQ integration
- Async message handling
- Health monitoring

---

# 🧠 Problem Statement

In a production-grade distributed system, multiple services such as:

- APIs
- Databases
- Cache clusters
- Queue systems
- MCP hosts

can generate thousands of failure signals per second.

Directly processing every request synchronously can:

- Crash the application
- Overload databases
- Cause memory spikes
- Increase API latency

To solve this, an asynchronous queue-based ingestion architecture was implemented.

---

# 🛠️ Technologies Used

| Component | Technology |
|---|---|
| Backend Framework | Node.js + Express |
| Queue System | RabbitMQ |
| Rate Limiting | express-rate-limit |
| API Testing | curl / Postman |

---

# 📂 Backend Structure for Phase 2

```text
backend/
│
├── config/
│   └── rabbitmq.js
│
├── api/
│
├── utils/
│
├── server.js
│
└── package.json
```

---

# ⚙️ Step 1 — Backend Initialization

## Create Backend Folder

```bash
mkdir backend
cd backend
```

---

## Initialize Node.js Project

```bash
npm init -y
```

This creates:

```text
package.json
```

which manages:
- dependencies
- scripts
- project metadata

---

# 📦 Step 2 — Install Dependencies

## Install Required Packages

```bash
npm install express amqplib express-rate-limit dotenv
```

---

## Dependency Explanation

| Package | Purpose |
|---|---|
| express | Backend API framework |
| amqplib | RabbitMQ client |
| express-rate-limit | API rate limiting |
| dotenv | Environment variable management |

---

# 📁 Step 3 — Create Project Structure

## Create Required Directories

```bash
mkdir api config utils
```

---

## Create Main Server File

```bash
touch server.js
```

---

# 🐳 Step 4 — Start RabbitMQ using Docker

RabbitMQ acts as a message broker between the ingestion API and worker service.

---

## Run RabbitMQ Container

```bash
docker run -d \
--hostname rabbitmq \
--name rabbitmq \
-p 5672:5672 \
-p 15672:15672 \
rabbitmq:3-management
```

---

## Verify Container

```bash
docker ps
```

---

## RabbitMQ Dashboard

Open browser:

```text
http://localhost:15672
```

### Default Credentials

```text
Username: guest
Password: guest
```

---

# 🔌 Step 5 — Configure RabbitMQ Connection

## Create RabbitMQ Config File

```bash
touch config/rabbitmq.js
```

---

## config/rabbitmq.js

```js
const amqp = require("amqplib");

let channel;

async function connectQueue() {

  // Create RabbitMQ connection
  const amqp = require("amqplib");

let channel;

async function connectQueue() {
  const connection = await amqp.connect("amqp://localhost");

  channel = await connection.createChannel();

  await channel.assertQueue("signals", {
    durable: true, // survives restart
  });
}

function sendToQueue(data) {
  channel.sendToQueue(
    "signals",
    Buffer.from(JSON.stringify(data)),
    { persistent: true } // ensures reliability
  );
}

module.exports = { connectQueue, sendToQueue };
```

---

# 🧠 RabbitMQ Workflow

```text
Client Request
      ↓
Ingestion API
      ↓
RabbitMQ Queue
      ↓
Worker Service
```

---

# 🚦 Step 6 — Implement Rate Limiting

## Why Rate Limiting?

Without rate limiting:

- APIs can be spammed
- Memory usage increases
- CPU spikes occur
- Backend crashes are possible

Rate limiting protects the system from overload.

---

# ⚙️ Step 7 — Create Express Server

## server.js

```js
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const { connectQueue, sendToQueue } = require("./config/rabbitmq");
const { connectRedis } = require("../worker/config/redis");

const workflowRoutes = require("./api/workflowRoutes");
const rcaRoutes = require("./api/rcaRoutes");
const dashboardRoutes = require("./api/dashboardRoutes");

const app = express();

// 🔹 Middlewares
app.use(express.json());
app.use(cors());

// 🔹 Rate limiter (protect ingestion API)
const limiter = rateLimit({
  windowMs: 1000,
  max: 100,
});
app.use(limiter);

// 🔹 Simple request counter (observability)
let requestCount = 0;

// 🔹 Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// 🔹 Signal ingestion API
app.post("/signal", async (req, res) => {
  try {
    const { componentId, message, severity } = req.body;

    if (!componentId || !message || !severity) {
      return res.status(400).send("Missing required fields");
    }

    console.log("📥 API received:", req.body);

    sendToQueue(req.body);

    console.log("📤 Sent to RabbitMQ");

    requestCount++;
    res.send("Signal queued");
  } catch (err) {
    console.error("❌ Error in /signal:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 🔹 Routes
app.use("/workflow", workflowRoutes);
app.use("/rca", rcaRoutes);
app.use("/dashboard", dashboardRoutes);

// 🔹 Throughput logging (every 5 sec)
setInterval(() => {
  console.log(`🚀 Throughput: ${requestCount} signals / 5 sec`);
  requestCount = 0;
}, 5000);

// 🔹 Start server AFTER dependencies connect
async function startServer() {
  try {
    // ✅ Connect Redis FIRST (FIXES your 500 error)
    await connectRedis();
    console.log("✅ Redis connected");

    // ✅ Connect RabbitMQ
    await connectQueue();
    console.log("✅ RabbitMQ connected");

    // ✅ Start server
    app.listen(3000, "127.0.0.1", () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
```

---

# 🔍 Step 8 — Health Endpoint

## Endpoint

```http
GET /health
```

---

## Purpose

Used for:
- monitoring
- uptime checks
- service validation

---

## Example

```bash
curl http://localhost:3000/health
```

### Response

```text
OK
```

---

# 📥 Step 9 — Signal Ingestion API

## Endpoint

```http
POST /signal
```

---

## Example Payload

```json
{
  "componentId": "CACHE_CLUSTER_01",
  "message": "Latency spike detected",
  "severity": "P2"
}
```

---

## Request Flow

```text
Client
  ↓
Express API
  ↓
Rate Limiter
  ↓
RabbitMQ Queue
  ↓
Worker Service
```

---

# 🧪 Step 10 — API Testing

## Using curl

```bash
curl -X POST http://localhost:3000/signal \
-H "Content-Type: application/json" \
-d '{
  "componentId":"CACHE_CLUSTER_01",
  "message":"Latency spike",
  "severity":"P2"
}'
```

---

## Expected Response

```json
{
  "success": true,
  "message": "Signal queued successfully"
}
```

---

# 📊 Step 11 — Verify Queue Messages

## Open RabbitMQ Dashboard

```text
http://localhost:15672
```

---

## Navigate

```text
Queues → signals
```

---

## Verify

You should see:

- Queue created
- Messages entering queue
- Ready message count increasing

---

# ⚡ Async Processing Architecture

Traditional synchronous systems:

```text
API → Database
```

Problems:
- Slow responses
- DB bottlenecks
- Crash risk

---

Implemented async architecture:

```text
API → RabbitMQ → Worker → Database
```

Benefits:
- Better throughput
- Queue buffering
- Improved resilience
- Horizontal scalability

---

# ⚠️ Backpressure Handling in Phase 2

Phase 2 introduced the first layer of backpressure handling.

---

## Techniques Used

### 1. RabbitMQ Queue Buffering

- Prevents request overload
- Buffers incoming traffic

---

### 2. Async Processing

- API does not wait for DB writes
- Improves response time

---

### 3. Rate Limiting

- Prevents API abuse
- Protects backend resources

---

# 📈 Performance Benefits

| Feature | Benefit |
|---|---|
| RabbitMQ | Handles burst traffic |
| Async Queue | Prevents blocking |
| Rate Limiter | Protects API |
| Express | Lightweight backend |
| Queue Buffering | Smooth traffic spikes |

---


---

# ⚡ PHASE 3 — Worker Service + Debouncing

## Features Implemented

- Async queue consumption
- Redis debouncing
- MongoDB signal storage
- PostgreSQL work item creation

---

## Debouncing Logic

### Requirement

If multiple signals arrive within 10 seconds for the same component:

- Only one work item should be created
- All signals should still be stored

### Implementation

- Redis key = componentId
- TTL = 10 seconds
- Prevent duplicate work item creation

---

# ⚡ PHASE 3 — Worker Service + Debouncing

## 📌 Objective

Phase 3 focuses on building the core backend processing engine of the Incident Management System.

This phase is responsible for:

- Consuming signals asynchronously from RabbitMQ
- Processing incoming incidents
- Applying debouncing logic
- Storing raw signals in MongoDB
- Creating Work Items in PostgreSQL
- Using Redis for temporary state management

This is the most important phase of the project because it handles scalability, concurrency, and incident grouping.

---

# 🧠 Architecture Flow

```text
Signal API
    │
    ▼
RabbitMQ Queue
    │
    ▼
Worker Service
    │
 ┌──┴───────────────┐
 ▼                  ▼
MongoDB         PostgreSQL
(Raw Signals)   (Work Items)
    │
    ▼
Redis
(Debouncing TTL)
```

---

# 📌 Why Worker Service Was Needed

Direct database writes from the API layer can cause:

- Slow response times
- API crashes during traffic spikes
- Database overload
- Blocking requests

To solve this:

- Signals are pushed into RabbitMQ
- Worker consumes signals asynchronously
- Processing happens independently

This creates a resilient and scalable architecture.

---

# 📂 Worker Service Setup

## Step 1 — Create Worker Directory

```bash
cd backend
mkdir worker
cd worker
npm init -y
```

---

## Step 2 — Install Dependencies

```bash
npm install amqplib mongoose pg redis dotenv
```

### Dependency Purpose

| Package | Purpose |
|---|---|
| amqplib | RabbitMQ communication |
| mongoose | MongoDB integration |
| pg | PostgreSQL integration |
| redis | Redis cache integration |
| dotenv | Environment configuration |

---

# 📂 Worker Folder Structure

```text
worker/
│
├── config/
│   ├── rabbitmq.js
│   └── redis.js
│
├── db/
│   ├── mongo.js
│   └── postgres.js
│
├── worker.js
└── package.json
```

---

# 📨 RabbitMQ Consumer Setup

## Step 1 — Create RabbitMQ Configuration

### File

```text
worker/config/rabbitmq.js
```

---

## Code

```js
const amqp = require("amqplib");

let channel;

async function connectQueue() {
  const connection = await amqp.connect("amqp://localhost");

  channel = await connection.createChannel();

  await channel.assertQueue("signals");
}

function consumeQueue(callback) {
  channel.consume("signals", (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());

      callback(data);

      channel.ack(msg);
    }
  });
}

module.exports = { connectQueue, consumeQueue };
```

---

---

# 🔥 Redis Integration (Debouncing Engine)

## 📌 Why Redis Was Used

Redis is extremely fast and supports TTL (Time-To-Live).

It is ideal for:
- Debouncing logic
- Temporary state handling
- Real-time cache

---

# 📌 Debouncing Requirement

Assignment Requirement:

> If 100 signals arrive for the same Component ID within 10 seconds, only one Work Item should be created.

---

# 🧠 Debouncing Strategy

## Logic

```text
IF Redis key exists:
    → Do NOT create new work item
    → Store only raw signal

ELSE:
    → Create work item
    → Set Redis key with 10-second TTL
```

---

# 📂 Redis Configuration

## File

```text
worker/config/redis.js
```

---

## Code

```js
const { createClient } = require("redis");

const client = createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Error:", err));

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    console.log("✅ Redis connected");
  }
}

module.exports = { client, connectRedis };
```

---

# 🗄️ MongoDB Integration (Raw Signals)

# 📂 MongoDB Configuration

## File

```text
worker/db/mongo.js
```

---

## Code

```js
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ims");

const signalSchema = new mongoose.Schema({
  componentId: String,
  message: String,
  severity: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Signal", signalSchema);
```

---

---

# 🗄️ PostgreSQL Integration (Work Items)

# 📂 PostgreSQL Configuration

## File

```text
worker/db/postgres.js
```

---

## Code

```js
const { Pool } = require("pg");

const pool = new Pool({
  user: "ims",
  host: "localhost",
  database: "imsdb",
  password: "ims123",
  port: 5432,
});

module.exports = pool;
```

---

# 📌 Create PostgreSQL Table

## Connect PostgreSQL

```bash
docker exec -it <postgres_container_id> psql -U ims -d imsdb
```

---

## Create Work Items Table

```sql
CREATE TABLE work_items (
  id SERIAL PRIMARY KEY,
  component_id TEXT,
  severity TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 🧠 Work Item Purpose

Each Work Item represents one unique incident.

Example:

```text
CACHE_CLUSTER_01 latency spike
```

Even if 100 signals arrive:
- Only ONE work item is created

---

# 🔥 Main Worker Logic

## File

```text
worker/worker.js
```

---

## Complete Worker Code

```js
const amqp = require("amqplib");
const { client: redisClient, connectRedis } = require("./config/redis");
const Signal = require("./db/mongo");
const pool = require("./db/postgres");

// 🔥 Batch config
let buffer = [];
const BATCH_SIZE = 100;
const FLUSH_INTERVAL = 2000;

// 🔥 Flush signals to MongoDB
async function flushBatch() {
  if (buffer.length === 0) return;

  try {
    await Signal.insertMany(buffer);
    console.log(`✅ Inserted ${buffer.length} signals`);
    buffer = [];
  } catch (err) {
    console.error("❌ Batch insert error:", err);
  }
}

// Auto flush every 2 sec
setInterval(flushBatch, FLUSH_INTERVAL);

// 🔥 Core signal processing
async function processSignal(signal) {
  const key = signal.componentId;

  try {
    // ✅ ATOMIC REDIS DEBOUNCE (FIXED)
    const isNew = await redisClient.set(key, "active", {
      NX: true,
      EX: 10,
    });

    // Always add to batch buffer
    buffer.push(signal);

    // Flush batch if size reached
    if (buffer.length >= BATCH_SIZE) {
      await flushBatch();
    }

    // If new incident → create Work Item
    if (isNew) {
      console.log("🚨 NEW incident:", key);

      await pool.query(
        "INSERT INTO work_items (component_id, severity, status) VALUES ($1,$2,$3)",
        [signal.componentId, signal.severity, "OPEN"]
      );

      // Update dashboard cache
      await redisClient.lPush(
        "dashboard:incidents",
        JSON.stringify({
          componentId: signal.componentId,
          severity: signal.severity,
          status: "OPEN",
          createdAt: new Date(),
        })
      );
    } else {
      console.log("⚡ Debounced signal:", key);
    }
  } catch (err) {
    console.error("❌ Processing error:", err);
    throw err;
  }
}

// 🔥 Start worker
async function start() {
  try {
    // 1. Connect Redis FIRST
    await connectRedis();
    console.log("Redis SET type:", typeof redisClient.set);

    // 2. Connect RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("signals", {
      durable: true,
    });

    // 🔥 PERFORMANCE BOOST
    channel.prefetch(100);

    console.log("🚀 Worker started...");

    // 3. Consume messages
    channel.consume("signals", async (msg) => {
      if (msg !== null) {
        const signal = JSON.parse(msg.content.toString());

        try {
          await processSignal(signal);
          channel.ack(msg);
        } catch (err) {
          console.error("❌ Message failed:", err);
          channel.nack(msg, false, true); // retry
        }
      }
    });
  } catch (err) {
    console.error("❌ Worker startup error:", err);
  }
}

// Run worker
start();```

---

---

## Step 2 — Store Raw Signal

Every signal is stored in MongoDB.

Purpose:
- Audit logs
- Incident tracing
- Historical analysis

---

## Step 3 — Check Redis Key

Redis key format:

```text
<ComponentId>
```

Example:

```text
CACHE_CLUSTER_01
```

---

## Step 4 — Apply Debouncing

### If key DOES NOT exist:

- Create PostgreSQL Work Item
- Set Redis TTL = 10 seconds

### If key EXISTS:

- Skip Work Item creation
- Store only raw signal

---

# 📌 Redis TTL Behavior

Example:

```text
SETEX CACHE_CLUSTER_01 10 active
```

Meaning:
- Key lives for 10 seconds
- Automatically deleted after expiration

This enables incident grouping.

---

# 🧪 Testing the Worker

## Step 1 — Start Backend API

```bash
cd backend
node server.js
```

---

## Step 2 — Start Worker

```bash
cd backend/worker
node worker.js
```

---

## Step 3 — Send Multiple Signals

```bash
for i in {1..20}
do
curl -X POST http://localhost:3000/signal \
-H "Content-Type: application/json" \
-d '{"componentId":"CACHE_CLUSTER_01","message":"Latency spike","severity":"P2"}'
done
```

---

# ✅ Expected Result

## PostgreSQL

Only ONE work item should exist.

```sql
SELECT * FROM work_items;
```

---

## MongoDB

All 20 signals should exist.

```bash
docker exec -it <mongo_container_id> mongosh
```

```js
use ims
db.signals.find()
```

---

## Redis

Debounce key should exist temporarily.

```bash
redis-cli
GET CACHE_CLUSTER_01
```

---

# 📊 Benefits Achieved in Phase 3

| Feature | Benefit |
|---|---|
| RabbitMQ | Async scalability |
| Redis TTL | Debouncing |
| MongoDB | Signal audit logs |
| PostgreSQL | Transactional incidents |
| Worker Service | Non-blocking processing |

---

---

# 🌐 PHASE 5 — Frontend Dashboard

## Frontend Features

- Live incident dashboard
- Incident detail page
- RCA submission form
- Severity sorting
- Real-time polling

---
# Frontend Dashboard (Live Incidents)

<img width="831" height="836" alt="Image" src="https://github.com/user-attachments/assets/a5cfb971-0d50-4159-8803-cf15d9f7ea83" />

# Incidents

<img width="802" height="685" alt="Image" src="https://github.com/user-attachments/assets/fe5943c9-c4f4-411a-9201-573030c92ee3" />

# RCA
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/e89f7c46-7acb-46e4-9592-d5d5d1f8a2f7" />

---


## 📌 Objective

The goal of Phase 5 was to build a responsive frontend dashboard that allows users to:

- Monitor active incidents in real time
- View incident details and raw signals
- Submit Root Cause Analysis (RCA)
- Track incident lifecycle states
- Avoid excessive database queries using Redis cache

The frontend was developed using React and connected with backend APIs.

---

# 🏗️ Frontend Architecture

```text
Frontend (React)
       │
       ▼
Backend APIs (Express)
       │
 ┌─────┼──────────────┐
 ▼     ▼              ▼
Redis MongoDB     PostgreSQL
```

---

# ⚙️ Frontend Setup

## Step 1 — Create React Application

```bash
npx create-react-app frontend
```

---

## Step 2 — Move Into Frontend Directory

```bash
cd frontend
```

---

## Step 3 — Install Required Dependencies

```bash
npm install axios
```

### Dependency Used

| Package | Purpose |
|---|---|
| axios | API communication |

---

# 📂 Frontend Folder Structure

```text
frontend/
│
├── src/
│   ├── App.js
│   ├── IncidentDetail.js
│   ├── RCAForm.js
│   ├── components/
│ 
│
├── public/
└── package.json
```

---

# 🔥 Dashboard Features Implemented

## ✅ Live Incident Feed

The dashboard continuously fetches incident data from backend APIs.

### Features

- Displays active incidents
- Shows severity and status
- Updates every 5 seconds
- Uses Redis-backed dashboard data

---

## ✅ Severity-Based Sorting

Incidents are sorted based on severity:

| Severity | Priority |
|---|---|
| P0 | Highest |
| P1 | Medium |
| P2 | Low |

This helps operators identify critical incidents quickly.

---

## ✅ Incident Detail Page

Users can click an incident to:

- View raw signals
- See error messages
- Track timestamps
- Monitor related failures

Data is fetched from MongoDB through backend APIs.

---

## ✅ RCA Submission Form

The dashboard provides a dedicated form for submitting:

- Root cause
- Fix applied
- Prevention steps
- Start time
- End time

---

# 🔄 Real-Time Polling Implementation

To simulate real-time updates:

```js
setInterval(fetchIncidents, 5000);
```

### Purpose

- Refresh dashboard automatically
- Show latest incidents
- Avoid manual refresh

---

# 📡 Backend API Integration

The frontend communicates with the backend using Axios.

---

## Get Incidents API

```http
GET /dashboard/incidents
```

### Response Example

```json
[
  {
    "componentId": "CACHE_CLUSTER_01",
    "severity": "P2",
    "status": "OPEN"
  }
]
```

---

## Get Incident Details API

```http
GET /dashboard/incident/:componentId
```

### Purpose

Fetch all related raw signals for a component.

---

## Submit RCA API

```http
POST /rca/submit-rca
```

### Payload Example

```json
{
  "workItemId": 1,
  "rootCause": "Database overload",
  "fix": "Scaled database nodes",
  "prevention": "Enable autoscaling",
  "startTime": "2026-05-04T10:00:00",
  "endTime": "2026-05-04T11:00:00"
}
```

---

# 💻 Dashboard Implementation

## App.js

The main dashboard component fetches and displays incidents.

```jsximport { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IncidentDetail from "./pages/IncidentDetail";
import RCAForm from "./pages/RCAForm";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Dashboard</Link> |
        <Link to="/incidents">Incidents</Link> |
        <Link to="/rca">RCA</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/incidents" element={<IncidentDetail />} />
        <Route path="/rca" element={<RCAForm />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

# 🔎 Incident Detail Component

## IncidentDetail.js

This component fetches raw signal data.

```jsx
import { useEffect, useState } from "react";
import axios from "axios";

function IncidentDetail() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/dashboard/live")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>📋 All Incidents</h2>

      {data.map(item => (
        <div key={item.id} style={{ border: "1px solid", margin: "10px" }}>
          <p>ID: {item.id}</p>
          <p>Component: {item.component_id}</p>
          <p>Status: {item.status}</p>
          <p>Severity: {item.severity}</p>
        </div>
      ))}
    </div>
  );
}

export default IncidentDetail;
```

---

# 📝 RCA Form Component

## RCAForm.js

This component allows incident resolution submission.

```jsx
import React, { useState } from "react";
import axios from "axios";

function RCAForm() {
  const [form, setForm] = useState({
    workItemId: "",
    rootCause: "",
    fix: "",
    prevention: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await axios.post("http://localhost:3000/rca/submit-rca", form);
      alert("RCA Submitted");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error submitting RCA");
    }
  };

  return (
    <div>
      <h3>Submit RCA</h3>

      <input name="workItemId" placeholder="Work Item ID" onChange={handleChange} />
      <input name="rootCause" placeholder="Root Cause" onChange={handleChange} />
      <input name="fix" placeholder="Fix" onChange={handleChange} />
      <input name="prevention" placeholder="Prevention" onChange={handleChange} />

      <input type="datetime-local" name="startTime" onChange={handleChange} />
      <input type="datetime-local" name="endTime" onChange={handleChange} />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default RCAForm;```

---

# 🚀 Running the Frontend

## Start React Application

```bash
npm start
```

---

## Access Dashboard

```text
http://localhost:3001 since 3000 is used by backend
```

---

# ⚡ Redis Dashboard Optimization

Redis was used to avoid repeated PostgreSQL queries.

### Benefits

- Faster dashboard loading
- Reduced DB load
- Improved responsiveness
- Better scalability

Dashboard state was cached using:

```text
dashboard:incidents
```

---

# 🎨 UI Improvements

Additional frontend enhancements:

- Severity-based display
- Responsive layout
- Automatic refresh
- Modular React components

---

# 📊 Phase 5 Outcomes

This phase successfully implemented:

- Real-time dashboard monitoring
- Backend API integration
- RCA submission workflow
- Incident detail tracking
- Redis-optimized dashboard performance
- Responsive frontend architecture

The frontend now acts as a centralized monitoring interface for incident management and operational tracking.
```

---

# ▶️ Running the Project

## Start Docker Services

```bash
docker-compose up -d
```

---

## Start Backend

```bash
cd backend
node server.js
```

---

## Start Worker

```bash
cd backend/worker
node worker.js
```

---

## Start Frontend

```bash
cd frontend
npm start
```

## Logs

# Worker 
<img width="1085" height="611" alt="Image" src="https://github.com/user-attachments/assets/c45fc105-17db-47e6-8924-70c158c8ffe2" />


# Server

<img width="982" height="337" alt="Image" src="https://github.com/user-attachments/assets/51bf8e01-fcd2-4f98-b5cb-3db9fee8f52e" />
---

# 🏁 Conclusion

This project successfully demonstrates:

- Distributed system design
- Event-driven architecture
- Async processing
- High-volume ingestion handling
- Workflow orchestration
- Real-time dashboarding
- Scalable backend engineering

The architecture closely resembles real-world production-grade incident management systems.
