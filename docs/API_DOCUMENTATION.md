# SmartShield API Documentation

## Overview

The SmartShield API provides endpoints for phishing detection, user management, analytics, and chat functionality.

**Base URL**: `http://localhost:4000/api/v1`

## Authentication

Most endpoints require authentication using JWT tokens.

### Getting a Token
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Using the Token
```bash
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 🔐 Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "orgId": "optional-org-id"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "orgId": "org-123",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt_token_here"
}
```

#### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "orgId": "org-123",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

#### POST /auth/refresh
Refresh JWT token.

**Headers:**
```
Authorization: Bearer <current_token>
```

**Response:**
```json
{
  "success": true,
  "token": "new_jwt_token_here"
}
```

### 🛡️ Phishing Detection

#### POST /scan/analyze
Analyze a URL or email for phishing indicators.

**Request Body:**
```json
{
  "type": "url",
  "content": "https://suspicious-site.com",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://google.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "snapshotHash": "abc123def456",
    "url": "https://suspicious-site.com",
    "domain": "suspicious-site.com",
    "score": 0.85,
    "label": "phishing",
    "confidence": 0.92,
    "reasons": [
      "Suspicious domain name",
      "SSL certificate issues",
      "Unusual redirect patterns"
    ],
    "modelProvider": "gemini",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /scan/results/:hash
Get detailed scan results by hash.

**Response:**
```json
{
  "success": true,
  "result": {
    "snapshotHash": "abc123def456",
    "url": "https://suspicious-site.com",
    "domain": "suspicious-site.com",
    "score": 0.85,
    "label": "phishing",
    "confidence": 0.92,
    "reasons": [
      "Suspicious domain name",
      "SSL certificate issues"
    ],
    "modelProvider": "gemini",
    "orgId": "org-123",
    "createdAt": "2024-01-01T00:00:00Z",
    "analysis": {
      "domainAnalysis": {
        "age": "30 days",
        "registrar": "Unknown",
        "suspicious": true
      },
      "contentAnalysis": {
        "suspiciousKeywords": ["urgent", "verify", "account"],
        "grammarIssues": true,
        "threatLevel": "high"
      }
    }
  }
}
```

#### GET /scan/history
Get scan history for authenticated user.

**Query Parameters:**
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)
- `label`: Filter by label (phishing/safe)
- `dateFrom`: Start date (ISO format)
- `dateTo`: End date (ISO format)

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "snapshotHash": "abc123def456",
      "url": "https://suspicious-site.com",
      "score": 0.85,
      "label": "phishing",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

### 💬 Chat & AI Assistant

#### POST /chat/session
Create a new chat session.

**Request Body:**
```json
{
  "snapshotHash": "abc123def456",
  "initialMessage": "Can you explain why this site is suspicious?"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "sessionId": "session-123",
    "snapshotHash": "abc123def456",
    "messages": [],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /chat/message
Send a message to chat session.

**Request Body:**
```json
{
  "sessionId": "session-123",
  "message": "What should I do if I clicked on this link?",
  "context": {
    "userRole": "user",
    "organization": "org-123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg-456",
    "content": "If you clicked on a suspicious link, here are the immediate steps you should take...",
    "role": "assistant",
    "timestamp": "2024-01-01T00:00:00Z",
    "suggestions": [
      "Change your passwords",
      "Run antivirus scan",
      "Monitor your accounts"
    ]
  }
}
```

#### GET /chat/sessions
Get user's chat sessions.

**Query Parameters:**
- `limit`: Number of sessions (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "sessions": [
    {
      "sessionId": "session-123",
      "snapshotHash": "abc123def456",
      "messageCount": 5,
      "lastMessage": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### 📊 Analytics

#### GET /analytics/overview
Get analytics overview for organization.

**Query Parameters:**
- `period`: Time period (7d, 30d, 90d, 1y)
- `orgId`: Organization ID (admin only)

**Response:**
```json
{
  "success": true,
  "overview": {
    "totalScans": 1250,
    "phishingDetected": 45,
    "safeSites": 1205,
    "detectionRate": 0.036,
    "topThreats": [
      {
        "domain": "fake-bank.com",
        "count": 12,
        "threatLevel": "high"
      }
    ],
    "trends": {
      "daily": [
        {"date": "2024-01-01", "scans": 50, "threats": 2},
        {"date": "2024-01-02", "scans": 45, "threats": 1}
      ]
    }
  }
}
```

#### GET /analytics/users
Get user activity analytics.

**Query Parameters:**
- `period`: Time period (7d, 30d, 90d)
- `orgId`: Organization ID (admin only)

**Response:**
```json
{
  "success": true,
  "users": {
    "totalUsers": 150,
    "activeUsers": 120,
    "newUsers": 15,
    "userActivity": [
      {
        "userId": "user-123",
        "email": "user@example.com",
        "scans": 25,
        "lastActive": "2024-01-01T00:00:00Z",
        "riskScore": 0.15
      }
    ]
  }
}
```

#### POST /analytics/event
Track custom analytics event.

**Request Body:**
```json
{
  "eventType": "game_completed",
  "eventData": {
    "gameType": "phish_or_safe",
    "score": 85,
    "timeSpent": 300
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "sessionId": "session-123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "eventId": "event-789"
}
```

### 📈 Statistics

#### GET /stats/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalScans": 1250,
    "threatsBlocked": 45,
    "usersProtected": 150,
    "organizationsProtected": 25,
    "uptime": "99.9%",
    "lastUpdated": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /stats/performance
Get system performance metrics.

**Response:**
```json
{
  "success": true,
  "performance": {
    "avgResponseTime": 250,
    "requestsPerMinute": 120,
    "errorRate": 0.001,
    "databaseConnections": 5,
    "memoryUsage": "512MB",
    "cpuUsage": "25%"
  }
}
```

### 🏥 Health & Monitoring

#### GET /health
Basic health check.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

#### GET /health/detailed
Detailed health check with dependencies.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "uptime": 3600,
  "dependencies": {
    "database": {
      "status": "healthy",
      "responseTime": 15,
      "version": "PostgreSQL 15.2"
    },
    "redis": {
      "status": "healthy",
      "responseTime": 2,
      "version": "Redis 7.0"
    },
    "ai_models": {
      "status": "healthy",
      "gemini": "available",
      "openai": "available"
    }
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Codes

- `VALIDATION_ERROR`: Invalid request data
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error
- `SERVICE_UNAVAILABLE`: External service unavailable

## Rate Limiting

API endpoints are rate limited:

- **Authentication**: 5 requests per minute
- **Scan endpoints**: 100 requests per hour
- **Chat endpoints**: 50 requests per hour
- **Analytics**: 200 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Scan Complete Webhook
Sent when a scan analysis is complete.

**URL**: `POST /webhooks/scan-complete`

**Payload:**
```json
{
  "event": "scan.complete",
  "data": {
    "snapshotHash": "abc123def456",
    "url": "https://example.com",
    "score": 0.15,
    "label": "safe",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## SDK Examples

### JavaScript/Node.js
```javascript
const SmartShield = require('@smartshield/sdk');

const client = new SmartShield({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.smartshield.com'
});

// Analyze URL
const result = await client.scan.analyze({
  type: 'url',
  content: 'https://example.com'
});

console.log(result.label); // 'safe' or 'phishing'
```

### Python
```python
from smartshield import SmartShieldClient

client = SmartShieldClient(
    api_key='your-api-key',
    base_url='https://api.smartshield.com'
)

# Analyze URL
result = client.scan.analyze(
    type='url',
    content='https://example.com'
)

print(result.label)  # 'safe' or 'phishing'
```

## Testing

### Postman Collection
Import the SmartShield API collection:
- [Download Collection](postman/SmartShield-API.postman_collection.json)
- [Download Environment](postman/SmartShield-Environment.postman_environment.json)

### cURL Examples
```bash
# Health check
curl -X GET http://localhost:4000/api/v1/health

# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Analyze URL
curl -X POST http://localhost:4000/api/v1/scan/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"type":"url","content":"https://example.com"}'
```

---

For more information, see the [Testing Guide](testing_guide.md) and [Setup Guide](SETUP_GUIDE.md).
