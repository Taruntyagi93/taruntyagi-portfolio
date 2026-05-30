# Tarun Tyagi Portfolio

This portfolio is a dynamic, JSON-driven website built for `Tarun Tyagi` with modern styling, AI/cloud-focused experience, and visual analytics.

## What’s included

- `index.html` — main portfolio page
- `style.css` — responsive dark/light styling
- `script.js` — dynamic content rendering from JSON
- `data/resume.json` — structured resume content source
- `Tarun Tyagi CA.pdf` — linked resume file
- `.gitignore` — local repository ignore rules

## What’s new

- Resume content updated from the provided software engineering profile.
- Skills and experience reflect full stack, cloud, AI/LLM, and automation expertise.
- Dynamic skill visualizations and metrics driven from JSON.

## How to customize

1. Open `data/resume.json`.
2. Edit the summary, stats, experience, education, skills, projects, and contact fields.
3. Save the file and refresh the browser.

## Run locally

1. Open `index.html` directly in a browser.
2. If the page fails to load JSON due to browser restrictions, run a local server:
   - `python3 -m http.server 8000`
   - Open `http://localhost:8000`

## GitHub repo setup

1. Open a terminal in this folder.
2. If you want a dedicated git repo here, run:
   ```bash
   git init
   git add .
   git commit -m "Add dynamic portfolio with resume data"
   ```
3. Create a repository on GitHub.
4. Link and push:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
5. Replace `<your-username>` and `<repo-name>` with your GitHub account and repository name.
