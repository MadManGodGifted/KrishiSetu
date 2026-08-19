# Krishi Setu - Architecture

## Project Goal

Krishi Setu is an AI-powered farming assistant built for Smart India Hackathon.

This MVP is NOT intended to be a production system. The objective is to demonstrate how multiple agricultural datasets can be combined into an intelligent decision support platform that helps farmers choose profitable crops and connects them with relevant agricultural input providers.

The application will be developed within 2 days using React Native (Expo).

---

# Tech Stack

Frontend
- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind
- React Query
- Zustand

Backend
- Node.js
- Express

Data
- Mock JSON APIs
- CSV datasets
- Live Weather API (Open-Meteo)

---

# Architecture

Farmer App
        │
        ▼
React Native Frontend
        │
 REST API
        ▼
Express Backend
        │
 ┌──────────────┬──────────────┬─────────────┐
 │              │              │
 ▼              ▼              ▼
CSV Datasets  Mock DSS APIs  Weather API

        │
        ▼

Decision Engine

        │
        ▼

Recommendation Response

---

# Data Sources

Primary

- Crop Recommendation Dataset
- Crop Yield Dataset
- Soil Dataset
- Open-Meteo Weather API

Secondary

- Mock Soil Moisture
- Mock Groundwater
- Mock Drought
- Mock Crop Rotation
- Mock NDVI

These secondary datasets simulate the Krishi DSS API structure and are designed to be easily replaced with real APIs in the future.

---

# Project Structure

frontend/

app/

components/

features/

hooks/

services/

store/

assets/

backend/

routes/

controllers/

services/

datasets/

mock/

---

# Backend APIs

GET /api/recommendation

GET /api/yield

GET /api/farm-health

GET /api/weather

GET /api/deals

POST /api/chat

---

# Decision Engine

The backend combines

- Soil Data
- Weather
- Crop Recommendation Dataset
- Yield Dataset
- Secondary Context Data

to produce

- Recommended Crop
- Expected Yield
- Confidence
- Risk Score
- Economic Viability

---

# Future Scope

Replace Mock APIs with

- Krishi DSS
- AgriStack
- Soil Health Card API
- IMD APIs

No frontend changes should be required.
