# Indang Residence — Interactive 3D Model

A navigable 3D model of the proposed one-storey house in Indang, Cavite, built
procedurally from the blueprint set (`INDANG 219 LOT_page-0001..0008.jpg`):
sheets A-01–A-04 (architectural), S-01–S-02 (structural), E-01 (electrical),
P-01 (plumbing).

## How to view

**Easiest:** double-click `index.html` — it runs fully offline (all scripts are
local; no internet or installs needed).

Or serve it: `python -m http.server 8000` in this folder, then open
`http://localhost:8000`.

## Controls

- **Left-drag** orbit · **wheel** zoom · **right-drag** pan
- **Walkthrough mode** button → WASD to move, drag mouse to look
- URL params work too, e.g. `index.html?view=interior`

## View modes (left panel)

| Mode | What it shows |
|---|---|
| Exterior | Full model w/ roof, parapets, site |
| Interior | Roof + ceiling hidden — room layout, furniture |
| Ceiling view | Camera inside looking up — CF-01 flat ceiling, pin lights, dining chandelier |
| Roof only | Roof decks + parapets alone |
| Structure | Columns (160×250 C-1), roof beams, 2×3 rafters + 2×4 purlins @600 OC |
| Top plan | Orthographic-ish plan view |

Layer checkboxes let you toggle any group independently.

## Dimensions used (from the plans)

- Main house envelope: **15.0 × 6.0 m** (grids 1–5 × A–C); lot 20.01 × ~10.9 m
- X-grid: 3000 / 2950 / (600+2800) / 4320 / ~1330; rooms per floor-plan dim string
  `3000|1300|1300|3150|4220|680|1350` (+3000 carport) = 18000
- Heights: NGL→FFL **0.35**, interior ceiling **2.55**, parapet **~3.95–4.55**
  (apex per A-03), porch soffit ~2.15
- Doors: D-1 sliding glass 2.1×2.1 (dining→lanai) · D-2 entry 0.9×2.1 ·
  D-3 PVC 0.6×2.1 ×2 · D-4 panel 0.8×2.1 ×4
- Windows (analok + glass): W-1 awning 0.5×1.2 sill 0.95 ×2 · W-2 casement
  1.4×1.0 sill 1.15 ×4 · W-3 0.6×0.6 sill 1.55 ×2 · W-4 casement 1.3×0.6 sill 1.55
- Finishes: FF-01 oak wood tile (beds/living/hall/genkan) · FF-02 60×60 white
  ceramic (kitchen/dining) · FF-03 non-skid (T&B, lanai) · CF-01 fiber-cement
  flat white · CF-02 PVC wood soffit (genkan/lanai/carport) · WF-01 stone accent ·
  WF-02 smooth white · WF-03 cream band · WF-04 limewash base band
- Structure (S-02): C-1 160×250 cols @ grids, F-1 1.0×1.0×0.3 footings @1.5 m
  deep, 100 mm SOG, steel rafters + purlins @600 OC, 16 mm sagrods

## Assumptions / ambiguous readings (please verify against plans)

1. **Hallway = central vestibule (~1.15 × 2.0 m ≈ 2.60 sqm)** — the hallway
   does **not** run to the west wall. West of grid 2 (x=3.0), **Bedroom 3 and
   Bedroom 4 touch directly** across a stepped partition (z=2.75 with a 500 mm
   pocket step to z=3.25 — that `500` is the middle segment of the left-side
   `2750|500|2750` dim string, not a corridor). B3, B4, and B2 all open via
   **D-4 doors on vertical (N-S) walls** into the central hallway pocket at
   x=3.0–4.15, which is finished in FF-02 white tile like the kitchen/dining.
   B2 has an L-shaped recess around the pocket; B1/B2's south wall sits at
   z=3.25. The kitchen is open-plan east of the T&B (x5.6), with the cook
   peninsula + raised counter table on its dining edge.
2. **Interior ceiling 2.55 m** (right-side elevation reads 2550). The `2150` dim
   on the front elevation (`0.35 + 2.15 = 2.50 m`) sets the window-head,
   East C-frame soffit, and Lanai/Carport canopy ceiling line (`PORCH_CEIL`).
3. **Parapet & exterior massing (per A-01 `PERSPECTIVE - 01` & A-03 elevations)**:
   - **3.15 m (`PARAPET_LO`)**: projecting **WF-03 cream C-frame portal** on the
     East facade (`300+50+2150+650 = 3150`), with `CF-02` wood soffit overhang,
     recessed downlights, 4×4 dark-grid front window wall, low stone planter box,
     and fluted-oak main entrance door **D-2** at the south end of the Genkan
     (`z=3.80–4.70`).
   - **3.95 m (`PARAPET`)**: main house parapet line (`3150+800 = 3950`), with an
     800 mm **WF-04 limewash stucco band** along the upper parapet.
   - **4.55 m (`APEX`)**: vertical **WF-01 stone-brick accent tower** (`3950+600`)
     at the Grid 5 / Grid C corner between the Carport canopy and the Cream
     C-frame portal, plus `WF-01` stone cladding framing the South Lanai and
     4×4-grid `D-1` sliding door.
4. **Roof & Carport / Lanai canopies**:
   - Concealed mono-pitch main roof draining toward grid A (north) below the
     3.95 m parapet; flat roof over the 1.35 × 5.0 m East/Genkan interior wing
     (`x13.67–15.0, z0–5.0`) concealed behind the 3.15 m C-frame.
   - Per A-02 Roof Plan & `PERSPECTIVE - 01`, the **Lanai canopy** (`x8.95–12.97,
     z6.0–8.05`) and **Carport canopy** (`x13.65–18.0, z5.0–8.05`) share the
     same south edge (`z≈8.05`) and height (`2.50 m`) with dark bronze fascia,
     square portal columns, and `CF-02` wood plank soffits. (There is no high
     roof east of `x=15.0` over `z0–5` — those lines on A-02 are dimension
     witness lines for `2970`.)
5. **T&B** modeled as two 1.3 m compartments each with a D-3 door (schedule
   lists D-3 qty 2; plan shows two WC symbols). Verify actual split.
6. **West-wall windows** added per the rear elevation; sizes assumed = W-2.
7. **Genkan & Carport notch**: per A-02 Floor Plan, the Living NE alcove occupies
   `x13.67–15.0, z0–2.95` (+0.35 m), the sunken **Genkan** (+0.20 m) occupies
   `x13.67–15.0, z2.95–5.0`, and `x13.67–15.0, z5.0–6.0` is an exterior notch
   under the Carport canopy. Front breeze-block screen wall at `x=17.95` is
   modeled per `PERSPECTIVE - 01`.
8. **Genkan floor at +0.20** (step down), lanai +0.30 — per the level
   annotations beside room labels. Hallway floor kept at +0.35.
9. Furniture, landscaping, and the car are **illustrative only** — not from plans.
10. Structural view shows columns/beams/framing approximately; footing sizes are
    per S-02 schedule but reinforcement is not modeled.
