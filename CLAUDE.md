# DataBee - פלטפורמת הסדרת פרטיות

## מה זה

פלטפורמת SaaS לניהול הסדרת פרטיות לארגונים ישראליים. Legal-Tech - עורכי דין עם AI מוטמע. המוצר נועד לשימוש פנימי של DataBee (משרד עורכי דין) לניהול לקוחות.

## הקבצים בפרויקט

```
prototype/
  DataBee_Platform.html    ← ה-source of truth ל-UX. פתח בדפדפן, שחק, הבן.

reference-docs/
  DataBee_Product_Spec_v1.docx  ← אפיון מוצר מלא (11 פרקים)
  מסמך_הגדרות_מאגר.docx        ← תבנית רשמית של מסמך הגדרות מאגר
  DPO_assesment_2701.xlsx       ← שאלון DPO של הרשות (58 שאלות ב-11 קטגוריות)
  צמצום_מידע.pdf                ← מדיניות צמצום מידע של הרשות להגנת הפרטיות
  קווים_מנחים_*.pdf             ← הנחיות לדיוור ישיר

CLAUDE.md                      ← הקובץ הזה. Claude Code קורא אותו אוטומטית.
```

## מה ה-prototype מכיל (קרא אותו קודם!)

ה-prototype הוא HTML+JS בודד שמדגים את כל ה-UX. הוא כולל:

### מערכת ניהול לקוחות
- מסך בית ריק - אין לקוח ברירת מחדל
- הוספת לקוחות חדשים (שם + סוג ארגון)
- מעבר בין לקוחות ב-dropdown בהדר
- מחיקת לקוחות
- כל לקוח = state נפרד (מאגר, משימות, DPO assessment)
- localStorage persistence

### מסך הגדרות מאגר (עריכה חוזרת)
- טופס מלא עם chips (multi-select) לכל הקטגוריות:
  - קטגוריות נושאי מידע: עובדים, ספקים, לקוחות, מתעניינים, חברים, תורמים, קטינים, מתנדבים
  - מטרות שימוש: דיוור, שירות, ניהול, מחקר, אירועים, גיוס, משאבי אנוש...
  - שיטות איסוף: אתר, אירועים, טלפון, וואטסאפ, רשתות, צד שלישי, cookies...
  - סוגי מידע: רגיל + רגיש (רפואי, פוליטי, דתי, פלילי, ביומטרי, גנטי, כלכלי...)
- ספקים חיצוניים: הוספה/מחיקה דינמית
- מנהל מאגר: שם, תפקיד, אימייל
- חישוב רמת אבטחה אוטומטי (בסיסית/בינונית/גבוהה)
- **עריכה חוזרת בכל זמן** - אפשר לחזור ולשנות

### דשבורד לקוח
- ציון תאימות (טבעת אחוזים)
- 4 כרטיסי סטטיסטיקה
- גריד של 16 משימות עם סטטוס (פתוח/בעבודה/הושלם)
- כפתור "ערוך פרטי מאגר" + "שגרת DPO"

### 5 מודולים עמוקים
1. **מסמך הגדרות מאגר** → מפנה לעריכת מאגר
2. **מדיניות פרטיות** → מסמך שנוצר אוטומטית מנתוני המאגר + DPO review banner
3. **מנגנוני הסכמה** → צ'קבוקסי הסכמה מותאמים לנקודות איסוף + preview חי
4. **הסכמי ספקים (DPA)** → כרטיס לכל ספק עם סטטוס וכפתור יצירת DPA
5. **צמצום מידע** → סיווג כל סוג מידע (נדרש/לבחון/עודף) + טופס בחינה שנתית

### 11 מודולים פשוטים
כל אחד: הסבר משפטי + צ'קליסט + כפתור "סמן כהושלם" + "פתח מחדש"

### אזור שגרת DPO
- 58 שאלות מ-Excel של הרשות (DPO_assesment_2701.xlsx)
- מחולק ל-11 קטגוריות שממופות למודולים
- כל שאלה: dropdown (בוצע/חלקי/לא/לא רלוונטי) + תאריך
- שאלות שטופלו במודולים = auto-filled בירוק
- כפתור "פתח מודול" ליד כל קטגוריה

### צ'אט AI בכל מודול
- כפתור "שאל את עמית" בסרגל צד
- Context-aware system prompt
- Demo mode (תשובות מוכנות) או Real mode (Claude API)
- Suggestion chips

## Stack הנדרש

```
Frontend:  Next.js 15 App Router + TypeScript + Tailwind CSS
Backend:   Next.js API routes or tRPC  
Database:  PostgreSQL + Prisma ORM
Auth:      Clerk (multi-tenant, 3 roles: client/dpo/admin)
AI:        Anthropic Claude API (claude-sonnet-4-6 for chat)
Files:     docx library for Word export
Deploy:    Vercel
Storage:   S3-compatible for documents
```

## Prisma Schema

```prisma
model Organization {
  id        String   @id @default(cuid())
  name      String
  type      String   // nonprofit, company, public
  createdAt DateTime @default(now())
  users     User[]
  dataAssets DataAsset[]
  vendors   Vendor[]
  documents Document[]
  tasks     Task[]
  dpoAssessment DpoAssessment[]
}

model User {
  id             String       @id @default(cuid())
  email          String       @unique
  name           String
  role           String       // client, dpo, admin
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
}

model DataAsset {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  name              String
  purpose           String[] // array of purpose codes
  collectionMethods String[] // array of method codes
  subjectCategories String[] // array of category codes
  dataTypes         String[] // array of data type codes
  sensitiveTypes    String[] // subset of dataTypes that are sensitive
  subjectsCount     Int      @default(0)
  permissionsCount  Int      @default(0)
  transferAbroad    Boolean  @default(false)
  securityLevel     String   @default("basic") // basic, medium, high
  managerName       String?
  managerRole       String?
  managerEmail      String?
  status            String   @default("draft") // draft, under_review, approved
  vendors           DataAssetVendor[]
  documents         Document[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Vendor {
  id             String   @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  name           String
  activity       String?
  hasDpa         Boolean  @default(false)
  dpaSignedAt    DateTime?
  dpaExpiresAt   DateTime?
  dataAssets     DataAssetVendor[]
}

model DataAssetVendor {
  dataAssetId String
  vendorId    String
  dataAsset   DataAsset @relation(fields: [dataAssetId], references: [id])
  vendor      Vendor    @relation(fields: [vendorId], references: [id])
  @@id([dataAssetId, vendorId])
}

model Document {
  id             String   @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  dataAssetId    String?
  dataAsset      DataAsset? @relation(fields: [dataAssetId], references: [id])
  type           String   // db_definition, privacy_policy, security_policy, dpa, consent
  version        Int      @default(1)
  status         String   @default("draft") // draft, under_review, approved
  content        Json
  approvedAt     DateTime?
  approvedById   String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Task {
  id             String   @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  taskType       String   // matches TASKS registry ids
  status         String   @default("open") // open, in_progress, done
  dueDate        DateTime?
  completedAt    DateTime?
  evidence       String?  // file URL
  notes          String?
}

model DpoAssessment {
  id             String   @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  questionKey    String   // e.g. "4.1_2" = sheet 4.1, question 2
  status         String?  // done, partial, no, na
  date           DateTime?
  notes          String?
  autoFilled     Boolean  @default(false)
  @@unique([organizationId, questionKey])
}
```

## Security Level Engine

```typescript
function calculateSecurityLevel(dataAsset: DataAsset): 'basic' | 'medium' | 'high' {
  const hasSensitive = dataAsset.sensitiveTypes.length > 0;
  const subjects = dataAsset.subjectsCount;
  const permissions = dataAsset.permissionsCount;

  if (hasSensitive && (subjects >= 100_000 || permissions > 100)) return 'high';
  if (hasSensitive) {
    if (permissions <= 10) return 'basic'; // edge case
    return 'medium';
  }
  return 'basic';
}
```

## DPO Assessment → Module Mapping

```
Sheet 1  "יידוע נושאי מידע"     → privacy_policy
Sheet 2  "הסכמה"                 → consent_mechanism
Sheet 3  "צמידות מטרה וצמצום"    → data_minimization
Sheet 4  "אבטחת מידע"           → security_policy
Sheet 4.1 "מסמך הגדרות מאגר"    → db_definition
Sheet 5  "בקרה שוטפת"           → audits
Sheet 6  "רישום והודעה"          → registration
Sheet 7  "דיוור ישיר"           → unsubscribe
Sheet 8  "עובדים"               → training
Sheet 9  "טיפול בפניות"         → dsr_mechanism
Sheet 10 "אחריות דירקטוריון"    → board_oversight
```

When a module task is marked "done", auto-fill the corresponding DPO assessment questions.

## AI Chat Requirements

- **System prompt**: Must include organization context, data asset details, security level, current module
- **Model**: claude-sonnet-4-6 (not opus - too expensive, not haiku - not accurate enough for legal)
- **Rate limit**: 20 messages/hour per user
- **DO NOT send PII to Claude** - only metadata (counts, categories, org name)
- **Guardrails**: Never give final legal opinion, always suggest consulting with DPO
- **Per-module history**: Each module maintains separate chat history

## Human-in-the-Loop (Critical)

Every AI-generated document MUST go through DPO review:
- `draft` → AI generated, waiting for DPO
- `under_review` → DPO is reviewing
- `approved` → DPO approved, visible to client

**NEVER show a client an unapproved document.**

## Legal References

- Privacy Protection Law: https://www.nevo.co.il/law_html/law00/71631.htm
- Security Regulations Guide: https://www.gov.il/BlobFolder/guide/data_security_guide/he/NEW_GUIDE.pdf
- Amendment 13 Guide: https://www.gov.il/BlobFolder/reports/guide_tikon13_professional/he/tikun%2013%20_170825.pdf

## Language

**Hebrew only. RTL everywhere.** No English support in MVP.

## Development Order

1. Prisma schema + auth + seeds → days 1-5
2. Clone prototype UX to `/app/[orgSlug]/` → days 6-12
3. Data asset edit form with persistence → days 13-16
4. Security level engine + task generator → days 17-20
5. Dashboard → days 21-24
6. Deep modules (privacy policy, consent, DPA, minimization) → days 25-32
7. Simple modules → days 33-36
8. DPO assessment zone → days 37-40
9. AI chat integration → days 41-44
10. DPO review interface → days 45-48
11. Export (Word/PDF) → days 49-52
12. Polish + tests + security → days 53-60

## What NOT to build

- Admin dashboard for DataBee management (later)
- English/i18n (later)
- Integrations (Google Drive, Monday, Slack) (later)
- Self-service onboarding for clients (later - for now, internal use)
- Mobile app (later)

## First Step

1. Read `prototype/DataBee_Platform.html` entirely
2. Set up Next.js 15 + TypeScript + Tailwind
3. Run `npx prisma init` and paste the schema above
4. Create the first page: client list (empty state → add client)
5. **Stop and show me before continuing.**
