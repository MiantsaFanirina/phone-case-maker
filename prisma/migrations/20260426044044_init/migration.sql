-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "caseColor" TEXT NOT NULL DEFAULT '#DFCEEA',
    "caseFinish" TEXT NOT NULL DEFAULT 'glossy',
    "imageUrl" TEXT,
    "editorImageUrl" TEXT,
    "positionX" REAL NOT NULL DEFAULT 0,
    "positionY" REAL NOT NULL DEFAULT 0,
    "scale" REAL NOT NULL DEFAULT 0.7,
    "rotation" REAL NOT NULL DEFAULT 0,
    "opacity" REAL NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
