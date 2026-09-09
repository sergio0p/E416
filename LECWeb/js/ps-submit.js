/* Problem set submission.
 *
 * Harvests every element carrying a `data-q`, sends the lot to the service, and
 * prefills from whatever the group last submitted. "Revisit your answers" and
 * "resubmit" are the same act: load the last version, edit it, send a new one --
 * the server never overwrites, it appends.
 *
 * The page is authored and previewed under the lecture server, where none of
 * these endpoints exist. That is a supported state, not a failure: it falls back
 * to PREVIEW, where everything works except submitting. Without that, authoring
 * a problem set would mean deploying it first.
 */
(function () {
  'use strict';

  var PS = (document.currentScript && document.currentScript.dataset.ps) || '02';
  var API = 'api/ps/' + PS;

  var identity = document.getElementById('ps-identity');
  var status = document.getElementById('ps-status');
  var button = document.getElementById('ps-submit');
  var keyBox = document.getElementById('ps-key');

  var state = { online: false, closed: false, group: null, dirty: false };

  function fields() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-q]'));
  }

  /* Inputs answer with their text; cells answer true / false / null. The null
     matters -- an unanswered relation is not a relation judged false, and the
     grader has to be able to tell them apart. */
  function harvest() {
    var out = {};
    fields().forEach(function (el) {
      if (el.tagName === 'INPUT') {
        out[el.dataset.q] = el.value.trim();
      } else {
        out[el.dataset.q] = el.dataset.state === '' ? null
                          : el.dataset.state === 'true';
      }
    });
    return out;
  }

  function fill(answers) {
    if (!answers) return;
    fields().forEach(function (el) {
      if (!(el.dataset.q in answers)) return;
      var v = answers[el.dataset.q];
      if (el.tagName === 'INPUT') {
        el.value = v == null ? '' : String(v);
      } else {
        el.dataset.state = v === true ? 'true' : v === false ? 'false' : '';
        el.querySelector('.ps-mark').textContent =
          v === true ? 'holds' : v === false ? 'does not hold' : 'not answered';
      }
    });
  }

  function answered() {
    var a = harvest();
    return Object.keys(a).filter(function (k) {
      return a[k] !== null && a[k] !== '';
    }).length;
  }

  function say(text, cls) {
    status.textContent = text;
    status.className = 'ps-status' + (cls ? ' ' + cls : '');
  }

  function showGroup(me) {
    var names = (me.members || []).map(function (m) { return m.name; });
    identity.classList.remove('ps-warn');
    identity.innerHTML =
      '<strong>You are submitting for ' + esc(me.groupName) + '</strong>' +
      '<span class="ps-members">' + esc(names.join(' and ')) +
      (me.latest
        ? ' &middot; last submitted by ' + esc(me.latest.submittedBy) +
          ', version ' + me.latest.version
        : ' &middot; nothing submitted yet') +
      '</span>';
  }

  function showNoGroup(message) {
    identity.classList.add('ps-warn');
    identity.innerHTML =
      '<strong>You are not in a group for Problem Set ' + esc(PS) + '</strong>' +
      '<span class="ps-members">' + esc(message ||
        'Please contact the instructor before the deadline.') + '</span>';
    button.disabled = true;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;',
               '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function preview(why) {
    identity.classList.remove('ps-warn');
    identity.innerHTML =
      '<strong>Preview</strong><span class="ps-members">' + esc(why) +
      ' Answers are not saved.</span>';
    say('Preview only — not connected to the submission service.');
    button.disabled = true;
  }

  window.addEventListener('ps:dirty', function () {
    state.dirty = true;
    if (state.online && !state.closed) {
      button.disabled = false;
      say(answered() + ' of ' + fields().length + ' answered.');
    }
  });

  document.addEventListener('input', function (ev) {
    if (ev.target.dataset && ev.target.dataset.q) {
      window.dispatchEvent(new CustomEvent('ps:dirty'));
    }
  });

  button.addEventListener('click', function () {
    button.disabled = true;
    say('Submitting…');
    fetch(API + '/submit', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: harvest() }),
    }).then(function (r) {
      return r.json().catch(function () { return {}; })
        .then(function (d) { return { status: r.status, data: d }; });
    }).then(function (res) {
      if (res.status === 200) {
        state.dirty = false;
        say('Saved as version ' + res.data.version + '. You can change your '
            + 'answers and submit again until the deadline.', 'ps-ok');
        return;
      }
      button.disabled = false;
      if (res.status === 403) {
        state.closed = true;
        button.disabled = true;
        say('The deadline has passed — this problem set is closed.', 'ps-error');
      } else if (res.status === 409) {
        say('You are not in a group for this problem set.', 'ps-error');
      } else {
        say('Could not save. Nothing was lost — try again.', 'ps-error');
      }
    }).catch(function () {
      button.disabled = false;
      say('No connection. Nothing was lost — try again.', 'ps-error');
    });
  });

  fetch(API + '/me', { credentials: 'same-origin' })
    .then(function (r) {
      if (r.status === 404) throw new Error('no session');
      return r.json();
    })
    .then(function (me) {
      state.online = true;
      state.closed = !!me.closed;
      state.group = me.groupId || null;

      if (!me.groupId) { showNoGroup(me.message); }
      else { showGroup(me); }

      if (me.latest) fill(me.latest.answers);

      if (me.closed) {
        button.disabled = true;
        say('Closed. Your answers are shown as you last submitted them.');
        if (me.key) showKey(me.key);
      } else if (me.groupId) {
        button.disabled = !me.latest;
        say(me.latest
          ? 'Loaded version ' + me.latest.version + '. Edit and submit again to replace it.'
          : 'Answer the questions, then submit.');
      }
    })
    .catch(function () {
      preview('This page is being previewed outside the submission service.');
    });

  /* The key is served only after the deadline -- it is never in this file and
     never in the page, so there is nothing to read early. */
  function showKey(key) {
    keyBox.hidden = false;
    keyBox.innerHTML = '<h3>Answer key</h3>' + key;
  }
})();
