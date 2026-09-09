/* Local, append-only record of what was submitted.
 *
 * The real store is Firestore, written by the Cloud Run service, and exported
 * for grading by a script -- docs/plans/2026-08-28-ps-submission-plan.md. None
 * of that exists yet, so a submission currently vanishes the moment the tab
 * closes, which makes the pages impossible to test end to end and impossible to
 * grade from.
 *
 * This is the same shape, kept in the browser: every submit appends a version
 * rather than overwriting one, because the plan grades the last version and
 * keeps the earlier ones. When the service lands, saveSubmission() becomes a
 * POST and everything else here goes away.
 *
 * A record is what the group handed in. It is not a grade and not a receipt --
 * the browser cannot promise either.
 */

const KEY = 'ps-submissions-v1';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch (err) {
    return {};
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    return false;               // private mode, or quota
  }
}

/**
 * Append a submission. Returns its version number, counting from 1 per part.
 * @param {string} ps    e.g. 'PS02'
 * @param {string} part  e.g. 'I'
 * @param {object} meta  { group, blanks, answers }
 */
export function saveSubmission(ps, part, meta) {
  const all = readAll();
  const set = all[ps] || (all[ps] = { versions: [] });
  const version = set.versions.filter(v => v.part === part).length + 1;
  set.versions.push({
    part,
    version,
    at: new Date().toISOString(),
    group: meta.group || null,
    blanks: (meta.blanks || []).slice(),
    answers: meta.answers,
  });
  writeAll(all);
  return version;
}

/** Every version recorded for `ps`, oldest first. */
export function submissions(ps) {
  const set = readAll()[ps];
  return set && Array.isArray(set.versions) ? set.versions.slice() : [];
}

/** The last version of each part -- what the plan says gets graded. */
export function latest(ps) {
  const out = {};
  for (const v of submissions(ps)) out[v.part] = v;
  return out;
}

/** The whole record, pretty-printed, for reading or pasting. */
export function toJSON(ps) {
  return JSON.stringify({ ps, exportedAt: new Date().toISOString(),
                          versions: submissions(ps) }, null, 2);
}

/** Save the record to a file. The only way out of localStorage is a download. */
export function download(ps) {
  const blob = new Blob([toJSON(ps)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ps.toLowerCase()}-submissions-${new Date()
    .toISOString().slice(0, 19).replace(/[:T]/g, '')}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return a.download;
}

export function clear(ps) {
  const all = readAll();
  delete all[ps];
  writeAll(all);
}

/* Console handle. Grading reads the exported file; this is how the file is got.
 *
 *     psStore.download('PS02')     -> a .json in ~/Downloads
 *     copy(psStore.toJSON('PS02')) -> the same thing on the clipboard
 *     psStore.latest('PS02')       -> just the versions that would be graded
 */
export function expose(ps) {
  window.psStore = { submissions, latest, toJSON, download, clear, ps };
  return window.psStore;
}
