# Database Overview

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

#### Reports

Client report generation and tracking.

| Field                 | Type    | Constraints                 | Description              |
| --------------------- | ------- | --------------------------- | ------------------------ |
| id                    | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique report identifier |
| dateSubmittedToClient | DATE    | NULLABLE                    | Client submission date   |
| nameCrFormat          | STRING  | NULLABLE                    | CR format name           |
| nameZipFile           | STRING  | NULLABLE                    | Generated ZIP filename   |
| userId                | INTEGER | FK, NOT NULL                | User who created report  |
| createdAt             | DATE    | NOT NULL                    | Timestamp                |
| updatedAt             | DATE    | NOT NULL                    | Timestamp                |

#### WebsiteDomains

Website domains for news source filtering.

| Field                 | Type    | Constraints                 | Description                |
| --------------------- | ------- | --------------------------- | -------------------------- |
| id                    | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique domain identifier   |
| name                  | STRING  | NOT NULL                    | Domain name                |
| isArchived            | BOOLEAN | DEFAULT false               | Archive status flag        |
| isArchievedNewsDataIo | BOOLEAN | DEFAULT false               | NewsData.io archive status |
| createdAt             | DATE    | NOT NULL                    | Timestamp                  |
| updatedAt             | DATE    | NOT NULL                    | Timestamp                  |

#### NewsApiRequests

API request tracking for news aggregation services.

| Field                               | Type     | Constraints                 | Description                      |
| ----------------------------------- | -------- | --------------------------- | -------------------------------- |
| id                                  | INTEGER  | PRIMARY KEY, AUTO_INCREMENT | Unique request identifier        |
| newsArticleAggregatorSourceId       | INTEGER  | FK, NOT NULL                | Reference to aggregator source   |
| countOfArticlesReceivedFromRequest  | INTEGER  | NULLABLE                    | Articles received count          |
| countOfArticlesSavedToDbFromRequest | INTEGER  | NULLABLE                    | Articles saved to database count |
| countOfArticlesAvailableFromRequest | INTEGER  | NULLABLE                    | Articles available count         |
| dateStartOfRequest                  | DATEONLY | NULLABLE                    | Request start date               |
| dateEndOfRequest                    | DATEONLY | NULLABLE                    | Request end date                 |
| status                              | STRING   | NULLABLE                    | Request status                   |
| url                                 | STRING   | NULLABLE                    | API request URL                  |
| andString                           | STRING   | NULLABLE                    | AND search parameters            |
| orString                            | STRING   | NULLABLE                    | OR search parameters             |
| notString                           | STRING   | NULLABLE                    | NOT search parameters            |
| isFromAutomation                    | BOOLEAN  | DEFAULT false               | Automated request flag           |
| createdAt                           | DATE     | NOT NULL                    | Timestamp                        |
| updatedAt                           | DATE     | NOT NULL                    | Timestamp                        |

#### ArticleContent

Full text content storage for articles.

| Field     | Type    | Constraints                 | Description               |
| --------- | ------- | --------------------------- | ------------------------- |
| id        | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique content identifier |
| articleId | INTEGER | FK, NOT NULL                | Reference to article      |
| content   | STRING  | NOT NULL                    | Full article content      |
| createdAt | DATE    | NOT NULL                    | Timestamp                 |
| updatedAt | DATE    | NOT NULL                    | Timestamp                 |

#### ArticleApproved

Article approval workflow tracking.

| Field                       | Type     | Constraints                 | Description                 |
| --------------------------- | -------- | --------------------------- | --------------------------- |
| id                          | INTEGER  | PRIMARY KEY, AUTO_INCREMENT | Unique approval identifier  |
| userId                      | INTEGER  | FK, NOT NULL                | User who approved           |
| articleId                   | INTEGER  | FK, NOT NULL                | Reference to article        |
| isApproved                  | BOOLEAN  | DEFAULT true                | Approval status             |
| headlineForPdfReport        | STRING   | NULLABLE                    | PDF report headline         |
| publicationNameForPdfReport | STRING   | NULLABLE                    | PDF report publication name |
| publicationDateForPdfReport | DATEONLY | NULLABLE                    | PDF report publication date |
| textForPdfReport            | STRING   | NULLABLE                    | PDF report text content     |
| urlForPdfReport             | STRING   | NULLABLE                    | PDF report URL              |
| kmNotes                     | STRING   | NULLABLE                    | Knowledge manager notes     |
| createdAt                   | DATE     | NOT NULL                    | Timestamp                   |
| updatedAt                   | DATE     | NOT NULL                    | Timestamp                   |

#### ArticleDuplicateAnalysis

Tracks deduplication comparison outputs between a newly ingested article and an already approved article.

| Field                | Type    | Constraints                 | Description                                          |
| -------------------- | ------- | --------------------------- | ---------------------------------------------------- |
| id                   | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique analysis identifier                           |
| articleIdNew         | INTEGER | FK, NOT NULL                | ID of the newly ingested article                     |
| articleIdApproved    | INTEGER | FK, NOT NULL                | ID of the previously approved article                |
| sameArticleIdFlag    | INTEGER | NOT NULL                    | 1 if IDs match; 0 otherwise                          |
| articleNewState      | STRING  | NOT NULL                    | State associated with the new article                |
| articleApprovedState | STRING  | NOT NULL                    | State associated with the approved article           |
| sameStateFlag        | INTEGER | NOT NULL                    | 1 if states match; 0 otherwise                       |
| urlCheck             | INTEGER | NOT NULL                    | URL match check result (e.g., 1 match / 0 no match)  |
| contentHash          | INTEGER | NOT NULL                    | Hash comparison result indicator for article content |
| embeddingSearch      | INTEGER | NOT NULL                    | Embedding similarity result indicator                |
| createdAt            | DATE    | NOT NULL                    | Timestamp                                            |
| updatedAt            | DATE    | NOT NULL                    | Timestamp                                            |

#### ArticleReviewed

Article review workflow tracking.

| Field      | Type    | Constraints                 | Description              |
| ---------- | ------- | --------------------------- | ------------------------ |
| id         | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique review identifier |
| userId     | INTEGER | FK, NOT NULL                | User who reviewed        |
| articleId  | INTEGER | FK, NOT NULL                | Reference to article     |
| isReviewed | BOOLEAN | DEFAULT true                | Review status            |
| kmNotes    | STRING  | NULLABLE                    | Knowledge manager notes  |
| createdAt  | DATE    | NOT NULL                    | Timestamp                |
| updatedAt  | DATE    | NOT NULL                    | Timestamp                |

#### ArticleIsRelevant

Article relevance assessment tracking.

| Field      | Type    | Constraints                 | Description                 |
| ---------- | ------- | --------------------------- | --------------------------- |
| id         | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique relevance identifier |
| userId     | INTEGER | FK, NOT NULL                | User who assessed           |
| articleId  | INTEGER | FK, NOT NULL                | Reference to article        |
| isRelevant | BOOLEAN | DEFAULT true                | Relevance status            |
| kmNotes    | STRING  | NULLABLE                    | Knowledge manager notes     |
| createdAt  | DATE    | NOT NULL                    | Timestamp                   |
| updatedAt  | DATE    | NOT NULL                    | Timestamp                   |

#### EntityWhoFoundArticle

Tracking entities that discover articles.

| Field                         | Type    | Constraints                 | Description                  |
| ----------------------------- | ------- | --------------------------- | ---------------------------- |
| id                            | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique entity identifier     |
| userId                        | INTEGER | FK, NULLABLE                | User who found article       |
| newsArticleAggregatorSourceId | INTEGER | FK, NULLABLE                | Aggregator source that found |
| createdAt                     | DATE    | NOT NULL                    | Timestamp                    |
| updatedAt                     | DATE    | NOT NULL                    | Timestamp                    |

#### EntityWhoCategorizedArticle

Tracking entities that categorize articles.

| Field                    | Type    | Constraints                 | Description                |
| ------------------------ | ------- | --------------------------- | -------------------------- |
| id                       | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique entity identifier   |
| userId                   | INTEGER | FK, NULLABLE                | User who categorized       |
| artificialIntelligenceId | INTEGER | FK, NULLABLE                | AI system that categorized |
| createdAt                | DATE    | NOT NULL                    | Timestamp                  |
| updatedAt                | DATE    | NOT NULL                    | Timestamp                  |

#### ArtificialIntelligence

AI models and systems configuration.

| Field                | Type    | Constraints                 | Description                 |
| -------------------- | ------- | --------------------------- | --------------------------- |
| id                   | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique AI system identifier |
| name                 | STRING  | NOT NULL                    | AI system name              |
| description          | STRING  | NULLABLE                    | AI system description       |
| huggingFaceModelName | STRING  | NULLABLE                    | HuggingFace model name      |
| huggingFaceModelType | STRING  | NULLABLE                    | HuggingFace model type      |
| createdAt            | DATE    | NOT NULL                    | Timestamp                   |
| updatedAt            | DATE    | NOT NULL                    | Timestamp                   |

#### NewsArticleAggregatorSource

News source and aggregator configuration.

| Field     | Type    | Constraints                 | Description              |
| --------- | ------- | --------------------------- | ------------------------ |
| id        | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique source identifier |
| nameOfOrg | STRING  | NULLABLE                    | Organization name        |
| url       | STRING  | NULLABLE                    | Source URL               |
| apiKey    | STRING  | NULLABLE                    | API access key           |
| isApi     | BOOLEAN | DEFAULT false               | API source flag          |
| isRss     | BOOLEAN | DEFAULT false               | RSS source flag          |
| createdAt | DATE    | NOT NULL                    | Timestamp                |
| updatedAt | DATE    | NOT NULL                    | Timestamp                |

### Contract/Junction Tables

#### ArticleStateContract

Many-to-many relationship between Articles and States.

| Field     | Type    | Constraints                 | Description          |
| --------- | ------- | --------------------------- | -------------------- |
| id        | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique contract ID   |
| articleId | INTEGER | FK, NOT NULL                | Reference to article |
| stateId   | INTEGER | FK, NOT NULL                | Reference to state   |
| createdAt | DATE    | NOT NULL                    | Timestamp            |
| updatedAt | DATE    | NOT NULL                    | Timestamp            |

#### ArticleReportContract

Many-to-many relationship between Articles and Reports.

| Field                          | Type    | Constraints                 | Description                |
| ------------------------------ | ------- | --------------------------- | -------------------------- |
| id                             | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique contract ID         |
| reportId                       | INTEGER | FK, NOT NULL                | Reference to report        |
| articleId                      | INTEGER | FK, NOT NULL                | Reference to article       |
| articleReferenceNumberInReport | STRING  | NULLABLE                    | Reference number in report |
| articleAcceptedByCpsc          | BOOLEAN | DEFAULT true                | CPSC acceptance status     |
| articleRejectionReason         | STRING  | NULLABLE                    | Reason for rejection       |
| createdAt                      | DATE    | NOT NULL                    | Timestamp                  |
| updatedAt                      | DATE    | NOT NULL                    | Timestamp                  |

#### ArticleEntityWhoCategorizedArticleContract

Links articles to categorization entities with keyword data.

| Field                  | Type    | Constraints                 | Description              |
| ---------------------- | ------- | --------------------------- | ------------------------ |
| id                     | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique contract ID       |
| articleId              | INTEGER | FK, NOT NULL                | Reference to article     |
| entityWhoCategorizesId | INTEGER | FK, NOT NULL                | Reference to categorizer |
| keyword                | STRING  | NULLABLE                    | Categorization keyword   |
| keywordRating          | FLOAT   | NULLABLE                    | Keyword relevance rating |
| createdAt              | DATE    | NOT NULL                    | Timestamp                |
| updatedAt              | DATE    | NOT NULL                    | Timestamp                |

_Note: Has unique index on (articleId, entityWhoCategorizesId, keyword)_

#### NewsApiRequestWebsiteDomainContract

Links NewsAPI requests to website domains for filtering.

| Field                         | Type    | Constraints                 | Description                 |
| ----------------------------- | ------- | --------------------------- | --------------------------- |
| id                            | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique contract ID          |
| newsApiRequestId              | INTEGER | FK, NULLABLE                | Reference to API request    |
| websiteDomainId               | INTEGER | FK, NULLABLE                | Reference to website domain |
| includedOrExcludedFromRequest | STRING  | DEFAULT "included"          | Include/exclude status      |
| createdAt                     | DATE    | NOT NULL                    | Timestamp                   |
| updatedAt                     | DATE    | NOT NULL                    | Timestamp                   |
