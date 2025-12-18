# Nyabugogo Smart Complex Parking Management System (NSCPMS)

## Overview

This project is a RESTful API for managing a commercial parking facility at Nyabugogo Smart Complex (Nyarugenge District, Kigali City).

It provides features for:

- **Parking Managers**
  - Record vehicle entry and exit
  - Automatic parking fee calculation
  - View currently parked vehicles
  - View parking history
  - Generate daily and monthly revenue reports

- **Drivers**
  - View their registered vehicles
  - View their parking history (entry/exit times, total hours, total amount)

---

## Tech Stack

- **Runtime:** Node.js (Express)
- **Database:** MySQL (`parking_system` database)
- **Auth:** JSON Web Tokens (JWT) with role-based access control
- **Environment:** `.env` configuration via `dotenv`

---

`

6. **Run the server**:

   ```bash
   npm run dev
   ```

   The API will run at `http://localhost:3000`.

---

3. **Login** (for either manager or driver)

   - **POST** `/api/auth/login`
   - Body:

     ```json
     {
       "username": "admin1",
       "password": "secret123"
     }
     ```

   - Response includes a `token`. Use it in the `Authorization` header:

     ```text
     Authorization: Bearer <JWT_TOKEN>
     ```

---

## Parking Manager Endpoints

> All manager endpoints require a **MANAGER** token in `Authorization: Bearer <token>`.

### 1. Record vehicle entry

- **POST** `/api/parking/entry`
- Body (JSON):

  ```json
  {
    "plateNumber": "RAB123C",
    "vehicleType": "Car",
    "userId": 2
  }
  ```

- If the vehicle does not exist, it is created and linked to driver `userId`.

### 2. Record vehicle exit

- **PUT** `/api/parking/exit/:recordId`
- Example: `/api/parking/exit/1`
- Body:

  ```json
  {}
  ```

- Calculates `totalHours` and `totalAmount` based on entry and exit time.

### 3. List currently parked vehicles

- **GET** `/api/parking/current`

Returns active parking records (where `exitTime` is `NULL`).

### 4. Daily revenue report

- **GET** `/api/reports/daily?date=YYYY-MM-DD`
- Example: `/api/reports/daily?date=2025-12-17`

### 5. Monthly revenue report

- **GET** `/api/reports/monthly?year=YYYY&month=MM`
- Example: `/api/reports/monthly?year=2025&month=12`

---

## Driver Endpoints

> All driver endpoints require a **DRIVER** token in `Authorization: Bearer <token>`.

### 1. View own vehicles

- **GET** `/api/drivers/me/vehicles`

Returns all vehicles in `Vehicle` table where `userId` is the logged-in driver.

### 2. View own parking history

- **GET** `/api/drivers/me/parking`

Returns all parking records for vehicles owned by the logged-in driver, including:

- `entryTime`
- `exitTime`
- `totalHours`
- `totalAmount`
- `plateNumber`
- `vehicleType`

---

## Parking Fee Rules

- **First 2 hours:** 1,500 RWF total.
- **Each additional hour:** 1,000 RWF per hour.
- Partial hours are rounded up to the next full hour.
- Fee is computed automatically when recording exit.

---

# CREDITS

## THIS SYSTEM WAS DEVELOPED BY

# vincenttwizere

_All rights reserved._
