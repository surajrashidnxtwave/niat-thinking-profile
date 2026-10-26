# Thinking Profile – NIAT

Student test: `index.html` · Admin results: `admin.html` · Results API: `api/`

## Launch (about 10 minutes, one time)
1. **Deploy:** in this folder run `npx vercel deploy --prod` (or push to GitHub and import it in Vercel). No build settings needed.
2. **Storage:** Vercel dashboard → this project → Storage → Create → **Blob** → connect it to the project.
3. **Admin key:** Settings → Environment Variables → add `ADMIN_KEY` = a password only your team knows.
4. **Redeploy** once so steps 2–3 take effect.

## Share
- Share one link with students: `https://<your-site>/`
- Results: `https://<your-site>/admin.html` → enter the admin key → results table + CSV of every student.

## Good to know
- Each student's first attempt counts. Retakes are stored but ignored in the summary.
- Feedback: the report ends with the Google Form embedded (not in the PDF). To change it, edit `FEEDBACK_FORM` at the top of the script in `index.html`. Responses go to the form's own Responses tab.
- Students save their report with the “Save as PDF or print” button (3-page A4: profile, skills, 4-week plan with links and weekly tick boxes).
- Progress is saved on the student's device, so a refresh or dropped connection doesn't lose their test.
- Rounds: Confession round (not scored), Word spread, Missing link, Deep read, Speed match, Know what you know, You or AI?, One question. About 17 minutes.
- Word spread (creativity) is scored on the device with GloVe word vectors (`dat/`), so there are no API costs.
- Vercel free (Hobby) Blob limits are fine for a few thousand students per month.
