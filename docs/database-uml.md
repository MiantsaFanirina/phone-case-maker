# Database Schema UML

## Entity: Design

```
┌─────────────────────────────────────────┐
│              Design                     │
├─────────────────────────────────────────┤
│ id: String (PK)                          │
│ name: String                            │
│ caseColor: String (default: "#DFCEEA")   │
│ caseFinish: String (default: "glossy")  │
│ imageUrl: String?                       │
│ editorImageUrl: String?                 │
│ positionX: Float (default: 0)          │
│ positionY: Float (default: 0)         │
│ scale: Float (default: 0.7)           │
│ rotation: Float (default: 0)            │
│ opacity: Float (default: 1)             │
│ createdAt: DateTime                    │
│ updatedAt: DateTime                    │
└─────────────────────────────────────────┘
```

## Fields Description

- **id**: Unique identifier (CUID)
- **name**: Design name (user-defined)
- **caseColor**: Hex color code for phone case
- **caseFinish**: Finish type (glossy/matte/rubber)
- **imageUrl**: Original uploaded image URL
- **editorImageUrl**: Processed canvas image URL
- **positionX**: Image X position offset
- **positionY**: Image Y position offset
- **scale**: Image scale factor (0.3-3)
- **rotation**: Image rotation in degrees
- **opacity**: Image opacity (0-1)
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

## Relationships

- None (standalone entity)

## Technology Stack

- Database: SQLite (via Prisma ORM)
- ORM: Prisma v5