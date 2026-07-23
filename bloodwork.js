/* ============================================================================
   YOUR BLOODWORK. The single source of truth. index.html holds NO data.

   AI: to add a draw, read _readme.how_to_add_a_draw and follow it exactly.
   The two ways to ruin this file silently are (a) converting a value yourself
   and (b) guessing a unit. Do neither. Write what the lab printed, name its
   unit exactly as it appears in that marker units[] array, and return the
   whole file. The dashboard validates on load and will tell the user if you
   got it wrong — but a wrong-but-plausible number may not be caught.
   ============================================================================ */
window.BLOODWORK =
{
 "_readme": {
  "what": "Bloodwork + supplement data for one person. THE single source of truth. The dashboard reads this file; so should any AI. Editing this file is how you add a new draw.",
  "how_to_add_a_draw": "APPEND one object to DATA.draws. Do not touch anything else. Do not reorder. Do not delete.\n  {\"id\":\"d2026jul\", \"date\":\"YYYY-MM-DD\", \"note\":\"lab, fasted?, on/off what\",\n   \"v\":{ \"<markerId>\": {\"r\": <EXACTLY what the lab printed>, \"u\": \"<the unit the lab used>\"} }}\nRULES, in order of how badly they bite:\n 1. NEVER convert a value. Write what the lab printed and name its unit. The dashboard converts.\n 2. \"u\" must be a unit LABEL copied EXACTLY from that marker units[] array (e.g. \"mg/L\", \"µmol/L\", \"G/L\").\n    If the lab used a unit not in that list, STOP and say so. Do not improvise a conversion.\n 3. \"<markerId>\" must be an existing id in MARK. If the lab reports something not in MARK, STOP and\n    say so rather than inventing an id — an unknown id is silently ignored.\n 4. Return the WHOLE file. Never a fragment, never a diff.",
  "units": "Each marker has a units[] array of {l, m} or {l, a, b} entries. Convert to the US unit with the entry whose l matches v.u: value = (a !== undefined) ? a*raw + b : raw*m. The first entry is not special; v.u names the unit by its LABEL, never by position.",
  "optimal_ranges": "opt[] and oc are INFERENCES, not lab data. oc is the evidence behind the target: strong = outcome data (RCTs, dose-response vs hard endpoints); moderate = association studies or physiology; weak = convention or industry framing, no outcome data. 3 strong, 29 moderate, 26 weak, 17 with no target at all. A value outside a WEAK band is an opinion, not a finding. A marker with NO opt is deliberate: it means no defensible target exists, and adding one back is a regression, not an improvement.",
  "clin_ranges": "clin[] IS lab data, off the report.",
  "dec": "Which supplements a marker bears on. Many-to-many. Membership does NOT mean the supplement moves it: cystatin C is under Creatine precisely because creatine CANNOT distort it, albumin is under Vitamin D because calcium cannot be corrected without it, selenium is iodine's cofactor, B12/folate are TMG's pathway. The DECS order is deliberate — grouped by primary biomarker domain (hormones/thyroid → lipids/cardio → liver/methylation → kidney/muscle → bone/minerals → aminos → foundational), NOT alphabetical; do not re-sort.",
  "confounds": [
   "Creatine was active at the March 2026 draw. It raises serum creatinine as substrate, not by damaging kidneys, and eGFR is CALCULATED from creatinine so it inherits the error. The eGFR of 61 is not readable as kidney disease. Cystatin C is immune and has never been drawn.",
   "Topical minoxidil appears in no supplement group. That is the finding, not an omission: it is a potassium-channel opener with ~1.4% systemic absorption and no hormonal mechanism. Astaxanthin, lycopene, hyaluronic acid and collagen are absent for the same reason. No blood marker can falsify them."
  ],
  "subject": {
   "sex": "male",
   "height": "187 cm",
   "weight": "80 kg",
   "bodyfat": "~12%",
   "training": "daily resistance",
   "country": "France",
   "diet": "See the DIET tab. Rarely fish; lots of olive oil; mozzarella 100g/meal, 6 eggs/day, potatoes, mushrooms, legumes + whole grains (wild rice / whole-grain pasta), and iodized salt. Huel Black: 90g/day as the pre-workout snack. Its fortification: iodine, vitamin D, zinc, selenium, B12, folate, magnesium, calcium, iron.",
   "supervision": "none"
  },
  "stack": "Moved to the STACK block below — structured, with dose, status, category, meal slot and purchase URL. STACK is the single source of truth for supplements; do not re-list them here.",
  "lifestyle_blocks": "STACK, ROUTINE, CARE and DIET are structured lifestyle data, same contract as the rest of the file: exact, never inferred. STACK is organised in functional categories; most items are status 'planned' — queued for the new protocol, not yet started. STACK.items[].status is one of taking/candidate/stopped/dropped/planned. .when is null (not yet assigned — never guess) OR an array of {at, dose}: one entry per meal slot it's taken at (presnack/brunch/dinner/evening), each carrying the PER-SLOT dose (astaxanthin = [{at:brunch,dose:12mg},{at:dinner,dose:12mg}]; the item's own .dose stays the daily total). Timing lives on the item (.when), not in the categories: cats are functional groups. .dec ties an item to its DECS group (verbatim label) so the dashboard can cross-link; null means no blood marker bears on it (see confounds). An optional .judge string is the readout — the marker or felt endpoint that decides whether a trial-tier (maylater) supplement is working — shown as a 'Judge by:' line under the item. A category's .note is the user's own caveat, shown under the section header; a category with t:null renders HEADERLESS — only its note introduces its items. A DIET meal without .at is a plain food section: no time chip, no supplement slot. A meal item is a string, or {n, info} — in a timed meal card, .info opens behind a hover info-tip on the name: .info is a string (plain caveat) OR a {section: [[label,value],…]} object rendered as a compact nutrition table (Huel Black uses this). ROUTINE times are HH:MM ascending; an entry's .until marks the end of a BLOCK (gym, work) and must be later than its .t; supplements are NOT shown in ROUTINE — they live only on the Diet tab (derived from STACK.when), so the routine just names the meal or event. CARE holds the dental / face protocols, rendered as cards on their own Grooming tab — deliberately NOT hour-by-hour events, they would duplicate. Meal supp lists are NOT stored anywhere: the Diet cards derive them from STACK.when (taking + planned) at render time, with an Evening supps card of its own — one source of truth for timing. DIET.meals[].id doubles as the when-slot key: an item with a when entry {at:'brunch'} belongs to the meal whose id is 'brunch' (slots: presnack/brunch/dinner/evening). In DIET, a '---' item is a course separator (starter / main / dessert), rendered as a gap. DIET.eveningAt stamps the Evening supplements card's time. NEXTDRAW.items is the biomarker list for the next draw — {en, fr} objects (English label + French lab name); the tab renders a two-column table (Marker | Pour le labo (FR)) with a button that copies every row as 'en — fr'. A CARE card may split its items into .groups by cadence (Daily / Weekly / Yearly), same shape as TRAINING groups, OR carry a .schedule instead — a day-indexed weekly grid (days[] with an optional tag + hi chip, sections[] (each an optional .icon: sun/sunset/moon) of rows {n, on:[day names], hi?}, plus notes[]) rendered as a dot-matrix (solid = applied, faint = skipped); the Skincare card (id 'face') uses this and every on-day name must appear in days[]. TRAINING is {cardio, note, cards}: the gym program as Pull / Push / Legs cards, each organised in muscle-group .groups ('Accessory' holds what resists categorising). Every item is {n, sets:[[kg,reps],...]} — one pair per set, kg null = bodyweight, a '+' prefix = added weight, reps may be a duration like '0:30', sets [] = a protocol without logged sets; an optional .info string holds details shown behind an info tip. Copied exactly from the user's workout app; .cardio is the cardio baseline and .note the resistance caveat — the page renders them as labelled Cardio / Resistance sections. Doses write micrograms as mcg, never µg — µ uppercases into M and becomes a 1000x reading error.",
  "never_measured": "26 markers have no value in any draw. Highest value first: cystatin C (settles eGFR outright), ApoB and Lp(a), homocysteine (NAC raises it, TMG lowers it, net never seen), anti-TPO + free T4 (iodine now from iodized salt + fortified Huel, no supplement; Huel spans the historical draws at 90g/day), selenium, copper and zinc (BEFORE starting zinc), omega-3 index.",
  "self_check_before_returning_the_file": [
   "Every markerId in the new draw exists in MARK.",
   "Every \"u\" string appears verbatim in that marker units[] array.",
   "No existing draw was modified, reordered or dropped. Count them: there were 6.",
   "The file still parses: it is window.BLOODWORK = {...}; with the wrapper intact."
  ]
 },
 "CATS": [
  {
   "id": "cbc",
   "t": "Blood count"
  },
  {
   "id": "lipid",
   "t": "Cardiometabolic"
  },
  {
   "id": "renal",
   "t": "Kidney"
  },
  {
   "id": "liver",
   "t": "Liver"
  },
  {
   "id": "other",
   "t": "Muscle & electrolytes"
  },
  {
   "id": "thy",
   "t": "Thyroid"
  },
  {
   "id": "horm",
   "t": "Hormones"
  },
  {
   "id": "iron",
   "t": "Iron"
  },
  {
   "id": "vitmin",
   "t": "Vitamins & minerals"
  }
 ],
 "DECS": [
  "Finasteride (topical) 0.1% - 1mL",
  "Boron 10mg",
  "Ashwagandha 600mg",
  "Omega-3 (2000mg EPA, 1125mg DHA)",
  "AGE garlic 2400mg",
  "NAC 12g",
  "TMG 6g",
  "Curcumin",
  "Creatine 5g",
  "Vitamin D3 10000 IU + K2",
  "Magnesium L-threonate",
  "Glycine 12g + taurine + collagen",
  "Huel"
 ],
 "STACK": {
  "intro": "Everything above 'May add later' is being taken, most of it started around the 2026-07-20 draw — so that draw is a clean baseline, measured before they went in. Huel counts too; it sits in the Diet as food. The parked tier waits for the next set of results. Creatine is the one exception: stopped before the draw so creatinine and eGFR would read clean, restarting shortly.",
  "cats": [
   {"id": "essentials", "t": "Essentials"},
   {"id": "skin", "t": "Skin"},
   {"id": "sport", "t": "Sport"},
   {"id": "maylater", "t": "May add later", "note": "The trial tier — plausible but unproven for me. Each is added alone as a 3-month experiment after the bloodwork, judged by the readout below, then kept, cycled, or (usually) dropped."}
  ],
  "items": [
   {"id": "astax", "name": "Astaxanthin", "dose": "12mg 2x/day", "info": "Photoprotection (raises the UV-burn threshold) plus moisture and elasticity. Not colour — that's beta-carotene's job. 24mg/day, 12mg twice with fat. Above the EU cap but safe to 40mg; held pending proof it helps colour.", "cat": "skin", "status": "taking", "when": [{"at": "brunch", "dose": "12mg"}, {"at": "dinner", "dose": "12mg"}], "url": null, "dec": null},
   {"id": "lyco", "name": "Lycopene", "dose": "15mg 2x/day", "info": "Warm skin tone plus UV photoprotection (10-16mg). Absorption saturates by ~30-40mg, so 30mg (15mg twice with fat) is the ceiling — more just gets excreted. Tomato-derived (LycoBeads) beats synthetic; cooked tomato in olive oil beats raw.", "cat": "skin", "status": "taking", "when": [{"at": "presnack", "dose": "15mg"}, {"at": "dinner", "dose": "15mg"}], "url": "https://www.sunday.de/en/lycopene-capsules.html", "dec": null},
   {"id": "vitd3k2", "name": "Vitamin D3 + K2", "dose": "10000 IU", "info": "Vitamin D repletion; the K2 steers calcium into bone, not arteries. Doubled from 5000 IU on 2026-07-21: the July draw came back at 28 ng/mL, below the lab's own sufficiency floor of 30 ng/mL (75 nmol/L), so 5000 was not enough — likely because daily SPF 50 leaves supplementation doing all the work with almost no cutaneous synthesis. 2 tablets. Above the EFSA/IOM upper limit of 4000 IU (the Endocrine Society ceiling is 10000), so this is titration, NOT a new autopilot: retest 25-OH-D AND calcium at 3 months, and come back down if it lands above 60-70.", "cat": "essentials", "status": "taking", "when": [{"at": "brunch", "dose": "10000 IU"}], "url": "https://www.sunday.de/en/vitamin-d-tablets-5000-iu-plus-k2-mk7-100mcg-xl.html", "dec": "Vitamin D3 10000 IU + K2"},
   {"id": "omega3", "name": "Omega-3", "dose": "2000mg EPA + 1125mg DHA", "info": "EPA-forward dose aimed at skin and inflammation — about double the general-health dose. Algae oil (triglyceride form), cleaner than fish oil and iodine-free. 5 softgels/day = 2000mg EPA + 1125mg DHA, split 1 at the pre-workout snack + 2 at brunch + 2 at dinner, each a meal with fat for absorption. Titrate to your omega-3 index (8-12%).", "cat": "essentials", "status": "taking", "when": [{"at": "presnack", "dose": "400mg EPA + 225mg DHA"}, {"at": "brunch", "dose": "800mg EPA + 450mg DHA"}, {"at": "dinner", "dose": "800mg EPA + 450mg DHA"}], "url": "https://www.sunday.de/en/omega-3-epa-dha-capsules.html", "dec": "Omega-3 (2000mg EPA, 1125mg DHA)"},
   {"id": "collagenc", "name": "Collagen peptides (low-MW)", "dose": "2g", "info": "Low-weight peptides (~500 Da) that signal skin to build its own collagen — the trigger, not the raw material (glycine covers that). 2g with vitamin C. Cosmetic, modest evidence.", "cat": "skin", "status": "taking", "when": [{"at": "brunch", "dose": "2g"}], "url": "https://www.sunday.de/en/collagen-powder-sunglow-luxe-plus-c.html", "dec": "Glycine 12g + taurine + collagen"},
   {"id": "ha", "name": "Hyaluronic acid", "dose": "250mg", "info": "Not absorbed intact (~0.2%) — gut bacteria fragment it into signals for the skin's own HA. 2025 review (7 trials): modest hydration, elasticity and wrinkle gains. 250mg, the trial dose. Cosmetic, gut-flora-dependent.", "cat": "skin", "status": "taking", "when": [{"at": "brunch", "dose": "250mg"}], "url": "https://www.sunday.de/en/hyaluronic-acid-250mg-high-dose-vegan-from-fermentation.html", "dec": null},
   {"id": "mglthr", "name": "Magnesium L-threonate", "judge": "sleep quality — an on-vs-off test by feel or your sleep tracker", "dose": "2040mg", "info": "Brain-penetrant magnesium (147mg elemental), sold for sleep. But the sleep case is thin — you're young and replete (~2× RDA), and its only trials are cognition in older adults. Parked pending your own on/off sleep test.", "cat": "maylater", "status": "planned", "when": [{"at": "evening", "dose": "2040mg"}], "url": "https://www.sunday.fr/magnesium-l-threonate-gelules.html", "dec": "Magnesium L-threonate"},
   {"id": "betacar", "name": "Beta-carotene", "judge": "skin tone — photos in consistent light over a few weeks", "dose": "15mg", "info": "The carotenoid that actually drives golden tone — astaxanthin can't. Parked so you judge astaxanthin + lycopene alone first, then add if the tint's still missing. Algae source (Dunaliella), safer than synthetic (which raised cancer risk only in smokers). 15mg with fat; more for deeper colour, but watch for orange palms.", "cat": "maylater", "status": "planned", "when": null, "url": "https://www.sunday.de/en/beta-carotene-algae-extract-capsules.html", "dec": null},
   {"id": "glycine", "name": "Glycine", "judge": "sleep (solo); or the GlyNAC markers, if paired with NAC", "dose": "12g", "info": "12g is a glutathione/GlyNAC dose (sleep studies use just 3g). Now paired 1:1 with 12g NAC — near the Sekhar efficacy dose for your weight (~8g glycine). Glycine's very safe and cheap, so the slight overshoot is fine.", "cat": "maylater", "status": "planned", "when": null, "url": null, "dec": "Glycine 12g + taurine + collagen"},
   {"id": "nac", "name": "NAC", "judge": "hs-CRP, HOMA-IR, homocysteine and GGT, before vs after 3 months", "dose": "12g", "info": "Glutathione/antioxidant precursor. 12g matches your glycine 1:1 — near the Sekhar GlyNAC dose for your weight (~11g NAC). Raises homocysteine, which the TMG offsets. Parked until the goal and oxidative markers are set.", "cat": "maylater", "status": "planned", "when": null, "url": null, "dec": "NAC 12g"},
   {"id": "tmg", "name": "TMG", "judge": "homocysteine — it exists only to offset NAC's rise", "dose": "6g", "info": "Methyl donor that lowers homocysteine — 6g is the effective dose, sized to offset the homocysteine your 12g NAC raises. Catch: betaine above ~4g can nudge LDL up, so watch it. Pending homocysteine, the number that justifies the loop.", "cat": "maylater", "status": "planned", "when": null, "url": null, "dec": "TMG 6g"},
   {"id": "garlic", "name": "AGE garlic", "judge": "blood pressure and LDL / ApoB", "dose": "2400mg", "info": "Aged garlic extract — modest BP (~5-8 mmHg in hypertensives) and lipid effects, plus slowed coronary plaque. 2400mg is the plaque-trial dose (BP works at 600-1200mg). Parked: the payoff is for elevated BP or CVD risk, not a fit 31-yo — revisit if your lipids or BP give it a job.", "cat": "maylater", "status": "planned", "when": null, "url": null, "dec": "AGE garlic 2400mg"},
   {"id": "curcumin", "name": "Curcumin", "judge": "hs-CRP", "dose": null, "info": "Anti-inflammatory (NF-κB). No dose set on purpose — raw curcumin barely absorbs, so the form (piperine, Meriva, liposomal) matters more than the mg. Parked until an inflammatory marker (hs-CRP) runs high enough to target, then pick a bioavailable form.", "cat": "maylater", "status": "planned", "when": null, "url": null, "dec": "Curcumin"},
   {"id": "creatine", "name": "Creatine", "dose": "5g", "info": "Strength, power, likely cognition. 5g/day, up to 20g on poor-sleep weeks. Saturation-based, so timing's flexible. NOT a trial, unlike the rest of this tier — it is the best-evidenced supplement on the list and was already being taken. It sits here only because it is paused: stopped before the 2026-07-20 draw so creatinine and eGFR would read clean without it, restarting shortly. Back to Sport then.", "cat": "maylater", "status": "planned", "when": [{"at": "presnack", "dose": "5g"}], "url": "https://amzn.eu/d/09MG0JOC", "dec": "Creatine 5g"},
   {"id": "taurine", "name": "Taurine", "judge": "nothing measurable at your age — a theory bet, not a testable one", "dose": "5g", "info": "5g is a longevity dose (exercise studies use 1-3g), extrapolated from the 2023 mouse-lifespan paper. Human evidence is observational, not trial — cheap and safe to 10g, but unproven. Parked until human data or a clear reason.", "cat": "maylater", "status": "planned", "when": null, "url": null, "dec": "Glycine 12g + taurine + collagen"},
   {"id": "boron", "name": "Boron", "judge": "free testosterone and SHBG", "dose": "10mg", "info": "Lowers SHBG, so more testosterone stays free (and drops estradiol). 10mg is the studied dose (free-T +28% over a week). Modest, and unclear at your age with normal T — parked until T/SHBG bloods justify it.", "cat": "maylater", "status": "planned", "when": null, "url": null, "dec": "Boron 10mg"},
   {"id": "ashwa", "name": "Ashwagandha", "judge": "perceived stress and sleep; testosterone / cortisol on bloods", "dose": "600mg", "info": "Adaptogen — lowers cortisol and stress, improves sleep, and small RCTs show recovery, strength and modest testosterone bumps in trained men. 600mg/day of a standardised root extract (KSM-66). Catch: it can nudge thyroid hormones, so don't start before the baseline draw — it'd confound TSH/T4; rare liver reports too, so cycle it 8-12 weeks on.", "cat": "maylater", "status": "planned", "when": null, "url": null, "dec": "Ashwagandha 600mg"}
  ]
 },
 "ROUTINE": [
  {"t": "07:00", "do": "10min run, sunlight, hot/cold shower"},
  {"t": "07:15", "do": "Pre-workout snack"},
  {"t": "08:00", "until": "10:00", "do": "Gym - phone stays OFF"},
  {"t": "10:00", "until": "10:30", "do": "Brunch"},
  {"t": "10:30", "until": "16:30", "do": "Work"},
  {"t": "16:30", "until": "17:00", "do": "Dinner"},
  {"t": "21:00", "until": "21:30", "do": "Shower + floss + skincare"},
  {"t": "21:30", "do": "Bedtime"},
  {"t": "22:00", "do": "Lights out"}
 ],
 "CARE": [
  {"id": "face", "t": "Skincare",
   "groups": [
    {"t": "Morning", "icon": "sun", "items": [
     {"n": "Serum - Vit C 15% + Ferulic Acid + Vit E", "url": "https://geekandgorgeous.com/products/c-glow"},
     {"n": "Serum - Niacinamide 10% (B3) + Zinc PCA + Sarcosine", "url": "https://geekandgorgeous.com/products/b-bomb"},
     {"n": "Moisturizer - Ceramides + Cholesterol", "url": "https://www.cerave.fr/nos-produits/hydratants/creme-hydratante-visage"},
     {"n": "SPF 50", "url": "https://roundlab.com/en-ca/products/birch-moisturizing-uv-sunscreen?variant=43645688021206"},
     "Finasteride 0.1% + Minoxidil 5%"
    ]},
    {"t": "Before sleep", "icon": "moon", "items": [
     "Retinal 0.2%",
     {"n": "Moisturizer - Ceramides + Cholesterol", "url": "https://www.cerave.fr/nos-produits/hydratants/creme-hydratante-visage"},
     "Body lotion 12% AHA",
     {"n": "Matrixyl 10% + HA", "url": "https://theordinary.com/fr-fr/matrixyl-10-ha-serum-100431.html"},
     {"n": "Copper Peptides 1%", "url": "https://theordinary.com/fr-fr/sérum-multi-peptides-peptides-de-cuivre-1-100625.html", "info": "Do not apply on Glycolic Acid days"},
     "Petroleum",
     "Finasteride 0.1% + Minoxidil 5%"
    ]}
   ],
   "notes": [
    "Glycolic 7% once a week instead of Retinal",
    "Microneedling → Infadolan: face 1mm weekly, up to 2mm monthly; scalp 0.75mm weekly."
   ]},
  {"id": "dental", "t": "Dental", "groups": [
   {"t": "Daily", "items": [
    "Water jet + toothbrush 2-3x/day",
    "Alternate thread floss & interdental brushes"
   ]},
   {"t": "Yearly", "items": [
    "Dental scaling 2-3x/year",
    "Carbamide peroxide 10-15% - 2x/year, applied with custom dental tray"
   ]}
  ]}
 ],
 "TRAINING": {
  "cardio": "One 30' HIT per week - mostly ~5k run.\nStriving for 3 sessions when business will be automated.",
  "note": "Weights and reps are approximations and may vary dramatically based on the machine used",
  "cards": [
  {"id": "pull", "t": "Pull", "groups": [
   {"t": "Back", "items": [
    {"n": "Chin up", "sets": [["+30",5],["+30",5],["+30",5]]},
    {"n": "Explosive pull up", "sets": [[null,2],[null,2],[null,2]]},
    {"n": "Face pull", "sets": [[40,10],[40,10]]},
    {"n": "Single arm row", "sets": [[40,8],[40,8]]},
    {"n": "Back extension", "sets": [[40,12],[40,12]]}
   ]},
   {"t": "Biceps", "items": [
    {"n": "Bicep curl", "sets": [[20,8],[20,8]]},
    {"n": "Hammer curl", "sets": [[20,6],[20,6]]},
    {"n": "Preacher curl", "sets": [[40,12],[40,12]]}
   ]},
   {"t": "Traps & neck", "items": [
    {"n": "Shrug", "sets": [[40,50],[40,50]]},
    {"n": "Neck extension", "sets": [[20,10],[20,10]]}
   ]},
   {"t": "Accessory", "items": [
    {"n": "Pull-over", "sets": [[10,10],[10,10]]},
    {"n": "Trap-3 raise", "sets": [[10,10],[10,10]]},
    {"n": "One arm hang", "sets": [[null,"0:30"],[null,"0:30"]]}
   ]}
  ]},
  {"id": "push", "t": "Push", "groups": [
   {"t": "Warm-up", "items": [
    {"n": "Shoulder prep", "info": "Figure 8, push-ups, ext. rotations w/ band or dumbbell, skin the cat, dislocates, gymnast seated stretch", "sets": []}
   ]},
   {"t": "Shoulders", "items": [
    {"n": "Overhead press", "sets": [[50,5],[50,5],[50,5]]},
    {"n": "Lateral raise", "sets": [[12,10],[12,10],[12,10]]},
    {"n": "Machine deltoid raise", "sets": [[50,5],[50,5],[50,5]]},
    {"n": "Rear deltoid", "sets": [[20,15],[20,15],[20,15]]}
   ]},
   {"t": "Triceps", "items": [
    {"n": "Tricep pushdown", "sets": [[25,20],[25,20]]},
    {"n": "Overhead tricep ext.", "sets": [[20,10],[20,10]]}
   ]},
   {"t": "Chest", "items": [
    {"n": "Incline dumbbell press", "sets": [[30,6],[30,6]]},
    {"n": "Machine incline press", "sets": [[80,6],[80,6]]},
    {"n": "Chest fly", "sets": [[25,15],[25,15]]}
   ]}
  ]},
  {"id": "legs", "t": "Legs", "groups": [
   {"t": "Calves", "items": [
    {"n": "Seated calf raise", "sets": [[80,20],[80,20],[80,20]]},
    {"n": "Standing calf raise", "sets": [[200,20],[200,20],[200,20]]}
   ]},
   {"t": "Quads", "items": [
    {"n": "Shrimp squat", "sets": [[null,5],[null,5],[null,5],[null,5],[null,5],[null,5]]},
    {"n": "Machine squat", "sets": [[80,8],[80,8],[80,8]]},
    {"n": "Leg extension", "sets": [[80,12],[80,12]]}
   ]},
   {"t": "Glutes", "items": [
    {"n": "Standing abduction", "sets": [[100,20],[100,20],[100,20]]},
    {"n": "Hip thrust", "sets": [[160,10],[160,10],[160,10]]},
    {"n": "Hip abduction", "sets": [[100,15],[100,15],[100,15]]}
   ]},
   {"t": "Hamstrings & groin", "items": [
    {"n": "Nordic curl", "sets": [[20,8],[20,8]]},
    {"n": "Lying leg curl", "sets": [[50,12],[50,12]]},
    {"n": "Hip adduction", "sets": [[80,12],[80,12]]}
   ]},
   {"t": "Core", "items": [
    {"n": "Psoas knee raise", "sets": [[16,10],[16,10]]},
    {"n": "Crunch", "sets": [[20,12],[20,12]]}
   ]}
  ]}
  ]
 },
 "NEXTDRAW": {
  "items": [
   {"en": "Cystatin C", "fr": "Cystatine C"},
   {"en": "Creatinine + eGFR", "fr": "Créatinine + DFG"},
   {"en": "Urea (BUN)", "fr": "Urée"},
   {"en": "Urinalysis (dipstick)", "fr": "Bandelette urinaire"},
   {"en": "ApoB", "fr": "Apolipoprotéine B (ApoB)"},
   {"en": "Lp(a)", "fr": "Lipoprotéine (a) [Lp(a)]"},
   {"en": "Lipid panel (total, LDL, HDL, triglycerides)", "fr": "Bilan lipidique (cholestérol total, LDL, HDL, triglycérides)"},
   {"en": "hs-CRP", "fr": "CRP ultrasensible"},
   {"en": "Homocysteine", "fr": "Homocystéine"},
   {"en": "TSH", "fr": "TSH"},
   {"en": "Free T4", "fr": "T4 libre (FT4)"},
   {"en": "Free T3", "fr": "T3 libre (FT3)"},
   {"en": "Anti-TPO antibodies", "fr": "Anticorps anti-TPO"},
   {"en": "Thyroglobulin antibodies (anti-Tg)", "fr": "Anticorps anti-thyroglobuline (anti-Tg)"},
   {"en": "Testosterone (total + free)", "fr": "Testostérone totale et libre"},
   {"en": "DHT (dihydrotestosterone)", "fr": "DHT (dihydrotestostérone)"},
   {"en": "SHBG", "fr": "SHBG"},
   {"en": "Estradiol", "fr": "Œstradiol (E2)"},
   {"en": "LH", "fr": "LH (hormone lutéinisante)"},
   {"en": "FSH", "fr": "FSH (hormone folliculo-stimulante)"},
   {"en": "Prolactin", "fr": "Prolactine"},
   {"en": "DHEA-S", "fr": "SDHEA (sulfate de DHEA)"},
   {"en": "IGF-1", "fr": "IGF-1 (somatomédine C)"},
   {"en": "Cortisol (morning)", "fr": "Cortisol (matinal, 8h)"},
   {"en": "25-OH vitamin D", "fr": "Vitamine D (25-OH)"},
   {"en": "Omega-3 index", "fr": "Index oméga-3"},
   {"en": "Vitamin B12", "fr": "Vitamine B12"},
   {"en": "Folate", "fr": "Folates (B9)"},
   {"en": "Selenium", "fr": "Sélénium"},
   {"en": "Zinc", "fr": "Zinc"},
   {"en": "Copper", "fr": "Cuivre"},
   {"en": "Calcium", "fr": "Calcium"},
   {"en": "PTH (parathyroid hormone)", "fr": "Parathormone (PTH)"},
   {"en": "Magnesium (serum)", "fr": "Magnésium sérique"},
   {"en": "Ferritin", "fr": "Ferritine"},
   {"en": "Serum iron", "fr": "Fer sérique"},
   {"en": "TIBC (total iron-binding capacity)", "fr": "Capacité totale de fixation du fer (CTF)"},
   {"en": "Transferrin saturation (TSAT)", "fr": "Coefficient de saturation de la transferrine (CST)"},
   {"en": "Fasting glucose", "fr": "Glycémie à jeun"},
   {"en": "HbA1c", "fr": "Hémoglobine glyquée (HbA1c)"},
   {"en": "Fasting insulin", "fr": "Insuline à jeun"},
   {"en": "Uric acid", "fr": "Acide urique"},
   {"en": "Ionogram (Na, K, Cl, bicarbonate)", "fr": "Ionogramme sanguin (Na, K, Cl, bicarbonates)"},
   {"en": "CBC", "fr": "NFS (numération formule sanguine)"},
   {"en": "Liver panel (ALT, AST, GGT)", "fr": "Bilan hépatique (ASAT, ALAT, GGT)"},
   {"en": "Alkaline phosphatase (ALP)", "fr": "Phosphatases alcalines (PAL)"},
   {"en": "Total bilirubin", "fr": "Bilirubine totale"},
   {"en": "Albumin", "fr": "Albumine"},
   {"en": "Total protein", "fr": "Protéines totales"},
   {"en": "Creatine kinase (CK)", "fr": "Créatine kinase (CPK)"}
  ]
 },
 "DIET": {
  "eveningAt": "21:00",
  "meals": [
   {"id": "presnack", "t": "Pre-workout snack", "at": "07:15", "items": [
    {"n": "Huel Black", "amt": "90 g", "info": {
     "Per 90g": [["Energy","400 kcal","20%"],["Protein","40 g","80%"],["Fat","17 g","24%"],["– saturates","4.0 g","20%"],["– monounsat.","3.8 g"],["– PUFA","9.4 g"],["Carbs","19 g","7%"],["– sugars","1.6 g","2%"],["Fibre","8.4 g"],["Salt","0.8 g","13%"]],
     "Vitamins": [["A","180 mcg","23%"],["D","160 IU","80%"],["E","4.0 mg","33%"],["K","39 mcg","52%"],["C","60 mg","75%"],["Thiamin","0.22 mg","20%"],["Riboflavin","0.28 mg","20%"],["Niacin","3.2 mg","20%"],["B6","0.28 mg","20%"],["Pantoth.","1.2 mg","20%"],["Folate","80 mcg","40%"],["B12","0.80 mcg","32%"],["Biotin","12 mcg","24%"]],
     "Minerals": [["Calcium","240 mg","30%"],["Phosphorus","360 mg","51%"],["Potassium","700 mg","35%"],["Chloride","164 mg","21%"],["Magnesium","88 mg","23%"],["Iron","9.0 mg","64%"],["Zinc","4.6 mg","46%"],["Copper","0.50 mg","50%"],["Manganese","0.90 mg","45%"],["Selenium","33 mcg","60%"],["Iodine","30 mcg","20%"],["Chromium","12 mcg","30%"],["Molybdenum","37 mcg","74%"]],
     "Other": [["Choline","120 mg"],["Omega-3 (ALA)","4.0 g"],["Omega-6","4.2 g"],["MCT","1.1 g"],["Caffeine","68 mg"],["Green tea","130 mg"],["Lutein","1.6 mg"],["Zeaxanthin","0.1 mg"],["B. coagulans","200 M"]]
    }},
    {"n": "Bananas", "amt": "2", "info": {"Per 2 (~236 g)":[["Energy","210 kcal","11%"],["Carbs","54 g","21%"],["– sugars","29 g","32%"],["Fibre","6 g"],["Protein","2.6 g","5%"]],"Standouts":[["Potassium","845 mg","42%"],["B6","0.9 mg","64%"],["Vit C","20 mg","25%"],["Magnesium","64 mg","17%"]]}}
   ]},
   {"id": "brunch", "t": "Brunch", "at": "10:00", "items": [
    {"n": "Coffee", "amt": "1 cup", "info": {"Per cup (~240 ml)":[["Energy","2 kcal"],["Caffeine","~95 mg"],["Potassium","116 mg","6%"],["Chlorogenic acids","~200 mg"]]}},
    "---",
    {"n": "Mozzarella di bufala", "amt": "100 g", "info": {"Per 100 g":[["Energy","275 kcal","14%"],["Protein","17 g","34%"],["Fat","22 g","31%"],["– saturates","15 g","75%"],["Salt","0.5 g","8%"]],"Minerals":[["Calcium","350 mg","44%"],["Phosphorus","350 mg","50%"],["Zinc","2 mg","20%"]]}},
    {"n": "Cherry tomatoes", "amt": "150 g", "info": {"Per 150 g": [["Energy","27 kcal","1%"],["Carbs","6 g","2%"],["– sugars","4 g","4%"],["Fibre","1.8 g"],["Protein","1.4 g","3%"]], "Standouts": [["Vit C","21 mg","26%"],["Potassium","355 mg","18%"],["Lycopene","~4 mg"],["Vit K","12 mcg","16%"],["Vit A","63 mcg","8%"]]}},
    "---",
    {"n": "Eggs", "amt": "6", "info": {"Per 6 (~300 g)":[["Energy","465 kcal","23%"],["Protein","38 g","75%"],["Fat","33 g","47%"],["– saturates","10 g","49%"]],"Micronutrients":[["Choline","885 mg"],["Selenium","90 mcg","164%"],["Vit D","240 IU","120%"],["B12","3 mcg","120%"],["Vit A","480 mcg","60%"],["Riboflavin","1.2 mg","86%"],["Folate","143 mcg","71%"]]}},
    {"n": "Air-fried potatoes", "amt": "~300 g", "info": {"Prep":[["Cooked in","duck grease"]],"Per ~300 g":[["Energy","395 kcal","20%"],["Carbs","58 g","22%"],["Fibre","5 g"],["Fat","15 g","21%"],["– saturates","5 g","25%"]],"Standouts":[["Potassium","1200 mg","60%"],["Vit C","30 mg","38%"],["B6","0.9 mg","64%"]]}},
    {"n": "Mushrooms (cooked)", "amt": "~150 g", "info": {"Per ~150 g (cooked)":[["Energy","45 kcal","2%"],["Carbs","6 g","2%"],["Fibre","3 g"],["Protein","4 g","8%"]],"Standouts":[["Ergothioneine","~3 mg"],["Copper","0.5 mg","50%"],["Pantothenic acid","2 mg","33%"],["Selenium","14 mcg","25%"],["Potassium","400 mg","20%"]]}},
    {"n": "Olive oil", "amt": "10 mL", "info": {"Per 10 mL":[["Energy","80 kcal","4%"],["Fat","9 g","13%"],["– monounsat.","7 g"],["Vit E","1 mg","10%"]]}},
    "---",
    {"n": "Fruit (apple, pear, peach…)", "amt": "~150 g", "info": {"Per piece (~150 g)":[["Energy","80 kcal","4%"],["Carbs","20 g","8%"],["– sugars","15 g","17%"],["Fibre","3 g"],["Vit C","7 mg","9%"],["Potassium","180 mg","9%"]]}},
    {"n": "Nuts", "amt": "~15 g", "info": {"Mix":[["Walnut","6g"],["Almond","5g"],["Pistachio","4g"]],"Per ~15 g":[["Energy","90 kcal","5%"],["Protein","3 g","6%"],["Fat","8 g","11%"],["Fibre","1.5 g"]],"Standouts":[["Omega-3 (ALA)","0.6 g"],["Vitamin E","1.3 mg","11%"],["Magnesium","28 mg","7%"]]}},
    {"n": "Dark chocolate", "amt": "~10 g", "info": {"Type":[["Cocoa","85%"],["Origin","Madagascar"]],"Per ~10 g":[["Energy","60 kcal","3%"],["Fat","5 g","7%"],["– saturates","3 g","14%"],["Carbs","2 g","1%"],["Fibre","1 g"]],"Minerals":[["Magnesium","23 mg","6%"],["Iron","1.1 mg","8%"],["Copper","0.2 mg","18%"],["Manganese","0.2 mg","10%"]]}}
   ]},
   {"id": "dinner", "t": "Dinner", "at": "16:30", "items": [
    {"n": "Cherry tomatoes", "amt": "150 g", "info": {"Per 150 g": [["Energy","27 kcal","1%"],["Carbs","6 g","2%"],["– sugars","4 g","4%"],["Fibre","1.8 g"],["Protein","1.4 g","3%"]], "Standouts": [["Vit C","21 mg","26%"],["Potassium","355 mg","18%"],["Lycopene","~4 mg"],["Vit K","12 mcg","16%"],["Vit A","63 mcg","8%"]]}},
    "---",
    {"n": "Wild rice or whole-grain pasta", "amt": "~75 g", "info": {"Per ~75 g cooked":[["Energy","90 kcal","5%"],["Carbs","19 g","7%"],["Protein","4 g","8%"],["Fibre","2 g"]]}},
    {"n": "Legumes (lentils, beans...)", "amt": "~75 g", "info": {"Per ~75 g cooked":[["Energy","95 kcal","5%"],["Carbs","17 g","7%"],["Protein","7 g","14%"],["Fibre","6 g"]],"Standouts":[["Folate","120 mcg","60%"],["Iron","2 mg","14%"],["Potassium","270 mg","14%"]]}},
    {"n": "Olive oil", "amt": "50 mL", "info": {"Per 50 mL":[["Energy","405 kcal","20%"],["Fat","46 g","66%"],["– monounsat.","34 g"],["– saturates","6 g","30%"],["Vit E","6 mg","50%"]]}},
    {"n": "Ground beef or chicken", "amt": "~200 g", "info": {"Ground beef (~200 g)":[["Energy","500 kcal","25%"],["Protein","40 g","80%"],["Fat","35 g","50%"],["– saturates","14 g","70%"]],"Minerals":[["Iron","5 mg","36%"],["Zinc","10 mg","100%"],["B12","5 mcg","200%"],["Selenium","30 mcg","55%"]]}},
    {"n": "Frozen vegetables", "amt": "~100 g", "info": {"Per ~100 g":[["Energy","35 kcal","2%"],["Carbs","6 g","2%"],["Fibre","3 g"],["Protein","2 g","4%"]],"Vitamins":[["K","25 mcg","33%"],["Folate","40 mcg","20%"],["C","15 mg","19%"],["A","150 mcg","19%"]]}},
    "---",
    {"n": "Kiwis", "amt": "2", "info": {"Per 2 (~140 g)":[["Energy","85 kcal","4%"],["Carbs","20 g","8%"],["– sugars","13 g","14%"],["Fibre","4 g"]],"Standouts":[["Vit C","130 mg","163%"],["Vit K","55 mcg","73%"],["Potassium","430 mg","22%"],["Vit E","2 mg","17%"]]}},
    {"n": "Nuts", "amt": "~15 g", "info": {"Mix":[["Walnut","6g"],["Almond","5g"],["Pistachio","4g"]],"Per ~15 g":[["Energy","90 kcal","5%"],["Protein","3 g","6%"],["Fat","8 g","11%"],["Fibre","1.5 g"]],"Standouts":[["Omega-3 (ALA)","0.6 g"],["Vitamin E","1.3 mg","11%"],["Magnesium","28 mg","7%"]]}},
    {"n": "Dark chocolate", "amt": "~10 g", "info": {"Type":[["Cocoa","85%"],["Origin","Madagascar"]],"Per ~10 g":[["Energy","60 kcal","3%"],["Fat","5 g","7%"],["– saturates","3 g","14%"],["Carbs","2 g","1%"],["Fibre","1 g"]],"Minerals":[["Magnesium","23 mg","6%"],["Iron","1.1 mg","8%"],["Copper","0.2 mg","18%"],["Manganese","0.2 mg","10%"]]}}
   ]}
  ]
 },
 "MARK": [
  {
   "id": "vitd",
   "cat": "vitmin",
   "dec": [
    "Vitamin D3 10000 IU + K2",
    "Boron 10mg",
    "Huel"
   ],
   "en": "Vitamin D (25-OH)",
   "fr": "Vitamine D (25-OH)",
   "us": "ng/mL",
   "units": [
    {
     "l": "nmol/L",
     "m": 0.4006
    },
    {
     "l": "ng/mL",
     "m": 1
    }
   ],
   "clin": [
    30,
    100
   ],
   "opt": [
    30,
    50
   ],
   "oc": "weak",
   "axis": [
    0,
    120
   ]
  },
  {
   "id": "cacorr",
   "cat": "vitmin",
   "calc": "DERIVED, never stored: ca − (alb in g/dL − 4.0). Computed at load from the same draw's calcium and albumin — see derive() in index.html. The coefficient is the SOURCE LAB'S (1.0 mg/L per g/L of albumin), not Payne's 0.02 mmol/L, so the figure reproduces what the lab printed rather than disagreeing with the report a clinician is holding. NOT COMPUTED WHEN ALBUMIN EXCEEDS 40 g/L (4.0 g/dL) — the source lab's own rule, printed verbatim on the 2022 report: 'Calcium corrigé non indiqué car albumine >40 g/L'. Above that the correction subtracts a large (albumin − 4) from a calcium that needed no correction, turning a normal result into a falsely low one. Every draw here that measured albumin measured it above 40 (52.9 g/L in 2022, 51 in July 2026), so this row is expected to be EMPTY and that emptiness is the answer, not a gap: for this person, corrected calcium is not indicated. Read the measured calcium instead.",
   "en": "Corrected calcium",
   "fr": "Calcium corrigé",
   "us": "mg/dL",
   "units": [
    {
     "l": "mmol/L",
     "m": 4.008
    },
    {
     "l": "mg/L",
     "m": 0.1
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    8.6,
    10.2
   ],
   "axis": [
    8,
    11
   ]
  },
  {
   "id": "ca",
   "cat": "vitmin",
   "dec": [
    "Vitamin D3 10000 IU + K2",
    "Huel"
   ],
   "en": "Calcium",
   "fr": "Calcium (calcémie)",
   "us": "mg/dL",
   "units": [
    {
     "l": "mmol/L",
     "m": 4.008
    },
    {
     "l": "mg/L",
     "m": 0.1
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    8.6,
    10.2
   ],
   "opt": [
    8.8,
    10
   ],
   "oc": "strong",
   "axis": [
    8,
    11
   ]
  },
  {
   "id": "pth",
   "cat": "vitmin",
   "dec": [
    "Vitamin D3 10000 IU + K2"
   ],
   "en": "Parathyroid hormone",
   "fr": "Parathormone (PTH)",
   "us": "pg/mL",
   "units": [
    {
     "l": "pg/mL",
     "m": 1
    },
    {
     "l": "ng/L",
     "m": 1
    },
    {
     "l": "pmol/L",
     "m": 9.43
    }
   ],
   "clin": [
    15,
    65
   ],
   "opt": [
    20,
    50
   ],
   "oc": "moderate",
   "axis": [
    0,
    90
   ]
  },
  {
   "id": "tsh",
   "cat": "thy",
   "dec": [
    "Huel",
    "Ashwagandha 600mg"
   ],
   "en": "TSH",
   "fr": "TSH",
   "us": "µIU/mL",
   "units": [
    {
     "l": "mUI/L",
     "m": 1
    }
   ],
   "clin": [
    0.4,
    4
   ],
   "opt": [
    0.5,
    2.5
   ],
   "oc": "moderate",
   "axis": [
    0,
    6
   ]
  },
  {
   "id": "ft4",
   "cat": "thy",
   "dec": [
    "Ashwagandha 600mg"
   ],
   "en": "Free T4",
   "fr": "T4 libre (FT4)",
   "us": "ng/dL",
   "units": [
    {
     "l": "pmol/L",
     "m": 0.0777
    },
    {
     "l": "ng/dL",
     "m": 1
    }
   ],
   "clin": [
    0.8,
    1.8
   ],
   "opt": [
    1,
    1.5
   ],
   "oc": "moderate",
   "axis": [
    0.4,
    2.2
   ]
  },
  {
   "id": "atpo",
   "cat": "thy",
   "en": "Anti-TPO antibodies",
   "fr": "Anticorps anti-TPO",
   "us": "IU/mL",
   "units": [
    {
     "l": "UI/mL",
     "m": 1
    }
   ],
   "clin": [
    0,
    35
   ],
   "axis": [
    0,
    80
   ]
  },
  {
   "id": "hcy",
   "cat": "vitmin",
   "dec": [
    "NAC 12g",
    "TMG 6g"
   ],
   "en": "Homocysteine",
   "fr": "Homocystéine",
   "us": "µmol/L",
   "units": [
    {
     "l": "µmol/L",
     "m": 1
    }
   ],
   "clin": [
    0,
    15
   ],
   "opt": [
    0,
    9
   ],
   "oc": "moderate",
   "axis": [
    0,
    20
   ]
  },
  {
   "id": "sel",
   "cat": "vitmin",
   "dec": [
    "Huel"
   ],
   "en": "Selenium",
   "fr": "Sélénium",
   "us": "µg/L",
   "units": [
    {
     "l": "µmol/L",
     "m": 78.96
    },
    {
     "l": "µg/L",
     "m": 1
    }
   ],
   "clin": [
    70,
    150
   ],
   "opt": [
    100,
    130
   ],
   "oc": "moderate",
   "axis": [
    40,
    200
   ]
  },
  {
   "id": "o3",
   "cat": "vitmin",
   "dec": [
    "Omega-3 (2000mg EPA, 1125mg DHA)"
   ],
   "en": "Omega-3 index",
   "fr": "(OmegaQuant, hors labo FR)",
   "us": "%",
   "units": [
    {
     "l": "%",
     "m": 1
    }
   ],
   "clin": [
    4,
    12
   ],
   "opt": [
    8,
    12
   ],
   "oc": "moderate",
   "axis": [
    0,
    14
   ]
  },
  {
   "id": "ferr",
   "cat": "iron",
   "dec": [
    "Curcumin",
    "Huel"
   ],
   "en": "Ferritin",
   "fr": "Ferritine",
   "us": "ng/mL",
   "units": [
    {
     "l": "µg/L",
     "m": 1
    }
   ],
   "clin": [
    30,
    400
   ],
   "opt": [
    50,
    150
   ],
   "oc": "moderate",
   "axis": [
    0,
    300
   ]
  },
  {
   "id": "zn",
   "cat": "vitmin",
   "dec": [
    "Huel"
   ],
   "en": "Zinc",
   "fr": "Zinc",
   "us": "µg/dL",
   "units": [
    {
     "l": "µmol/L",
     "m": 6.538
    },
    {
     "l": "µg/dL",
     "m": 1
    }
   ],
   "clin": [
    70,
    120
   ],
   "opt": [
    80,
    110
   ],
   "oc": "weak",
   "axis": [
    50,
    140
   ]
  },
  {
   "id": "cu",
   "cat": "vitmin",
   "en": "Copper",
   "fr": "Cuivre sérique",
   "us": "µg/dL",
   "units": [
    {
     "l": "µmol/L",
     "m": 6.354
    },
    {
     "l": "µg/dL",
     "m": 1
    }
   ],
   "clin": [
    70,
    140
   ],
   "opt": [
    80,
    120
   ],
   "oc": "moderate",
   "axis": [
    40,
    180
   ]
  },
  {
   "id": "b12",
   "cat": "vitmin",
   "dec": [
    "TMG 6g",
    "Huel"
   ],
   "en": "Vitamin B12",
   "fr": "Vitamine B12",
   "us": "pg/mL",
   "units": [
    {
     "l": "pmol/L",
     "m": 1.355
    },
    {
     "l": "pg/mL",
     "m": 1
    }
   ],
   "clin": [
    200,
    900
   ],
   "opt": [
    400,
    900
   ],
   "oc": "moderate",
   "axis": [
    100,
    1000
   ]
  },
  {
   "id": "fol",
   "cat": "vitmin",
   "dec": [
    "TMG 6g",
    "Huel"
   ],
   "en": "Folate",
   "fr": "Folates (vitamine B9)",
   "us": "ng/mL",
   "units": [
    {
     "l": "nmol/L",
     "m": 0.4413
    },
    {
     "l": "ng/mL",
     "m": 1
    }
   ],
   "clin": [
    3,
    17
   ],
   "opt": [
    6,
    17
   ],
   "oc": "moderate",
   "axis": [
    0,
    20
   ]
  },
  {
   "id": "crea",
   "cat": "renal",
   "dec": [
    "Creatine 5g"
   ],
   "en": "Creatinine",
   "fr": "Créatinine",
   "us": "mg/dL",
   "units": [
    {
     "l": "µmol/L",
     "m": 0.01131
    },
    {
     "l": "mg/L",
     "m": 0.1
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    0.7,
    1.3
   ],
   "opt": [
    0.7,
    1.2
   ],
   "oc": "moderate",
   "axis": [
    0.4,
    1.8
   ]
  },
  {
   "id": "cysc",
   "cat": "renal",
   "dec": [
    "Creatine 5g"
   ],
   "en": "Cystatin C",
   "fr": "Cystatine C",
   "us": "mg/L",
   "units": [
    {
     "l": "mg/L",
     "m": 1
    }
   ],
   "clin": [
    0.5,
    1
   ],
   "opt": [
    0.5,
    0.9
   ],
   "oc": "moderate",
   "axis": [
    0.3,
    1.4
   ]
  },
  {
   "id": "egfr",
   "cat": "renal",
   "dec": [
    "Creatine 5g"
   ],
   "en": "eGFR",
   "fr": "DFG estimé (CKD-EPI)",
   "us": "mL/min",
   "units": [
    {
     "l": "mL/min/1.73m²",
     "m": 1
    }
   ],
   "clin": [
    60,
    140
   ],
   "opt": [
    90,
    140
   ],
   "oc": "moderate",
   "axis": [
    40,
    140
   ]
  },
  {
   "id": "urea",
   "cat": "renal",
   "dec": [
    "Creatine 5g",
    "Glycine 12g + taurine + collagen"
   ],
   "en": "Urea (BUN)",
   "fr": "Urée",
   "us": "mg/dL",
   "units": [
    {
     "l": "mmol/L",
     "m": 2.801
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    7,
    20
   ],
   "opt": [
    7,
    18
   ],
   "oc": "weak",
   "axis": [
    0,
    30
   ]
  },
  {
   "id": "tg",
   "cat": "lipid",
   "dec": [
    "Omega-3 (2000mg EPA, 1125mg DHA)"
   ],
   "en": "Triglycerides",
   "fr": "Triglycérides",
   "us": "mg/dL",
   "units": [
    {
     "l": "g/L",
     "m": 100
    },
    {
     "l": "mmol/L",
     "m": 88.57
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    0,
    150
   ],
   "opt": [
    0,
    90
   ],
   "oc": "strong",
   "axis": [
    0,
    200
   ]
  },
  {
   "id": "apob",
   "cat": "lipid",
   "en": "ApoB",
   "fr": "Apolipoprotéine B",
   "us": "mg/dL",
   "units": [
    {
     "l": "g/L",
     "m": 100
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    0,
    130
   ],
   "opt": [
    0,
    80
   ],
   "oc": "moderate",
   "axis": [
    0,
    160
   ]
  },
  {
   "id": "lpa",
   "cat": "lipid",
   "en": "Lipoprotein(a)",
   "fr": "Lipoprotéine (a)",
   "us": "nmol/L",
   "units": [
    {
     "l": "nmol/L",
     "m": 1
    },
    {
     "l": "mg/dL",
     "m": 2.15
    }
   ],
   "clin": [
    0,
    105
   ],
   "opt": [
    0,
    62
   ],
   "oc": "moderate",
   "axis": [
    0,
    150
   ]
  },
  {
   "id": "nonhdl",
   "cat": "lipid",
   "dec": [
    "AGE garlic 2400mg"
   ],
   "en": "Non-HDL cholesterol",
   "fr": "NON-HDL Cholestérol",
   "us": "mg/dL",
   "units": [
    {
     "l": "g/L",
     "m": 100
    },
    {
     "l": "mmol/L",
     "m": 38.67
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    0,
    160
   ],
   "opt": [
    0,
    130
   ],
   "oc": "moderate",
   "axis": [
    0,
    200
   ]
  },
  {
   "id": "hscrp",
   "cat": "lipid",
   "dec": [
    "Omega-3 (2000mg EPA, 1125mg DHA)",
    "Curcumin"
   ],
   "en": "hs-CRP",
   "fr": "CRP ultrasensible",
   "us": "mg/L",
   "units": [
    {
     "l": "mg/L",
     "m": 1
    }
   ],
   "clin": [
    0,
    3
   ],
   "opt": [
    0,
    1
   ],
   "oc": "strong",
   "axis": [
    0,
    6
   ]
  },
  {
   "id": "ldl",
   "cat": "lipid",
   "dec": [
    "Omega-3 (2000mg EPA, 1125mg DHA)",
    "AGE garlic 2400mg"
   ],
   "en": "LDL cholesterol",
   "fr": "LDL-Cholestérol",
   "us": "mg/dL",
   "units": [
    {
     "l": "g/L",
     "m": 100
    },
    {
     "l": "mmol/L",
     "m": 38.67
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    0,
    130
   ],
   "opt": [
    0,
    100
   ],
   "oc": "moderate",
   "axis": [
    0,
    190
   ]
  },
  {
   "id": "hdl",
   "cat": "lipid",
   "dec": [
    "Omega-3 (2000mg EPA, 1125mg DHA)",
    "AGE garlic 2400mg"
   ],
   "en": "HDL cholesterol",
   "fr": "HDL-Cholestérol",
   "us": "mg/dL",
   "units": [
    {
     "l": "g/L",
     "m": 100
    },
    {
     "l": "mmol/L",
     "m": 38.67
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    40,
    100
   ],
   "axis": [
    20,
    110
   ]
  },
  {
   "id": "chol",
   "cat": "lipid",
   "dec": [
    "AGE garlic 2400mg"
   ],
   "en": "Total cholesterol",
   "fr": "Cholestérol total",
   "us": "mg/dL",
   "units": [
    {
     "l": "g/L",
     "m": 100
    },
    {
     "l": "mmol/L",
     "m": 38.67
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    0,
    200
   ],
   "opt": [
    0,
    180
   ],
   "oc": "weak",
   "axis": [
    100,
    280
   ]
  },
  {
   "id": "glu",
   "cat": "lipid",
   "en": "Fasting glucose",
   "fr": "Glycémie à jeun",
   "us": "mg/dL",
   "units": [
    {
     "l": "g/L",
     "m": 100
    },
    {
     "l": "mmol/L",
     "m": 18.016
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    70,
    99
   ],
   "opt": [
    75,
    90
   ],
   "oc": "moderate",
   "axis": [
    60,
    130
   ]
  },
  {
   "id": "a1c",
   "cat": "lipid",
   "en": "HbA1c",
   "fr": "Hémoglobine glyquée",
   "us": "%",
   "units": [
    {
     "l": "%",
     "m": 1
    },
    {
     "l": "mmol/mol (IFCC)",
     "a": 0.09148,
     "b": 2.152
    }
   ],
   "clin": [
    4,
    5.6
   ],
   "opt": [
    4.6,
    5.4
   ],
   "oc": "moderate",
   "axis": [
    4,
    7
   ]
  },
  {
   "id": "ins",
   "cat": "lipid",
   "en": "Fasting insulin",
   "fr": "Insuline à jeun",
   "us": "µIU/mL",
   "units": [
    {
     "l": "mUI/L",
     "m": 1
    },
    {
     "l": "pmol/L",
     "m": 0.144
    }
   ],
   "clin": [
    2,
    20
   ],
   "opt": [
    2,
    7
   ],
   "oc": "moderate",
   "axis": [
    0,
    25
   ]
  },
  {
   "id": "ua",
   "cat": "lipid",
   "en": "Uric acid",
   "fr": "Acide urique",
   "us": "mg/dL",
   "units": [
    {
     "l": "µmol/L",
     "m": 0.01681
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    3.5,
    7.2
   ],
   "opt": [
    3.5,
    5.5
   ],
   "oc": "moderate",
   "axis": [
    2,
    9
   ]
  },
  {
   "id": "alt",
   "cat": "liver",
   "dec": [
    "Curcumin",
    "NAC 12g"
   ],
   "en": "ALT",
   "fr": "ALAT (TGP)",
   "us": "U/L",
   "units": [
    {
     "l": "UI/L",
     "m": 1
    }
   ],
   "clin": [
    0,
    40
   ],
   "opt": [
    0,
    30
   ],
   "oc": "moderate",
   "axis": [
    0,
    70
   ]
  },
  {
   "id": "ast",
   "cat": "liver",
   "dec": [
    "Curcumin",
    "NAC 12g"
   ],
   "en": "AST",
   "fr": "ASAT (TGO)",
   "us": "U/L",
   "units": [
    {
     "l": "UI/L",
     "m": 1
    }
   ],
   "clin": [
    0,
    40
   ],
   "opt": [
    0,
    30
   ],
   "oc": "moderate",
   "axis": [
    0,
    70
   ]
  },
  {
   "id": "ggt",
   "cat": "liver",
   "dec": [
    "Curcumin"
   ],
   "en": "GGT",
   "fr": "Gamma-GT",
   "us": "U/L",
   "units": [
    {
     "l": "UI/L",
     "m": 1
    }
   ],
   "clin": [
    0,
    55
   ],
   "opt": [
    0,
    25
   ],
   "oc": "moderate",
   "axis": [
    0,
    90
   ]
  },
  {
   "id": "alp",
   "cat": "liver",
   "dec": [
    "Vitamin D3 10000 IU + K2"
   ],
   "en": "Alkaline phosphatase",
   "fr": "Phosphatases alcalines",
   "us": "U/L",
   "units": [
    {
     "l": "UI/L",
     "m": 1
    }
   ],
   "clin": [
    40,
    130
   ],
   "opt": [
    40,
    110
   ],
   "oc": "weak",
   "axis": [
    20,
    170
   ]
  },
  {
   "id": "bili",
   "cat": "liver",
   "dec": [
    "Curcumin"
   ],
   "en": "Total bilirubin",
   "fr": "Bilirubine totale",
   "us": "mg/dL",
   "units": [
    {
     "l": "µmol/L",
     "m": 0.05848
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    0.2,
    1.2
   ],
   "axis": [
    0,
    2
   ]
  },
  {
   "id": "alb",
   "cat": "liver",
   "dec": [
    "Vitamin D3 10000 IU + K2"
   ],
   "en": "Albumin",
   "fr": "Albumine",
   "us": "g/dL",
   "units": [
    {
     "l": "g/L",
     "m": 0.1
    },
    {
     "l": "g/dL",
     "m": 1
    }
   ],
   "clin": [
    3.5,
    5.2
   ],
   "opt": [
    4.5,
    5.2
   ],
   "oc": "moderate",
   "axis": [
    3,
    5.5
   ]
  },
  {
   "id": "tt",
   "cat": "horm",
   "dec": [
    "Boron 10mg",
    "Finasteride (topical) 0.1% - 1mL",
    "Ashwagandha 600mg"
   ],
   "en": "Total testosterone",
   "fr": "Testostérone totale",
   "us": "ng/dL",
   "units": [
    {
     "l": "nmol/L",
     "m": 28.84
    },
    {
     "l": "ng/dL",
     "m": 1
    }
   ],
   "clin": [
    264,
    916
   ],
   "opt": [
    550,
    900
   ],
   "oc": "weak",
   "axis": [
    200,
    1100
   ]
  },
  {
   "id": "ft",
   "cat": "horm",
   "dec": [
    "Boron 10mg",
    "Finasteride (topical) 0.1% - 1mL"
   ],
   "en": "Free testosterone",
   "fr": "Testostérone libre",
   "us": "pg/mL",
   "units": [
    {
     "l": "pmol/L",
     "m": 0.2884
    },
    {
     "l": "pg/mL",
     "m": 1
    }
   ],
   "clin": [
    47,
    244
   ],
   "opt": [
    100,
    200
   ],
   "oc": "weak",
   "axis": [
    20,
    280
   ]
  },
  {
   "id": "shbg",
   "cat": "horm",
   "dec": [
    "Boron 10mg",
    "Finasteride (topical) 0.1% - 1mL"
   ],
   "en": "SHBG",
   "fr": "SHBG",
   "us": "nmol/L",
   "units": [
    {
     "l": "nmol/L",
     "m": 1
    }
   ],
   "clin": [
    18,
    54
   ],
   "opt": [
    20,
    45
   ],
   "oc": "moderate",
   "axis": [
    10,
    70
   ]
  },
  {
   "id": "e2",
   "cat": "horm",
   "dec": [
    "Boron 10mg",
    "Finasteride (topical) 0.1% - 1mL"
   ],
   "en": "Estradiol",
   "fr": "Œstradiol (E2)",
   "us": "pg/mL",
   "units": [
    {
     "l": "pmol/L",
     "m": 0.2724
    },
    {
     "l": "pg/mL",
     "m": 1
    }
   ],
   "clin": [
    10,
    40
   ],
   "axis": [
    0,
    60
   ]
  },
  {
   "id": "dht",
   "cat": "horm",
   "dec": [
    "Finasteride (topical) 0.1% - 1mL"
   ],
   "en": "DHT",
   "fr": "Dihydrotestostérone",
   "us": "ng/dL",
   "units": [
    {
     "l": "nmol/L",
     "m": 29
    },
    {
     "l": "ng/dL",
     "m": 1
    }
   ],
   "clin": [
    23,
    102
   ],
   "axis": [
    0,
    110
   ]
  },
  {
   "id": "lh",
   "cat": "horm",
   "en": "LH",
   "fr": "LH",
   "us": "IU/L",
   "units": [
    {
     "l": "UI/L",
     "m": 1
    }
   ],
   "clin": [
    1.7,
    8.6
   ],
   "axis": [
    0,
    12
   ]
  },
  {
   "id": "fsh",
   "cat": "horm",
   "en": "FSH",
   "fr": "FSH",
   "us": "IU/L",
   "units": [
    {
     "l": "UI/L",
     "m": 1
    }
   ],
   "clin": [
    1.5,
    12.4
   ],
   "opt": [
    2,
    10
   ],
   "oc": "weak",
   "axis": [
    0,
    16
   ]
  },
  {
   "id": "cort",
   "cat": "horm",
   "dec": [
    "Ashwagandha 600mg"
   ],
   "en": "Cortisol (morning)",
   "fr": "Cortisol (8h)",
   "us": "µg/dL",
   "units": [
    {
     "l": "nmol/L",
     "m": 0.03625
    },
    {
     "l": "µg/dL",
     "m": 1
    }
   ],
   "clin": [
    6,
    23
   ],
   "opt": [
    8,
    18
   ],
   "oc": "weak",
   "axis": [
    0,
    30
   ]
  },
  {
   "id": "prl",
   "cat": "horm",
   "dec": [
    "Finasteride (topical) 0.1% - 1mL"
   ],
   "en": "Prolactin",
   "fr": "Prolactine",
   "us": "ng/mL",
   "units": [
    {
     "l": "ng/mL",
     "m": 1
    },
    {
     "l": "µg/L",
     "m": 1
    },
    {
     "l": "mUI/L",
     "m": 0.0472
    }
   ],
   "clin": [
    2,
    18
   ],
   "opt": [
    2,
    15
   ],
   "oc": "weak",
   "axis": [
    0,
    30
   ]
  },
  {
   "id": "plt",
   "cat": "cbc",
   "dec": [
    "Omega-3 (2000mg EPA, 1125mg DHA)",
    "Curcumin",
    "AGE garlic 2400mg"
   ],
   "en": "Platelets",
   "fr": "Plaquettes",
   "us": "10³/µL",
   "units": [
    {
     "l": "G/L",
     "m": 1
    }
   ],
   "clin": [
    150,
    400
   ],
   "opt": [
    180,
    350
   ],
   "oc": "moderate",
   "axis": [
    100,
    450
   ]
  },
  {
   "id": "mpv",
   "cat": "cbc",
   "en": "MPV",
   "fr": "V.P.M.",
   "us": "fL",
   "units": [
    {
     "l": "fL",
     "m": 1
    }
   ],
   "clin": [
    7,
    11
   ],
   "axis": [
    5,
    14
   ]
  },
  {
   "id": "hb",
   "cat": "cbc",
   "en": "Hemoglobin",
   "fr": "Hémoglobine",
   "us": "g/dL",
   "units": [
    {
     "l": "g/dL",
     "m": 1
    },
    {
     "l": "g/L",
     "m": 0.1
    }
   ],
   "clin": [
    13.5,
    17.5
   ],
   "opt": [
    14,
    17
   ],
   "oc": "moderate",
   "axis": [
    11,
    19
   ]
  },
  {
   "id": "hct",
   "cat": "cbc",
   "en": "Hematocrit",
   "fr": "Hématocrite",
   "us": "%",
   "units": [
    {
     "l": "%",
     "m": 1
    }
   ],
   "clin": [
    40,
    52
   ],
   "opt": [
    42,
    50
   ],
   "oc": "moderate",
   "axis": [
    35,
    58
   ]
  },
  {
   "id": "rbc",
   "cat": "cbc",
   "en": "Red blood cells",
   "fr": "Hématies (GR)",
   "us": "10⁶/µL",
   "units": [
    {
     "l": "T/L",
     "m": 1
    },
    {
     "l": "10⁶/µL",
     "m": 1
    }
   ],
   "clin": [
    4.2,
    5.8
   ],
   "opt": [
    4.5,
    5.6
   ],
   "oc": "weak",
   "axis": [
    3.5,
    6.5
   ]
  },
  {
   "id": "mcv",
   "cat": "cbc",
   "en": "MCV",
   "fr": "VGM",
   "us": "fL",
   "units": [
    {
     "l": "fL",
     "m": 1
    }
   ],
   "clin": [
    80,
    100
   ],
   "opt": [
    85,
    95
   ],
   "oc": "weak",
   "axis": [
    70,
    110
   ]
  },
  {
   "id": "mch",
   "cat": "cbc",
   "en": "MCH",
   "fr": "TCMH",
   "us": "pg",
   "units": [
    {
     "l": "pg",
     "m": 1
    }
   ],
   "clin": [
    26,
    34
   ],
   "opt": [
    28,
    33
   ],
   "oc": "weak",
   "axis": [
    22,
    38
   ]
  },
  {
   "id": "mchc",
   "cat": "cbc",
   "en": "MCHC",
   "fr": "CCMH",
   "us": "g/dL",
   "units": [
    {
     "l": "g/L",
     "m": 0.1
    },
    {
     "l": "g/dL",
     "m": 1
    }
   ],
   "clin": [
    31,
    36.5
   ],
   "opt": [
    32,
    36.5
   ],
   "oc": "weak",
   "axis": [
    29,
    38
   ]
  },
  {
   "id": "rdw",
   "cat": "cbc",
   "en": "RDW",
   "fr": "IDR",
   "us": "%",
   "units": [
    {
     "l": "%",
     "m": 1
    }
   ],
   "clin": [
    11,
    15
   ],
   "opt": [
    11,
    13.5
   ],
   "oc": "weak",
   "axis": [
    9,
    18
   ]
  },
  {
   "id": "wbc",
   "cat": "cbc",
   "en": "White blood cells",
   "fr": "Leucocytes (GB)",
   "us": "10³/µL",
   "units": [
    {
     "l": "G/L",
     "m": 1
    }
   ],
   "clin": [
    4,
    10
   ],
   "opt": [
    4.5,
    8.5
   ],
   "oc": "weak",
   "axis": [
    2,
    13
   ]
  },
  {
   "id": "neut",
   "cat": "cbc",
   "en": "Neutrophils",
   "fr": "Polynucléaires neutrophiles",
   "us": "cells/µL",
   "units": [
    {
     "l": "cells/µL",
     "m": 1
    },
    {
     "l": "G/L",
     "m": 1000
    }
   ],
   "clin": [
    1500,
    7800
   ],
   "opt": [
    2000,
    6000
   ],
   "oc": "weak",
   "axis": [
    1000,
    9000
   ]
  },
  {
   "id": "lymph",
   "cat": "cbc",
   "en": "Lymphocytes",
   "fr": "Lymphocytes",
   "us": "cells/µL",
   "units": [
    {
     "l": "cells/µL",
     "m": 1
    },
    {
     "l": "G/L",
     "m": 1000
    }
   ],
   "clin": [
    850,
    3900
   ],
   "opt": [
    1200,
    3000
   ],
   "oc": "weak",
   "axis": [
    500,
    4500
   ]
  },
  {
   "id": "mono",
   "cat": "cbc",
   "en": "Monocytes",
   "fr": "Monocytes",
   "us": "cells/µL",
   "units": [
    {
     "l": "cells/µL",
     "m": 1
    },
    {
     "l": "G/L",
     "m": 1000
    }
   ],
   "clin": [
    200,
    950
   ],
   "opt": [
    250,
    800
   ],
   "oc": "weak",
   "axis": [
    0,
    1100
   ]
  },
  {
   "id": "eos",
   "cat": "cbc",
   "en": "Eosinophils",
   "fr": "Polynucléaires éosinophiles",
   "us": "cells/µL",
   "units": [
    {
     "l": "cells/µL",
     "m": 1
    },
    {
     "l": "G/L",
     "m": 1000
    }
   ],
   "clin": [
    15,
    500
   ],
   "opt": [
    15,
    350
   ],
   "oc": "weak",
   "axis": [
    0,
    600
   ]
  },
  {
   "id": "baso",
   "cat": "cbc",
   "en": "Basophils",
   "fr": "Polynucléaires basophiles",
   "us": "cells/µL",
   "units": [
    {
     "l": "cells/µL",
     "m": 1
    },
    {
     "l": "G/L",
     "m": 1000
    }
   ],
   "clin": [
    0,
    200
   ],
   "opt": [
    0,
    150
   ],
   "oc": "weak",
   "axis": [
    0,
    250
   ]
  },
  {
   "id": "iron",
   "cat": "iron",
   "dec": [
    "Huel"
   ],
   "en": "Serum iron",
   "fr": "Fer sérique",
   "us": "µg/dL",
   "units": [
    {
     "l": "µmol/L",
     "m": 5.587
    },
    {
     "l": "µg/dL",
     "m": 1
    }
   ],
   "clin": [
    50,
    180
   ],
   "opt": [
    70,
    150
   ],
   "oc": "weak",
   "axis": [
    20,
    220
   ]
  },
  {
   "id": "tibc",
   "cat": "iron",
   "en": "TIBC",
   "fr": "Capacité totale de fixation (CTF)",
   "us": "µg/dL",
   "units": [
    {
     "l": "µmol/L",
     "m": 5.587
    },
    {
     "l": "µg/dL",
     "m": 1
    }
   ],
   "clin": [
    250,
    425
   ],
   "opt": [
    250,
    400
   ],
   "oc": "weak",
   "axis": [
    180,
    500
   ]
  },
  {
   "id": "tsat",
   "cat": "iron",
   "dec": [
    "Huel"
   ],
   "en": "Transferrin saturation",
   "fr": "Coefficient de saturation (CST)",
   "us": "%",
   "units": [
    {
     "l": "%",
     "m": 1
    }
   ],
   "clin": [
    20,
    45
   ],
   "axis": [
    0,
    60
   ]
  },
  {
   "id": "mg",
   "cat": "vitmin",
   "dec": [
    "Magnesium L-threonate",
    "Huel"
   ],
   "en": "Magnesium (serum)",
   "fr": "Magnésium",
   "us": "mg/dL",
   "units": [
    {
     "l": "mmol/L",
     "m": 2.43
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    1.7,
    2.4
   ],
   "opt": [
    2,
    2.4
   ],
   "oc": "weak",
   "axis": [
    1.4,
    2.8
   ]
  },
  {
   "id": "ck",
   "cat": "other",
   "en": "Creatine kinase",
   "fr": "CPK",
   "us": "U/L",
   "units": [
    {
     "l": "UI/L",
     "m": 1
    }
   ],
   "clin": [
    30,
    380
   ],
   "axis": [
    0,
    600
   ]
  },
  {
   "id": "na",
   "cat": "other",
   "en": "Sodium",
   "fr": "Sodium (natrémie)",
   "us": "mmol/L",
   "units": [
    {
     "l": "mmol/L",
     "m": 1
    }
   ],
   "clin": [
    135,
    146
   ],
   "opt": [
    137,
    143
   ],
   "oc": "weak",
   "axis": [
    130,
    150
   ]
  },
  {
   "id": "k",
   "cat": "other",
   "en": "Potassium",
   "fr": "Potassium (kaliémie)",
   "us": "mmol/L",
   "units": [
    {
     "l": "mmol/L",
     "m": 1
    }
   ],
   "clin": [
    3.5,
    5.3
   ],
   "opt": [
    4,
    5
   ],
   "oc": "weak",
   "axis": [
    3,
    6
   ]
  },
  {
   "id": "ft3",
   "cat": "thy",
   "en": "Free T3",
   "fr": "T3 libre (FT3)",
   "us": "pg/mL",
   "units": [
    {
     "l": "pmol/L",
     "m": 0.651
    },
    {
     "l": "pg/mL",
     "m": 1
    }
   ],
   "clin": [
    2,
    4.4
   ],
   "axis": [
    1.5,
    5
   ]
  },
  {
   "id": "atg",
   "cat": "thy",
   "en": "Thyroglobulin antibodies",
   "fr": "Anticorps anti-thyroglobuline",
   "us": "IU/mL",
   "units": [
    {
     "l": "UI/mL",
     "m": 1
    }
   ],
   "clin": [
    0,
    115
   ],
   "axis": [
    0,
    150
   ]
  },
  {
   "id": "dheas",
   "cat": "horm",
   "en": "DHEA-S",
   "fr": "SDHEA (sulfate de DHEA)",
   "us": "µg/dL",
   "units": [
    {
     "l": "µmol/L",
     "m": 36.85
    },
    {
     "l": "µg/dL",
     "m": 1
    }
   ],
   "clin": [
    160,
    449
   ],
   "axis": [
    100,
    500
   ]
  },
  {
   "id": "igf1",
   "cat": "horm",
   "en": "IGF-1",
   "fr": "IGF-1 (somatomédine C)",
   "us": "ng/mL",
   "units": [
    {
     "l": "nmol/L",
     "m": 7.69
    },
    {
     "l": "ng/mL",
     "m": 1
    }
   ],
   "clin": [
    82,
    241
   ],
   "axis": [
    60,
    280
   ]
  },
  {
   "id": "tp",
   "cat": "liver",
   "en": "Total protein",
   "fr": "Protéines totales",
   "us": "g/dL",
   "units": [
    {
     "l": "g/L",
     "m": 0.1
    },
    {
     "l": "g/dL",
     "m": 1
    }
   ],
   "clin": [
    6.4,
    8.3
   ],
   "axis": [
    5.5,
    9
   ]
  },
  {
   "id": "trf",
   "cat": "iron",
   "en": "Transferrin",
   "fr": "Transferrine",
   "us": "mg/dL",
   "units": [
    {
     "l": "g/L",
     "m": 100
    },
    {
     "l": "mg/dL",
     "m": 1
    }
   ],
   "clin": [
    200,
    360
   ],
   "axis": [
    150,
    420
   ]
  },
  {
   "id": "upcr",
   "cat": "renal",
   "en": "Urine protein/creatinine",
   "fr": "Ratio protéines/créatinine urinaire",
   "us": "mg/g",
   "units": [
    {
     "l": "mg/mmol",
     "m": 8.84
    },
    {
     "l": "mg/g",
     "m": 1
    }
   ],
   "clin": [
    0,
    150
   ],
   "axis": [
    0,
    600
   ]
  },
  {
   "id": "ucrea",
   "cat": "renal",
   "en": "Urine creatinine",
   "fr": "Créatinine urinaire",
   "us": "mg/L",
   "units": [
    {
     "l": "mmol/L",
     "m": 113.12
    },
    {
     "l": "mg/L",
     "m": 1
    }
   ],
   "clin": [
    400,
    2780
   ],
   "axis": [
    300,
    3000
   ]
  }
 ],
 "DATA": {
  "draws": [
   {
    "id": "d20201210",
    "date": "2020-12-10",
    "note": "Cerballiance Clairval (Marseille), drawn 10:38, Roche Cobas; hormones on Cobas ECLIA. Reached this file via an InsideTracker upload that re-converted the lab's SI values instead of transcribing them, so eight results were dropped entirely and six arrived rounded — all restored here from the report. THE LAB FLAGGED THREE VALUES: calcium 2.58 mmol/L against 2.15-2.50, creatinine 110 umol/L against 59-104, and potassium 4.7 against 3.4-4.5. Read the potassium with care — the report states 'legere hemolyse detectee dans le serum', and haemolysis releases intracellular potassium, which is the usual cause of a mildly high result on an otherwise normal panel. No albumin was measured, so corrected calcium cannot be derived for this draw. ONE VALUE HERE IS NOT FROM THIS COLLECTION: zinc (13.9 umol/L, atomic absorption, CERBA) was drawn 22.12.2020 at 09h58, twelve days later, and arrived with the same report bundle. Folded in deliberately rather than given its own draw — the time axis is in years, so twelve days is invisible, and a separate draw would add a table column in which 74 of 75 rows are empty.",
    "v": {
     "wbc": {
      "r": 6.2,
      "u": "G/L"
     },
     "neut": {
      "r": 4.56,
      "u": "G/L"
     },
     "lymph": {
      "r": 1.05,
      "u": "G/L"
     },
     "mono": {
      "r": 0.47,
      "u": "G/L"
     },
     "eos": {
      "r": 0.05,
      "u": "G/L"
     },
     "baso": {
      "r": 0.07,
      "u": "G/L"
     },
     "hb": {
      "r": 16.4,
      "u": "g/dL"
     },
     "rbc": {
      "r": 5.33,
      "u": "T/L"
     },
     "hct": {
      "r": 48.3,
      "u": "%"
     },
     "mcv": {
      "r": 90.6,
      "u": "fL"
     },
     "mch": {
      "r": 30.7,
      "u": "pg"
     },
     "mchc": {
      "r": 33.9,
      "u": "g/dL"
     },
     "plt": {
      "r": 166,
      "u": "G/L"
     },
     "mpv": {
      "r": 9.2,
      "u": "fL"
     },
     "glu": {
      "r": 1.05,
      "u": "g/L"
     },
     "a1c": {
      "r": 5.1,
      "u": "%"
     },
     "crea": {
      "r": 12.5,
      "u": "mg/L"
     },
     "egfr": {
      "r": 80,
      "u": "mL/min/1.73m²"
     },
     "ua": {
      "r": 305,
      "u": "µmol/L"
     },
     "chol": {
      "r": 1.56,
      "u": "g/L"
     },
     "hdl": {
      "r": 0.71,
      "u": "g/L"
     },
     "ldl": {
      "r": 0.75,
      "u": "g/L"
     },
     "tg": {
      "r": 0.55,
      "u": "g/L"
     },
     "na": {
      "r": 139,
      "u": "mmol/L"
     },
     "k": {
      "r": 4.7,
      "u": "mmol/L"
     },
     "tp": {
      "r": 81,
      "u": "g/L"
     },
     "ca": {
      "r": 103,
      "u": "mg/L"
     },
     "mg": {
      "r": 0.86,
      "u": "mmol/L"
     },
     "iron": {
      "r": 14.62,
      "u": "µmol/L"
     },
     "ferr": {
      "r": 72,
      "u": "µg/L"
     },
     "zn": {
      "r": 13.9,
      "u": "µmol/L"
     },
     "ast": {
      "r": 31,
      "u": "UI/L"
     },
     "alt": {
      "r": 25,
      "u": "UI/L"
     },
     "alp": {
      "r": 62,
      "u": "UI/L"
     },
     "ggt": {
      "r": 27,
      "u": "UI/L"
     },
     "vitd": {
      "r": 117.5,
      "u": "nmol/L"
     },
     "ft3": {
      "r": 3.12,
      "u": "pg/mL"
     },
     "ft4": {
      "r": 17.28,
      "u": "pmol/L"
     },
     "tsh": {
      "r": 0.99,
      "u": "mUI/L"
     },
     "tt": {
      "r": 25.9,
      "u": "nmol/L"
     }
    }
   },
   {
    "id": "d20220514",
    "date": "2022-05-14",
    "note": "Cerballiance La Rouviere (Marseille), drawn 10:15, Roche Cobas / Cobas ECLIA. Arrived via an InsideTracker upload: four results were dropped (creatinine, eGFR, alkaline phosphatase, TSH) and three were rounded (RBC 5.28 stored as 5.3, MCHC 34.8 as 35, albumin 52.9 g/L as 5.3 g/dL) — all restored from the report. THE LAB FLAGGED THREE VALUES: albumin 52.9 g/L against 35-52, creatinine 106 umol/L against 59-104, and MPV 11.7 fL against 7.0-11.0 (no MPV marker in this panel; it was 9.2 in 2020). CRITICAL FOR THE CORRECTED-CALCIUM MARKER: this report prints, verbatim, 'Calcium corrige non indique car albumine >40 g/L' — the laboratory REFUSED to compute corrected calcium because albumin exceeds 40 g/L, which it does in every draw where albumin was measured (52.9 here, 51 in July 2026). Urea was deliberately not performed: the report states it is only reimbursed for dialysis, acute renal failure, or nutritional assessment in chronic renal failure, so the empty urea marker is a French reimbursement rule and not a dropped value. hs-CRP printed 'Inf a 0,5 mg/L' and is stored AT the limit, so read it as an upper bound.",
    "v": {
     "wbc": {
      "r": 5.3,
      "u": "G/L"
     },
     "neut": {
      "r": 3.32,
      "u": "G/L"
     },
     "lymph": {
      "r": 1.46,
      "u": "G/L"
     },
     "mono": {
      "r": 0.41,
      "u": "G/L"
     },
     "eos": {
      "r": 0.07,
      "u": "G/L"
     },
     "baso": {
      "r": 0.05,
      "u": "G/L"
     },
     "hb": {
      "r": 16.3,
      "u": "g/dL"
     },
     "rbc": {
      "r": 5.28,
      "u": "T/L"
     },
     "hct": {
      "r": 46.8,
      "u": "%"
     },
     "mcv": {
      "r": 88.6,
      "u": "fL"
     },
     "mch": {
      "r": 30.9,
      "u": "pg"
     },
     "mchc": {
      "r": 34.8,
      "u": "g/dL"
     },
     "plt": {
      "r": 172,
      "u": "G/L"
     },
     "mpv": {
      "r": 11.7,
      "u": "fL"
     },
     "glu": {
      "r": 0.85,
      "u": "g/L"
     },
     "crea": {
      "r": 12.0,
      "u": "mg/L"
     },
     "egfr": {
      "r": 82,
      "u": "mL/min/1.73m²"
     },
     "chol": {
      "r": 1.49,
      "u": "g/L"
     },
     "hdl": {
      "r": 0.53,
      "u": "g/L"
     },
     "ldl": {
      "r": 0.81,
      "u": "g/L"
     },
     "tg": {
      "r": 0.73,
      "u": "g/L"
     },
     "na": {
      "r": 140,
      "u": "mmol/L"
     },
     "k": {
      "r": 4.4,
      "u": "mmol/L"
     },
     "alb": {
      "r": 52.9,
      "u": "g/L"
     },
     "ca": {
      "r": 100,
      "u": "mg/L"
     },
     "ast": {
      "r": 28,
      "u": "UI/L"
     },
     "alt": {
      "r": 20,
      "u": "UI/L"
     },
     "alp": {
      "r": 61,
      "u": "UI/L"
     },
     "ggt": {
      "r": 21,
      "u": "UI/L"
     },
     "vitd": {
      "r": 80.0,
      "u": "nmol/L"
     },
     "hscrp": {
      "r": 0.5,
      "u": "mg/L"
     },
     "tsh": {
      "r": 0.87,
      "u": "mUI/L"
     }
    }
   },
   {
    "id": "d20230130",
    "date": "2023-01-30",
    "note": "Cerballiance Clairval (Marseille), drawn 14h53 — an AFTERNOON draw, so this total T is NOT comparable to the morning draws either side of it; testosterone peaks around 08:00 and falls through the day. Hormone send-outs to CERBA. TESTOSTERONE LIBRE by RIA: 32.3 pmol/L / 9.3 pg/mL, in range against that assay's own printed reference of 30.0-87.0 pmol/L / 8.7-25.0 pg/mL. This is the value once stored as '0.9 ng/dL' and excluded as a suspected 10x transcription error — it was neither an error nor mislabelled: 9.3 pg/mL IS 0.93 ng/dL. What was wrong was the range it was judged against, the marker's 47-244 pg/mL, which belongs to a different method entirely. Kept as a note rather than a marker value: direct analog RIA free T is the method the Endocrine Society says not to use, and it shares no scale with the calculated free T this panel uses going forward. THE LAB FLAGGED THREE VALUES: platelets 153 against ITS OWN reference of 172-398 (this lab uses a narrower interval than the 150-400 this panel carries, so 153 reads normal here and low there), creatinine 106 umol/L against 59-104, and potassium 4.6 against 3.4-4.5 on a heparinised tube. The report also notes 'serum legerement lactescent' — mild lipaemia, which can interfere with spectrophotometric assays.",
    "v": {
     "wbc": {
      "r": 4.9,
      "u": "G/L"
     },
     "neut": {
      "r": 2.9,
      "u": "G/L"
     },
     "lymph": {
      "r": 1.47,
      "u": "G/L"
     },
     "mono": {
      "r": 0.39,
      "u": "G/L"
     },
     "eos": {
      "r": 0.1,
      "u": "G/L"
     },
     "baso": {
      "r": 0.03,
      "u": "G/L"
     },
     "tt": {
      "r": 19.2,
      "u": "nmol/L"
     },
     "shbg": {
      "r": 53,
      "u": "nmol/L"
     },
     "hb": {
      "r": 164,
      "u": "g/L"
     },
     "rbc": {
      "r": 5.26,
      "u": "T/L"
     },
     "hct": {
      "r": 47.3,
      "u": "%"
     },
     "mcv": {
      "r": 89.9,
      "u": "fL"
     },
     "mch": {
      "r": 31.2,
      "u": "pg"
     },
     "mchc": {
      "r": 347,
      "u": "g/L"
     },
     "plt": {
      "r": 153,
      "u": "G/L"
     },
     "mpv": {
      "r": 9.4,
      "u": "fL"
     },
     "crea": {
      "r": 12.0,
      "u": "mg/L"
     },
     "egfr": {
      "r": 82,
      "u": "mL/min/1.73m²"
     },
     "k": {
      "r": 4.6,
      "u": "mmol/L"
     },
     "na": {
      "r": 141,
      "u": "mmol/L"
     }
    }
   },
   {
    "id": "d20230313",
    "date": "2023-03-13",
    "note": "Cerballiance Barral (Marseille), drawn 09:45 — a different site and analyser from the January draw six weeks earlier, which matters below. This was an ALLERGY workup: IgE came back 122 UI/mL against a reference of <100 and was flagged, with Phadiatop and Trophatop sent out (those results are not in this report and there is no IgE marker in this panel). Arrived via an InsideTracker upload that rounded three values — RBC 5.04 stored as 5, MCHC 335 g/L as 34 g/dL, WBC 4.18 as 4.2 — and dropped MPV; all restored. THE LAB FLAGGED THREE HAEMATOLOGY VALUES: lymphocytes 1.06 G/L against 1.34-3.92 (low), platelets 157 against 172-398 (low), and MPV 12.1 fL against 7.4-10.8 (high). READ THE MPV SERIES WITH CARE: across four reports it splits perfectly by laboratory rather than by date — Clairval 9.2 and 9.4, La Rouviere 11.7, Barral 12.1. MPV rises as platelets swell in EDTA, so it tracks the delay to analysis and the analyser, not the patient. The line will look like a trend and is not one. Fibrinogen 2.0 g/L and an ESR of 2 mm / 5 mm were also run; neither has a marker here.",
    "v": {
     "wbc": {
      "r": 4.18,
      "u": "G/L"
     },
     "neut": {
      "r": 2.52,
      "u": "G/L"
     },
     "lymph": {
      "r": 1.06,
      "u": "G/L"
     },
     "mono": {
      "r": 0.46,
      "u": "G/L"
     },
     "eos": {
      "r": 0.09,
      "u": "G/L"
     },
     "baso": {
      "r": 0.05,
      "u": "G/L"
     },
     "hb": {
      "r": 152,
      "u": "g/L"
     },
     "rbc": {
      "r": 5.04,
      "u": "T/L"
     },
     "hct": {
      "r": 45.4,
      "u": "%"
     },
     "mcv": {
      "r": 90.1,
      "u": "fL"
     },
     "mch": {
      "r": 30.2,
      "u": "pg"
     },
     "mchc": {
      "r": 335,
      "u": "g/L"
     },
     "plt": {
      "r": 157,
      "u": "G/L"
     },
     "mpv": {
      "r": 12.1,
      "u": "fL"
     },
     "hscrp": {
      "r": 1.4,
      "u": "mg/L"
     }
    }
   },
   {
    "id": "d20240402",
    "date": "2024-04-02",
    "note": "Cerballiance Provence Azur (La Rouvière, Marseille), drawn 09:56, Roche Cobas ECLIA; hormone send-outs to CERBA. Reached this file via an InsideTracker upload that RE-CONVERTED the SI values instead of transcribing the printed US ones, which is why earlier entries drifted from the report (B12 551 vs the printed 554 ng/L, total T 625.4 vs the printed 629.30 ng/dL) — values are now stored as the lab printed them, in SI. TESTOSTERONE BIODISPONIBLE by RIA: 3.6 nmol/L / 1.05 ng/mL, in range against that assay's own printed reference of 2.7-12.0 nmol/L / 0.78-3.46 ng/mL. Kept as a note rather than a marker: one measurement on an assay not being reordered, and it cannot be compared to the calculated free T this panel uses going forward. The 'free testosterone 83 pg/mL' previously stored here appears NOWHERE in the lab report — an InsideTracker artifact, now removed.",
    "v": {
     "b12": {
      "r": 407,
      "u": "pmol/L"
     },
     "tt": {
      "r": 21.7,
      "u": "nmol/L"
     },
     "shbg": {
      "r": 49,
      "u": "nmol/L"
     },
     "vitd": {
      "r": 73.0,
      "u": "nmol/L"
     }
    }
   },
   {
    "id": "d2026fr",
    "date": "2026-03-01",
    "note": "French lab, Beckman chemistry with an XN Sysmex haematology analyser, 10h fast, serum limpide. ON CREATINE at the time — which is why the eGFR of 61 is the outlier in an otherwise flat renal series (80, 82, 82, 61, 83.4) and should not be read as a decline. Verified against the printed report: every value matches to the digit, with no rounding, because this draw came from the lab directly rather than through an InsideTracker re-conversion. Creatinine 15 mg/L is on a page not reproduced in the copy checked here, but CKD-EPI 2021 on 1.5 mg/dL at age 31 gives 63, so it is consistent with the printed DFG of 61. Platelets 148 sit just below the 150-400 reference. THE CRP HERE IS A STANDARD ASSAY, NOT HIGH-SENSITIVITY: immuno-turbidimetry with a reference of <5 mg/L, printed '<1 mg/L' and stored AT that limit, so it is an upper bound from an assay that cannot resolve the hs-CRP range at all. The 2022 and July 2026 values ('Inf a 0,5' and '<0.6') come from genuine high-sensitivity assays and are the ones worth comparing.",
    "v": {
     "rbc": {
      "r": 5.17,
      "u": "T/L"
     },
     "hb": {
      "r": 16.2,
      "u": "g/dL"
     },
     "hct": {
      "r": 44.8,
      "u": "%"
     },
     "mcv": {
      "r": 87,
      "u": "fL"
     },
     "mch": {
      "r": 31.3,
      "u": "pg"
     },
     "mchc": {
      "r": 36.2,
      "u": "g/dL"
     },
     "rdw": {
      "r": 11.7,
      "u": "%"
     },
     "wbc": {
      "r": 4.48,
      "u": "G/L"
     },
     "neut": {
      "r": 2.41,
      "u": "G/L"
     },
     "eos": {
      "r": 0.09,
      "u": "G/L"
     },
     "baso": {
      "r": 0.04,
      "u": "G/L"
     },
     "lymph": {
      "r": 1.55,
      "u": "G/L"
     },
     "mono": {
      "r": 0.39,
      "u": "G/L"
     },
     "plt": {
      "r": 148,
      "u": "G/L"
     },
     "glu": {
      "r": 0.9,
      "u": "g/L"
     },
     "tg": {
      "r": 0.5,
      "u": "g/L"
     },
     "chol": {
      "r": 1.55,
      "u": "g/L"
     },
     "hdl": {
      "r": 0.45,
      "u": "g/L"
     },
     "ldl": {
      "r": 1,
      "u": "g/L"
     },
     "nonhdl": {
      "r": 1.1,
      "u": "g/L"
     },
     "crea": {
      "r": 15,
      "u": "mg/L"
     },
     "egfr": {
      "r": 61,
      "u": "mL/min/1.73m²"
     },
     "ast": {
      "r": 25,
      "u": "UI/L"
     },
     "alt": {
      "r": 22,
      "u": "UI/L"
     },
     "hscrp": {
      "r": 1,
      "u": "mg/L"
     },
     "tsh": {
      "r": 0.783,
      "u": "mUI/L"
     }
    }
   },
   {
    "id": "d2026jul",
    "date": "2026-07-20",
    "note": "French lab (B2A Brumath; Cerba/Barbier for send-outs), 10h fast, drawn 08:37. OFF creatine — the clean kidney read the March draw could not give. hs-CRP printed '<0.6' and anti-TPO '<8.0'; both stored AT the limit because r must be a number, so read them as upper bounds, not measurements. The lab refused erythrocyte magnesium and substituted serum (the marker is serum, so it lands correctly). The diet cut — mozzarella 400 to 200 g/day, eggs 10 to 6 — landed only 2 days before the draw, so the lipids still reflect the prior intake. Pending at Cerba/Barbier: ApoB, Lp(a), cystatin C, homocysteine, DHT, SHBG, zinc, copper, selenium, omega-3 index.",
    "v": {
     "rbc": {
      "r": 4.94,
      "u": "T/L"
     },
     "hb": {
      "r": 15.3,
      "u": "g/dL"
     },
     "hct": {
      "r": 43.5,
      "u": "%"
     },
     "mcv": {
      "r": 88,
      "u": "fL"
     },
     "mch": {
      "r": 31.0,
      "u": "pg"
     },
     "mchc": {
      "r": 35.2,
      "u": "g/dL"
     },
     "rdw": {
      "r": 12.1,
      "u": "%"
     },
     "wbc": {
      "r": 4.18,
      "u": "G/L"
     },
     "neut": {
      "r": 2.47,
      "u": "G/L"
     },
     "lymph": {
      "r": 1.34,
      "u": "G/L"
     },
     "mono": {
      "r": 0.25,
      "u": "G/L"
     },
     "eos": {
      "r": 0.08,
      "u": "G/L"
     },
     "baso": {
      "r": 0.04,
      "u": "G/L"
     },
     "plt": {
      "r": 152,
      "u": "G/L"
     },
     "glu": {
      "r": 0.88,
      "u": "g/L"
     },
     "a1c": {
      "r": 5.1,
      "u": "%"
     },
     "ins": {
      "r": 4.2,
      "u": "mUI/L"
     },
     "tg": {
      "r": 0.65,
      "u": "g/L"
     },
     "chol": {
      "r": 2.05,
      "u": "g/L"
     },
     "hdl": {
      "r": 0.50,
      "u": "g/L"
     },
     "nonhdl": {
      "r": 1.55,
      "u": "g/L"
     },
     "ldl": {
      "r": 1.42,
      "u": "g/L"
     },
     "crea": {
      "r": 11.6,
      "u": "mg/L"
     },
     "egfr": {
      "r": 83.4,
      "u": "mL/min/1.73m²"
     },
     "ua": {
      "r": 250,
      "u": "µmol/L"
     },
     "na": {
      "r": 140,
      "u": "mmol/L"
     },
     "k": {
      "r": 4.0,
      "u": "mmol/L"
     },
     "ca": {
      "r": 94,
      "u": "mg/L"
     },
     "mg": {
      "r": 0.86,
      "u": "mmol/L"
     },
     "ast": {
      "r": 22,
      "u": "UI/L"
     },
     "alt": {
      "r": 17,
      "u": "UI/L"
     },
     "ggt": {
      "r": 16,
      "u": "UI/L"
     },
     "alp": {
      "r": 63,
      "u": "UI/L"
     },
     "bili": {
      "r": 13,
      "u": "µmol/L"
     },
     "ck": {
      "r": 77,
      "u": "UI/L"
     },
     "ferr": {
      "r": 58,
      "u": "µg/L"
     },
     "iron": {
      "r": 14.5,
      "u": "µmol/L"
     },
     "tsat": {
      "r": 22,
      "u": "%"
     },
     "hscrp": {
      "r": 0.6,
      "u": "mg/L"
     },
     "alb": {
      "r": 51,
      "u": "g/L"
     },
     "fol": {
      "r": 6.3,
      "u": "ng/mL"
     },
     "b12": {
      "r": 522,
      "u": "pg/mL"
     },
     "vitd": {
      "r": 70.0,
      "u": "nmol/L"
     },
     "tsh": {
      "r": 1,
      "u": "mUI/L"
     },
     "ft4": {
      "r": 19.31,
      "u": "pmol/L"
     },
     "atpo": {
      "r": 8.0,
      "u": "UI/mL"
     },
     "fsh": {
      "r": 4.3,
      "u": "UI/L"
     },
     "lh": {
      "r": 4.6,
      "u": "UI/L"
     },
     "e2": {
      "r": 58.7,
      "u": "pmol/L"
     },
     "prl": {
      "r": 7.76,
      "u": "ng/mL"
     },
     "tt": {
      "r": 22.12,
      "u": "nmol/L"
     },
     "pth": {
      "r": 17.9,
      "u": "pg/mL"
     },
     "cort": {
      "r": 292.4,
      "u": "nmol/L"
     },
     "ft3": {
      "r": 3,
      "u": "pg/mL"
     },
     "atg": {
      "r": 19.1,
      "u": "UI/mL"
     },
     "dheas": {
      "r": 257,
      "u": "µg/dL"
     },
     "igf1": {
      "r": 104.6,
      "u": "ng/mL"
     },
     "tp": {
      "r": 72,
      "u": "g/L"
     },
     "trf": {
      "r": 2.59,
      "u": "g/L"
     },
     "ucrea": {
      "r": 417,
      "u": "mg/L"
     }
    }
   }
  ]
 }
};
