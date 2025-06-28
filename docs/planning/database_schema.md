# Fleet Flow - Database Schema

**Datum poslednje revizije:** 2024-07-15

## Pregled

Ovaj dokument opisuje šemu baze podataka za Fleet Flow aplikaciju, koja obuhvata mobilnu i web platformu za upravljanje voznim parkom.

### Trenutni Status
- ✅ Mobilna aplikacija: Šema u potpunosti implementirana
- 🔄 Web aplikacija: Priprema za integraciju postojeće šeme
- 🚧 Planirana proširenja za web specifične funkcionalnosti

### Napomene o Implementaciji
- Šema je dizajnirana da bude konzistentna između mobilne i web platforme
- Koristi Supabase PostgreSQL backend
- Podržava multi-language i multi-currency funkcionalnosti
- Omogućava fleksibilnu konfiguraciju i proširenje

## Sadržaj dokumenta

- [Core Entities](#core-entities)
  - [Companies](#companies)
  - [Users](#users)
  - [Roles](#roles)
  - [UserRoles](#userroles)
  - [Permissions](#permissions)
  - [RolePermissions](#rolepermissions)
  - [Departments](#departments)
  - [UserDepartments](#userdepartments)
- [Fleet Management Entities](#fleet-management-entities)
  - [Vehicles](#vehicles)
  - [VehicleTypes](#vehicletypes)
  - [VehicleStatus](#vehiclestatus)
  - [VehicleAssignments](#vehicleassignments)
  - [VehicleDocuments](#vehicledocuments)
  - [LicenseTypes](#licensetypes)
  - [UserLicenses](#userlicenses)
  - [RequiredLicensesForVehicleType](#requiredlicensesforvehicletype)
- [Operations Entities](#operations-entities)
  - [Trips](#trips)
  - [TripTypes](#triptypes)
  - [TripPurposes](#trippurposes)
  - [TripGpsData](#tripgpsdata)
  - [Expenses](#expenses)
  - [ExpenseCategories](#expensecategories)
  - [ExpenseReceipts](#expensereceipts)
  - [Reservations](#reservations)
  - [ReservationStatus](#reservationstatus)
  - [RoadRestrictionTypes](#roadrestrictiontypes)
  - [RoadRestrictions](#roadrestrictions)
  - [RoadRestrictionVehicleTypes](#roadrestrictionvehicletypes)
- [Communication & Gamification Entities](#communication--gamification-entities)
  - [Messages](#messages)
  - [ChatGroups](#chatgroups)
  - [UserChatGroups](#userchatgroups)
  - [SystemNotifications](#systemnotifications)
  - [Reminders](#reminders)
  - [ReminderTypes](#remindertypes)
  - [GamificationChallenges](#gamificationchallenges)
  - [UserChallengeProgress](#userchallengeprogress)
  - [UserPoints](#userpoints)
  - [RewardTiers](#rewardtiers)
- [Settings & Configuration Entities](#settings--configuration-entities)
  - [ApplicationSettings](#applicationsettings)
  - [FuelPrices](#fuelprices)
  - [CurrencyRates](#currencyrates)
  - [Pois (Points of Interest)](#pois-points-of-interest)
  - [StandardRoutes](#standardroutes)
- [Audit & Logging Entities](#audit--logging-entities)
  - [AuditLogs](#auditlogs)

---

## Core Entities

### Companies
Stores information about companies using the application (if multi-company setup is needed in the future, or for organizing users). For a single-company setup, this might hold the primary organization's details.

| Column Name         | Data Type                      | Constraints                                  | Description                                      |
|---------------------|--------------------------------|----------------------------------------------|--------------------------------------------------|
| `company_id`        | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the company.               |
| `name`              | VARCHAR(255)                   | NOT NULL                                     | Name of the company.                             |
| `address`           | TEXT                           | NULLABLE                                     | Physical address of the company.                 |
| `contact_email`     | VARCHAR(255)                   | NULLABLE, UNIQUE                             | Contact email for the company.                   |
| `contact_phone`     | VARCHAR(50)                    | NULLABLE                                     | Contact phone number for the company.            |
| `subscription_plan` | VARCHAR(100)                   | NULLABLE                                     | (Future) Subscription plan details.              |
| `created_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the company record was created.|
| `updated_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of the last update.                    |

### Users
Stores information about individual users.

| Column Name         | Data Type                      | Constraints                                  | Description                                                                 |
|---------------------|--------------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| `user_id`           | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the user.                                             |
| `company_id`        | UUID / INT                     | FOREIGN KEY (Companies), NULLABLE            | Identifier of the company the user belongs to (if applicable).             |
| `username`          | VARCHAR(100)                   | NOT NULL, UNIQUE                             | Unique username for login.                                                  |
| `email`             | VARCHAR(255)                   | NOT NULL, UNIQUE                             | User's email address.                                                       |
| `password_hash`     | VARCHAR(255)                   | NOT NULL                                     | Hashed password.                                                            |
| `first_name`        | VARCHAR(100)                   | NOT NULL                                     | User's first name.                                                          |
| `last_name`         | VARCHAR(100)                   | NOT NULL                                     | User's last name.                                                           |
| `phone_number`      | VARCHAR(50)                    | NULLABLE                                     | User's phone number.                                                        |
| `avatar_url`        | VARCHAR(255)                   | NULLABLE                                     | URL to the user's profile picture.                                          |
| `is_active`         | BOOLEAN                        | NOT NULL, DEFAULT TRUE                       | Indicates if the user account is active.                                    |
| `is_email_verified` | BOOLEAN                        | NOT NULL, DEFAULT FALSE                      | Indicates if the user's email has been verified.                            |
| `last_login_at`     | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp of the user's last login.                                         |
| `onboarding_status` | VARCHAR(50)                    | NULLABLE                                     | Stage of the onboarding process (e.g., 'pending', 'completed').             |
| `preferred_language`| VARCHAR(10)                    | NULLABLE, DEFAULT 'en'                       | User's preferred language for the application (e.g., 'en', 'sr').           |
| `preferred_theme`   | VARCHAR(20)                    | NULLABLE, DEFAULT 'light'                    | User's preferred theme (e.g., 'light', 'dark').                             |
| `preferred_units`   | VARCHAR(20)                    | NULLABLE, DEFAULT 'metric'                   | User's preferred measurement units (e.g., 'metric', 'imperial').          |
| `preferred_currency`| VARCHAR(5)                     | NULLABLE, DEFAULT 'USD'                      | User's preferred currency (e.g., 'USD', 'EUR', 'RSD').                     |
| `created_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the user record was created.                              |
| `updated_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of the last update.                                               |

### Roles
Defines roles within the system (e.g., Admin, Fleet Manager, Driver).

| Column Name | Data Type                      | Constraints                                  | Description                                     |
|-------------|--------------------------------|----------------------------------------------|-------------------------------------------------|
| `role_id`   | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the role.                 |
| `role_name` | VARCHAR(100)                   | NOT NULL, UNIQUE                             | Name of the role (e.g., 'Admin', 'Driver').     |
| `description`| TEXT                           | NULLABLE                                     | Description of the role.                        |
| `created_at`| TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the role was created.         |
| `updated_at`| TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of the last update.                   |

### UserRoles
Junction table to link users to roles (many-to-many).

| Column Name | Data Type                      | Constraints                                  | Description                                     |
|-------------|--------------------------------|----------------------------------------------|-------------------------------------------------|
| `user_id`   | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (Users)             | Identifier of the user.                         |
| `role_id`   | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (Roles)             | Identifier of the role.                         |
| `assigned_at`| TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the role was assigned.        |

### Permissions
Defines specific permissions in the system (e.g., 'create_vehicle', 'approve_expense').

| Column Name      | Data Type                      | Constraints                                  | Description                                              |
|------------------|--------------------------------|----------------------------------------------|----------------------------------------------------------|
| `permission_id`  | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the permission.                    |
| `permission_name`| VARCHAR(100)                   | NOT NULL, UNIQUE                             | Name of the permission (e.g., 'vehicle:create').         |
| `description`    | TEXT                           | NULLABLE                                     | Description of what the permission allows.               |
| `module`         | VARCHAR(100)                   | NULLABLE                                     | Module this permission belongs to (e.g., 'Fleet', 'Expenses'). |
| `created_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the permission was created.            |
| `updated_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of the last update.                            |

### RolePermissions
Junction table to link roles to permissions (many-to-many).

| Column Name     | Data Type                      | Constraints                                  | Description                                     |
|-----------------|--------------------------------|----------------------------------------------|-------------------------------------------------|
| `role_id`       | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (Roles)             | Identifier of the role.                         |
| `permission_id` | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (Permissions)       | Identifier of the permission.                   |
| `assigned_at`   | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the permission was granted.   |

### Departments
Stores information about organizational departments.

| Column Name      | Data Type                      | Constraints                                  | Description                                     |
|------------------|--------------------------------|----------------------------------------------|-------------------------------------------------|
| `department_id`  | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the department.           |
| `company_id`     | UUID / INT                     | FOREIGN KEY (Companies), NOT NULL            | Company this department belongs to.             |
| `name`           | VARCHAR(150)                   | NOT NULL                                     | Name of the department.                         |
| `parent_department_id` | UUID / INT               | FOREIGN KEY (Departments), NULLABLE          | For hierarchical department structures.        |
| `created_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the department was created.   |
| `updated_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of the last update.                   |

### UserDepartments
Junction table to assign users to departments (many-to-many, or one-to-many if a user belongs to only one primary department).

| Column Name      | Data Type                      | Constraints                                  | Description                                     |
|------------------|--------------------------------|----------------------------------------------|-------------------------------------------------|
| `user_id`        | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (Users)             | Identifier of the user.                         |
| `department_id`  | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (Departments)       | Identifier of the department.                   |
| `assigned_at`    | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the user was assigned.        |

---

## Fleet Management Entities

### Vehicles
Stores detailed information about each vehicle in the fleet.

| Column Name             | Data Type                      | Constraints                                  | Description                                                                                             |
|-------------------------|--------------------------------|----------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `vehicle_id`            | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the vehicle.                                                                      |
| `company_id`            | UUID / INT                     | FOREIGN KEY (Companies), NOT NULL            | Company owning/managing this vehicle.                                                                   |
| `vehicle_type_id`       | UUID / INT                     | FOREIGN KEY (VehicleTypes), NOT NULL         | Type of vehicle (e.g., Car, Van, Truck).                                                                |
| `vehicle_status_id`     | UUID / INT                     | FOREIGN KEY (VehicleStatus), NOT NULL        | Current status of the vehicle (e.g., Available, In Use, Maintenance).                                   |
| `make`                  | VARCHAR(100)                   | NOT NULL                                     | Manufacturer of the vehicle (e.g., Volkswagen, Toyota).                                                 |
| `model`                 | VARCHAR(100)                   | NOT NULL                                     | Model of the vehicle (e.g., Golf, Corolla).                                                             |
| `year`                  | INT                            | NOT NULL                                     | Manufacturing year.                                                                                     |
| `license_plate`         | VARCHAR(20)                    | NOT NULL, UNIQUE (per company/region)        | Vehicle registration number.                                                                            |
| `vin`                   | VARCHAR(17)                    | NULLABLE, UNIQUE (per company)               | Vehicle Identification Number.                                                                          |
| `color`                 | VARCHAR(50)                    | NULLABLE                                     | Color of the vehicle.                                                                                   |
| `engine_type`           | VARCHAR(50)                    | NULLABLE                                     | Type of engine (e.g., Petrol, Diesel, Electric, Hybrid).                                                |
| `fuel_type_id`          | UUID / INT                     | FOREIGN KEY (FuelTypes - to be defined), NULLABLE | Primary fuel type.                                                                                     |
| `fuel_tank_capacity`    | DECIMAL(10,2)                  | NULLABLE                                     | Fuel tank capacity (e.g., in liters or gallons).                                                        |
| `battery_capacity_kwh`  | DECIMAL(10,2)                  | NULLABLE                                     | For electric vehicles, battery capacity in kWh.                                                         |
| `avg_consumption`       | DECIMAL(10,2)                  | NULLABLE                                     | Average fuel/energy consumption (e.g., L/100km or kWh/100km). Can be calculated or manually set.     |
| `current_odometer`      | INT                            | NULLABLE                                     | Current odometer reading in km or miles.                                                                |
| `last_odometer_update`  | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp of the last odometer update.                                                                  |
| `registration_date`     | DATE                           | NULLABLE                                     | Date of first registration.                                                                             |
| `registration_expiry_date`| DATE                         | NULLABLE                                     | Date when registration expires.                                                                         |
| `insurance_policy_number`| VARCHAR(100)                  | NULLABLE                                     | Insurance policy number.                                                                                |
| `insurance_expiry_date` | DATE                           | NULLABLE                                     | Date when insurance expires.                                                                            |
| `is_private_vehicle`    | BOOLEAN                        | NOT NULL, DEFAULT FALSE                      | Indicates if this is a privately owned vehicle used for company purposes.                               |
| `notes`                 | TEXT                           | NULLABLE                                     | Any additional notes about the vehicle.                                                                 |
| `created_at`            | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the vehicle record was created.                                                       |
| `updated_at`            | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of the last update.                                                                           |

### VehicleTypes
Defines categories or types of vehicles.

| Column Name       | Data Type                      | Constraints                                  | Description                                       |
|-------------------|--------------------------------|----------------------------------------------|---------------------------------------------------|
| `vehicle_type_id` | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the vehicle type.           |
| `name`            | VARCHAR(100)                   | NOT NULL, UNIQUE                             | Name of the vehicle type (e.g., Sedan, SUV, Van). |
| `description`     | TEXT                           | NULLABLE                                     | Description of the vehicle type.                  |
| `created_at`      | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                            |
| `updated_at`      | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                         |

### VehicleStatus
Defines possible statuses for a vehicle.

| Column Name         | Data Type                      | Constraints                                  | Description                                                        |
|---------------------|--------------------------------|----------------------------------------------|--------------------------------------------------------------------|
| `vehicle_status_id` | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the vehicle status.                          |
| `status_name`       | VARCHAR(50)                    | NOT NULL, UNIQUE                             | Name of the status (e.g., 'Available', 'In Use', 'Maintenance').   |
| `description`       | TEXT                           | NULLABLE                                     | Description of the status.                                         |
| `is_available_for_booking` | BOOLEAN                 | NOT NULL, DEFAULT TRUE                       | Indicates if vehicles with this status can be booked.              |
| `created_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                             |
| `updated_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                          |

### VehicleAssignments
Tracks which user is currently assigned to or primarily uses a vehicle (default driver).

| Column Name         | Data Type                      | Constraints                                  | Description                                       |
|---------------------|--------------------------------|----------------------------------------------|---------------------------------------------------|
| `assignment_id`     | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the assignment.             |
| `vehicle_id`        | UUID / INT                     | FOREIGN KEY (Vehicles), NOT NULL             | The assigned vehicle.                             |
| `user_id`           | UUID / INT                     | FOREIGN KEY (Users), NOT NULL                | The user assigned to the vehicle.                 |
| `assignment_type`   | VARCHAR(50)                    | NULLABLE                                     | Type of assignment (e.g., 'default_driver', 'temporary'). |
| `start_date`        | TIMESTAMP WITH TIME ZONE       | NOT NULL                                     | Start date of the assignment.                     |
| `end_date`          | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | End date of the assignment (if applicable).       |
| `notes`             | TEXT                           | NULLABLE                                     | Notes about the assignment.                       |
| `created_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                            |
| `updated_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                         |

### VehicleDocuments
Stores documents related to vehicles (e.g., registration, insurance).

| Column Name      | Data Type                      | Constraints                                  | Description                                      |
|------------------|--------------------------------|----------------------------------------------|--------------------------------------------------|
| `document_id`    | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the document.              |
| `vehicle_id`     | UUID / INT                     | FOREIGN KEY (Vehicles), NOT NULL             | The vehicle this document belongs to.            |
| `document_type`  | VARCHAR(100)                   | NOT NULL                                     | Type of document (e.g., 'Registration', 'Insurance'). |
| `document_url`   | VARCHAR(255)                   | NOT NULL                                     | URL or path to the stored document.              |
| `file_name`      | VARCHAR(255)                   | NULLABLE                                     | Original file name of the document.              |
| `mime_type`      | VARCHAR(100)                   | NULLABLE                                     | Mime type of the document file.                  |
| `issue_date`     | DATE                           | NULLABLE                                     | Issue date of the document.                      |
| `expiry_date`    | DATE                           | NULLABLE                                     | Expiry date of the document.                     |
| `uploaded_by_user_id` | UUID / INT                | FOREIGN KEY (Users), NULLABLE                | User who uploaded the document.                  |
| `created_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                           |
| `updated_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                        |

### LicenseTypes
Defines different types of driving licenses or certifications.

| Column Name       | Data Type                      | Constraints                                  | Description                                       |
|-------------------|--------------------------------|----------------------------------------------|---------------------------------------------------|
| `license_type_id` | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the license type.           |
| `name`            | VARCHAR(100)                   | NOT NULL, UNIQUE                             | Name of the license type (e.g., 'Category B', 'ADR'). |
| `description`     | TEXT                           | NULLABLE                                     | Description of the license type.                  |
| `created_at`      | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                            |
| `updated_at`      | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                         |

### UserLicenses
Stores licenses held by users.

| Column Name       | Data Type                      | Constraints                                  | Description                                      |
|-------------------|--------------------------------|----------------------------------------------|--------------------------------------------------|
| `user_license_id` | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the user's license entry.  |
| `user_id`         | UUID / INT                     | FOREIGN KEY (Users), NOT NULL                | The user who holds the license.                  |
| `license_type_id` | UUID / INT                     | FOREIGN KEY (LicenseTypes), NOT NULL         | The type of license.                             |
| `license_number`  | VARCHAR(100)                   | NULLABLE                                     | License number.                                  |
| `issue_date`      | DATE                           | NULLABLE                                     | Issue date of the license.                       |
| `expiry_date`     | DATE                           | NULLABLE                                     | Expiry date of the license.                      |
| `issuing_authority`| VARCHAR(150)                  | NULLABLE                                     | Authority that issued the license.               |
| `document_url`    | VARCHAR(255)                   | NULLABLE                                     | URL to a scanned copy of the license.            |
| `is_verified`     | BOOLEAN                        | NOT NULL, DEFAULT FALSE                      | Whether the license has been verified by an admin. |
| `verified_by_user_id` | UUID / INT                | FOREIGN KEY (Users), NULLABLE                | Admin who verified the license.                  |
| `verified_at`     | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp of verification.                       |
| `created_at`      | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                           |
| `updated_at`      | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                        |

### RequiredLicensesForVehicleType
Junction table specifying which license types are required for operating certain vehicle types.

| Column Name         | Data Type                      | Constraints                                  | Description                                         |
|---------------------|--------------------------------|----------------------------------------------|-----------------------------------------------------|
| `vehicle_type_id`   | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (VehicleTypes)      | Identifier of the vehicle type.                     |
| `license_type_id`   | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (LicenseTypes)      | Identifier of the required license type.            |
| `notes`             | TEXT                           | NULLABLE                                     | Any specific notes about this requirement.          |
| `created_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the requirement was defined.      |

---
## Operations Entities

### Trips
Records details of each trip made.

| Column Name         | Data Type                      | Constraints                                  | Description                                                                          |
|---------------------|--------------------------------|----------------------------------------------|--------------------------------------------------------------------------------------|
| `trip_id`           | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the trip.                                                      |
| `user_id`           | UUID / INT                     | FOREIGN KEY (Users), NOT NULL                | User who made the trip (driver).                                                     |
| `vehicle_id`        | UUID / INT                     | FOREIGN KEY (Vehicles), NOT NULL             | Vehicle used for the trip.                                                           |
| `trip_type_id`      | UUID / INT                     | FOREIGN KEY (TripTypes), NULLABLE            | Type of trip (e.g., 'Business', 'Personal', 'Commute').                              |
| `trip_purpose_id`   | UUID / INT                     | FOREIGN KEY (TripPurposes), NULLABLE         | Specific purpose of the trip.                                                        |
| `start_time`        | TIMESTAMP WITH TIME ZONE       | NOT NULL                                     | Timestamp when the trip started.                                                     |
| `end_time`          | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp when the trip ended.                                                       |
| `start_location_lat`| DECIMAL(9,6)                   | NULLABLE                                     | Latitude of the starting point.                                                      |
| `start_location_lon`| DECIMAL(9,6)                   | NULLABLE                                     | Longitude of the starting point.                                                     |
| `start_location_address`| TEXT                       | NULLABLE                                     | Address of the starting point.                                                       |
| `end_location_lat`  | DECIMAL(9,6)                   | NULLABLE                                     | Latitude of the ending point.                                                        |
| `end_location_lon`  | DECIMAL(9,6)                   | NULLABLE                                     | Longitude of the ending point.                                                       |
| `end_location_address`| TEXT                         | NULLABLE                                     | Address of the ending point.                                                         |
| `start_odometer`    | INT                            | NULLABLE                                     | Odometer reading at the start of the trip.                                           |
| `end_odometer`      | INT                            | NULLABLE                                     | Odometer reading at the end of the trip.                                             |
| `distance_km`       | DECIMAL(10,2)                  | NULLABLE                                     | Total distance of the trip in kilometers. Could be GPS-calculated or manual.       |
| `duration_minutes`  | INT                            | NULLABLE                                     | Total duration of the trip in minutes.                                               |
| `route_details_json`| JSONB                          | NULLABLE                                     | JSON object storing waypoints or polyline of the route.                              |
| `status`            | VARCHAR(50)                    | NOT NULL, DEFAULT 'PLANNED'                  | Status of the trip (e.g., 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').      |
| `notes`             | TEXT                           | NULLABLE                                     | Any notes related to the trip.                                                       |
| `is_offline_synced` | BOOLEAN                        | NOT NULL, DEFAULT FALSE                      | Indicates if an offline-recorded trip has been synced.                               |
| `purpose_description`| TEXT                          | NULLABLE                                     | User-provided description of the trip purpose if not fitting predefined categories. |
| `created_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                               |
| `updated_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                            |

### TripTypes
Predefined types of trips, e.g., business, personal, city, intercity.
Some trip types might have fixed costs/mileage associated.

| Column Name           | Data Type                      | Constraints                                  | Description                                                               |
|-----------------------|--------------------------------|----------------------------------------------|---------------------------------------------------------------------------|
| `trip_type_id`        | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the trip type.                                      |
| `name`                | VARCHAR(100)                   | NOT NULL, UNIQUE                             | Name of the trip type (e.g., 'City Business', 'Intercity Commute').       |
| `description`         | TEXT                           | NULLABLE                                     | Description of the trip type.                                             |
| `fixed_distance_km`   | DECIMAL(10,2)                  | NULLABLE                                     | Predefined distance for this trip type, if applicable.                    |
| `fixed_cost_amount`   | DECIMAL(10,2)                  | NULLABLE                                     | Predefined cost for this trip type, if applicable.                        |
| `cost_calculation_formula` | TEXT                      | NULLABLE                                     | Formula or rules for calculating cost if not fixed.                       |
| `is_billable`         | BOOLEAN                        | NOT NULL, DEFAULT TRUE                       | Indicates if this trip type is typically billable or reimbursable.        |
| `created_at`          | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                    |
| `updated_at`          | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                 |

### TripPurposes
Predefined purposes for trips.

| Column Name         | Data Type                      | Constraints                                  | Description                                       |
|---------------------|--------------------------------|----------------------------------------------|---------------------------------------------------|
| `trip_purpose_id`   | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the trip purpose.           |
| `name`              | VARCHAR(150)                   | NOT NULL, UNIQUE                             | Name of the trip purpose (e.g., 'Client Meeting', 'Delivery'). |
| `description`       | TEXT                           | NULLABLE                                     | Description of the trip purpose.                  |
| `category`          | VARCHAR(50)                    | NULLABLE                                     | Broad category (e.g., 'Sales', 'Operations', 'Personal'). |
| `created_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                            |
| `updated_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                         |


### TripGpsData
Stores GPS data points for a trip if detailed tracking is enabled.

| Column Name    | Data Type                      | Constraints                                  | Description                                      |
|----------------|--------------------------------|----------------------------------------------|--------------------------------------------------|
| `gps_data_id`  | BIGSERIAL / UUID               | PRIMARY KEY                                  | Unique identifier for the GPS data point.        |
| `trip_id`      | UUID / INT                     | FOREIGN KEY (Trips), NOT NULL, INDEX         | The trip this GPS data belongs to.               |
| `latitude`     | DECIMAL(9,6)                   | NOT NULL                                     | Latitude of the GPS point.                       |
| `longitude`    | DECIMAL(9,6)                   | NOT NULL                                     | Longitude of the GPS point.                      |
| `altitude`     | DECIMAL(10,2)                  | NULLABLE                                     | Altitude in meters.                              |
| `speed_kmh`    | DECIMAL(5,2)                   | NULLABLE                                     | Speed in km/h at this point.                     |
| `accuracy_m`   | DECIMAL(6,2)                   | NULLABLE                                     | GPS accuracy in meters.                          |
| `heading`      | DECIMAL(5,2)                   | NULLABLE                                     | Direction of travel (degrees from North).        |
| `timestamp`    | TIMESTAMP WITH TIME ZONE       | NOT NULL                                     | Timestamp of the GPS reading.                    |
| `created_at`   | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the record was created.        |

### Expenses
Records various expenses related to fleet operations.

| Column Name          | Data Type                      | Constraints                                  | Description                                                                             |
|----------------------|--------------------------------|----------------------------------------------|-----------------------------------------------------------------------------------------|
| `expense_id`         | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the expense.                                                      |
| `user_id`            | UUID / INT                     | FOREIGN KEY (Users), NOT NULL                | User who incurred or reported the expense.                                              |
| `trip_id`            | UUID / INT                     | FOREIGN KEY (Trips), NULLABLE                | Associated trip, if any.                                                                |
| `vehicle_id`         | UUID / INT                     | FOREIGN KEY (Vehicles), NULLABLE             | Associated vehicle, if any.                                                             |
| `expense_category_id`| UUID / INT                     | FOREIGN KEY (ExpenseCategories), NOT NULL    | Category of the expense (e.g., Fuel, Toll, Parking).                                    |
| `amount`             | DECIMAL(10,2)                  | NOT NULL                                     | Amount of the expense.                                                                  |
| `currency`           | VARCHAR(5)                     | NOT NULL, DEFAULT 'USD'                      | Currency of the expense amount.                                                         |
| `expense_date`       | DATE                           | NOT NULL                                     | Date when the expense was incurred.                                                     |
| `description`        | TEXT                           | NULLABLE                                     | Detailed description of the expense.                                                    |
| `status`             | VARCHAR(50)                    | NOT NULL, DEFAULT 'PENDING'                  | Approval status (e.g., 'PENDING', 'APPROVED', 'REJECTED', 'REIMBURSED').              |
| `approved_by_user_id`| UUID / INT                     | FOREIGN KEY (Users), NULLABLE                | User who approved/rejected the expense.                                                 |
| `approval_date`      | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp of approval/rejection.                                                        |
| `rejection_reason`   | TEXT                           | NULLABLE                                     | Reason if the expense was rejected.                                                     |
| `payment_method`     | VARCHAR(50)                    | NULLABLE                                     | How the expense was paid (e.g., 'Cash', 'Credit Card', 'Fuel Card').                    |
| `fuel_liters`        | DECIMAL(10,2)                  | NULLABLE                                     | For fuel expenses, amount of fuel in liters.                                            |
| `fuel_price_per_liter`| DECIMAL(10,3)                 | NULLABLE                                     | For fuel expenses, price per liter.                                                     |
| `is_reimbursable`    | BOOLEAN                        | NOT NULL, DEFAULT TRUE                       | Indicates if the expense is reimbursable to the user.                                   |
| `created_at`         | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                                  |
| `updated_at`         | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                               |

### ExpenseCategories
Defines categories for expenses.

| Column Name         | Data Type                      | Constraints                                  | Description                                                        |
|---------------------|--------------------------------|----------------------------------------------|--------------------------------------------------------------------|
| `expense_category_id`| UUID / INT (auto-increment)   | PRIMARY KEY                                  | Unique identifier for the expense category.                        |
| `name`              | VARCHAR(100)                   | NOT NULL, UNIQUE                             | Name of the category (e.g., 'Fuel', 'Tolls', 'Parking', 'Maintenance').|
| `description`       | TEXT                           | NULLABLE                                     | Description of the category.                                       |
| `default_gl_code`   | VARCHAR(50)                    | NULLABLE                                     | Default General Ledger code for accounting integration (future).   |
| `is_active`         | BOOLEAN                        | NOT NULL, DEFAULT TRUE                       | Whether this category is currently active/selectable.              |
| `created_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                             |
| `updated_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                          |

### ExpenseReceipts
Stores images or files of expense receipts.

| Column Name      | Data Type                      | Constraints                                  | Description                                      |
|------------------|--------------------------------|----------------------------------------------|--------------------------------------------------|
| `receipt_id`     | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the receipt.               |
| `expense_id`     | UUID / INT                     | FOREIGN KEY (Expenses), NOT NULL             | The expense this receipt belongs to.             |
| `file_url`       | VARCHAR(255)                   | NOT NULL                                     | URL or path to the stored receipt file.          |
| `file_name`      | VARCHAR(255)                   | NULLABLE                                     | Original file name of the receipt.               |
| `mime_type`      | VARCHAR(100)                   | NULLABLE                                     | Mime type of the receipt file.                   |
| `uploaded_at`    | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the receipt was uploaded.      |
| `uploaded_by_user_id` | UUID / INT                | FOREIGN KEY (Users), NOT NULL                | User who uploaded the receipt.                   |
| `created_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                           |

### Reservations
Manages vehicle reservations.

| Column Name          | Data Type                      | Constraints                                  | Description                                                                  |
|----------------------|--------------------------------|----------------------------------------------|------------------------------------------------------------------------------|
| `reservation_id`     | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the reservation.                                       |
| `user_id`            | UUID / INT                     | FOREIGN KEY (Users), NOT NULL                | User who made the reservation.                                               |
| `vehicle_id`         | UUID / INT                     | FOREIGN KEY (Vehicles), NULLABLE             | Vehicle being reserved. Can be NULL if any suitable vehicle.                 |
| `vehicle_type_id`    | UUID / INT                     | FOREIGN KEY (VehicleTypes), NULLABLE         | Requested vehicle type if specific vehicle not chosen.                       |
| `start_time`         | TIMESTAMP WITH TIME ZONE       | NOT NULL                                     | Requested start time for the reservation.                                    |
| `end_time`           | TIMESTAMP WITH TIME ZONE       | NOT NULL                                     | Requested end time for the reservation.                                      |
| `purpose`            | TEXT                           | NULLABLE                                     | Purpose of the reservation.                                                  |
| `status_id`          | UUID / INT                     | FOREIGN KEY (ReservationStatus), NOT NULL    | Current status of the reservation (e.g., 'PENDING', 'APPROVED', 'REJECTED'). |
| `approved_by_user_id`| UUID / INT                     | FOREIGN KEY (Users), NULLABLE                | User who approved/rejected the reservation.                                  |
| `approval_notes`     | TEXT                           | NULLABLE                                     | Notes from the approver.                                                     |
| `rejection_reason`   | TEXT                           | NULLABLE                                     | Reason if the reservation was rejected.                                      |
| `requested_features` | JSONB                          | NULLABLE                                     | Any specific features requested for the vehicle (e.g. 'GPS', 'tow_hitch').   |
| `actual_vehicle_id`  | UUID / INT                     | FOREIGN KEY (Vehicles), NULLABLE             | The actual vehicle assigned if different from requested or if any was chosen. |
| `pickup_location`    | TEXT                           | NULLABLE                                     | Where the vehicle will be picked up.                                         |
| `dropoff_location`   | TEXT                           | NULLABLE                                     | Where the vehicle will be dropped off.                                       |
| `created_at`         | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                       |
| `updated_at`         | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                    |

### ReservationStatus
Defines possible statuses for a reservation.

| Column Name           | Data Type                      | Constraints                                  | Description                                                               |
|-----------------------|--------------------------------|----------------------------------------------|---------------------------------------------------------------------------|
| `reservation_status_id`| UUID / INT (auto-increment)   | PRIMARY KEY                                  | Unique identifier for the reservation status.                             |
| `status_name`         | VARCHAR(50)                    | NOT NULL, UNIQUE                             | Name of the status (e.g., 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED', 'ACTIVE', 'COMPLETED'). |
| `description`         | TEXT                           | NULLABLE                                     | Description of the status.                                                |
| `created_at`          | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                    |
| `updated_at`          | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                 |

### RoadRestrictionTypes
Defines types of road restrictions or advisories.

| Column Name             | Data Type                      | Constraints                                  | Description                                                                 |
|-------------------------|--------------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| `restriction_type_id`   | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the road restriction type.                            |
| `name`                  | VARCHAR(150)                   | NOT NULL, UNIQUE                             | Name of the restriction type (e.g., 'Road Works', 'Seasonal Closure', 'Weight Limit', 'Height Limit', 'Traffic Jam', 'Accident'). |
| `description`           | TEXT                           | NULLABLE                                     | Description of the restriction type.                                        |
| `category`              | VARCHAR(50)                    | NULLABLE                                     | Category of restriction (e.g., 'CONSTRUCTION', 'REGULATORY', 'EVENT', 'WEATHER_RELATED', 'TRAFFIC_INCIDENT'). |
| `default_severity`      | VARCHAR(20)                    | NULLABLE                                     | Default severity (e.g., 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL').               |
| `icon_url`              | VARCHAR(255)                   | NULLABLE                                     | URL for an icon representing this restriction type.                         |
| `created_at`            | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                      |
| `updated_at`            | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                   |

### RoadRestrictions
Stores information about specific road restrictions, advisories, or conditions. Data can be sourced from APIs or entered manually.

| Column Name             | Data Type                      | Constraints                                  | Description                                                                                    |
|-------------------------|--------------------------------|----------------------------------------------|------------------------------------------------------------------------------------------------|
| `restriction_id`        | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the road restriction.                                                    |
| `restriction_type_id`   | UUID / INT                     | FOREIGN KEY (RoadRestrictionTypes), NOT NULL | Type of restriction.                                                                           |
| `description`           | TEXT                           | NOT NULL                                     | Detailed description of the restriction/condition.                                             |
| `location_description`  | TEXT                           | NULLABLE                                     | Textual description of the location (e.g., 'Highway A1, km 55-60').                            |
| `location_geojson`      | JSONB                          | NULLABLE                                     | GeoJSON representing the affected area (Point, LineString, Polygon).                           |
| `start_latitude`        | DECIMAL(9,6)                   | NULLABLE                                     | Start latitude (if a segment or point).                                                        |
| `start_longitude`       | DECIMAL(9,6)                   | NULLABLE                                     | Start longitude (if a segment or point).                                                       |
| `end_latitude`          | DECIMAL(9,6)                   | NULLABLE                                     | End latitude (if a segment).                                                                   |
| `end_longitude`         | DECIMAL(9,6)                   | NULLABLE                                     | End longitude (if a segment).                                                                  |
| `affected_road_names`   | TEXT[]                         | NULLABLE                                     | Array of affected road names/numbers.                                                          |
| `start_time`            | TIMESTAMP WITH TIME ZONE       | NOT NULL                                     | Start time of the restriction.                                                                 |
| `end_time`              | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | End time of the restriction (if applicable, otherwise indefinite or event-based).                |
| `expected_delay_min`    | INT                            | NULLABLE                                     | Expected delay in minutes due to this restriction.                                             |
| `severity`              | VARCHAR(20)                    | NULLABLE                                     | Severity of the restriction (overrides type default if set).                                   |
| `source`                | VARCHAR(100)                   | NULLABLE                                     | Source of the information (e.g., 'API:TrafficServiceX', 'Manual Entry', 'User Report').        |
| `source_event_id`       | VARCHAR(255)                   | NULLABLE                                     | Original ID from the source system, if applicable.                                             |
| `is_verified`           | BOOLEAN                        | NOT NULL, DEFAULT FALSE                      | If the restriction has been verified (especially for user reports or unconfirmed API data).    |
| `verified_by_user_id`   | UUID / INT                     | FOREIGN KEY (Users), NULLABLE                | User who verified the restriction.                                                             |
| `verified_at`           | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp of verification.                                                                     |
| `notes`                 | TEXT                           | NULLABLE                                     | Additional notes.                                                                              |
| `created_at`            | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                                         |
| `updated_at`            | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                                      |

### RoadRestrictionVehicleTypes
Junction table to link specific road restrictions to applicable vehicle types (e.g., a weight limit only applies to trucks).
If a restriction has no entries here, it's assumed to apply to all vehicle types.

| Column Name         | Data Type                      | Constraints                                       | Description                                         |
|---------------------|--------------------------------|---------------------------------------------------|-----------------------------------------------------|
| `restriction_id`    | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (RoadRestrictions)       | Identifier of the road restriction.                 |
| `vehicle_type_id`   | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (VehicleTypes)           | Identifier of the vehicle type affected.            |
| `notes`             | TEXT                           | NULLABLE                                          | Specific notes for this vehicle type regarding the restriction. |
| `created_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP               | Timestamp of when this link was created.            |

---

## Communication & Gamification Entities

### Messages
Stores individual messages for direct or group chats.

| Column Name      | Data Type                      | Constraints                                  | Description                                      |
|------------------|--------------------------------|----------------------------------------------|--------------------------------------------------|
| `message_id`     | UUID / BIGSERIAL               | PRIMARY KEY                                  | Unique identifier for the message.               |
| `chat_group_id`  | UUID / INT                     | FOREIGN KEY (ChatGroups), NULLABLE           | Group this message belongs to (if group message).|
| `sender_user_id` | UUID / INT                     | FOREIGN KEY (Users), NOT NULL                | User who sent the message.                       |
| `receiver_user_id`| UUID / INT                    | FOREIGN KEY (Users), NULLABLE                | User receiving the message (if direct message).  |
| `content_type`   | VARCHAR(50)                    | NOT NULL, DEFAULT 'TEXT'                     | Type of message content ('TEXT', 'IMAGE', 'FILE', 'LOCATION'). |
| `content_text`   | TEXT                           | NULLABLE                                     | Text content of the message.                     |
| `content_url`    | VARCHAR(255)                   | NULLABLE                                     | URL for image/file content.                      |
| `content_metadata`| JSONB                         | NULLABLE                                     | Metadata for content (e.g., file size, image dimensions, location coordinates). |
| `sent_at`        | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp when the message was sent.             |
| `read_at`        | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp when the message was read by recipient (for DMs). |
| `status`         | VARCHAR(20)                    | NULLABLE                                     | e.g. 'SENT', 'DELIVERED', 'READ', 'FAILED'      |
| `created_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                           |

### ChatGroups
Stores information about group chats.

| Column Name      | Data Type                      | Constraints                                  | Description                                       |
|------------------|--------------------------------|----------------------------------------------|---------------------------------------------------|
| `chat_group_id`  | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the chat group.             |
| `group_name`     | VARCHAR(150)                   | NULLABLE                                     | Name of the group chat.                           |
| `group_avatar_url`| VARCHAR(255)                  | NULLABLE                                     | URL for the group's avatar/icon.                  |
| `created_by_user_id`| UUID / INT                  | FOREIGN KEY (Users), NOT NULL                | User who created the group.                       |
| `last_message_id`| UUID / BIGSERIAL               | FOREIGN KEY (Messages), NULLABLE             | ID of the last message sent in this group (for quick preview). |
| `created_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                            |
| `updated_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update (e.g., new message).     |

### UserChatGroups
Junction table linking users to chat groups (many-to-many).

| Column Name      | Data Type                      | Constraints                                  | Description                                      |
|------------------|--------------------------------|----------------------------------------------|--------------------------------------------------|
| `user_id`        | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (Users)             | Identifier of the user.                          |
| `chat_group_id`  | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (ChatGroups)        | Identifier of the chat group.                    |
| `joined_at`      | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of when the user joined the group.     |
| `last_read_message_id` | UUID / BIGSERIAL         | FOREIGN KEY (Messages), NULLABLE             | Last message ID read by this user in this group. |
| `muted_until`    | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | If user muted notifications for this group.      |
| `role_in_group`  | VARCHAR(20)                    | NULLABLE                                     | e.g. 'ADMIN', 'MEMBER'                          |

### SystemNotifications
Stores system-generated notifications for users.

| Column Name          | Data Type                      | Constraints                                  | Description                                                                  |
|----------------------|--------------------------------|----------------------------------------------|------------------------------------------------------------------------------|
| `notification_id`    | UUID / BIGSERIAL               | PRIMARY KEY                                  | Unique identifier for the notification.                                      |
| `user_id`            | UUID / INT                     | FOREIGN KEY (Users), NOT NULL                | The user who should receive this notification.                               |
| `type`               | VARCHAR(100)                   | NOT NULL                                     | Type of notification (e.g., 'RESERVATION_APPROVED', 'REMINDER_DUE', 'NEW_MESSAGE', 'WEATHER_ALERT', 'ROAD_CONDITION_UPDATE'). |
| `title`              | VARCHAR(255)                   | NULLABLE                                     | Title of the notification.                                                   |
| `message`            | TEXT                           | NOT NULL                                     | Content of the notification message.                                         |
| `related_entity_type`| VARCHAR(50)                    | NULLABLE                                     | Type of entity this notification relates to (e.g., 'Reservation', 'Vehicle'). |
| `related_entity_id`  | VARCHAR(255)                   | NULLABLE                                     | ID of the related entity.                                                    |
| `is_read`            | BOOLEAN                        | NOT NULL, DEFAULT FALSE                      | Whether the user has read the notification.                                  |
| `read_at`            | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp when the notification was read.                                    |
| `created_at`         | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                       |

### Reminders
Stores personal and system-generated reminders.

| Column Name        | Data Type                      | Constraints                                  | Description                                                                   |
|--------------------|--------------------------------|----------------------------------------------|-------------------------------------------------------------------------------|
| `reminder_id`      | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the reminder.                                           |
| `user_id`          | UUID / INT                     | FOREIGN KEY (Users), NOT NULL                | User who owns or is targeted by this reminder.                                |
| `reminder_type_id` | UUID / INT                     | FOREIGN KEY (ReminderTypes), NULLABLE        | Type of reminder (e.g., 'Service Due', 'License Expiry', 'Personal').         |
| `vehicle_id`       | UUID / INT                     | FOREIGN KEY (Vehicles), NULLABLE             | Vehicle associated with the reminder (e.g., for service).                     |
| `user_license_id`  | UUID / INT                     | FOREIGN KEY (UserLicenses), NULLABLE         | User license associated with the reminder (e.g., for expiry).                 |
| `title`            | VARCHAR(255)                   | NOT NULL                                     | Title of the reminder.                                                        |
| `description`      | TEXT                           | NULLABLE                                     | Detailed description of the reminder.                                         |
| `due_date`         | TIMESTAMP WITH TIME ZONE       | NOT NULL                                     | When the reminder is due.                                                     |
| `is_system_generated`| BOOLEAN                      | NOT NULL, DEFAULT FALSE                      | True if generated by the system, false if user-created.                       |
| `is_completed`     | BOOLEAN                        | NOT NULL, DEFAULT FALSE                      | Whether the reminder has been marked as completed.                            |
| `completed_at`     | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp of completion.                                                      |
| `notification_preferences` | JSONB                   | NULLABLE                                     | How/when user wants to be notified (e.g., 1 day before, email, push).         |
| `created_at`       | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                        |
| `updated_at`       | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                     |

### ReminderTypes
Predefined types for reminders.

| Column Name        | Data Type                      | Constraints                                  | Description                                       |
|--------------------|--------------------------------|----------------------------------------------|---------------------------------------------------|
| `reminder_type_id` | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the reminder type.          |
| `name`             | VARCHAR(100)                   | NOT NULL, UNIQUE                             | Name of the reminder type (e.g., 'Vehicle Service', 'License Renewal'). |
| `description`      | TEXT                           | NULLABLE                                     | Description of the reminder type.                 |
| `default_lead_time_days` | INT                     | NULLABLE                                     | Default number of days before due date to notify. |
| `created_at`       | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                            |
| `updated_at`       | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                         |


### GamificationChallenges
Defines challenges for the "FleetEco Rewards" system.

| Column Name        | Data Type                      | Constraints                                  | Description                                                              |
|--------------------|--------------------------------|----------------------------------------------|----------------------------------------------------------------------------|
| `challenge_id`     | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the challenge.                                     |
| `name`             | VARCHAR(150)                   | NOT NULL                                     | Name of the challenge.                                                   |
| `description`      | TEXT                           | NOT NULL                                     | Description of how to complete the challenge.                            |
| `challenge_type`   | VARCHAR(50)                    | NOT NULL                                     | Type of challenge (e.g., 'DISTANCE_DRIVEN', 'FUEL_EFFICIENCY', 'TRIPS_LOGGED'). |
| `target_value`     | DECIMAL(10,2)                  | NULLABLE                                     | Target value to achieve (e.g., 1000 km, 5 L/100km).                      |
| `points_reward`    | INT                            | NOT NULL                                     | Points awarded upon completion.                                          |
| `start_date`       | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Start date of the challenge availability.                                |
| `end_date`         | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | End date of the challenge availability.                                  |
| `is_active`        | BOOLEAN                        | NOT NULL, DEFAULT TRUE                       | Whether the challenge is currently active.                               |
| `icon_url`         | VARCHAR(255)                   | NULLABLE                                     | URL for a challenge icon.                                                |
| `repeatable_interval`| VARCHAR(20)                  | NULLABLE                                     | How often it can be repeated (e.g. 'DAILY', 'WEEKLY', 'MONTHLY', 'NONE').|
| `created_at`       | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                   |
| `updated_at`       | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                |

### UserChallengeProgress
Tracks user progress on gamification challenges.

| Column Name            | Data Type                      | Constraints                                  | Description                                                               |
|------------------------|--------------------------------|----------------------------------------------|---------------------------------------------------------------------------|
| `user_challenge_id`    | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for user's progress on a challenge.                     |
| `user_id`              | UUID / INT                     | FOREIGN KEY (Users), NOT NULL                | User participating in the challenge.                                      |
| `challenge_id`         | UUID / INT                     | FOREIGN KEY (GamificationChallenges), NOT NULL| The challenge.                                                            |
| `current_progress`     | DECIMAL(10,2)                  | NOT NULL, DEFAULT 0                          | User's current progress towards the target.                               |
| `status`               | VARCHAR(20)                    | NOT NULL, DEFAULT 'IN_PROGRESS'              | 'IN_PROGRESS', 'COMPLETED', 'EXPIRED'.                                    |
| `completed_at`         | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp when the challenge was completed.                               |
| `last_progress_update` | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp of the last progress update.                                    |
| `iteration_start_date` | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | For repeatable challenges, start of current iteration.                    |
| `created_at`           | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                    |
| `updated_at`           | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                 |

### UserPoints
Stores total points for each user in the gamification system.

| Column Name        | Data Type                      | Constraints                                  | Description                                       |
|--------------------|--------------------------------|----------------------------------------------|---------------------------------------------------|
| `user_id`          | UUID / INT                     | PRIMARY KEY, FOREIGN KEY (Users)             | The user.                                         |
| `total_points`     | INT                            | NOT NULL, DEFAULT 0                          | Total accumulated points.                         |
| `current_rank`     | VARCHAR(50)                    | NULLABLE                                     | Current rank or level based on points.            |
| `last_earned_at`   | TIMESTAMP WITH TIME ZONE       | NULLABLE                                     | Timestamp of when points were last earned.        |
| `updated_at`       | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                         |

### RewardTiers
Defines tiers or ranks in the gamification system. (Simple version for now)

| Column Name      | Data Type                      | Constraints                                  | Description                                      |
|------------------|--------------------------------|----------------------------------------------|--------------------------------------------------|
| `tier_id`        | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the tier.                  |
| `tier_name`      | VARCHAR(100)                   | NOT NULL, UNIQUE                             | Name of the tier (e.g., 'Bronze', 'Silver', 'Gold').|
| `min_points`     | INT                            | NOT NULL                                     | Minimum points required to reach this tier.      |
| `description`    | TEXT                           | NULLABLE                                     | Description of the tier and its benefits.        |
| `icon_url`       | VARCHAR(255)                   | NULLABLE                                     | Icon for the tier.                               |
| `created_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                           |
| `updated_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                        |

---

## Settings & Configuration Entities

### ApplicationSettings
Stores global application settings and configurations. Stored as key-value pairs.

| Column Name        | Data Type                      | Constraints                                  | Description                                                                 |
|--------------------|--------------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| `setting_id`       | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique ID for the setting.                                                  |
| `setting_key`      | VARCHAR(100)                   | NOT NULL, UNIQUE                             | Unique key for the setting (e.g., 'default_currency', 'fuel_api_key', 'weather_api_key', 'road_data_api_key').      |
| `setting_value`    | TEXT                           | NOT NULL                                     | Value of the setting. Can be JSON for complex values.                       |
| `setting_type`     | VARCHAR(50)                    | NULLABLE                                     | Data type of the value (e.g., 'STRING', 'NUMBER', 'BOOLEAN', 'JSON').         |
| `description`      | TEXT                           | NULLABLE                                     | Description of the setting.                                                 |
| `is_editable_by_admin`| BOOLEAN                    | NOT NULL, DEFAULT TRUE                       | Can admins modify this setting via UI?                                      |
| `created_at`       | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                      |
| `updated_at`       | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                   |

### FuelTypes
Defines different types of fuel/energy.

| Column Name    | Data Type                      | Constraints                                  | Description                                       |
|----------------|--------------------------------|----------------------------------------------|---------------------------------------------------|
| `fuel_type_id` | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the fuel type.              |
| `name`         | VARCHAR(50)                    | NOT NULL, UNIQUE                             | Name of the fuel type (e.g., 'Petrol 95', 'Diesel', 'Electricity', 'LPG'). |
| `unit`         | VARCHAR(10)                    | NOT NULL                                     | Unit of measurement (e.g., 'liter', 'kWh', 'kg'). |
| `description`  | TEXT                           | NULLABLE                                     | Description of the fuel type.                     |
| `created_at`   | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                            |
| `updated_at`   | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                         |

### FuelPrices
Stores historical and current prices for different fuel types.

| Column Name    | Data Type                      | Constraints                                  | Description                                                         |
|----------------|--------------------------------|----------------------------------------------|---------------------------------------------------------------------|
| `price_id`     | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the price entry.                              |
| `fuel_type_id` | UUID / INT                     | FOREIGN KEY (FuelTypes), NOT NULL            | The type of fuel this price is for.                                 |
| `price_per_unit`| DECIMAL(10,3)                 | NOT NULL                                     | Price per unit (e.g., per liter, per kWh).                          |
| `currency`     | VARCHAR(5)                     | NOT NULL                                     | Currency of the price.                                              |
| `effective_date`| DATE                          | NOT NULL                                     | Date from which this price is effective.                            |
| `source`       | VARCHAR(100)                   | NULLABLE                                     | Source of the price information (e.g., 'API:FuelProviderX', 'Manual'). |
| `region`       | VARCHAR(100)                   | NULLABLE                                     | Geographical region this price applies to (if applicable).          |
| `created_at`   | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                              |
| `updated_at`   | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                           |

### CurrencyRates
(Optional, if multiple currencies are heavily used and need conversion rates stored locally)
Stores exchange rates between currencies.

| Column Name      | Data Type                      | Constraints                                  | Description                                       |
|------------------|--------------------------------|----------------------------------------------|---------------------------------------------------|
| `rate_id`        | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the rate entry.             |
| `base_currency`  | VARCHAR(5)                     | NOT NULL                                     | The base currency (e.g., 'USD').                  |
| `target_currency`| VARCHAR(5)                     | NOT NULL                                     | The target currency (e.g., 'EUR').                |
| `rate`           | DECIMAL(15,6)                  | NOT NULL                                     | Exchange rate from base to target currency.       |
| `effective_date` | DATE                           | NOT NULL                                     | Date from which this rate is effective.           |
| `source`         | VARCHAR(100)                   | NULLABLE                                     | Source of the rate (e.g., 'API:ECB', 'Manual').   |
| `created_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                            |
| `updated_at`     | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                         |

### POIs (Points of Interest)
Stores frequently used locations or points of interest.

| Column Name    | Data Type                      | Constraints                                  | Description                                       |
|----------------|--------------------------------|----------------------------------------------|---------------------------------------------------|
| `poi_id`       | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the POI.                    |
| `company_id`   | UUID / INT                     | FOREIGN KEY (Companies), NULLABLE            | Company this POI belongs to (if not global).      |
| `name`         | VARCHAR(150)                   | NOT NULL                                     | Name of the POI (e.g., 'Main Office', 'Client X HQ'). |
| `address`      | TEXT                           | NULLABLE                                     | Full address of the POI.                          |
| `latitude`     | DECIMAL(9,6)                   | NOT NULL                                     | Latitude of the POI.                              |
| `longitude`    | DECIMAL(9,6)                   | NOT NULL                                     | Longitude of the POI.                             |
| `category`     | VARCHAR(50)                    | NULLABLE                                     | Category of POI (e.g., 'Client', 'Office', 'Warehouse'). |
| `contact_info` | TEXT                           | NULLABLE                                     | Contact information for the POI.                  |
| `notes`        | TEXT                           | NULLABLE                                     | Additional notes.                                 |
| `created_at`   | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                            |
| `updated_at`   | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                         |

### StandardRoutes
Stores predefined standard routes with associated data.

| Column Name           | Data Type                      | Constraints                                  | Description                                                                          |
|-----------------------|--------------------------------|----------------------------------------------|--------------------------------------------------------------------------------------|
| `route_id`            | UUID / INT (auto-increment)    | PRIMARY KEY                                  | Unique identifier for the standard route.                                            |
| `company_id`          | UUID / INT                     | FOREIGN KEY (Companies), NULLABLE            | Company this route belongs to (if not global).                                       |
| `name`                | VARCHAR(150)                   | NOT NULL                                     | Name of the route (e.g., 'Office to Warehouse A').                                   |
| `start_poi_id`        | UUID / INT                     | FOREIGN KEY (POIs), NULLABLE                 | Starting POI of the route.                                                           |
| `end_poi_id`          | UUID / INT                     | FOREIGN KEY (POIs), NULLABLE                 | Ending POI of the route.                                                             |
| `start_address_manual`| TEXT                           | NULLABLE                                     | Manually entered start address if not a POI.                                         |
| `end_address_manual`  | TEXT                           | NULLABLE                                     | Manually entered end address if not a POI.                                           |
| `predefined_distance_km`| DECIMAL(10,2)                | NULLABLE                                     | Predefined distance for this route in km.                                            |
| `estimated_duration_min`| INT                          | NULLABLE                                     | Estimated travel time in minutes.                                                    |
| `predefined_cost`     | DECIMAL(10,2)                  | NULLABLE                                     | Predefined cost for taking this route.                                               |
| `cost_calculation_formula` | TEXT                      | NULLABLE                                     | Formula for calculating cost if not fixed (e.g., based on vehicle type and distance).|
| `route_details_json`  | JSONB                          | NULLABLE                                     | JSON storing waypoints, polyline, or other route specifics.                          |
| `notes`               | TEXT                           | NULLABLE                                     | Additional notes about the route.                                                    |
| `created_at`          | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of creation.                                                               |
| `updated_at`          | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of last update.                                                            |

---

## Audit & Logging Entities

### AuditLogs
Tracks significant actions and changes within the system.

| Column Name      | Data Type                      | Constraints                                  | Description                                                              |
|------------------|--------------------------------|----------------------------------------------|------------------------------------------------------------------------------|
| `log_id`         | BIGSERIAL / UUID               | PRIMARY KEY                                  | Unique identifier for the audit log entry.                               |
| `user_id`        | UUID / INT                     | FOREIGN KEY (Users), NULLABLE                | User who performed the action. Null if system action.                    |
| `action_type`    | VARCHAR(100)                   | NOT NULL                                     | Type of action (e.g., 'USER_LOGIN', 'VEHICLE_CREATE', 'EXPENSE_APPROVE').|
| `entity_type`    | VARCHAR(50)                    | NULLABLE                                     | Type of entity affected (e.g., 'User', 'Vehicle', 'Expense').            |
| `entity_id`      | VARCHAR(255)                   | NULLABLE                                     | ID of the affected entity.                                               |
| `timestamp`      | TIMESTAMP WITH TIME ZONE       | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Timestamp of the action.                                                 |
| `ip_address`     | VARCHAR(45)                    | NULLABLE                                     | IP address from which the action originated.                             |
| `user_agent`     | TEXT                           | NULLABLE                                     | User agent string of the client.                                         |
| `details_before` | JSONB                          | NULLABLE                                     | State of the entity before the change (for updates/deletes).             |
| `details_after`  | JSONB                          | NULLABLE                                     | State of the entity after the change (for creates/updates).              |
| `description`    | TEXT                           | NULLABLE                                     | Additional description or context for the log entry.                     |

---

This schema is designed to support Phase 1 functionalities and provide a foundation for Phase 1.5.
UUIDs are suggested for primary keys for better scalability and to avoid collisions if data is merged from different sources, but auto-incrementing integers can also be used depending on the database choice and preference.
Timestamps are generally `TIMESTAMP WITH TIME ZONE` for global consistency.
`NULLABLE` and `NOT NULL` constraints are specified. `UNIQUE` constraints are used where appropriate.
Foreign keys establish relationships between tables. Indexes should be added to foreign keys and frequently queried columns for performance.
The `FuelTypes` table was added under Settings & Configuration Entities as it's a system-defined list.
The `TripPurposes` table has been added.
The `TripTypes` table has been added for predefined trip characteristics.

Further considerations:
- **Indexing:** Critical for performance. Add indexes on foreign keys, frequently searched columns (e.g., `email` in `Users`, `license_plate` in `Vehicles`), and columns used in `WHERE` clauses or `JOIN` conditions.
- **Data Archival/Partitioning:** For tables that can grow very large (e.g., `TripGpsData`, `AuditLogs`, `Messages`, `RoadRestrictions`), consider strategies for data archival or partitioning.
- **Normalization vs. Denormalization:** This schema leans towards normalization. Denormalization might be considered in specific cases for performance, especially for reporting.
- **Soft Deletes:** Consider adding `is_deleted` (BOOLEAN) and `deleted_at` (TIMESTAMP) columns to tables where soft deletes are preferred over hard deletes.
- **Full-Text Search:** For fields like `notes` or `description`, a full-text search engine might be beneficial.
- **Geospatial Data Types:** For latitude/longitude, consider using native geospatial data types if your database supports them (e.g., PostGIS for PostgreSQL) for efficient spatial queries. For now, DECIMAL is used for simplicity.
- **JSONB Usage:** Used for flexible fields like `route_details_json` or `content_metadata`. Ensure proper indexing on JSONB fields if they are queried frequently.
- **External APIs:** Integration with external APIs for weather data, road conditions, traffic information, and fuel prices will be crucial. The schema provides places to store API keys (`ApplicationSettings`) and sourced data (`FuelPrices`, `RoadRestrictions`). The actual data fetching and parsing logic will be part of the application's service layer.

Next steps would involve refining these tables, adding more specific constraints, default values, and defining an initial set of data for lookup tables (e.g., `Roles`, `ExpenseCategories`, `RoadRestrictionTypes`).
This schema is a comprehensive starting point. 

## Recent Changes and Migrations

### 2025-06-19: Admin User Creation Fix (Migration: 20250619142418)

**Problem Resolved:** 
- Fixed "Database error querying schema" AuthApiError 500
- Admin users were incorrectly created via direct SQL INSERT into `auth.users`

**Solution Implemented:**
- Created migration `20250619142418_create_admin_user_via_api.sql`
- Admin user now created through proper Supabase Auth internal methods
- Added `recreate_admin_user()` function for development use
- Proper linking between `auth.users` and `public.users` tables

**Migration Details:**
```sql
-- Key fields in auth.users for admin user:
- id: auto-generated UUID
- email: djuretic.danko@gmail.com  
- encrypted_password: bcrypt hash of 'password123'
- role: 'authenticated'
- aud: 'authenticated'
- email_confirmed_at: current timestamp
- raw_app_meta_data: provider info
- raw_user_meta_data: email verification status

-- Corresponding public.users record:
- user_id: matches auth.users.id (FK)
- username: 'danko.admin'
- email: 'djuretic.danko@gmail.com'
- first_name: 'Danko'
- last_name: 'Đuretić'
- is_active: true
- is_email_verified: true
```

**Critical Rule Established:**
🚫 **NEVER create auth users with direct SQL INSERT into `auth.users` table**
✅ **ALWAYS use migrations with proper auth.users structure matching Supabase Auth API**

**Development Workflow:**
1. `npx supabase db reset` - applies all migrations including admin user
2. `SELECT recreate_admin_user();` - recreates admin user only
3. New features require new migration files
4. All migrations tested with full database reset

This ensures consistency across development environments and prevents auth-related errors.