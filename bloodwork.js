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
  "optimal_ranges": "opt[] and oc are INFERENCES, not lab data. oc is the evidence behind the target: strong = outcome data (RCTs, dose-response vs hard endpoints); moderate = association studies or physiology; weak = convention or industry framing, no outcome data. 9 strong, 28 moderate, 29 weak. A value outside a WEAK band is an opinion, not a finding.",
  "clin_ranges": "clin[] IS lab data, off the report.",
  "dec": "Which supplements a marker bears on. Many-to-many. Membership does NOT mean the supplement moves it: cystatin C is under Creatine precisely because creatine CANNOT distort it, albumin is under Vitamin D because calcium cannot be corrected without it, selenium is iodine's cofactor, B12/folate are TMG's pathway.",
  "confounds": [
   "Creatine was active at the March 2026 draw. It raises serum creatinine as substrate, not by damaging kidneys, and eGFR is CALCULATED from creatinine so it inherits the error. The eGFR of 61 is not readable as kidney disease. Cystatin C is immune and has never been drawn.",
   "Topical minoxidil appears in no supplement group. That is the finding, not an omission: it is a potassium-channel opener with ~1.4% systemic absorption and no hormonal mechanism. Astaxanthin, lycopene, hyaluronic acid and collagen are absent for the same reason. No blood marker can falsify them."
  ],
  "subject": {
   "sex": "male",
   "country": "France",
   "diet": "See the DIET tab. Rarely fish; lots of olive oil; high mozzarella, eggs (6-10/day) and potatoes. Huel Black: 100g/day as the pre-workout snack. Its fortification: iodine, vitamin D, zinc, selenium, B12, folate, magnesium, calcium, iron.",
   "supervision": "none"
  },
  "stack": "Moved to the STACK block below — structured, with dose, status, category, meal slot and purchase URL. STACK is the single source of truth for supplements; do not re-list them here.",
  "lifestyle_blocks": "STACK, ROUTINE, CARE and DIET are structured lifestyle data, same contract as the rest of the file: exact, never inferred. STACK is organised in functional categories; most items are status 'planned' — queued for the new protocol, not yet started. STACK.items[].status is one of taking/candidate/stopped/dropped/planned. .when is the slot a supplement is taken with (presnack/brunch/dinner/evening) — null means NOT YET ASSIGNED, never guess it. Timing lives on the item (.when), not in the categories: cats are functional groups. .dec ties an item to its DECS group (verbatim label) so the dashboard can cross-link; null means no blood marker bears on it (see confounds). A category's .note is the user's own caveat, shown under the section header; a category with t:null renders HEADERLESS — only its note introduces its items. A DIET meal without .at is a plain food section: no time chip, no supplement slot. A meal item is a string, or {n, info} — in a timed meal card, .info opens behind a hover info-tip on the name: .info is a string (plain caveat) OR a {section: [[label,value],…]} object rendered as a compact nutrition table (Huel Black uses this). ROUTINE times are HH:MM ascending; an entry's .until marks the end of a BLOCK (gym, work) and must be later than its .t; a routine entry's .slot pulls the matching STACK items at render time, so meal supplement lists are derived, never written twice. CARE holds the dental / face protocols, rendered as cards at the foot of the Stack page — deliberately NOT hour-by-hour events, they would duplicate. Meal supp lists are NOT stored anywhere: the Diet cards derive them from STACK.when (taking + planned) at render time, with an Evening supps card of its own — one source of truth for timing. DIET.meals[].id doubles as the when-slot key: an item with when:'brunch' belongs to the meal whose id is 'brunch' (slots: presnack/brunch/dinner/evening). In DIET, a '---' item is a course separator (starter / main / dessert), rendered as a gap. DIET.eveningAt stamps the Evening supplements card's time. NEXTDRAW.items is the flat list of biomarkers to collect at the next draw — strings, exactly as the lab order should read. A CARE card may split its items into .groups by cadence (Daily / Weekly / Yearly), same shape as TRAINING groups. TRAINING is {cardio, note, cards}: the gym program as Pull / Push / Legs cards, each organised in muscle-group .groups ('Accessory' holds what resists categorising). Every item is {n, sets:[[kg,reps],...]} — one pair per set, kg null = bodyweight, a '+' prefix = added weight, reps may be a duration like '0:30', sets [] = a protocol without logged sets; an optional .info string holds details shown behind an info tip. Copied exactly from the user's workout app; .cardio is the cardio baseline and .note the resistance caveat — the page renders them as labelled Cardio / Resistance sections. Doses write micrograms as mcg, never µg — µ uppercases into M and becomes a 1000x reading error.",
  "never_measured": "26 markers have no value in any draw. Highest value first: cystatin C (settles eGFR outright), ApoB and Lp(a), homocysteine (NAC raises it, TMG lowers it, net never seen), anti-TPO + free T4 (300mcg iodine; iodine-fortified Huel spans the historical draws and is back at 90g/day), selenium, copper and zinc (BEFORE starting zinc), omega-3 index.",
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
  "AGE garlic 2400mg",
  "Boron 5mg",
  "Creatine 5g",
  "Curcumin",
  "Finasteride (topical) 0.1% - 1mL",
  "Glycine 12g + taurine + collagen",
  "Huel",
  "Iodine 300mcg",
  "Magnesium L-threonate",
  "NAC 2000mg",
  "Omega-3 (3g EPA, 1.5g DHA)",
  "TMG 1000mg",
  "Vitamin D3 5000 IU + K2",
  "Zinc + copper"
 ],
 "STACK": {
  "cats": [
   {"id": "essentials", "t": "Essentials"},
   {"id": "skin", "t": "Skin"},
   {"id": "antiox", "t": "Antioxidants"},
   {"id": "aminos", "t": "Aminos & longevity"},
   {"id": "sport", "t": "Sport"},
   {"id": "hair", "t": "Hair loss"},
   {"id": "hairlater", "t": null, "note": "Potential additions to increase scalp absorption."}
  ],
  "items": [
   {"id": "astax", "name": "Astaxanthin", "dose": "24mg", "cat": "antiox", "status": "planned", "when": null, "url": null, "dec": null},
   {"id": "lyco", "name": "Lycopene", "dose": "50mg", "cat": "antiox", "status": "planned", "when": null, "url": null, "dec": null},
   {"id": "vitd3k2", "name": "Vitamin D3 + K2", "dose": "5000 IU", "cat": "essentials", "status": "planned", "when": null, "url": null, "dec": "Vitamin D3 5000 IU + K2"},
   {"id": "iodine", "name": "Iodine", "dose": "300mcg", "cat": "essentials", "status": "planned", "when": null, "url": null, "dec": "Iodine 300mcg"},
   {"id": "omega3", "name": "Omega-3", "dose": "3g EPA + 1.5g DHA", "cat": "essentials", "status": "planned", "when": null, "url": null, "dec": "Omega-3 (3g EPA, 1.5g DHA)"},
   {"id": "collagenc", "name": "Collagen peptides (low-MW)", "dose": "2g", "info": "~500 Da, ~80% tripeptides — the skin-signalling hydrolysate, with vitamin C. Glycine covers the amino substrate.", "cat": "skin", "status": "planned", "when": null, "url": "https://www.sunday.de/en/collagen-powder-sunglow-luxe-plus-c.html", "dec": "Glycine 12g + taurine + collagen"},
   {"id": "ha", "name": "Hyaluronic acid", "dose": "200mg", "cat": "skin", "status": "planned", "when": null, "url": null, "dec": null},
   {"id": "mglthr", "name": "Magnesium L-threonate", "dose": "2000mg", "info": "150mg elemental", "cat": "essentials", "status": "planned", "when": "evening", "url": null, "dec": "Magnesium L-threonate"},
   {"id": "minoxidil", "name": "Minoxidil (topical)", "dose": "5-10%, 1mL 2x/day", "cat": "hair", "status": "taking", "when": null, "url": null, "dec": null},
   {"id": "finasteride", "name": "Finasteride (topical)", "dose": "0.1%, 1mL 2x/day", "cat": "hair", "status": "planned", "when": null, "url": null, "dec": "Finasteride (topical) 0.1% - 1mL",
    "info": "Topical application as a serum = fewer side effects. Finasteride 0.1% is a low dose, but stay aware of potential effects on libido, erectile function and mood (including depression) during the first 6 months."},
   {"id": "glycine", "name": "Glycine", "dose": "12g", "cat": "aminos", "status": "planned", "when": null, "url": null, "dec": "Glycine 12g + taurine + collagen"},
   {"id": "nac", "name": "NAC", "dose": "2000mg", "cat": "aminos", "status": "planned", "when": null, "url": null, "dec": "NAC 2000mg"},
   {"id": "tmg", "name": "TMG", "dose": "1000mg", "cat": "aminos", "status": "planned", "when": null, "url": null, "dec": "TMG 1000mg"},
   {"id": "garlic", "name": "AGE garlic", "dose": "2400mg", "cat": "antiox", "status": "planned", "when": null, "url": null, "dec": "AGE garlic 2400mg"},
   {"id": "curcumin", "name": "Curcumin", "dose": null, "cat": "antiox", "status": "planned", "when": null, "url": null, "dec": "Curcumin"},
   {"id": "creatine", "name": "Creatine", "dose": "5g (up to 20g in periods of fatigue)", "cat": "sport", "status": "planned", "when": null, "url": null, "dec": "Creatine 5g"},
   {"id": "taurine", "name": "Taurine", "dose": "5g", "cat": "sport", "status": "planned", "when": null, "url": null, "dec": "Glycine 12g + taurine + collagen"},
   {"id": "boron", "name": "Boron", "dose": "5mg", "cat": "sport", "status": "planned", "when": null, "url": null, "dec": "Boron 5mg"},
   {"id": "tretinoin", "name": "Tretinoin / retinoic acid (topical)", "dose": "0.01%, 1mL", "cat": "hairlater", "status": "candidate", "when": null, "url": null, "dec": null},
   {"id": "ketoconazole", "name": "Ketoconazole (topical)", "dose": "2%, 1mL 3x/week", "cat": "hairlater", "status": "candidate", "when": null, "url": null, "dec": null}
  ]
 },
 "ROUTINE": [
  {"t": "07:00", "do": "Walk, sunlight, cold shower"},
  {"t": "07:15", "do": "Pre-workout snack + supplements", "slot": "presnack"},
  {"t": "08:00", "until": "10:00", "do": "Gym - phone stays OFF"},
  {"t": "10:00", "until": "10:30", "do": "Brunch + supplements", "slot": "brunch"},
  {"t": "10:30", "until": "16:30", "do": "Work"},
  {"t": "16:30", "until": "17:00", "do": "Dinner + supplements", "slot": "dinner"},
  {"t": "17:00", "until": "17:30", "do": "Shower + flossing + skincare"},
  {"t": "18:00", "until": "21:00", "do": "Work"},
  {"t": "21:00", "do": "Screens off"},
  {"t": "21:30", "do": "Bedtime"},
  {"t": "22:00", "do": "Lights out"}
 ],
 "CARE": [
  {"id": "dental", "t": "Dental", "groups": [
   {"t": "Daily", "items": [
    "Water jet + toothbrush 2-3x/day",
    "Alternate thread floss & interdental brushes"
   ]},
   {"t": "Yearly", "items": [
    "Dental scaling 2-3x/year",
    "Carbamide peroxide 10-15% - 2x/year, applied with custom dental tray"
   ]}
  ]},
  {"id": "face", "t": "Face", "groups": [
   {"t": "Daily", "items": [
    "Morning: serum → day cream",
    "After dinner:\n1% retinol → night cream → petroleum (Vaseline)",
    "Full body hydrating cream after shower"
   ]},
   {"t": "Weekly (Once)", "items": [
    "Instead of retinol: glycolic acid 7%",
    "Microneedling 1mm, face + scalp\nNo retinols or acids for 48h!"
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
  "items": []
 },
 "DIET": {
  "eveningAt": "21:00",
  "meals": [
   {"id": "presnack", "t": "Pre-workout snack", "at": "07:15", "items": [
    {"n": "100g Huel Black", "info": {
     "Per 100g": [["Energy","438 kcal","22%"],["Protein","44 g","88%"],["Fat","18 g","26%"],["– saturates","4.2 g","21%"],["– monounsat.","3.9 g"],["– PUFA","9.5 g"],["Carbs","20 g","8%"],["– sugars","1.8 g","2%"],["Fibre","9.3 g"],["Salt","0.8 g","13%"]],
     "Vitamins": [["A","197 mcg","25%"],["D","176 IU","88%"],["E","4.4 mg","37%"],["K","43 mcg","57%"],["C","66 mg","83%"],["Thiamin","0.24 mg","22%"],["Riboflavin","0.31 mg","22%"],["Niacin","3.5 mg","22%"],["B6","0.31 mg","22%"],["Pantoth.","1.3 mg","22%"],["Folate","88 mcg","44%"],["B12","0.9 mcg","35%"],["Biotin","13 mcg","26%"]],
     "Minerals": [["Calcium","263 mg","33%"],["Phosphorus","394 mg","56%"],["Potassium","766 mg","38%"],["Chloride","179 mg","22%"],["Magnesium","96 mg","26%"],["Iron","9.8 mg","70%"],["Zinc","5 mg","50%"],["Copper","0.5 mg","50%"],["Manganese","1 mg","50%"],["Selenium","36 mcg","65%"],["Iodine","33 mcg","22%"],["Chromium","13 mcg","33%"],["Molybdenum","41 mcg","82%"]],
     "Other": [["Choline","131 mg"],["Omega-3 (ALA)","4.5 g"],["Omega-6","4.7 g"],["MCT","1.2 g"],["Caffeine","76 mg"],["Green tea","140 mg"],["Lutein","1.8 mg"],["Zeaxanthin","0.1 mg"],["B. coagulans","219 M"]]
    }},
    {"n": "Two bananas", "info": {"Per 2 (~236 g)":[["Energy","210 kcal","11%"],["Carbs","54 g","21%"],["– sugars","29 g","32%"],["Fibre","6 g"],["Protein","2.6 g","5%"]],"Standouts":[["Potassium","845 mg","42%"],["B6","0.9 mg","64%"],["Vit C","20 mg","25%"],["Magnesium","64 mg","17%"]]}}
   ]},
   {"id": "brunch", "t": "Brunch", "at": "10:00", "items": [
    {"n": "200g mozzarella di bufala", "info": {"Per 200 g":[["Energy","550 kcal","28%"],["Protein","34 g","68%"],["Fat","44 g","63%"],["– saturates","30 g","150%"],["Salt","1 g","17%"]],"Minerals":[["Calcium","700 mg","88%"],["Phosphorus","700 mg","100%"],["Zinc","4 mg","40%"]]}},
    {"n": "150g cherry tomatoes", "info": {"Per 150 g": [["Energy","27 kcal","1%"],["Carbs","6 g","2%"],["– sugars","4 g","4%"],["Fibre","1.8 g"],["Protein","1.4 g","3%"]], "Standouts": [["Vit C","21 mg","26%"],["Potassium","355 mg","18%"],["Lycopene","~4 mg"],["Vit K","12 mcg","16%"],["Vit A","63 mcg","8%"]]}},
    "---",
    {"n": "6-10 eggs", "info": {"Per ~8 (~400 g)":[["Energy","620 kcal","31%"],["Protein","50 g","100%"],["Fat","44 g","63%"],["– saturates","13 g","65%"]],"Micronutrients":[["Choline","1180 mg"],["Selenium","120 mcg","218%"],["Vit D","320 IU","160%"],["B12","4 mcg","160%"],["Vit A","640 mcg","80%"],["Riboflavin","1.6 mg","114%"],["Folate","190 mcg","95%"]]}},
    {"n": "Air-fried potatoes in duck grease (or other grease)", "info": {"Per ~300 g + grease":[["Energy","395 kcal","20%"],["Carbs","58 g","22%"],["Fibre","5 g"],["Fat","15 g","21%"],["– saturates","5 g","25%"]],"Standouts":[["Potassium","1200 mg","60%"],["Vit C","30 mg","38%"],["B6","0.9 mg","64%"]]}},
    {"n": "Frozen reheated vegetables", "info": {"Per ~200 g":[["Energy","70 kcal","4%"],["Carbs","12 g","5%"],["Fibre","6 g"],["Protein","4 g","8%"]],"Vitamins":[["K","50 mcg","67%"],["Folate","80 mcg","40%"],["C","30 mg","38%"],["A","300 mcg","38%"]]}},
    "---",
    {"n": "Fruit (apple, pear, peach, apricots…)", "info": {"Per piece (~150 g)":[["Energy","80 kcal","4%"],["Carbs","20 g","8%"],["– sugars","15 g","17%"],["Fibre","3 g"],["Vit C","7 mg","9%"],["Potassium","180 mg","9%"]]}}
   ]},
   {"id": "dinner", "t": "Dinner", "at": "16:30", "items": [
    {"n": "200g mozzarella di bufala", "info": {"Per 200 g":[["Energy","550 kcal","28%"],["Protein","34 g","68%"],["Fat","44 g","63%"],["– saturates","30 g","150%"],["Salt","1 g","17%"]],"Minerals":[["Calcium","700 mg","88%"],["Phosphorus","700 mg","100%"],["Zinc","4 mg","40%"]]}},
    {"n": "150g cherry tomatoes", "info": {"Per 150 g": [["Energy","27 kcal","1%"],["Carbs","6 g","2%"],["– sugars","4 g","4%"],["Fibre","1.8 g"],["Protein","1.4 g","3%"]], "Standouts": [["Vit C","21 mg","26%"],["Potassium","355 mg","18%"],["Lycopene","~4 mg"],["Vit K","12 mcg","16%"],["Vit A","63 mcg","8%"]]}},
    "---",
    {"n": "Rice or pasta + olive oil", "info": {"Per ~180 g + oil":[["Energy","360 kcal","18%"],["Carbs","50 g","19%"],["Protein","5 g","10%"],["Fat","15 g","21%"],["Vit E","2 mg","17%"]]}},
    {"n": "Ground beef or chicken (frozen, reheated)", "info": {"Ground beef (~200 g)":[["Energy","500 kcal","25%"],["Protein","40 g","80%"],["Fat","35 g","50%"],["– saturates","14 g","70%"]],"Minerals":[["Iron","5 mg","36%"],["Zinc","10 mg","100%"],["B12","5 mcg","200%"],["Selenium","30 mcg","55%"]]}},
    {"n": "Frozen reheated vegetables", "info": {"Per ~200 g":[["Energy","70 kcal","4%"],["Carbs","12 g","5%"],["Fibre","6 g"],["Protein","4 g","8%"]],"Vitamins":[["K","50 mcg","67%"],["Folate","80 mcg","40%"],["C","30 mg","38%"],["A","300 mcg","38%"]]}},
    "---",
    {"n": "Two kiwis", "info": {"Per 2 (~140 g)":[["Energy","85 kcal","4%"],["Carbs","20 g","8%"],["– sugars","13 g","14%"],["Fibre","4 g"]],"Standouts":[["Vit C","130 mg","163%"],["Vit K","55 mcg","73%"],["Potassium","430 mg","22%"],["Vit E","2 mg","17%"]]}}
   ]},
   {"id": "other", "t": "Other foods", "items": [
    {"n": "Dark chocolate", "info": {"Per ~30 g":[["Energy","170 kcal","9%"],["Fat","13 g","19%"],["– saturates","8 g","40%"],["Carbs","10 g","4%"],["Fibre","3 g"]],"Minerals":[["Magnesium","70 mg","19%"],["Iron","3.4 mg","24%"],["Copper","0.5 mg","50%"],["Manganese","0.6 mg","30%"]]}},
    {"n": "Decaf", "info": {"Per cup (~240 ml)":[["Energy","2 kcal"],["Potassium","115 mg","6%"],["Caffeine","~3 mg"]]}},
    {"n": "Nuts (Walnuts, Almonds, Pistachios)", "info": {"Per ~30 g":[["Energy","180 kcal","9%"],["Fat","16 g","23%"],["Protein","5 g","10%"],["Fibre","2.5 g"]],"Standouts":[["Magnesium","50 mg","13%"],["Vit E","4 mg","33%"],["Omega-3 (ALA)","1.5 g"]]}}
   ]}
  ]
 },
 "MARK": [
  {
   "id": "vitd",
   "cat": "vitmin",
   "dec": [
    "Vitamin D3 5000 IU + K2",
    "Boron 5mg",
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
    40,
    60
   ],
   "oc": "moderate",
   "axis": [
    0,
    120
   ]
  },
  {
   "id": "ca",
   "cat": "vitmin",
   "dec": [
    "Vitamin D3 5000 IU + K2",
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
    "Vitamin D3 5000 IU + K2"
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
    "Iodine 300mcg",
    "Huel"
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
    "Iodine 300mcg"
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
   "dec": [
    "Iodine 300mcg"
   ],
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
   "opt": [
    0,
    10
   ],
   "oc": "strong",
   "axis": [
    0,
    80
   ]
  },
  {
   "id": "hcy",
   "cat": "vitmin",
   "dec": [
    "NAC 2000mg",
    "TMG 1000mg"
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
    "Iodine 300mcg",
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
    "Omega-3 (3g EPA, 1.5g DHA)"
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
    "Zinc + copper",
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
   "dec": [
    "Zinc + copper"
   ],
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
    "TMG 1000mg",
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
    "TMG 1000mg",
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
    90,
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
    "Omega-3 (3g EPA, 1.5g DHA)"
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
   "oc": "strong",
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
    75
   ],
   "opt": [
    0,
    30
   ],
   "oc": "strong",
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
   "oc": "strong",
   "axis": [
    0,
    200
   ]
  },
  {
   "id": "hscrp",
   "cat": "lipid",
   "dec": [
    "Omega-3 (3g EPA, 1.5g DHA)",
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
    "Omega-3 (3g EPA, 1.5g DHA)",
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
   "oc": "strong",
   "axis": [
    0,
    190
   ]
  },
  {
   "id": "hdl",
   "cat": "lipid",
   "dec": [
    "Omega-3 (3g EPA, 1.5g DHA)",
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
   "opt": [
    55,
    100
   ],
   "oc": "weak",
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
    5.7
   ],
   "opt": [
    4.6,
    5.4
   ],
   "oc": "strong",
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
    "NAC 2000mg"
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
    "NAC 2000mg"
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
    "Vitamin D3 5000 IU + K2",
    "Zinc + copper"
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
   "opt": [
    0.2,
    1
   ],
   "oc": "weak",
   "axis": [
    0,
    2
   ]
  },
  {
   "id": "alb",
   "cat": "liver",
   "dec": [
    "Vitamin D3 5000 IU + K2"
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
    5
   ],
   "opt": [
    4,
    5
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
    "Boron 5mg",
    "Finasteride (topical) 0.1% - 1mL",
    "Zinc + copper"
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
    300,
    1000
   ],
   "opt": [
    550,
    900
   ],
   "oc": "moderate",
   "axis": [
    200,
    1100
   ]
  },
  {
   "id": "ft",
   "cat": "horm",
   "dec": [
    "Boron 5mg",
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
   "oc": "moderate",
   "axis": [
    20,
    280
   ]
  },
  {
   "id": "shbg",
   "cat": "horm",
   "dec": [
    "Boron 5mg",
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
    "Boron 5mg",
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
   "opt": [
    20,
    30
   ],
   "oc": "weak",
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
    30,
    85
   ],
   "opt": [
    30,
    85
   ],
   "oc": "weak",
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
   "opt": [
    2,
    7
   ],
   "oc": "weak",
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
    "Omega-3 (3g EPA, 1.5g DHA)",
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
   "id": "hb",
   "cat": "cbc",
   "dec": [
    "Zinc + copper"
   ],
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
   "dec": [
    "Zinc + copper"
   ],
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
   "dec": [
    "Zinc + copper"
   ],
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
   "opt": [
    25,
    35
   ],
   "oc": "moderate",
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
    200
   ],
   "opt": [
    30,
    200
   ],
   "oc": "weak",
   "axis": [
    0,
    400
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
  }
 ],
 "DATA": {
  "draws": [
   {
    "id": "d20201210",
    "date": "2020-12-10",
    "note": "InsideTracker upload",
    "v": {
     "wbc": {
      "r": 6.2,
      "u": "G/L"
     },
     "neut": {
      "r": 4560,
      "u": "cells/µL"
     },
     "lymph": {
      "r": 1050,
      "u": "cells/µL"
     },
     "mono": {
      "r": 470,
      "u": "cells/µL"
     },
     "eos": {
      "r": 50,
      "u": "cells/µL"
     },
     "baso": {
      "r": 70,
      "u": "cells/µL"
     },
     "chol": {
      "r": 156,
      "u": "mg/dL"
     },
     "hdl": {
      "r": 70,
      "u": "mg/dL"
     },
     "ldl": {
      "r": 75,
      "u": "mg/dL"
     },
     "tg": {
      "r": 55,
      "u": "mg/dL"
     },
     "tt": {
      "r": 746.4,
      "u": "ng/dL"
     },
     "mg": {
      "r": 2.1,
      "u": "mg/dL"
     },
     "vitd": {
      "r": 47,
      "u": "ng/mL"
     },
     "glu": {
      "r": 105,
      "u": "mg/dL"
     },
     "a1c": {
      "r": 5.1,
      "u": "%"
     },
     "alt": {
      "r": 25,
      "u": "UI/L"
     },
     "ast": {
      "r": 31,
      "u": "UI/L"
     },
     "ggt": {
      "r": 27,
      "u": "UI/L"
     },
     "ca": {
      "r": 10.3,
      "u": "mg/dL"
     },
     "ferr": {
      "r": 72,
      "u": "µg/L"
     },
     "iron": {
      "r": 82,
      "u": "µg/dL"
     },
     "hb": {
      "r": 16.4,
      "u": "g/dL"
     },
     "rbc": {
      "r": 5.3,
      "u": "10⁶/µL"
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
      "r": 34,
      "u": "g/dL"
     },
     "plt": {
      "r": 166,
      "u": "G/L"
     },
     "k": {
      "r": 4.7,
      "u": "mmol/L"
     },
     "na": {
      "r": 139,
      "u": "mmol/L"
     }
    }
   },
   {
    "id": "d20220514",
    "date": "2022-05-14",
    "note": "InsideTracker upload",
    "v": {
     "wbc": {
      "r": 5.3,
      "u": "G/L"
     },
     "hscrp": {
      "r": 0.5,
      "u": "mg/L"
     },
     "neut": {
      "r": 3320,
      "u": "cells/µL"
     },
     "lymph": {
      "r": 1460,
      "u": "cells/µL"
     },
     "mono": {
      "r": 410,
      "u": "cells/µL"
     },
     "eos": {
      "r": 70,
      "u": "cells/µL"
     },
     "baso": {
      "r": 50,
      "u": "cells/µL"
     },
     "chol": {
      "r": 149,
      "u": "mg/dL"
     },
     "hdl": {
      "r": 53,
      "u": "mg/dL"
     },
     "ldl": {
      "r": 81,
      "u": "mg/dL"
     },
     "tg": {
      "r": 73,
      "u": "mg/dL"
     },
     "vitd": {
      "r": 32,
      "u": "ng/mL"
     },
     "glu": {
      "r": 85,
      "u": "mg/dL"
     },
     "alt": {
      "r": 20,
      "u": "UI/L"
     },
     "ast": {
      "r": 28,
      "u": "UI/L"
     },
     "ggt": {
      "r": 21,
      "u": "UI/L"
     },
     "alb": {
      "r": 5.3,
      "u": "g/dL"
     },
     "ca": {
      "r": 10,
      "u": "mg/dL"
     },
     "hb": {
      "r": 16.3,
      "u": "g/dL"
     },
     "rbc": {
      "r": 5.3,
      "u": "10⁶/µL"
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
      "r": 35,
      "u": "g/dL"
     },
     "plt": {
      "r": 172,
      "u": "G/L"
     },
     "k": {
      "r": 4.4,
      "u": "mmol/L"
     },
     "na": {
      "r": 140,
      "u": "mmol/L"
     }
    }
   },
   {
    "id": "d20230130",
    "date": "2023-01-30",
    "note": "InsideTracker upload. Free T (0.9 ng/dL) excluded: suspected 10x transcription error.",
    "v": {
     "wbc": {
      "r": 4.9,
      "u": "G/L"
     },
     "neut": {
      "r": 2900,
      "u": "cells/µL"
     },
     "lymph": {
      "r": 1470,
      "u": "cells/µL"
     },
     "mono": {
      "r": 390,
      "u": "cells/µL"
     },
     "eos": {
      "r": 100,
      "u": "cells/µL"
     },
     "baso": {
      "r": 30,
      "u": "cells/µL"
     },
     "tt": {
      "r": 553.3,
      "u": "ng/dL"
     },
     "hb": {
      "r": 16.4,
      "u": "g/dL"
     },
     "rbc": {
      "r": 5.3,
      "u": "10⁶/µL"
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
      "r": 35,
      "u": "g/dL"
     },
     "plt": {
      "r": 153,
      "u": "G/L"
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
    "note": "InsideTracker upload",
    "v": {
     "wbc": {
      "r": 4.2,
      "u": "G/L"
     },
     "hscrp": {
      "r": 1.4,
      "u": "mg/L"
     },
     "neut": {
      "r": 2520,
      "u": "cells/µL"
     },
     "lymph": {
      "r": 1060,
      "u": "cells/µL"
     },
     "mono": {
      "r": 460,
      "u": "cells/µL"
     },
     "eos": {
      "r": 90,
      "u": "cells/µL"
     },
     "baso": {
      "r": 50,
      "u": "cells/µL"
     },
     "hb": {
      "r": 15.2,
      "u": "g/dL"
     },
     "rbc": {
      "r": 5,
      "u": "10⁶/µL"
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
      "r": 34,
      "u": "g/dL"
     },
     "plt": {
      "r": 157,
      "u": "G/L"
     }
    }
   },
   {
    "id": "d20240402",
    "date": "2024-04-02",
    "note": "InsideTracker upload",
    "v": {
     "b12": {
      "r": 551,
      "u": "pg/mL"
     },
     "tt": {
      "r": 625.4,
      "u": "ng/dL"
     },
     "ft": {
      "r": 83,
      "u": "pg/mL"
     },
     "shbg": {
      "r": 49,
      "u": "nmol/L"
     },
     "vitd": {
      "r": 29,
      "u": "ng/mL"
     }
    }
   },
   {
    "id": "d2026fr",
    "date": "2026-03-01",
    "note": "French lab (Beckman), 10h fast. On creatine at the time.",
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
   }
  ]
 }
};
