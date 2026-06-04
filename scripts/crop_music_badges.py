"""
crop_music_badges.py
Extracts all 78 music badges (75 core + 3 character exclusive) from 7 batch sheets.

Batch layout:
  MUSIC_B1.png  — 5 cols × 3 rows  — Milestone (15)
  MUSIC_B2.png  — 5 cols × 3 rows  — Performance (15)
  MUSIC_B3.png  — 5 cols × 3 rows  — Genre/Topic (13 unique; 2 dup skips + 1 empty)
  MUSIC_B4.png  — 5 cols × 3 rows  — Rarity Progression (15)
  MUSIC_B5.png  — 5 cols × 2 rows  — Engagement (10)
  MUSIC_B6.png  — 4 cols × 2 rows  — Mastery (8)
  MUSIC_B7.png  — 3 cols × 1 row   — Character Exclusive (3, circular glow format)

Run:  python scripts/crop_music_badges.py
"""

from PIL import Image
import numpy as np
from pathlib import Path
from collections import deque

SRC        = Path(r'C:\Users\sairi\Desktop\FINLIT\BADGES\MUSIC')
OUT        = Path(r'C:\Users\sairi\Desktop\FINLIT\frontend\public\badges\music')
CANVAS     = 512
FILL_RATIO = 0.82
MIN_ALPHA  = 10
PAD        = 10


# ── White background removal (flood-fill from corners) ────────────────────────
def remove_white_bg(rgb_arr, tol=28):
    h, w = rgb_arr.shape[:2]
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[:, :, :3] = rgb_arr
    rgba[:, :, 3]  = 255

    def is_white(y, x):
        r, g, b = int(rgb_arr[y, x, 0]), int(rgb_arr[y, x, 1]), int(rgb_arr[y, x, 2])
        return r >= (255 - tol) and g >= (255 - tol) and b >= (255 - tol)

    visited = np.zeros((h, w), dtype=bool)
    bg_mask = np.zeros((h, w), dtype=bool)
    q = deque()
    for sy, sx in [(0,0), (0,w-1), (h-1,0), (h-1,w-1)]:
        if not visited[sy, sx] and is_white(sy, sx):
            q.append((sy, sx)); visited[sy, sx] = True; bg_mask[sy, sx] = True
    while q:
        y, x = q.popleft()
        for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
            ny, nx = y+dy, x+dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                visited[ny, nx] = True
                if is_white(ny, nx):
                    bg_mask[ny, nx] = True; q.append((ny, nx))
    rgba[bg_mask, 3] = 0
    return rgba


# ── Adaptive bleedthrough skip (prev row badge tip bleeding into top of cell) ──
def adaptive_skip(cell_rgb, search_rows=60, zero_run_needed=2, dense_thr=0):
    h = cell_rgb.shape[0]
    not_white = np.any(cell_rgb < 220, axis=2)
    cnt = not_white.sum(axis=1).astype(int)
    seen_dense = False; zero_start = -1
    for r in range(min(search_rows, h)):
        if cnt[r] > dense_thr:
            seen_dense = True; zero_start = -1
        else:
            if seen_dense:
                if zero_start == -1: zero_start = r
                if (r - zero_start + 1) >= zero_run_needed:
                    end = r + 1
                    while end < h and cnt[end] <= dense_thr:
                        end += 1
                    return end
    return 0


# ── Valley-based text-label crop ──────────────────────────────────────────────
# The badge's bottom hexagon vertex tapers to a low density that nearly equals
# the label-text density, so an absolute "gap < threshold" test can't separate
# them. Instead we find the density VALLEY between the badge body and the text
# bump and cut there — robust regardless of where the vertex sits.
def find_text_gap(alpha_2d, smooth=9):
    H    = alpha_2d.shape[0]
    mask = alpha_2d > 30
    dens = mask.sum(axis=1).astype(float)
    if dens.max() == 0:
        return H

    # Horizontal extent (width) per row — separates a label from a soft glow
    # ring where density alone tapers monotonically with no valley.
    width = np.zeros(H)
    for r in range(H):
        xs = np.where(mask[r])[0]
        if xs.size:
            width[r] = xs[-1] - xs[0]

    k  = np.ones(smooth) / smooth
    sd = np.convolve(dens,  k, mode='same')
    sw = np.convolve(width, k, mode='same')
    peak = sd.max()
    pr   = int(sd.argmax())

    # Scan downward from past the peak; cut at the first local minimum (in EITHER
    # density or width) that is followed by a "bump" — i.e. a text label below.
    start = pr + max(4, int(0.04 * H))
    win   = int(0.25 * H) + 1
    for r in range(start, H - smooth):
        trough_d = sd[r] <= sd[r - smooth] and sd[r] <= sd[r + 1]
        trough_w = sw[r] <= sw[r - smooth] and sw[r] <= sw[r + 1]
        if not (trough_d or trough_w):
            continue
        below_d = sd[r + 1 : min(H, r + win)]
        below_w = sw[r + 1 : min(H, r + win)]
        dbump = below_d.size and below_d.max() > sd[r] * 1.18 and below_d.max() > peak * 0.05
        wbump = below_w.size and below_w.max() > sw[r] * 1.08 and below_w.max() > 25
        if dbump or wbump:
            return r  # valley between badge and its text label

    # No text bump found (badge has no label below it) — trim trailing blank only.
    for r in range(H - 1, pr, -1):
        if sd[r] > peak * 0.03:
            return min(H, r + 1)
    return H


# ── Centre on canvas ──────────────────────────────────────────────────────────
def centre_on_canvas(rgba):
    alpha = rgba[:,:,3]
    rows  = np.any(alpha > MIN_ALPHA, axis=1)
    cols  = np.any(alpha > MIN_ALPHA, axis=0)
    if not rows.any():
        return rgba
    t = max(0,             int(np.argmax(rows))                    - PAD)
    b = min(rgba.shape[0], int(len(rows) - np.argmax(rows[::-1])) + PAD)
    l = max(0,             int(np.argmax(cols))                    - PAD)
    r = min(rgba.shape[1], int(len(cols) - np.argmax(cols[::-1])) + PAD)
    crop = rgba[t:b, l:r]
    ch, cw = crop.shape[:2]
    target = int(CANVAS * FILL_RATIO)
    scale  = target / (ch * cw) ** 0.5
    new_w  = int(round(cw * scale))
    new_h  = int(round(ch * scale))
    if max(new_w, new_h) > CANVAS:
        cap   = CANVAS / max(new_w, new_h)
        new_w = int(round(new_w * cap))
        new_h = int(round(new_h * cap))
    resized = np.array(Image.fromarray(crop, 'RGBA').resize((new_w, new_h), Image.LANCZOS))
    canvas  = np.zeros((CANVAS, CANVAS, 4), dtype=np.uint8)
    off_y   = (CANVAS - new_h) // 2
    off_x   = (CANVAS - new_w) // 2
    canvas[off_y:off_y+new_h, off_x:off_x+new_w] = resized
    return canvas


# ── Extract one badge from a cell ────────────────────────────────────────────
def process_cell(cell_rgb, badge_id, text_height_pct=0.97):
    h, _   = cell_rgb.shape[:2]
    keep_h = int(h * text_height_pct)
    cell   = cell_rgb[:keep_h]
    rgba   = remove_white_bg(cell)
    crop_row = find_text_gap(rgba[:,:,3])
    rgba   = rgba[:crop_row]
    result = centre_on_canvas(rgba)
    fill   = (result[:,:,3] > MIN_ALPHA).sum() / (CANVAS * CANVAS) * 100
    out_path = OUT / f'{badge_id}.png'
    Image.fromarray(result, 'RGBA').save(out_path, 'PNG', optimize=False)
    status = 'OK ' if fill > 5 else 'LOW'
    print(f'  {status}  {badge_id:<48s}  fill={fill:.1f}%')
    return fill > 5


# ── Process a regular grid sheet ──────────────────────────────────────────────
# badge_ids: flat list matching row-major order; use None to skip a cell.
def process_sheet(fname, n_cols, n_rows, badge_ids, text_pct=0.97):
    path = SRC / fname
    img  = Image.open(path).convert('RGB')
    W, H = img.size
    cw, ch = W // n_cols, H // n_rows
    print(f'\n{fname}  ({W}×{H})  grid={n_cols}×{n_rows}  cell={cw}×{ch}')
    idx = 0
    for row in range(n_rows):
        for col in range(n_cols):
            if idx >= len(badge_ids):
                break
            bid = badge_ids[idx]; idx += 1
            if bid is None:
                print(f'  SKIP  [{row},{col}]  (duplicate/empty)')
                continue
            x0, y0 = col * cw, row * ch
            cell = np.array(img.crop((x0, y0, x0+cw, y0+ch)))
            # Remove bleedthrough from the previous row's badge tip
            if row > 0:
                skip = adaptive_skip(cell)
                if skip > 0:
                    cell = cell[skip:]
            process_cell(cell, bid, text_pct)


# ── B3 — Genre/Topic sheet (irregular bottom row) ─────────────────────────────
# Rows 0-1 sit on the even 5-col grid (with 2 duplicate cells skipped).
# Row 2 has only 4 badges placed at CUSTOM x-positions (not grid-aligned),
# so we detect their column ranges directly.
def detect_col_ranges(band_rgb, full_h, occ_ratio=0.15, merge_gap=60):
    """Return list of (x0, x1) ranges of badge content in a horizontal band."""
    nw = np.any(band_rgb < 220, axis=2).sum(axis=0)
    occ = nw > full_h * occ_ratio
    ranges = []; inr = False; s = 0
    W = band_rgb.shape[1]
    for x in range(W):
        if occ[x] and not inr:
            s = x; inr = True
        elif not occ[x] and inr:
            ranges.append((s, x)); inr = False
    if inr:
        ranges.append((s, W))
    merged = []
    for a, b in ranges:
        if merged and a - merged[-1][1] < merge_gap:
            merged[-1] = (merged[-1][0], b)
        else:
            merged.append((a, b))
    # Filter out tiny specks
    return [(a, b) for a, b in merged if (b - a) > 120]


def process_b3():
    fname = 'MUSIC_B3.png'
    img   = Image.open(SRC / fname).convert('RGB')
    arr   = np.array(img)
    W, H  = img.size
    ch    = H // 3
    cw    = W // 5
    print(f'\n{fname}  ({W}×{H})  rows 0-1 grid (5 col) + custom bottom row')

    # Rows 0-1 on the even 5-col grid
    grid_ids = [
        'music_ecosystem_explorer', 'music_rights_scholar', 'music_streaming_savvy',
        'music_deal_diplomat', 'music_diversifier',                                 # row 0
        None, 'music_merch_merchant', 'music_sponsor_seeker', 'music_fan_builder', None,  # row 1 (skip dups)
    ]
    idx = 0
    for row in range(2):
        for col in range(5):
            bid = grid_ids[idx]; idx += 1
            if bid is None:
                print(f'  SKIP  [{row},{col}]  (duplicate)')
                continue
            cell = np.array(img.crop((col * cw, row * ch, col * cw + cw, (row + 1) * ch)))
            if row > 0:
                skip = adaptive_skip(cell)
                if skip > 0:
                    cell = cell[skip:]
            process_cell(cell, bid)

    # Row 2: detect the 4 custom-positioned badges
    row2_ids = [
        'music_indie_pioneer', 'music_tour_master',
        'music_financial_planner', 'music_brand_visionary',
    ]
    band   = arr[2 * ch:3 * ch]
    ranges = detect_col_ranges(band, ch)
    print(f'  row2 detected {len(ranges)} columns: {ranges}')
    if len(ranges) != len(row2_ids):
        print(f'  WARNING: expected {len(row2_ids)} badges, found {len(ranges)}')
    pad_x = 20
    for (x0, x1), bid in zip(ranges, row2_ids):
        xa = max(0, x0 - pad_x); xb = min(W, x1 + pad_x)
        cell = np.array(img.crop((xa, 2 * ch, xb, 3 * ch)))
        process_cell(cell, bid)


# ── Badge ID lists ─────────────────────────────────────────────────────────────

B1 = [  # Milestone — 5×3
    'music_first_stream',           'music_streaming_enthusiast',   'music_chart_climber',
    'music_first_release',          'music_album_artisan',
    'music_tour_ready',             'music_venue_veteran',          'music_festival_performer',
    'music_collaboration_master',   'music_playlist_placement',
    'music_radio_rotation',         'music_million_streams',        'music_industry_recognition',
    'music_debut_album',            'music_legacy_builder',
]

B2 = [  # Performance — 5×3
    'music_perfect_theory',         'music_negotiation_pro',        'music_budget_master',
    'music_growth_hacker',          'music_fan_favorite',
    'music_viral_moment',           'music_chart_topper',           'music_trendsetter',
    'music_revenue_wizard',         'music_marketing_genius',
    'music_analytics_expert',       'music_strategy_master',        'music_deal_maker',
    'music_brand_ambassador',       'music_influencer_status',
]

B3 = [  # Genre/Topic — 5×3  (None = skip duplicate or empty)
    'music_ecosystem_explorer',     'music_rights_scholar',         'music_streaming_savvy',
    'music_deal_diplomat',          'music_diversifier',
    None,                           'music_merch_merchant',         'music_sponsor_seeker',
    'music_fan_builder',            None,
    'music_indie_pioneer',          'music_tour_master',            'music_financial_planner',
    'music_brand_visionary',        None,
]

B4 = [  # Rarity Progression — 5×3
    'music_learning_lover',         'music_quiz_master',            'music_topic_completionist',
    'music_streak_starter',         'music_beginners_luck',
    'music_intermediate_scholar',   'music_momentum_builder',       'music_knowledge_seeker',
    'music_curious_mind',           'music_fast_learner',
    'music_advanced_expert',        'music_deep_learner',           'music_strategy_architect',
    'music_mastermind',             'music_complete_musician',
]

B5 = [  # Engagement — 5×2
    'music_early_bird',             'music_night_owl',              'music_weekend_warrior',
    'music_consistency_king',       'music_iron_streak',
    'music_comeback_kid',           'music_never_give_up',          'music_persistence_pays',
    'music_badge_collector',        'music_trophy_hunter',
]

B6 = [  # Mastery — 4×2
    'music_label_negotiator',       'music_revenue_master',         'music_independent_legend',
    'music_golden_record',
    'music_hall_of_fame',           'music_music_icon',             'music_unstoppable',
    'music_complete_mastery',
]


# ── Main ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)

    # Generous hard pre-crop (keeps badge + label); the valley-based find_text_gap
    # then cuts precisely at the density minimum between the badge tip and its label.
    process_sheet('MUSIC_B1.png', 5, 3, B1, text_pct=0.99)
    process_sheet('MUSIC_B2.png', 5, 3, B2, text_pct=0.99)
    process_b3()  # irregular bottom row — custom handler
    process_sheet('MUSIC_B4.png', 5, 3, B4, text_pct=0.99)
    process_sheet('MUSIC_B5.png', 5, 2, B5, text_pct=0.99)
    process_sheet('MUSIC_B6.png', 4, 2, B6, text_pct=0.99)
    # B7 character-exclusive badges removed from the badge set — no longer cropped.

    # ── Verification ──────────────────────────────────────────────────────────
    print(f'\n{"="*60}')
    print('VERIFICATION')
    print(f'{"="*60}')
    ok = 0; low = []
    for p in sorted(OUT.glob('music_*.png')):
        img   = Image.open(p).convert('RGBA')
        alpha = np.array(img)[:,:,3]
        fill  = (alpha > 10).sum() / (CANVAS * CANVAS) * 100
        if fill < 20:
            low.append((fill, p.name))
        else:
            ok += 1

    print(f'Good badges  : {ok}')
    if low:
        print(f'Low fill ({len(low)}):')
        for fill, name in low:
            print(f'  {fill:5.1f}%  {name}')
    else:
        print('All badges look good (>=20% fill).')
    print(f'Total output : {ok + len(low)} files in {OUT}')
