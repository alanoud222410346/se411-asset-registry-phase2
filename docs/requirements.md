# Requirements

## Project

Frontend for a company to manage one kind of asset: **computers**. Data is kept in memory (a JavaScript array), there is no database in Part 1.

## Asset fields

| Field | Type | Rule |
|---|---|---|
| id | number | Created automatically |
| name | text | Required |
| brand | text | Required |
| serialNumber | text | Required |
| purchaseDate | date | Required |
| price | number | Required, not negative |
| status | choice | In use, In stock, In repair, Retired |

## User stories

1. As a user, I want to see all computers in a table so I know what the company owns.
2. As a user, I want to add a new computer so the registry stays up to date.
3. As a user, I want to edit a computer when something changes (for example its status).
4. As a user, I want to delete a computer, and I want to confirm first so I do not delete by mistake.
5. As a user, I want a menu on every page so I can move between features.
6. As a user, I want an About page that shows who made the app.

## Pages

| Page | Route | Purpose |
|---|---|---|
| Assets | `/` | Table with all computers, Edit and Delete actions |
| Add asset | `/add` | Form to create a computer |
| Edit asset | `/edit/:id` | Same form, filled with the computer's data |
| About | `/about` | Team members (name and student ID) |

## Design

- Black and white only, flat colors.
- Square corners, no gradients, no shadows.
- Simple table for data, simple form with labels above inputs.
- Navigation bar at the top of every page: Assets, Add asset, About.

## Out of scope for Part 1

- Database or backend (Part 2).
- Login and user roles.
