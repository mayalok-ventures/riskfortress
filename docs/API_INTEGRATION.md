
### **37. `docs/API_INTEGRATION.md`** (API Documentation)
```markdown
# RiskFortress API Integration

## Overview

RiskFortress provides secure APIs for enterprise clients to integrate intelligence capabilities into their systems.

## Base URL

https://riskfortress.com/api

text

## Authentication

All API requests require authentication via JWT tokens or API keys.

### Authentication Methods

1. **JWT Token** (Recommended)
```http
Authorization: Bearer <jwt_token>
API Key

http
X-API-Key: <api_key>
Obtaining Credentials
bash
# Request API access
curl -X POST https://riskfortress.com/api/auth/request-access \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Your Corporation",
    "email": "api@yourcompany.com",
    "purpose": "Integration for risk monitoring"
  }'
Rate Limits
Free Tier: 100 requests/hour

Enterprise: 10,000 requests/hour

Custom: Contact for higher limits

Headers included in responses:

text
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
Endpoints
1. Secure Intake API
Submit Intelligence Request

http
POST /submit-intake
Request Body:

json
{
  "firstName": "John",
  "lastName": "Doe",
  "company": "Example Corp",
  "jobTitle": "Chief Security Officer",
  "email": "john@examplecorp.com",
  "phone": "+919876543210",
  "companyType": "fortune500",
  "budgetRange": "2Cr-10Cr",
  "primaryConcern": "landDueDiligence",
  "message": "Need land due diligence for 500-acre industrial project."
}
Response:

json
{
  "success": true,
  "referenceId": "RF-2024-001-ABC123",
  "message": "Intake received and secured",
  "timestamp": "2024-01-15T10:30:00Z",
  "nextSteps": [
    "Our intelligence team will review within 24 hours"
  ]
}
2. Risk Intelligence API
Get Threat Intelligence

http
GET /intelligence/threats
Parameters:

sector (optional): industrial, technical, hni

location (optional): city, state

severity (optional): critical, high, medium

limit (optional): number of results (default: 10)

Response:

json
{
  "threats": [
    {
      "id": "T-2024-001",
      "title": "Industrial Land Dispute - Maharashtra",
      "sector": "industrial",
      "severity": "high",
      "confidence": 92,
      "location": "Pune, Maharashtra",
      "summary": "Emerging land dispute affecting industrial parks",
      "keywords": ["land", "industrial", "dispute"],
      "detectedAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "metadata": {
    "total": 45,
    "page": 1,
    "limit": 10
  }
}
3. Due Diligence API
Request Land Verification

http
POST /due-diligence/land
Request Body:

json
{
  "projectName": "Mega Industrial Park",
  "location": "Pune, Maharashtra",
  "area": "500 acres",
  "documents": [
    {
      "type": "land_record",
      "reference": "LR-2024-001"
    }
  ],
  "priority": "high",
  "callbackUrl": "https://yourcompany.com/webhook/due-diligence"
}
Response:

json
{
  "requestId": "DD-2024-001-XYZ789",
  "status": "processing",
  "estimatedCompletion": "2024-01-22T10:00:00Z",
  "reportUrl": "https://riskfortress.com/reports/DD-2024-001-XYZ789"
}
4. TSCM Service API
Schedule Technical Sweep

http
POST /tscm/schedule
Request Body:

json
{
  "company": "TechCorp Inc.",
  "facility": "Bengaluru Headquarters",
  "area": "50,000 sq ft",
  "sweepType": "comprehensive",
  "scheduledDate": "2024-01-20T09:00:00Z",
  "contact": {
    "name": "Security Manager",
    "email": "security@techcorp.com",
    "phone": "+919876543210"
  },
  "specialRequirements": ["executive floors", "board room"]
}
Response:

json
{
  "bookingId": "TSCM-2024-001-ABC456",
  "status": "confirmed",
  "teamLead": "Maj. Gen. Arjun Singh (Retd.)",
  "equipment": ["Spectrum Analyzer", "Non-linear Junction Detector"],
  "estimatedDuration": "8 hours",
  "reportDelivery": "24 hours post-sweep"
}
5. Family Office API
Request Security Assessment