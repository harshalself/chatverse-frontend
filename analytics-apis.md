# Chatverse Analytics API Integration Guide

## 📊 Overview

The Chatverse Analytics API provides comprehensive insights into chatbot performance, user behavior, and AI model usage. This guide covers all available analytics endpoints for frontend integration.

## 🔐 Authentication

All analytics endpoints require JWT authentication with schema:

```
Authorization: Bearer <token> <schema>
```

**Example:**
```javascript
const headers = {
  'Authorization': `Bearer ${token} ${schema}`,
  'Content-Type': 'application/json'
};
```

## 🌐 Base URL

```
http://localhost:8000/api/v1/analytics
```

---

## 📈 Agent Performance Analytics

### Get Agent Performance Report
**GET** `/agents/:agentId/performance`

Get detailed performance metrics for a specific agent.

**Parameters:**
- `agentId` (path): Agent ID
- `timeframe` (query, optional): `1d`, `7d`, `30d`, `90d` (default: `7d`)

**Response:**
```json
{
  "data": {
    "agentId": 3,
    "agentName": "Customer Support Bot",
    "timeframe": "7d",
    "totalChats": 150,
    "totalMessages": 450,
    "avgResponseTime": 1250,
    "totalCost": 2.45,
    "avgCostPerChat": 0.016,
    "efficiencyScore": 8.5,
    "qualityMetrics": {
      "satisfactionRate": 0.92,
      "errorRate": 0.03
    }
  },
  "message": "Agent performance report retrieved successfully"
}
```

### Compare Multiple Agents
**POST** `/agents/compare`

Compare performance metrics between multiple agents.

**Request Body:**
```json
{
  "agentIds": [1, 2, 3],
  "timeframe": "30d"
}
```

**Response:**
```json
{
  "data": [
    {
      "agentId": 1,
      "agentName": "Sales Bot",
      "totalMessages": 320,
      "avgResponseTime": 980,
      "totalCost": 1.25,
      "efficiencyScore": 9.2
    },
    {
      "agentId": 2,
      "agentName": "Support Bot",
      "totalMessages": 450,
      "avgResponseTime": 1250,
      "totalCost": 2.45,
      "efficiencyScore": 8.5
    }
  ],
  "message": "Agent performance comparison generated successfully"
}
```

### Get Top Performing Agents
**GET** `/agents/top`

Get ranking of top-performing agents.

**Parameters:**
- `limit` (query, optional): Number of agents to return (default: 10)
- `timeframe` (query, optional): `1d`, `7d`, `30d`, `90d` (default: `7d`)

**Response:**
```json
{
  "data": [
    {
      "agentId": 3,
      "agentName": "Premium Support Bot",
      "totalMessages": 1200,
      "avgResponseTime": 850,
      "totalCost": 4.20,
      "efficiencyScore": 9.8,
      "rank": 1
    }
  ],
  "message": "Top performing agents retrieved successfully"
}
```

### Get Agent Optimization Recommendations
**GET** `/agents/:agentId/optimize`

Get optimization suggestions for improving agent performance.

**Parameters:**
- `agentId` (path): Agent ID

**Response:**
```json
{
  "data": {
    "currentPerformance": {
      "score": 7.5,
      "responseTime": 1500,
      "costEfficiency": 6.8
    },
    "recommendedModel": "groq/llama-3.1-8b-instant",
    "potentialSavings": 25.50,
    "efficiencyGains": 15,
    "recommendations": [
      "Switch to faster model to reduce response time by 30%",
      "Optimize system prompt for better context usage",
      "Consider caching frequently asked questions"
    ]
  },
  "message": "Agent optimization recommendations generated successfully"
}
```

---

## 🤖 Model Usage Analytics

### Get Model Usage Summary
**GET** `/models/usage`

Get usage statistics for all AI models.

**Parameters:**
- `timeframe` (query, optional): `1d`, `7d`, `30d`, `90d` (default: `7d`)

**Response:**
```json
{
  "data": {
    "timeframe": "7d",
    "totalModels": 3,
    "mostUsedModel": "groq/llama-3.1-8b-instant",
    "totalUsage": 1250,
    "totalCost": 8.75,
    "modelStats": [
      {
        "model": "groq/llama-3.1-8b-instant",
        "provider": "groq",
        "usageCount": 850,
        "totalCost": 4.25,
        "avgResponseTime": 1200,
        "avgSatisfaction": 0.89
      }
    ]
  },
  "message": "Model usage summary retrieved successfully"
}
```

### Get Model Cost Analysis
**GET** `/models/costs`

Get detailed cost analysis across all models.

**Parameters:**
- `timeframe` (query, optional): `1d`, `7d`, `30d`, `90d` (default: `30d`)

**Response:**
```json
{
  "data": {
    "totalCost": 15.80,
    "avgCostPerRequest": 0.021,
    "mostExpensiveModel": "openai/gpt-4",
    "mostCostEffectiveModel": "groq/llama-3.1-8b-instant",
    "costBreakdown": [
      {
        "model": "groq/llama-3.1-8b-instant",
        "provider": "groq",
        "totalCost": 8.75,
        "totalTokens": 87500,
        "avgCostPerToken": 0.0001,
        "usageCount": 850,
        "percentage": 55.4
      }
    ],
    "costTrends": [
      {
        "date": "2025-10-01",
        "totalCost": 2.45,
        "tokenCount": 24500
      }
    ]
  },
  "message": "Model cost analysis retrieved successfully"
}
```

### Get Model Performance Comparison
**GET** `/models/performance`

Compare performance metrics across different models.

**Parameters:**
- `timeframe` (query, optional): `1d`, `7d`, `30d`, `90d` (default: `7d`)

**Response:**
```json
{
  "data": {
    "timeframe": "7d",
    "modelMetrics": [
      {
        "model": "groq/llama-3.1-8b-instant",
        "provider": "groq",
        "avgResponseTime": 1200,
        "costEfficiency": 8.5,
        "qualityScore": 8.7,
        "usageCount": 850,
        "totalCost": 4.25
      }
    ],
    "performanceComparison": [
      {
        "model": "groq/llama-3.1-8b-instant",
        "rank": 1,
        "speedScore": 9.2,
        "costScore": 8.5,
        "qualityScore": 8.7,
        "overallScore": 8.8
      }
    ],
    "recommendations": {
      "optimalModel": "groq/llama-3.1-8b-instant",
      "costSavingOpportunities": [
        "Switch 40% of gpt-4 usage to llama-3.1-8b-instant",
        "Implement model selection based on query complexity"
      ]
    }
  },
  "message": "Model performance analysis retrieved successfully"
}
```

---

## 👥 User Behavior Analytics (Phase 2)

### Get User Engagement Metrics
**GET** `/user/engagement`

Get user engagement and activity metrics.

**Parameters:**
- `timeframe` (query, optional): `1d`, `7d`, `30d`, `90d` (default: `7d`)

**Response:**
```json
{
  "data": {
    "timeframe": "7d",
    "totalUsers": 1250,
    "activeUsers": 890,
    "newUsers": 45,
    "returningUsers": 845,
    "engagementRate": 0.712,
    "avgSessionsPerUser": 3.2,
    "avgSessionDuration": 450,
    "popularFeatures": ["chat", "analytics", "settings"]
  },
  "message": "User engagement metrics retrieved successfully"
}
```

### Get User Behavior Insights
**GET** `/user/behavior`

Get detailed user behavior analysis with cohort analysis.

**Parameters:**
- `timeframe` (query, optional): `1d`, `7d`, `30d`, `90d` (default: `30d`)
- `limit` (query, optional): Number of insights to return (default: 10)

**Response:**
```json
{
  "data": {
    "timeframe": "30d",
    "summary": {
      "totalUsers": 1250,
      "totalSessions": 4000,
      "totalMessages": 8500,
      "avgSessionDuration": 450
    },
    "cohorts": [
      {
        "cohort": "2025-09-01",
        "users": 150,
        "retention": {
          "day1": 0.85,
          "day7": 0.72,
          "day30": 0.45
        }
      }
    ],
    "insights": [
      {
        "type": "engagement",
        "title": "Peak Usage Hours",
        "description": "Users are most active between 2-4 PM",
        "impact": "high"
      }
    ]
  },
  "message": "User behavior insights retrieved successfully"
}
```

---

## 📊 System Performance Analytics (Phase 1)

### Get System Performance Metrics
**GET** `/system/performance`

Get overall system performance statistics.

**Parameters:**
- `timeframe` (query, optional): `1d`, `7d`, `30d`, `90d` (default: `7d`)

**Response:**
```json
{
  "data": {
    "timeframe": "7d",
    "totalRequests": 50000,
    "avgResponseTime": 850,
    "errorRate": 0.012,
    "uptime": 99.7,
    "throughput": {
      "requestsPerSecond": 8.5,
      "peakRPS": 15.2
    },
    "resourceUsage": {
      "cpu": 65.5,
      "memory": 78.2,
      "disk": 45.1
    }
  },
  "message": "System performance metrics retrieved successfully"
}
```

---

## ⚠️ Error Handling

All endpoints return standard HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (agent/endpoint doesn't exist)
- `500`: Internal Server Error

**Error Response Format:**
```json
{
  "message": "Error description",
  "status": 400
}
```

---

## 📝 TypeScript Interfaces

```typescript
// Common types
type Timeframe = '1d' | '7d' | '30d' | '90d';

// Agent Performance
interface AgentPerformanceReport {
  agentId: number;
  agentName: string;
  timeframe: string;
  totalChats: number;
  totalMessages: number;
  avgResponseTime: number;
  totalCost: number;
  efficiencyScore: number;
}

// Model Usage
interface ModelUsageStats {
  model: string;
  provider: string;
  usageCount: number;
  totalCost: number;
  avgResponseTime: number;
}

// API Response
interface ApiResponse<T> {
  data: T;
  message: string;
}
```

---

## 🚀 Quick Start Example

```javascript
// Initialize analytics client
class AnalyticsClient {
  constructor(baseURL, token, schema) {
    this.baseURL = baseURL;
    this.headers = {
      'Authorization': `Bearer ${token} ${schema}`,
      'Content-Type': 'application/json'
    };
  }

  async getAgentPerformance(agentId, timeframe = '7d') {
    const response = await fetch(
      `${this.baseURL}/agents/${agentId}/performance?timeframe=${timeframe}`,
      { headers: this.headers }
    );
    return response.json();
  }

  async compareAgents(agentIds, timeframe = '30d') {
    const response = await fetch(`${this.baseURL}/agents/compare`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ agentIds, timeframe })
    });
    return response.json();
  }

  async getModelUsage(timeframe = '7d') {
    const response = await fetch(
      `${this.baseURL}/models/usage?timeframe=${timeframe}`,
      { headers: this.headers }
    );
    return response.json();
  }
}

// Usage
const analytics = new AnalyticsClient(
  'http://localhost:8000/api/v1/analytics',
  userToken,
  userSchema
);

const performance = await analytics.getAgentPerformance(1);
const comparison = await analytics.compareAgents([1, 2, 3]);
const usage = await analytics.getModelUsage();
```

---

## 📋 Integration Checklist

- [ ] Implement authentication token management
- [ ] Create analytics service/client class
- [ ] Add error handling for all API calls
- [ ] Implement loading states for analytics dashboards
- [ ] Add data caching for frequently accessed metrics
- [ ] Create charts/visualizations for performance data
- [ ] Implement real-time updates where applicable
- [ ] Add export functionality for reports

---

## 🆘 Support

For questions or issues with analytics API integration:
1. Check the API response format matches the documentation
2. Verify authentication headers are correct
3. Ensure agent IDs and parameters are valid
4. Check network connectivity and CORS settings

**Last Updated:** October 4, 2025</content>
<parameter name="filePath">/Users/harshalpatil/Documents/Projects/chatverse-backend/ANALYTICS_API_INTEGRATION_GUIDE.md