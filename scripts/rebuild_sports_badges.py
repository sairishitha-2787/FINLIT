"""
rebuild_sports_badges.py
Re-extracts ALL 75 sports badges fresh from the original batch sheets.
Fixes: correct B2 boundaries, text label removal, corner padding, normalised frame size.
Run from any directory — paths are absolute.
"""

from PIL import Image
import numpy as np
from pathlib import Path
from collections import deque

SRC  = Path(r'C:\Users\sairi\Desktop\FINLIT\BADGES\SPORTS')
OUT  = Path(r'C:\Users\sairi\Desktop\FINLIT\frontend\public\BADGES\SPORTS')
CANVAS  = 512
FILL_RATIO = 0.82   # diamond should occupy ~82% of the canvas edge after centering
MIN_ALPHA  = 10     # threshold for "opaque" pixels
PAD        = 10     # padding added around tight-crop to preserve anti-aliased corners


# ── Batch sheet definitions ────────────────────────────────────────────────────
# Each regular sheet: (filename, n_cols, n_rows, badge_ids, text_pct)
# text_pct = fraction of cell height to keep before gap-based text detection.
# Must be high enough to include the full diamond tip (bottom point).
# B6 is the exception — its tier labels sit high so 0.78 works; all others
# need 0.93+ because badge tips reach ~93% of cell height in those sheets.
REGULAR_SHEETS = [
    ("SPORTS_B-1.png", 5, 2, [
        "first_whistle","rookie_card","opening_match","first_points","division_climber",
        "week_one_warrior","season_opener","training_ground","quick_start","team_player",
    ], 0.97),
    ("SPORTS_B-3.png", 5, 3, [
        "clean_sheet","hat_trick","perfect_form","speed_demon","comeback_king",
        "consistency_champion","no_mistakes","record_breaker","sharpshooter","clutch_player",
        "perfectionist","quick_learner","ace_student","iron_will","flawless_victory",
    ], 0.97),
    ("SPORTS_B-5.png", 5, 3, [
        "budget_master","savings_expert","income_tracker","emergency_ready","investment_pro",
        "debt_free","credit_savvy","tax_ready","portfolio_builder","retirement_planner",
        "real_estate_ready","wealth_builder","topic_completionist","perfect_training","knowledge_base",
    ], 0.97),
    ("SPORTS_B-6.png", 3, 3, [
        "captains_armband","marathon_runner","iron_streak",
        "mvp","golden_boot","division_10",
        "top_tier","master_class","legendary_status",
    ], 0.97),
    ("SPORTS_B-7.png", 3, 3, [
        "early_bird","night_owl","weekend_warrior",
        "comeback_trail","badge_collector","speed_runner",
        "trophy_hunter","hall_of_fame","the_complete_athlete",
    ], 0.97),
]

# No per-badge overrides needed for hexagonal badges (no external text labels).
BADGE_TEXT_PCT = {}

# B2 uses auto-detected correct column splits instead of equal thirds
B2_BADGES = [
    "practice_makes_perfect","hundred_club","five_hundred_club",
    "thousand_club","welcome_to_the_league",
]


# ── Background removal ─────────────────────────────────────────────────────────
def remove_white_bg(rgb_arr, tol=28):
    """Flood-fill from corners; make connected near-white pixels transparent."""
    h, w = rgb_arr.shape[:2]
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[:, :, :3] = rgb_arr
    rgba[:, :, 3] = 255

    def is_white(y, x):
        r, g, b = int(rgb_arr[y, x, 0]), int(rgb_arr[y, x, 1]), int(rgb_arr[y, x, 2])
        return r >= (255 - tol) and g >= (255 - tol) and b >= (255 - tol)

    visited  = np.zeros((h, w), dtype=bool)
    bg_mask  = np.zeros((h, w), dtype=bool)
    q = deque()
    for sy, sx in [(0,0),(0,w-1),(h-1,0),(h-1,w-1)]:
        if not visited[sy,sx] and is_white(sy,sx):
            q.append((sy,sx)); visited[sy,sx] = True; bg_mask[sy,sx] = True
    while q:
        y, x = q.popleft()
        for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
            ny, nx = y+dy, x+dx
            if 0<=ny<h and 0<=nx<w and not visited[ny,nx]:
                visited[ny,nx] = True
                if is_white(ny,nx):
                    bg_mask[ny,nx] = True; q.append((ny,nx))
    rgba[bg_mask, 3] = 0
    return rgba


# ── Adaptive bleedthrough skip ────────────────────────────────────────────────
def adaptive_skip(cell_rgb, search_rows=60, zero_run_needed=2, dense_thr=0):
    """
    Detects bleedthrough from the previous row's badge tip at the top of a cell.
    Pattern: dense rows (prev tip bleeding in) → zero/sparse gap → current badge.
    Returns how many rows to trim from the top. Returns 0 when no such pattern
    is found (e.g. current badge's own tip starts at row 0 with increasing density).
    """
    h = cell_rgb.shape[0]
    not_white = np.any(cell_rgb < 220, axis=2)
    cnt = not_white.sum(axis=1).astype(int)

    seen_dense = False
    zero_start = -1
    for r in range(min(search_rows, h)):
        if cnt[r] > dense_thr:
            seen_dense = True
            zero_start = -1          # reset any partial zero run
        else:
            if seen_dense:
                if zero_start == -1:
                    zero_start = r
                if (r - zero_start + 1) >= zero_run_needed:
                    # Qualifying gap found — advance to end of sparse region
                    end = r + 1
                    while end < h and cnt[end] <= dense_thr:
                        end += 1
                    return end
    return 0


# ── Text label detection (gap-based) ─────────────────────────────────────────
def find_text_gap(alpha_2d, gap_thr=8, min_after=12):
    """
    Find the first row where a qualifying gap occurs:
      – row count ≤ gap_thr  AND
      – at least min_after opaque pixels exist somewhere below
      – at least 15px opaque pixels exist somewhere above (badge body)
    Returns crop row (exclusive). Falls back to full height.
    """
    H    = alpha_2d.shape[0]
    cnt  = (alpha_2d > 30).sum(axis=1).astype(int)
    in_g = False; g_start = 0; gaps = []
    for r in range(H):
        if cnt[r] <= gap_thr:
            if not in_g: g_start = r; in_g = True
        else:
            if in_g: gaps.append((g_start, r)); in_g = False
    if in_g: gaps.append((g_start, H))

    for gs, ge in gaps:
        if gs > 0 and cnt[:gs].max() >= 50 and ge < H and cnt[ge:].max() >= min_after:
            return gs
    return H


# ── Centre on canvas ──────────────────────────────────────────────────────────
def centre_on_canvas(rgba):
    """Tight-crop (with padding) → normalise by geometric mean → centre on CANVAS×CANVAS.

    Scaling by sqrt(W*H) instead of max(W,H) gives all badges the same visual
    area on-canvas regardless of their aspect ratio (wide/tall source artwork).
    """
    alpha = rgba[:,:,3]
    rows  = np.any(alpha > MIN_ALPHA, axis=1)
    cols  = np.any(alpha > MIN_ALPHA, axis=0)
    if not rows.any():
        return rgba

    t = max(0,            int(np.argmax(rows))              - PAD)
    b = min(rgba.shape[0], int(len(rows) - np.argmax(rows[::-1])) + PAD)
    l = max(0,            int(np.argmax(cols))              - PAD)
    r = min(rgba.shape[1], int(len(cols) - np.argmax(cols[::-1])) + PAD)
    crop = rgba[t:b, l:r]

    ch, cw = crop.shape[:2]

    # Scale so geometric mean of content dims equals target.
    # This normalises visual area so all badges look the same size regardless
    # of whether the source diamond is slightly wider or taller than square.
    target = int(CANVAS * FILL_RATIO)   # 420
    scale  = target / (ch * cw) ** 0.5
    new_w  = int(round(cw * scale))
    new_h  = int(round(ch * scale))

    # Cap: neither dimension may exceed canvas bounds.
    if max(new_w, new_h) > CANVAS:
        cap   = CANVAS / max(new_w, new_h)
        new_w = int(round(new_w * cap))
        new_h = int(round(new_h * cap))

    resized = np.array(Image.fromarray(crop, 'RGBA').resize((new_w, new_h), Image.LANCZOS))

    canvas = np.zeros((CANVAS, CANVAS, 4), dtype=np.uint8)
    off_y  = (CANVAS - new_h) // 2
    off_x  = (CANVAS - new_w) // 2
    canvas[off_y:off_y+new_h, off_x:off_x+new_w] = resized
    return canvas


# ── Extract one badge from a cropped cell (RGB, white bg) ─────────────────────
def process_cell(cell_rgb, badge_id, text_height_pct=0.75):
    """
    cell_rgb : H×W×3 numpy array (white background)
    text_height_pct : keep only this top fraction of the cell (strips text)
    """
    h, w = cell_rgb.shape[:2]
    # 1. Strip text: keep top text_height_pct of cell
    keep_h = int(h * text_height_pct)
    cell   = cell_rgb[:keep_h]

    # 2. Remove white background
    rgba = remove_white_bg(cell)

    # 3. Additional gap-based text check (in case label crept in)
    crop_row = find_text_gap(rgba[:,:,3])
    rgba = rgba[:crop_row]

    # 4. Centre
    result = centre_on_canvas(rgba)

    fill = (result[:,:,3] > MIN_ALPHA).sum() / (CANVAS*CANVAS) * 100
    Image.fromarray(result,'RGBA').save(OUT / f'{badge_id}.png', 'PNG', optimize=False)
    print(f'  OK  {badge_id:40s}  fill={fill:.1f}%')
    return fill > 5


# ── Regular grid sheets ────────────────────────────────────────────────────────
def process_regular_sheet(fname, n_cols, n_rows, badge_ids, text_pct=0.75):
    path = SRC / fname
    img  = Image.open(path).convert('RGB')
    W, H = img.size
    cw, ch = W // n_cols, H // n_rows
    print(f'\n{fname}  ({W}×{H})  cell={cw}×{ch}')
    idx = 0
    for row in range(n_rows):
        for col in range(n_cols):
            if idx >= len(badge_ids): break
            x0, y0 = col*cw, row*ch
            cell = np.array(img.crop((x0, y0, x0+cw, y0+ch)))
            # Remove bleedthrough from previous row's badge tip (non-first rows only).
            # adaptive_skip returns 0 when no bleedthrough pattern is detected
            # (e.g. current badge tip starts at row 0 with immediately increasing density).
            if row > 0:
                skip = adaptive_skip(cell)
                if skip > 0:
                    cell = cell[skip:]
            badge_id = badge_ids[idx]
            effective_pct = BADGE_TEXT_PCT.get(badge_id, text_pct)
            process_cell(cell, badge_id, effective_pct)
            idx += 1


# ── B2 (irregular layout with corrected boundaries) ───────────────────────────
def process_b2():
    path = SRC / "SPORTS_B-2.png"
    img  = Image.open(path).convert('RGB')
    W, H = img.size
    print(f'\nSPORTS_B-2.png  ({W}×{H})  irregular 3+2')

    arr = np.array(img)

    # Auto-detect column splits in the top half
    top_mask  = np.any(arr[:H//2] < 240, axis=2)
    col_d     = top_mask.sum(axis=0).astype(int)

    # Find valleys between the 3 top badges
    sep_cols = []
    in_v = False; vs = 0
    for c in range(W):
        if col_d[c] < 60:
            if not in_v: vs = c; in_v = True
        else:
            if in_v:
                left_ok  = col_d[:vs].max() > 200 if vs > 0 else False
                right_ok = col_d[c:].max() > 200  if c < W else False
                if left_ok and right_ok:
                    sep_cols.append((vs + c) // 2)
                in_v = False
    if in_v:
        if col_d[:vs].max() > 200:
            sep_cols.append((vs + W) // 2)

    top_bounds = [0] + sep_cols[:2] + [W]
    print(f'  Top-row column boundaries: {top_bounds}')

    # Auto-detect column split in the bottom half
    bot_mask = np.any(arr[H//2:] < 240, axis=2)
    col_d_b  = bot_mask.sum(axis=0).astype(int)
    sep_b    = []
    in_v = False; vs = 0
    for c in range(W):
        if col_d_b[c] < 60:
            if not in_v: vs = c; in_v = True
        else:
            if in_v:
                left_ok  = col_d_b[:vs].max() > 200 if vs > 0 else False
                right_ok = col_d_b[c:].max() > 200  if c < W else False
                if left_ok and right_ok:
                    sep_b.append((vs + c) // 2)
                in_v = False
    bot_bounds = [0] + sep_b[:1] + [W]
    print(f'  Bot-row column boundaries: {bot_bounds}')

    half_h = H // 2

    # Top row: 3 badges
    for i, badge_id in enumerate(B2_BADGES[:3]):
        x0, x1 = top_bounds[i], top_bounds[i+1]
        cell = np.array(img.crop((x0, 0, x1, half_h)))
        process_cell(cell, badge_id, text_height_pct=0.97)

    # Bottom row: 2 badges — start at the true midpoint
    for i, badge_id in enumerate(B2_BADGES[3:]):
        x0, x1 = bot_bounds[i], bot_bounds[i+1]
        cell = np.array(img.crop((x0, half_h, x1, H)))
        process_cell(cell, badge_id, text_height_pct=0.97)


B4_BADGES = [
    "pre_season_victor","pre_season_complete","pre_season_perfect","mid_season_champion",
    "regular_season_complete","regular_season_perfect","league_champion","championship_complete",
    "championship_perfect","the_treble","unbeaten_season","triple_crown",
]


def process_b4():
    """B4 has a large left margin so equal column splits misalign badges. Auto-detect."""
    path = SRC / "SPORTS_B-4.png"
    img  = Image.open(path).convert('RGB')
    W, H = img.size
    n_rows = 3
    print(f'\nSPORTS_B-4.png  ({W}×{H})  irregular columns (auto-detect)')

    arr   = np.array(img)
    col_d = np.any(arr < 220, axis=2).sum(axis=0).astype(int)

    # Find the 3 valleys between the 4 badge columns
    sep_cols = []
    in_v = False; vs = 0
    for c in range(W):
        if col_d[c] < 60:
            if not in_v: vs = c; in_v = True
        else:
            if in_v:
                left_ok  = col_d[:vs].max() > 200 if vs > 0 else False
                right_ok = col_d[c:].max()  > 200 if c < W else False
                if left_ok and right_ok:
                    sep_cols.append((vs + c) // 2)
                in_v = False
    if in_v and col_d[:vs].max() > 200:
        sep_cols.append((vs + W) // 2)

    col_bounds = [0] + sep_cols[:3] + [W]
    print(f'  Column boundaries: {col_bounds}')

    ch = H // n_rows
    idx = 0
    for row in range(n_rows):
        for col in range(len(col_bounds) - 1):
            if idx >= len(B4_BADGES): break
            x0, x1 = col_bounds[col], col_bounds[col + 1]
            y0, y1 = row * ch, (row + 1) * ch
            cell = np.array(img.crop((x0, y0, x1, y1)))
            if row > 0:
                skip = adaptive_skip(cell)
                if skip > 0:
                    cell = cell[skip:]
            process_cell(cell, B4_BADGES[idx], text_height_pct=0.97)
            idx += 1


# ── Main ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    ok = 0; total = 0

    for fname, n_cols, n_rows, badge_ids, text_pct in REGULAR_SHEETS:
        process_regular_sheet(fname, n_cols, n_rows, badge_ids, text_pct)
        total += len(badge_ids)

    process_b2()
    total += len(B2_BADGES)

    process_b4()
    total += len(B4_BADGES)

    # Verify
    print(f'\n=== Verification ===')
    low = []
    for p in sorted(OUT.glob('*.png')):
        img = Image.open(p).convert('RGBA')
        alpha = np.array(img)[:,:,3]
        fill = (alpha > 10).sum() / (CANVAS*CANVAS) * 100
        if fill < 20:
            low.append((fill, p.name))
        else:
            ok += 1
    if low:
        print(f'LOW FILL BADGES ({len(low)}):')
        for fill, name in low:
            print(f'  {fill:.1f}% {name}')
    else:
        print(f'All {ok} badges look good (>= 20% fill).')
