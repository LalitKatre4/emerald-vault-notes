# Vault Notes

Build a complete responsive mobile-first app called “Private Notes Vault”.

IMPORTANT:

This must be a fully designed multi-screen application, NOT a landing page and NOT a single-page mockup.

Create every screen listed below.

All navigation buttons, tabs, cards, menus, forms, dialogs, and actions should be connected and interactive.

The app should feel like a real private notes/vault product that could eventually be converted into a mobile app.

Do NOT use the typical blue/purple AI-generated color scheme.

Use a premium dark charcoal + emerald green + warm off-white visual theme.

Use modern rounded cards, subtle shadows, clean typography, and minimal animations.

Make the interface feel secure, private, elegant, and trustworthy.

Design for mobile screens first, while remaining responsive on desktop.

APP NAME

Private Notes Vault

Tagline:
“Your thoughts. Your privacy.”

COLOR & VISUAL STYLE

Primary background:

Dark charcoal / near-black

Primary accent:

Emerald green

Secondary accent:

Muted gold

Text:

Warm white

Secondary text:

Soft gray

Avoid:

Bright blue

Purple gradients

Excessive gradients

Generic SaaS dashboard appearance

Use security/privacy visual cues such as:

Lock icons

Shield icons

Fingerprint icons

Key icons

Do NOT make the interface look like a banking app.

SCREEN 1 — SPLASH SCREEN

Create a short splash screen.

Center:

Shield + lock icon

“Private Notes Vault”

“Your thoughts. Your privacy.”

Small loading indicator.

After a short delay, navigate to the appropriate screen:

First-time user → Setup PIN

Existing user → Vault Lock Screen

SCREEN 2 — FIRST-TIME SETUP

Title:
“Secure your private notes”

Description:
“Create a PIN to protect your vault.”

Elements:

PIN input

Confirm PIN input

Show/hide PIN option

“Enable biometric unlock” toggle

“Continue” button

Security note:
“Your notes stay private and are protected by your vault.”

After successful setup → Vault Home.

SCREEN 3 — VAULT LOCK SCREEN

This screen appears whenever the vault is locked.

Center:

Shield/lock illustration

“Vault Locked”

“Enter your PIN to continue”

PIN keypad:
1 2 3
4 5 6
7 8 9
Fingerprint / biometric button
0
Backspace

Below:
“Use fingerprint”

Include:

Failed attempt message

Forgot PIN option

After successful authentication → Vault Home.

SCREEN 4 — VAULT HOME / DASHBOARD

This is the main screen.

Top header:
“Private Notes”
Small subtitle:
“Your thoughts. Your privacy.”

Top-right:

Search icon

Lock icon

Security status card:
🔒 “Vault Protected”
“Your notes are secured”

Main statistics:

Total Notes

Favorites

Categories

Quick action:
Large “+ New Note” button

Notes section:
“Recent Notes”

Display note cards containing:

Note title

Short preview

Category

Updated date/time

Favorite icon

Example notes:

“Ideas for my next project”

“Travel Plans”

“Important Things”

“Personal Thoughts”

Bottom navigation:

Home

Notes

Favorites

Settings

Add a floating “+” button for creating a new note.

SCREEN 5 — ALL NOTES

Title:
“All Notes”

Top:

Search bar

Filter icon

Sort icon

Filter options:

All

Personal

Work

Ideas

Important

Sort options:

Recently updated

Recently created

A–Z

Notes should be displayed as attractive cards.

Each card:

Title

Preview

Category

Date

Favorite button

More menu

More menu:

Edit

Favorite

Move to category

Delete

Include an empty state:
“No private notes yet.”
“Create your first secure note.”

Button:
“Create Note”

SCREEN 6 — CREATE NOTE

Title:
“New Note”

Fields:

Note title

Note content

Toolbar:

Bold

Italic

Bullet list

Checklist

Options:

Category

Favorite

Lock note

Buttons:
“Save Note”
“Cancel”

Autosave indicator:
“Saved securely”

When Save Note is clicked:

Save the note

Show a small success notification

Return to Notes/Home

SCREEN 7 — VIEW NOTE

Create a dedicated note-reading screen.

Top:

Back button

Favorite icon

More menu

Content:

Note title

Category

Created date

Updated date

Full note content

Bottom actions:

Edit

Delete

More menu:

Move to category

Lock note

Export

Delete

SCREEN 8 — EDIT NOTE

Same structure as Create Note but populated with existing content.

Title:
“Edit Note”

Allow:

Edit title

Edit content

Change category

Favorite/unfavorite

Lock/unlock note

Buttons:
“Save Changes”
“Cancel”

Show:
“Last saved just now”

SCREEN 9 — FAVORITES

Title:
“Favorites”

Show all notes marked as favorite.

Empty state:
“No favorite notes”
“Mark important notes as favorites to find them quickly.”

Use the same note cards as the Notes screen.

SCREEN 10 — SEARCH

Create a dedicated full-screen search experience.

Top:

Back button

Search field

Clear button

Search through:

Note titles

Note content

Categories

Show matching notes instantly.

Empty state:
“No notes found”

Suggestion:
“Try searching for another keyword.”

SCREEN 11 — CATEGORIES

Create a category management screen.

Title:
“Categories”

Default categories:

Personal

Work

Ideas

Important

Travel

Each category should show:

Icon

Name

Number of notes

Button:
“+ Create Category”

Create Category dialog:

Category name

Choose icon

Save

Category actions:

Rename

Delete

SCREEN 12 — TRASH

Title:
“Recently Deleted”

Description:
“Deleted notes are kept here temporarily.”

Show deleted note cards.

Actions:

Restore

Permanently Delete

Button:
“Empty Trash”

Confirmation dialog:
“Permanently delete all notes?”
“This action cannot be undone.”

Buttons:
“Cancel”
“Delete Permanently”

SCREEN 13 — SETTINGS

Title:
“Settings”

Create sections.

SECURITY:

Change PIN

Biometric Unlock

Auto Lock

Lock Vault Now

AUTO LOCK options:

Immediately

1 minute

5 minutes

15 minutes

Never

PRIVACY:

Hide note previews

Screenshot protection

Hide app content from recent apps

NOTES:

Default category

Default note view

Sort notes

DATA:

Backup

Restore

Export Notes

Import Notes

APP:

Dark Mode

Notifications

Language

ABOUT:

Privacy Policy

Terms of Service

About Private Notes Vault

App Version

SCREEN 14 — SECURITY SETTINGS

Create a dedicated security screen.

Title:
“Security”

Security status:
🟢 “Vault Protection Active”

Options:

Change PIN

Enable biometric unlock

Auto-lock timer

Lock vault now

Screenshot protection

Hide content in recent apps

Security information card:
“Your vault is designed to keep private notes protected.”

SCREEN 15 — PREMIUM SCREEN

Create a premium upgrade screen.

Title:
“Private Notes Premium”

Subtitle:
“More privacy. More control.”

Premium features:

✓ Remove Ads
✓ Unlimited Notes
✓ Secure Folders
✓ Advanced Encryption
✓ Backup & Restore
✓ Export & Import
✓ Additional Security Options
✓ Custom Vault Themes

Pricing cards:

MONTHLY
“₹49 / month”

YEARLY
“₹299 / year”
Badge:
“Best Value”

Buttons:
“Start Premium”

Also provide:
“Restore Purchase”

Make the premium screen visually premium but DO NOT use blue/purple gradients.

Use emerald + subtle gold accents.

SCREEN 16 — BACKUP & RESTORE

Title:
“Backup & Restore”

Create two large cards.

BACKUP:
“Create a secure backup of your notes.”

Button:
“Create Backup”

RESTORE:
“Restore your notes from a previous backup.”

Button:
“Restore Backup”

Add warning:
“Keep your backup file in a secure location.”

SCREEN 17 — DELETE CONFIRMATION

Create reusable confirmation dialogs.

Delete Note:
“Delete this note?”

Buttons:
“Cancel”
“Move to Trash”

Permanent Delete:
“Delete permanently?”

Buttons:
“Cancel”
“Delete Permanently”

SCREEN 18 — CHANGE PIN

Title:
“Change PIN”

Fields:

Current PIN

New PIN

Confirm New PIN

Button:
“Change PIN”

Show validation messages for:

Incorrect current PIN

PINs don't match

PIN too short

Success:
“PIN changed successfully.”

SCREEN 19 — BIOMETRIC SETUP

Title:
“Biometric Unlock”

Show:

Large fingerprint icon

“Unlock your vault faster”

Toggle:
“Use biometric authentication”

Information:
“Your biometric data is handled by your device's secure authentication system.”

Button:
“Enable”

SCREEN 20 — EMPTY STATES

Create polished empty states for:

No notes

No favorites

No search results

Empty trash

No categories

No backups

Each should have:

Simple illustration/icon

Short message

Helpful action button

NAVIGATION

Implement real navigation between all major screens.

Bottom navigation:
Home → Vault Home
Notes → All Notes
Favorites → Favorites
Settings → Settings

Additional navigation:
New Note → Create Note
Note Card → View Note
Edit → Edit Note
Search → Search
Categories → Categories
Trash → Trash
Security → Security Settings
Premium → Premium
Backup → Backup & Restore

Back buttons should return to the previous screen.

INTERACTIONS

Implement realistic interactions throughout the prototype.

Examples:

New Note
Tap “New Note” → Create Note screen.

Save Note
Save → note appears in Recent Notes and All Notes.

Favorite
Favorite icon toggles state and moves note into Favorites.

Delete
Delete → confirmation → move note to Trash.

Restore
Trash → Restore → note returns to All Notes.

Search
Typing → filter notes.

Category
Selecting category → display notes in that category.

Lock Vault
Lock button → Vault Lock Screen.

PIN
Correct PIN → unlock.
Incorrect PIN → show error.

Settings
Every setting should have a working toggle/select control in the prototype.

SAMPLE DATA

Populate the initial prototype with realistic sample notes so the UI does not look empty.

Use:

“Project Ideas”
Category: Ideas

“Travel Checklist”
Category: Travel

“Important Information”
Category: Important

“Personal Thoughts”
Category: Personal

“Work Notes”
Category: Work

RESPONSIVE DESIGN

The primary target is a modern Android phone.

Design for approximately:

360px–430px width

Also make the application responsive on tablets and desktop browsers.

Do not create a desktop-only layout.

COMPONENTS

Create reusable components for:

NoteCard

CategoryChip

BottomNavigation

SecurityCard

PINPad

SearchBar

EmptyState

ConfirmationDialog

SettingsItem

PremiumFeatureCard

BackupCard

Maintain consistent spacing, typography, icons, and interactions.

UX REQUIREMENTS

The application should feel:

Private

Secure

Minimal

Premium

Fast

Easy to understand

Mobile-first

Avoid:

Generic dashboard templates

Huge hero sections

Marketing landing-page design

Excessive animations

Blue/purple AI-generated styling

Unnecessary charts

Excessive gradients

The user should immediately understand:

“This is a secure place for my private notes.”

IMPORTANT FINAL REQUIREMENT

Do NOT stop after creating the Home screen.

Build the complete multi-screen Private Notes Vault application described above.

Every major screen must be accessible through navigation.

Every important button should have a corresponding interaction or screen.

The final result should look like a real mobile application prototype, not a website landing page.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://emerald-vault-notes.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4e4bf3fb-9d9c-477e-9409-fcf075c8063a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
