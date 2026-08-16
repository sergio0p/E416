# E416 Behavioral Economics — Setup TODOs

## Before Semester Starts

### syllabus.html & index.html
- [ ] Term (e.g., "Fall 2026")
- [ ] Class time and location
- [ ] Office hours schedule and Zoom link
- [ ] Canvas course URL
- [ ] Prerequisite(s)
- [ ] Course description (blockquote)
- [ ] Learning objectives
- [ ] Grading breakdown (% per component)
- [ ] Important dates: midterms, final exam, any project deadlines
- [ ] Course-specific AI policy (ECON 416 section)
- [ ] Tentative course schedule table
- [ ] Textbook or no-textbook policy
- [ ] Google Analytics tag (create property for E416 at analytics.google.com)

### LECWeb/index.html
- [ ] Term in the date field
- [ ] Add lecture links as they are created

## Analytics
- [ ] Write Python script to query Google Analytics Data API directly (30-ish lines, official GA API, no third-party packages)

## Infrastructure
- [ ] Add `.gitignore` (DS_Store, etc.)
- [ ] Add Google Analytics to `index.html` and `syllabus.html` once property is created
- [ ] Add ECON 416 to `lecweb_update.py`: Canvas course ID + GitHub Pages URL (`https://sergio0p.github.io/E416/LECWeb/`). File: `Dropbox/Scripts/Canvas/canvas_utils/lecweb_update.py` lines 31–41. Also add `'416'` to the `choices` list on the `--course` argparse argument.
