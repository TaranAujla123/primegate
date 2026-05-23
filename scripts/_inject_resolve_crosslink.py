"""
One-off injection script.

Inserts a discreet cross-link paragraph into the footer disclosure block of
every English HTML page in build-v2, immediately above <p class="copyright">.

This script is idempotent: if the line is already present, the file is left
untouched. French pages under /fr/ are intentionally skipped because the line
would need a translated copy. The card/ vCard page uses a different minimal
footer and is also skipped.

Run from build-v2/ root:
    python scripts/_inject_resolve_crosslink.py
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Anchor we insert immediately above. 8-space indent is the consistent indent
# used by every English footer in build-v2/.
ANCHOR = '        <p class="copyright">'

NEW_PARAGRAPH = (
    '        <p class="footer-also">\n'
    '          Also by Taran Aujla. '
    '<a href="https://resolveproperty.ca" rel="noopener external">Resolve</a>: '
    'discreet representation for homeowners navigating a difficult or '
    'time-sensitive sale.\n'
    '        </p>\n'
)

# Idempotency check: the URL is unique enough across the codebase to use as
# the "already-inserted" signal.
IDEMPOTENCY_SIGNAL = 'https://resolveproperty.ca'

# Pages to edit: every HTML page that has <p class="copyright"> and is not
# under /fr/, /card/, /node_modules/, or /_archive/.
SKIP_PARTS = {'fr', 'card', 'node_modules', '_archive'}


def should_skip(path: Path) -> bool:
    return any(part in SKIP_PARTS for part in path.relative_to(ROOT).parts)


def main() -> int:
    edited: list[Path] = []
    skipped_already: list[Path] = []
    skipped_no_anchor: list[Path] = []

    for html_path in ROOT.rglob('*.html'):
        if should_skip(html_path):
            continue
        text = html_path.read_text(encoding='utf-8')
        if IDEMPOTENCY_SIGNAL in text:
            skipped_already.append(html_path)
            continue
        if ANCHOR not in text:
            skipped_no_anchor.append(html_path)
            continue
        new_text = text.replace(ANCHOR, NEW_PARAGRAPH + ANCHOR, 1)
        html_path.write_text(new_text, encoding='utf-8', newline='\n')
        edited.append(html_path)

    print(f'Edited {len(edited)} files:')
    for p in edited:
        print(f'  + {p.relative_to(ROOT).as_posix()}')
    if skipped_already:
        print(f'\nAlready had the line ({len(skipped_already)}):')
        for p in skipped_already:
            print(f'  = {p.relative_to(ROOT).as_posix()}')
    if skipped_no_anchor:
        print(f'\nNo copyright anchor found ({len(skipped_no_anchor)}):')
        for p in skipped_no_anchor:
            print(f'  - {p.relative_to(ROOT).as_posix()}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
