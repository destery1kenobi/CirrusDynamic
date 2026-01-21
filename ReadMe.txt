Lesson Module – Briefing Experience (Static Web Prototype)

This folder contains a static, indexable lesson module used for Cirrus briefing content.
Each lesson is self-contained and designed to be hosted as a simple website
(no build step) while preserving a consistent look, feel, and interaction model
across all lessons.

------------------------------------------------------------
CONTENTS
------------------------------------------------------------

index.html
- The main entry page (indexable).
- Loads layout, styles, and application logic.

styles.css
- All visual styling for the lesson.
- Shared and identical across all lessons.

app.js
- All behavior and content wiring:
  - Topic menu
  - Bullet rendering
  - Checklist logic (when enabled)
  - Image carousel
  - Fullscreen lightbox

assets/images/
- All images used by the lesson, including:
  - Splash background
  - Menu icons
  - Topic images
  - Task Matrix visuals

------------------------------------------------------------
LESSON STRUCTURE
------------------------------------------------------------

Each lesson lives in its own folder, for example:

lesson-01/
lesson-02/
lesson-03/

Each lesson folder contains:
- index.html
- styles.css
- app.js
- assets/images/

No files are shared across lesson folders at runtime.

------------------------------------------------------------
CURRENT FEATURES / BEHAVIOR
------------------------------------------------------------

- Splash screen with “Start the Brief” transition into the lesson
- Left navigation menu to select briefing topics
- Right content panel supports:
  - Bullet lists (two-column by default)
  - Optional checklist mode
  - Image carousel (multiple images)
  - Single-image display
  - No-media state
  - Optional Task Matrix table
- Fullscreen image lightbox:
  - Opens by clicking the image or fullscreen icon
  - Closes by clicking the X, the image itself, or Escape
- Checklist selections persist using browser localStorage

------------------------------------------------------------
ICON SYSTEM (IMPORTANT)
------------------------------------------------------------

Each topic in the lesson outline begins with an ALL CAPS keyword.
This keyword determines the menu icon used.

The keyword must match an icon filename in assets/images/.

Supported icons:

BRIEF      → Brief.png
DETERMINE → Determine.png
DISCUSS   → Discuss.png
LIST      → List.png
DESCRIBE  → Describe.png
PREVIEW   → Preview.png
REVIEW    → Review.png

Icon filenames must match exactly.

------------------------------------------------------------
SPLASH IMAGE
------------------------------------------------------------

Each lesson uses a single splash background image.

Recommended approach:
- File name: splash.png
- Location: assets/images/splash.png

This avoids changing CSS per lesson.

------------------------------------------------------------
CONTENT RULES
------------------------------------------------------------

Bullets:
- Render exactly as written in the outline
- No punctuation added automatically
- Question marks are allowed if present

Images:
- Stored in assets/images/
- Filenames must match exactly (case-sensitive)
- No captions are displayed
- Image titles are derived automatically from filenames
- Multiple images always render as a carousel

Recommended image specs:
- 1920 × 1080 pixels (16:9)
- PNG for slides/diagrams
- JPG (85–90%) for photos

------------------------------------------------------------
UPDATING CONTENT
------------------------------------------------------------

Topic content is managed in app.js.

Each topic can include:
- heading
- bullets
- images

Optional topic behaviors:
- checklistLastN: converts last N bullets to checklist items
- checklistHeader: checklist section title
- table: renders a Task Matrix table

To add or replace images:
1. Add the image file to assets/images/
2. Reference it in app.js
3. Ensure the filename matches exactly

------------------------------------------------------------
HOW TO RUN LOCALLY
------------------------------------------------------------

Option A (Recommended – Python):

  python -m http.server 8000

Then open:
  http://localhost:8000

Option B (VS Code):
- Open the lesson folder in VS Code
- Right-click index.html
- Select “Open with Live Server”

Note:
Opening index.html directly via file:// may work inconsistently.
A local server is recommended.

------------------------------------------------------------
HOSTING / DEPLOYMENT
------------------------------------------------------------

This is a static site and can be hosted on:

- AWS S3 (static hosting)
- Azure Blob Static Website / Static Web Apps
- Netlify
- Vercel (static)
- IIS, Apache, or Nginx

Deployment steps:
1. Upload the entire lesson folder.
2. Ensure index.html is at the site root.
3. Confirm images load correctly from assets/images/.

------------------------------------------------------------
NOTES / CONSIDERATIONS
------------------------------------------------------------

- Filenames must match exactly; many hosts are case-sensitive.
- Some images may use .bmp format; ensure the host supports it.
- Clearing browser storage resets checklist progress.

------------------------------------------------------------
MAINTAINER
------------------------------------------------------------

This lesson module pattern is maintained as part of the Cirrus
briefing content system.

For updates, enhancements, or production hardening,
coordinate with the project maintainer.
