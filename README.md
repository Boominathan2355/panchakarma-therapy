# Panchakarma Therapy Automation System

**Abstract**
Panchakarma therapy is a fundamental component of Ayurvedic care and requires careful planning, strict adherence to treatment protocols, and close coordination of trained staff and physical resources. In many Ayurvedic hospitals, these activities are still handled through manual, paper-based methods and informal communication among staff. Such practices often result in scheduling clashes, high administrative workload, uneven execution of therapies, and poor visibility into resource usage.

## System Overview
This work presents a web-based **Panchakarma Therapy Automation System** powered by large language models that converts traditional therapy protocols into standardized digital workflows.

### Key Capabilities
- **Protocol Automation**: Hospitals upload structured therapy documents, which are processed to extract machine-readable formats.
- **Intelligent Scheduling**: A hybrid approach combining rule-based methods and priority heuristics to manage multi-session, multi-day treatments.
- **Resource Management**: Real-time availability checks for therapists ("Vaidyas"), rooms, and materials.
- **Dynamic Adaptability**: Support for rescheduling, handling session cancellations, and accommodating urgent priority cases.
- **Audit & Explainability**: Transparency in scheduling decisions and manual overrides.

## Modules Implemented
1.  **Dashboard**: High-level KPIs, Weekly Trends, and System Alerts.
2.  **Therapy Management**: Protocol execution, safety guidelines, and digitized workflows.
3.  **Patient Management**: Profiles, Medical History, and Eligibility Tracking.
4.  **Scheduling**: Drag-and-drop Calendar, Gantt Charts, and Conflict Resolution.
5.  **Resources**: Staff Rosters, Skill Management, and Inventory Control.
6.  **Audit**: System Logs and AI Decision Explanations.

## Tech Stack
-   **Frontend**: React, Vite, Redux Toolkit
-   **Styling**: Vanilla CSS (Premium aesthetics)
-   **Visualization**: ECharts, React Big Calendar
-   **Icons**: Lucide React

## Running the Project
```bash
npm install
npm run dev
```
