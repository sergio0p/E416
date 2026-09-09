/* Which parts of a problem set have been handed in.
 *
 * Part I and Part II are separate pages, and the group acknowledgement belongs
 * to the problem set rather than to either half of it -- there is no point
 * confirming "submitting on behalf of X & Y" twice, and no point confirming it
 * at all while half the work is still outstanding. So each page records that its
 * own part is in, and whichever page completes the pair is the one that asks.
 *
 * STOPGAP. localStorage is per browser and per device: if one partner submits
 * Part I here and the other submits Part II on their own laptop, neither browser
 * sees a complete set and neither asks. That is wrong, and it is wrong in a way
 * only the server can fix -- the real source of truth is the submission service
 * in docs/plans/2026-08-28-ps-submission-plan.md, which knows what the group has
 * filed regardless of who filed it. Everything here is behind these four
 * functions so that swap touches one file.
 *
 * Nothing here is a submission. It is a note about one.
 */

const KEY = 'ps-progress-v2';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch (err) {
    return {};                     // private mode, cleared storage, quota
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    /* A student who cannot persist this can still submit; they will just be
       asked to confirm the group on whichever part they finish. */
  }
}

/** Parts of `ps` recorded as handed in, e.g. ['I']. */
export function partsIn(ps) {
  const rec = readAll()[ps];
  return rec && typeof rec === 'object' ? Object.keys(rec) : [];
}

/* Record a part as handed in, along with whatever in it was left blank.
 *
 * The blanks travel with the record because the warning is raised at the end,
 * on whichever page completes the set -- and that page cannot see the other
 * half's answers. Part I has no way to know that question 3 of Part II is
 * empty except by being told when Part II was submitted.
 *
 * Resubmitting replaces the entry rather than adding one: what matters is what
 * is blank now, not what was blank on some earlier attempt. */
export function recordPart(ps, part, blanks) {
  const all = readAll();
  const rec = all[ps] && typeof all[ps] === 'object' ? all[ps] : {};
  rec[part] = { blanks: (blanks || []).slice(), at: Date.now() };
  all[ps] = rec;
  writeAll(all);
  return Object.keys(rec);
}

/** Everything left blank across every part handed in so far, in part order. */
export function blanksIn(ps, order) {
  const rec = readAll()[ps];
  if (!rec || typeof rec !== 'object') return [];
  const parts = (order || Object.keys(rec)).filter(k => rec[k]);
  return parts.flatMap(k => (rec[k].blanks || []));
}

/** True once every part of the set has been handed in at least once. */
export function isComplete(ps, parts) {
  const rec = partsIn(ps);
  return parts.every(x => rec.includes(x));
}

/** For tests and for a student starting over. */
export function forget(ps) {
  const all = readAll();
  delete all[ps];
  writeAll(all);
}
