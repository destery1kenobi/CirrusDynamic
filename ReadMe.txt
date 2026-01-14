Lesson 4 – Intro to Partial Panel Flight (POC Prototype)

This folder contains a static, indexable proof-of-concept (POC) web prototype for the Lesson 4 briefing experience. It is designed to be hosted as a simple website (no build step) while preserving the current look, feel, and interaction model.

------------------------------------------------------------
CONTENTS
------------------------------------------------------------

index.html
- The main entry page (indexable).
- Loads layout, Bootstrap, styles, and application logic.

styles.css
- All visual styling for the prototype.

app.js
- All behavior and content wiring:
  - Topic menu
  - Bullet rendering
  - Checklist logic
  - Image carousel
  - Fullscreen lightbox

assets/images/
- All images used by the UI, including:
  - Splash background
  - Menu icons
  - Topic images
  - Task Matrix visuals

------------------------------------------------------------
CURRENT FEATURES / BEHAVIOR
------------------------------------------------------------

- Splash screen with “Start the Brief” transition into the lesson.
- Left navigation menu to select briefing topics.
- Right content panel supports:
  - Bullet lists (two-column by default)
  - Checklist mode (PAVE section)
  - Image carousel (multiple images)
  - Single-image display
  - No-media state
  - Task Matrix table
- Fullscreen image lightbox:
  - Opens by clicking the image or fullscreen icon
  - Closes by clicking the X or clicking anywhere on the image
  - Closes with the Escape key
- Checklist selections persist using browser localStorage.

------------------------------------------------------------
RECENT CLIENT REQUESTS (IMPLEMENTED)
------------------------------------------------------------

1. Expanded images can be closed by clicking:
   - The X button
   - Anywhere on the image itself

2. Non-expanded images were increased slightly in size to reduce white space.

3. Non-expanded images are vertically centered in the right panel to prevent bottom-heavy empty space.

No other layout or behavior changes were made beyond these requests.

------------------------------------------------------------
PROJECT STRUCTURE
------------------------------------------------------------

client-site/
  index.html
  styles.css
  app.js
  assets/
    images/
      Lesson_4_Splash.png
      aircraft-5336532.jpg
      Discuss2.png
      Brief3.png
      Preview.png
      ADC Failure.png
      AHRS failure.bmp
      Magnetometer failure.png
      PFD Failure.png
      PitotStaticCHAK.png
      PiotStaticADAHRS.png
      PFDPitotStatic Instruments.png
      PitotCHAK.png
      IMC CockpitView.png
      (additional images as needed)

IMPORTANT:
- Filenames must match exactly.
- Many hosts are case-sensitive.

------------------------------------------------------------
HOW TO RUN LOCALLY
------------------------------------------------------------

Option A (Recommended – Python):
From the project root:

  python -m http.server 8000

Then open:
  http://localhost:8000

Option B (VS Code):
- Open the folder in VS Code
- Right-click index.html
- Select “Open with Live Server”

Note:
Opening index.html directly via file:// may work inconsistently. A local server is recommended.

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
1. Upload the entire folder (including assets).
2. Ensure index.html is at the site root.
3. Confirm images load correctly from assets/images/.

------------------------------------------------------------
UPDATING CONTENT
------------------------------------------------------------

Topic content is managed in app.js.

Each topic can include:
- heading
- bullets
- images (title, src, alt)

Optional topic behaviors:
- checklistLastN: converts last N bullets to checklist items
- checklistHeader: checklist section title
- table: renders a Task Matrix table

To add or replace images:
1. Add the image file to assets/images/
2. Reference it in app.js
3. Ensure filename matches exactly

------------------------------------------------------------
DEPENDENCIES
------------------------------------------------------------

External (via CDN):
- Bootstrap 5.0.2
- Google Fonts (Montserrat)

No build tools or package managers are required.

------------------------------------------------------------
NOTES / CONSIDERATIONS
------------------------------------------------------------

- Some images use .bmp format. Ensure the hosting platform serves .bmp files correctly.
- Checklist state is stored in browser localStorage. Clearing browser storage resets checklist progress.

------------------------------------------------------------
MAINTAINER
------------------------------------------------------------

This prototype is maintained as part of the client POC effort.
For updates, enhancements, or production hardening, coordinate with the project maintainer.
