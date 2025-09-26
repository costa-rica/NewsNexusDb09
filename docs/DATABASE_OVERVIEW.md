# Database Schema Overview

This document provides a comprehensive overview of the NewsNexusDb09 database schema. All tables use SQLite as the underlying database engine and are managed through Sequelize ORM.

## NewsNexusDb09 Description

- One class per table (`src/models/<Name>.ts`) with strong typings.
- Centralized initialization and associations.
- Emit `.d.ts` so downstream apps (API, mobile) get type-safe imports.
- dist/ is the output directory for compiled JavaScript files.
- src/ is the source directory for TypeScript files.
- All tables have an updatedAt and createdAt field.

## Database / Project Architecture

### Project Structure

```
NewsNexusDb09/
├── src/                          # TypeScript source files
│   ├── index.ts                  # Main entry point
│   └── models/                   # Sequelize model definitions
│       ├── _connection.ts        # Database connection setup
│       ├── _index.ts            # Model registry and exports
│       ├── _associations.ts     # All model relationships
│       ├── Article.ts           # Core article model
│       ├── User.ts              # User management
│       └── [ other models...] # Complete model suite
├── dist/                        # Compiled JavaScript output
│   ├── index.js                 # Compiled entry point
│   ├── index.d.ts               # TypeScript declarations
│   └── models/                  # Compiled models with .d.ts files
├── docs/                        # Documentation
└── package.json                 # Project configuration
```

## Template (copy for each new model)

```ts
// src/models/Example.ts
import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
	NonAttribute,
} from "sequelize";
import { sequelize } from "./_connection";

export class Example extends Model<
	InferAttributes<Example>,
	InferCreationAttributes<Example>
> {
	declare id: CreationOptional<number>;
	declare name: string;

	// FK example:
	// declare userId: ForeignKey<User["id"]>;
	// declare user?: NonAttribute<User>;
}

export function initExample() {
	Example.init(
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			name: { type: DataTypes.STRING, allowNull: false },
			// userId: { type: DataTypes.INTEGER, allowNull: false }
		},
		{
			sequelize,
			tableName: "examples",
			timestamps: true,
		}
	);
	return Example;
}
```

## Example src/models/\_index.ts

```ts
// SAMPLE of different proejctsrc/models/_index.ts
import { sequelize } from "./_connection";

import { initExample, Example } from "./Example";

import { applyAssociations } from "./_associations";

/** Initialize all models and associations once per process. */
export function initModels() {
	initExample();
	applyAssociations();

	return {
		sequelize,
		Example,
	};
}

// 👇 Export named items for consumers
export { sequelize, Example };

// 👇 Export named items for consumers
export { sequelize, Example };
```

### Database Configuration

- **Database Type**: SQLite (via Sequelize ORM)
- **Environment Variables**:
  - `PATH_DATABASE`: Directory path for database file
  - `NAME_DB`: Database filename
- **No .env file required**: Inherits environment from importing application

## Tables

### Core Entity Tables

#### Articles

Main news article storage with metadata.

| Field                   | Type     | Constraints                 | Description                   |
| ----------------------- | -------- | --------------------------- | ----------------------------- |
| id                      | INTEGER  | PRIMARY KEY, AUTO_INCREMENT | Unique article identifier     |
| publicationName         | STRING   | NULLABLE                    | News source name              |
| author                  | STRING   | NULLABLE                    | Article author                |
| title                   | STRING   | NULLABLE                    | Article headline              |
| description             | STRING   | NULLABLE                    | Article summary               |
| url                     | STRING   | NULLABLE                    | Original article URL          |
| urlToImage              | STRING   | NULLABLE                    | Featured image URL            |
| publishedDate           | DATEONLY | NULLABLE                    | Publication date              |
| entityWhoFoundArticleId | INTEGER  | FK, NULLABLE                | Reference to discovery source |
| newsApiRequestId        | INTEGER  | FK, NULLABLE                | Reference to NewsAPI request  |
| newsRssRequestId        | INTEGER  | FK, NULLABLE                | Reference to RSS request      |
| createdAt               | DATE     | NOT NULL                    | Timestamp                     |
| updatedAt               | DATE     | NOT NULL                    | Timestamp                     |

#### Users

System users for approval/review workflows.

| Field     | Type    | Constraints                 | Description            |
| --------- | ------- | --------------------------- | ---------------------- |
| id        | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| username  | STRING  | NOT NULL                    | User login name        |
| email     | STRING  | NOT NULL                    | User email address     |
| password  | STRING  | NOT NULL                    | Hashed password        |
| isAdmin   | BOOLEAN | DEFAULT false               | Admin privileges flag  |
| createdAt | DATE    | NOT NULL                    | Timestamp              |
| updatedAt | DATE    | NOT NULL                    | Timestamp              |

#### States

US geographic states for filtering.

| Field        | Type    | Constraints                 | Description             |
| ------------ | ------- | --------------------------- | ----------------------- |
| id           | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique state identifier |
| name         | STRING  | NOT NULL                    | Full state name         |
| abbreviation | STRING  | NOT NULL                    | Two-letter state code   |
| createdAt    | DATE    | NOT NULL                    | Timestamp               |
| updatedAt    | DATE    | NOT NULL                    | Timestamp               |
