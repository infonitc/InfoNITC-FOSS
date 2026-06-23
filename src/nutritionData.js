// Nutritional data for NITC Mess Menu
// Sources: IFCT 2017 (Indian Food Composition Tables), NIN Hyderabad,
//          USDA FoodData Central for items not in IFCT.
// All values per SERVING (not per 100g) unless stated.
// Disclaimer: Approximate values based on standard serving sizes.

// Per-item nutrition
// { kcal, protein(g), carbs(g), fat(g), fibre(g), sugar(g), sodium(mg),
//   calcium(mg), iron(mg), vitC(mg), vitA(mcg), serving }

const ITEMS = {
  // BREAKFAST STAPLES
  "idli_1pc":         { kcal:39,  protein:1.7, carbs:8.0,  fat:0.2, fibre:0.5, sugar:0.2, sodium:100, calcium:12,  iron:0.3, vitC:0,  vitA:0,   serving:"1 piece (40g)" },
  "masala_dosa":      { kcal:210, protein:5.0, carbs:32.0, fat:7.0, fibre:2.0, sugar:1.5, sodium:320, calcium:30,  iron:1.2, vitC:5,  vitA:15,  serving:"1 dosa (150g)" },
  "rava_dosa":        { kcal:185, protein:4.5, carbs:28.0, fat:6.5, fibre:1.2, sugar:1.0, sodium:290, calcium:20,  iron:0.9, vitC:0,  vitA:0,   serving:"1 dosa (120g)" },
  "vada_1pc":         { kcal:97,  protein:3.5, carbs:11.0, fat:4.5, fibre:1.5, sugar:0.5, sodium:180, calcium:18,  iron:0.8, vitC:0,  vitA:0,   serving:"1 piece (50g)" },
  "poha":             { kcal:160, protein:3.0, carbs:32.0, fat:2.5, fibre:1.5, sugar:1.0, sodium:200, calcium:10,  iron:1.5, vitC:2,  vitA:5,   serving:"1 cup (100g)" },
  "oothappam":        { kcal:120, protein:3.5, carbs:20.0, fat:3.0, fibre:1.5, sugar:1.0, sodium:220, calcium:25,  iron:0.7, vitC:0,  vitA:10,  serving:"1 piece (90g)" },
  "poori_1pc":        { kcal:112, protein:2.5, carbs:14.0, fat:5.5, fibre:0.8, sugar:0.3, sodium:120, calcium:10,  iron:0.8, vitC:0,  vitA:0,   serving:"1 piece (50g)" },
  "bhaji":            { kcal:85,  protein:2.5, carbs:10.0, fat:4.0, fibre:2.5, sugar:2.0, sodium:180, calcium:30,  iron:1.0, vitC:20, vitA:40,  serving:"1 serve (80g)" },
  "vellappam_1pc":    { kcal:95,  protein:2.0, carbs:18.0, fat:1.5, fibre:0.5, sugar:0.5, sodium:80,  calcium:8,   iron:0.4, vitC:0,  vitA:0,   serving:"1 piece (70g)" },
  "veg_stew":         { kcal:110, protein:2.5, carbs:12.0, fat:5.5, fibre:2.0, sugar:3.0, sodium:220, calcium:40,  iron:0.8, vitC:15, vitA:80,  serving:"1 cup (150ml)" },
  "noolputtu":        { kcal:130, protein:3.0, carbs:26.0, fat:0.8, fibre:0.5, sugar:0.3, sodium:60,  calcium:6,   iron:0.5, vitC:0,  vitA:0,   serving:"1 serve (80g)" },
  "kadala_curry":     { kcal:145, protein:7.0, carbs:20.0, fat:4.5, fibre:5.0, sugar:1.5, sodium:280, calcium:50,  iron:2.5, vitC:5,  vitA:10,  serving:"1 cup (120g)" },
  "aloo_paratha":     { kcal:235, protein:5.5, carbs:36.0, fat:8.0, fibre:3.0, sugar:1.0, sodium:310, calcium:30,  iron:1.5, vitC:8,  vitA:5,   serving:"1 piece (120g)" },
  "curd_50ml":        { kcal:30,  protein:1.8, carbs:2.5,  fat:1.5, fibre:0,   sugar:2.5, sodium:35,  calcium:70,  iron:0.1, vitC:0,  vitA:15,  serving:"50ml (PDF spec)" },
  "paav_bhaji":       { kcal:280, protein:7.0, carbs:42.0, fat:9.0, fibre:4.0, sugar:5.0, sodium:480, calcium:60,  iron:2.0, vitC:25, vitA:60,  serving:"1 serve (200g)" },
  "millet_upma":      { kcal:150, protein:4.0, carbs:28.0, fat:3.0, fibre:3.5, sugar:0.5, sodium:180, calcium:20,  iron:1.8, vitC:0,  vitA:0,   serving:"1 cup (120g)" },
  "rava_upma":        { kcal:165, protein:4.5, carbs:28.0, fat:4.5, fibre:1.5, sugar:0.5, sodium:220, calcium:15,  iron:1.0, vitC:0,  vitA:5,   serving:"1 cup (120g)" },
  "poha_namkeen":     { kcal:160, protein:3.0, carbs:32.0, fat:2.5, fibre:1.5, sugar:1.0, sodium:280, calcium:10,  iron:1.5, vitC:0,  vitA:0,   serving:"1 cup (100g)" },
  "puttu":            { kcal:210, protein:4.5, carbs:43.0, fat:1.5, fibre:2.0, sugar:0.5, sodium:50,  calcium:12,  iron:1.2, vitC:0,  vitA:0,   serving:"1 serve (120g)" },
  "pongal":           { kcal:200, protein:5.5, carbs:34.0, fat:5.5, fibre:2.0, sugar:0.5, sodium:220, calcium:25,  iron:1.0, vitC:0,  vitA:0,   serving:"1 cup (150g)" },
  "mix_veg_paratha":  { kcal:220, protein:5.0, carbs:34.0, fat:7.5, fibre:3.5, sugar:1.5, sodium:290, calcium:35,  iron:1.5, vitC:10, vitA:20,  serving:"1 piece (120g)" },
  "pathiri":          { kcal:105, protein:2.5, carbs:20.0, fat:1.5, fibre:0.8, sugar:0.2, sodium:80,  calcium:8,   iron:0.6, vitC:0,  vitA:0,   serving:"1 piece (60g)" },
  "green_peas_curry": { kcal:120, protein:5.5, carbs:16.0, fat:4.0, fibre:4.5, sugar:3.0, sodium:250, calcium:35,  iron:1.5, vitC:10, vitA:30,  serving:"1 cup (120g)" },
  "boiled_egg":       { kcal:78,  protein:6.3, carbs:0.6,  fat:5.3, fibre:0,   sugar:0.6, sodium:62,  calcium:25,  iron:0.9, vitC:0,  vitA:80,  serving:"1 large egg (50g)" },
  "cornflakes_20g":   { kcal:74,  protein:1.6, carbs:17.0, fat:0.1, fibre:0.6, sugar:2.5, sodium:130, calcium:3,   iron:2.0, vitC:0,  vitA:0,   serving:"20g (PDF spec)" },
  "bread_2sl":        { kcal:140, protein:5.0, carbs:26.0, fat:1.5, fibre:1.5, sugar:2.5, sodium:280, calcium:50,  iron:1.5, vitC:0,  vitA:0,   serving:"2 slices (60g)" },
  "seasonal_fruit":   { kcal:60,  protein:0.8, carbs:15.0, fat:0.3, fibre:2.0, sugar:12,  sodium:5,   calcium:15,  iron:0.3, vitC:20, vitA:30,  serving:"1 medium (100g)" },
  "milk_200ml":       { kcal:130, protein:6.8, carbs:9.6,  fat:7.2, fibre:0,   sugar:9.6, sodium:100, calcium:240, iron:0.1, vitC:2,  vitA:70,  serving:"200ml" },
  "green_gram_boiled":{ kcal:105, protein:7.0, carbs:19.0, fat:0.4, fibre:7.6, sugar:1.5, sodium:15,  calcium:27,  iron:1.4, vitC:3,  vitA:5,   serving:"½ cup (75g)" },

  // LUNCH / DINNER STAPLES (mandatory items)
  "rice_cooked":      { kcal:206, protein:4.3, carbs:45.0, fat:0.4, fibre:0.6, sugar:0,   sodium:1,   calcium:16,  iron:0.4, vitC:0,  vitA:0,   serving:"1 cup (180g)" },
  "kerala_rice":      { kcal:200, protein:4.0, carbs:44.0, fat:0.5, fibre:0.8, sugar:0,   sodium:3,   calcium:10,  iron:0.6, vitC:0,  vitA:0,   serving:"1 cup (180g)" },
  "sambar":           { kcal:85,  protein:4.5, carbs:12.0, fat:2.5, fibre:3.5, sugar:2.0, sodium:350, calcium:45,  iron:1.5, vitC:10, vitA:50,  serving:"1 cup (200ml)" },
  "dal":              { kcal:115, protein:7.5, carbs:18.0, fat:2.0, fibre:5.0, sugar:1.0, sodium:280, calcium:40,  iron:2.0, vitC:2,  vitA:5,   serving:"1 cup (150ml)" },
  "chapati":          { kcal:104, protein:3.1, carbs:18.0, fat:2.5, fibre:2.5, sugar:0.3, sodium:120, calcium:20,  iron:1.0, vitC:0,  vitA:0,   serving:"1 piece (40g)" },
  "buttermilk_50ml":  { kcal:12,  protein:0.8, carbs:1.2,  fat:0.5, fibre:0,   sugar:1.2, sodium:40,  calcium:35,  iron:0,   vitC:0,  vitA:5,   serving:"50ml (PDF spec)" },
  "rasam":            { kcal:35,  protein:1.0, carbs:5.5,  fat:1.0, fibre:0.8, sugar:1.5, sodium:280, calcium:15,  iron:0.5, vitC:8,  vitA:20,  serving:"1 cup (150ml)" },
  "pickle":           { kcal:25,  protein:0.4, carbs:3.0,  fat:1.2, fibre:0.5, sugar:0.5, sodium:580, calcium:8,   iron:0.3, vitC:2,  vitA:10,  serving:"1 tbsp (20g)" },
  "papad":            { kcal:45,  protein:2.5, carbs:7.5,  fat:0.5, fibre:0.8, sugar:0.2, sodium:290, calcium:15,  iron:0.5, vitC:0,  vitA:0,   serving:"1 piece (10g)" },
  "cut_fruits_80g":   { kcal:48,  protein:0.7, carbs:12.0, fat:0.2, fibre:1.6, sugar:10,  sodium:4,   calcium:12,  iron:0.2, vitC:16, vitA:25,  serving:"80g (PDF spec)" },
  "thoran":           { kcal:90,  protein:2.5, carbs:8.0,  fat:5.5, fibre:3.0, sugar:1.5, sodium:150, calcium:40,  iron:1.2, vitC:20, vitA:30,  serving:"1 serve (80g)" },
  "moru_curry":       { kcal:65,  protein:3.0, carbs:5.0,  fat:3.5, fibre:0.5, sugar:3.5, sodium:220, calcium:90,  iron:0.2, vitC:2,  vitA:15,  serving:"1 cup (150ml)" },
  "veg_salad_100g":   { kcal:35,  protein:1.5, carbs:6.0,  fat:0.5, fibre:2.0, sugar:3.0, sodium:50,  calcium:30,  iron:0.5, vitC:15, vitA:40,  serving:"100g (PDF spec)" },
  "raita":            { kcal:60,  protein:3.0, carbs:5.0,  fat:3.0, fibre:0.5, sugar:4.0, sodium:120, calcium:100, iron:0.2, vitC:5,  vitA:20,  serving:"½ cup (100g)" },

  // CHICKEN / EGG / FISH (lunch/dinner)
  "chicken_lunch_80g":{ kcal:165, protein:22.0,carbs:3.0,  fat:7.5, fibre:0.5, sugar:0.5, sodium:380, calcium:20,  iron:1.2, vitC:0,  vitA:25,  serving:"80g chicken + 20g masala (PDF spec)" },
  "chicken_dinner_100g":{kcal:205,protein:27.5,carbs:4.0,  fat:9.0, fibre:0.5, sugar:0.5, sodium:470, calcium:25,  iron:1.5, vitC:0,  vitA:30,  serving:"100g chicken + 20g masala (PDF spec)" },
  "fish_fry_75g":     { kcal:145, protein:18.0,carbs:5.0,  fat:6.0, fibre:0,   sugar:0.2, sodium:320, calcium:180, iron:1.0, vitC:0,  vitA:20,  serving:"75g fish slice (PDF spec)" },
  "egg_omelette":     { kcal:145, protein:10.5,carbs:1.5,  fat:11.0,fibre:0,   sugar:0.5, sodium:280, calcium:50,  iron:1.5, vitC:0,  vitA:120, serving:"2 eggs (100g)" },
  "egg_masala":       { kcal:160, protein:11.0,carbs:5.0,  fat:11.0,fibre:1.0, sugar:1.5, sodium:340, calcium:60,  iron:1.8, vitC:5,  vitA:130, serving:"2 eggs with masala" },
  "egg_bhurji":       { kcal:175, protein:11.5,carbs:4.0,  fat:12.5,fibre:0.8, sugar:1.5, sodium:360, calcium:55,  iron:1.8, vitC:5,  vitA:140, serving:"2 eggs with onion/tomato" },
  "netholi_75g":      { kcal:110, protein:16.0,carbs:2.0,  fat:4.5, fibre:0,   sugar:0,   sodium:310, calcium:220, iron:1.2, vitC:0,  vitA:15,  serving:"75g Netholi (PDF spec)" },

  // PANEER DISHES
  "paneer_dish_50g":  { kcal:165, protein:8.5, carbs:6.0,  fat:12.0,fibre:0.5, sugar:1.5, sodium:280, calcium:200, iron:0.5, vitC:3,  vitA:40,  serving:"50g paneer (PDF spec) + gravy" },
  "paneer_butter_masala":{ kcal:220,protein:10.0,carbs:12.0,fat:16.0,fibre:1.5,sugar:4.0, sodium:420, calcium:220, iron:0.8, vitC:8,  vitA:80,  serving:"50g paneer + sauce" },
  "mutter_paneer":    { kcal:190, protein:9.5, carbs:14.0, fat:11.5,fibre:3.0, sugar:3.0, sodium:350, calcium:180, iron:1.5, vitC:10, vitA:50,  serving:"50g paneer + peas" },
  "kadai_paneer":     { kcal:200, protein:9.0, carbs:10.0, fat:14.0,fibre:2.0, sugar:3.5, sodium:380, calcium:195, iron:0.8, vitC:15, vitA:70,  serving:"50g paneer + veggies" },

  // VEG CURRIES / SIDE DISHES
  "rajma_masala":     { kcal:165, protein:9.5, carbs:27.0, fat:3.5, fibre:7.5, sugar:2.0, sodium:380, calcium:55,  iron:2.5, vitC:5,  vitA:15,  serving:"1 cup (180g)" },
  "aloo_fry":         { kcal:140, protein:2.5, carbs:22.0, fat:5.0, fibre:2.0, sugar:1.0, sodium:220, calcium:15,  iron:1.0, vitC:15, vitA:5,   serving:"1 serve (120g)" },
  "chana_masala":     { kcal:160, protein:8.5, carbs:24.0, fat:4.5, fibre:6.5, sugar:2.5, sodium:340, calcium:60,  iron:3.0, vitC:8,  vitA:20,  serving:"1 cup (180g)" },
  "chole_bhature":    { kcal:350, protein:12.0,carbs:48.0, fat:13.0,fibre:8.0, sugar:3.0, sodium:520, calcium:80,  iron:3.5, vitC:10, vitA:25,  serving:"1 serve bhature + chole" },
  "dal_makhani":      { kcal:180, protein:9.0, carbs:22.0, fat:6.5, fibre:6.0, sugar:2.0, sodium:420, calcium:70,  iron:2.8, vitC:3,  vitA:30,  serving:"1 cup (180g)" },
  "dal_tadka":        { kcal:145, protein:8.5, carbs:20.0, fat:4.0, fibre:5.5, sugar:1.5, sodium:330, calcium:50,  iron:2.2, vitC:3,  vitA:10,  serving:"1 cup (180g)" },
  "mix_veg_sabji":    { kcal:110, protein:3.5, carbs:14.0, fat:5.0, fibre:3.5, sugar:3.0, sodium:260, calcium:50,  iron:1.5, vitC:25, vitA:90,  serving:"1 cup (150g)" },
  "aloo_gobi":        { kcal:120, protein:3.0, carbs:16.0, fat:5.5, fibre:3.0, sugar:2.5, sodium:240, calcium:40,  iron:1.2, vitC:30, vitA:20,  serving:"1 cup (150g)" },
  "bhindi_masala":    { kcal:95,  protein:2.5, carbs:10.0, fat:5.0, fibre:3.5, sugar:2.0, sodium:220, calcium:85,  iron:0.8, vitC:18, vitA:40,  serving:"1 cup (150g)" },
  "kovakka_fry":      { kcal:85,  protein:2.0, carbs:9.0,  fat:4.5, fibre:2.5, sugar:2.0, sodium:180, calcium:25,  iron:0.6, vitC:15, vitA:20,  serving:"1 cup (120g)" },
  "kootu_curry":      { kcal:130, protein:4.5, carbs:16.0, fat:6.0, fibre:4.5, sugar:2.0, sodium:230, calcium:55,  iron:1.8, vitC:8,  vitA:35,  serving:"1 cup (150g)" },
  "avial":            { kcal:140, protein:3.0, carbs:15.0, fat:7.5, fibre:4.0, sugar:3.5, sodium:200, calcium:60,  iron:1.0, vitC:20, vitA:80,  serving:"1 cup (150g)" },
  "soya_fry":         { kcal:135, protein:12.0,carbs:8.0,  fat:6.0, fibre:2.5, sugar:1.0, sodium:280, calcium:40,  iron:2.5, vitC:2,  vitA:5,   serving:"1 serve (100g)" },
  "aloo_soybean":     { kcal:155, protein:8.5, carbs:18.0, fat:5.5, fibre:4.0, sugar:1.5, sodium:290, calcium:45,  iron:2.0, vitC:12, vitA:10,  serving:"1 cup (150g)" },
  "chilly_chicken":   { kcal:220, protein:23.0,carbs:10.0, fat:10.0,fibre:1.5, sugar:3.0, sodium:550, calcium:30,  iron:1.5, vitC:15, vitA:20,  serving:"1 serve (150g)" },
  "kadai_chicken":    { kcal:240, protein:25.0,carbs:8.0,  fat:13.0,fibre:2.0, sugar:2.5, sodium:480, calcium:35,  iron:1.8, vitC:20, vitA:40,  serving:"1 serve (150g)" },
  "chicken_curry":    { kcal:195, protein:22.0,carbs:6.0,  fat:9.5, fibre:1.0, sugar:2.0, sodium:420, calcium:30,  iron:1.5, vitC:5,  vitA:25,  serving:"1 serve (150g)" },
  "capsicum_corn_curry":{ kcal:130,protein:4.0, carbs:18.0, fat:5.5, fibre:3.5, sugar:5.0, sodium:280, calcium:30,  iron:0.8, vitC:50, vitA:30,  serving:"1 cup (150g)" },

  // BIRIYANI / RICE DISHES
  "chicken_biriyani": { kcal:420, protein:28.0,carbs:55.0, fat:10.0,fibre:2.0, sugar:2.0, sodium:650, calcium:50,  iron:2.5, vitC:5,  vitA:30,  serving:"1 plate (300g)" },
  "veg_biriyani":     { kcal:350, protein:8.0, carbs:60.0, fat:9.0, fibre:3.5, sugar:2.5, sodium:520, calcium:55,  iron:2.0, vitC:8,  vitA:40,  serving:"1 plate (280g)" },
  "egg_biriyani":     { kcal:380, protein:18.0,carbs:55.0, fat:10.5,fibre:2.0, sugar:2.0, sodium:580, calcium:60,  iron:2.2, vitC:3,  vitA:80,  serving:"1 plate (280g)" },
  "gopi_manchurian":  { kcal:185, protein:5.5, carbs:22.0, fat:8.5, fibre:2.5, sugar:4.0, sodium:450, calcium:35,  iron:0.8, vitC:40, vitA:20,  serving:"1 serve (150g)" },
  "podi_paneer":      { kcal:175, protein:8.5, carbs:8.0,  fat:13.0,fibre:1.0, sugar:1.5, sodium:340, calcium:180, iron:0.6, vitC:5,  vitA:35,  serving:"50g paneer (PDF spec)" },
  "ghee_rice":        { kcal:290, protein:5.0, carbs:48.0, fat:9.0, fibre:0.5, sugar:0.5, sodium:120, calcium:20,  iron:0.8, vitC:0,  vitA:0,   serving:"1 cup (200g)" },
  "veg_fried_rice":   { kcal:280, protein:6.5, carbs:48.0, fat:7.0, fibre:2.5, sugar:2.0, sodium:480, calcium:30,  iron:1.2, vitC:10, vitA:25,  serving:"1 cup (200g)" },
  "veg_manchurian":   { kcal:160, protein:4.0, carbs:20.0, fat:7.5, fibre:2.5, sugar:4.0, sodium:420, calcium:30,  iron:0.8, vitC:15, vitA:15,  serving:"1 serve (150g)" },
  "aloo_mutter":      { kcal:145, protein:5.5, carbs:20.0, fat:5.0, fibre:4.5, sugar:3.0, sodium:300, calcium:40,  iron:1.8, vitC:12, vitA:30,  serving:"1 cup (150g)" },
  "bisibele_bath":    { kcal:220, protein:8.0, carbs:38.0, fat:5.0, fibre:4.0, sugar:1.5, sodium:380, calcium:50,  iron:2.0, vitC:5,  vitA:20,  serving:"1 cup (180g)" },
  "tomato_rice":      { kcal:235, protein:5.0, carbs:42.0, fat:6.0, fibre:2.0, sugar:4.0, sodium:320, calcium:25,  iron:1.2, vitC:15, vitA:40,  serving:"1 cup (180g)" },
  "curd_rice":        { kcal:175, protein:5.5, carbs:30.0, fat:4.5, fibre:0.5, sugar:3.5, sodium:180, calcium:120, iron:0.3, vitC:0,  vitA:20,  serving:"1 cup (180g)" },
  "pulao":            { kcal:260, protein:6.0, carbs:44.0, fat:7.0, fibre:2.0, sugar:1.5, sodium:360, calcium:30,  iron:1.0, vitC:5,  vitA:15,  serving:"1 cup (180g)" },
  "mandi_alfahm":     { kcal:380, protein:28.0,carbs:42.0, fat:12.0,fibre:1.5, sugar:1.5, sodium:580, calcium:45,  iron:2.5, vitC:3,  vitA:25,  serving:"1 plate (300g)" },
  "kadai_veg":        { kcal:140, protein:4.5, carbs:14.0, fat:8.0, fibre:3.5, sugar:4.0, sodium:330, calcium:60,  iron:1.0, vitC:30, vitA:60,  serving:"1 cup (150g)" },
  "thattu_dosa":      { kcal:175, protein:4.5, carbs:30.0, fat:4.5, fibre:1.5, sugar:1.0, sodium:260, calcium:20,  iron:0.8, vitC:0,  vitA:0,   serving:"2 pieces (120g)" },
  "chilly_gopi":      { kcal:165, protein:5.0, carbs:20.0, fat:8.0, fibre:3.0, sugar:5.0, sodium:420, calcium:40,  iron:0.8, vitC:45, vitA:20,  serving:"1 cup (150g)" },
  "puttu_kadala":     { kcal:355, protein:11.5,carbs:62.0, fat:6.0, fibre:9.5, sugar:2.0, sodium:110, calcium:62,  iron:3.7, vitC:5,  vitA:10,  serving:"1 serve puttu+kadala (200g)" },
  "porotta":          { kcal:195, protein:4.5, carbs:28.0, fat:7.5, fibre:1.0, sugar:0.5, sodium:240, calcium:15,  iron:1.2, vitC:0,  vitA:0,   serving:"2 pieces (100g)" },
  "kheer_50ml":       { kcal:100, protein:2.5, carbs:18.0, fat:2.5, fibre:0,   sugar:16,  sodium:50,  calcium:80,  iron:0.2, vitC:0,  vitA:20,  serving:"50ml (PDF spec)" },
  "gulab_jamun":      { kcal:150, protein:2.5, carbs:25.0, fat:5.5, fibre:0.3, sugar:22,  sodium:80,  calcium:40,  iron:0.4, vitC:0,  vitA:10,  serving:"2 pieces (80g)" },
  "green_peas_kuruma":{ kcal:135, protein:6.0, carbs:17.0, fat:5.5, fibre:5.0, sugar:3.5, sodium:300, calcium:45,  iron:1.8, vitC:12, vitA:35,  serving:"1 cup (150g)" },
  "nice_pathiri":     { kcal:110, protein:2.5, carbs:22.0, fat:1.5, fibre:0.8, sugar:0.5, sodium:85,  calcium:8,   iron:0.6, vitC:0,  vitA:0,   serving:"2 pieces (80g)" },
  "veg_soup_50ml":    { kcal:18,  protein:0.5, carbs:3.0,  fat:0.3, fibre:0.5, sugar:1.0, sodium:180, calcium:8,   iron:0.2, vitC:3,  vitA:10,  serving:"50ml (PDF spec)" },
  "pachhadi":         { kcal:55,  protein:1.5, carbs:7.0,  fat:2.5, fibre:1.0, sugar:4.5, sodium:140, calcium:35,  iron:0.3, vitC:5,  vitA:20,  serving:"2 tbsp (50g)" },
  "paneer_burjee":    { kcal:155, protein:9.0, carbs:4.0,  fat:11.5,fibre:0.5, sugar:1.5, sodium:300, calcium:195, iron:0.5, vitC:3,  vitA:40,  serving:"50g paneer (PDF spec)" },
  "veg_noodles":      { kcal:250, protein:6.5, carbs:42.0, fat:7.0, fibre:2.5, sugar:3.0, sodium:480, calcium:30,  iron:1.5, vitC:8,  vitA:15,  serving:"1 plate (200g)" },
  "chilli_paneer":    { kcal:200, protein:9.5, carbs:12.0, fat:13.0,fibre:1.5, sugar:4.5, sodium:460, calcium:185, iron:0.7, vitC:20, vitA:45,  serving:"50g paneer (PDF spec) + sauce" },
  "tawa_veg":         { kcal:115, protein:3.0, carbs:12.0, fat:6.0, fibre:3.0, sugar:3.5, sodium:280, calcium:45,  iron:1.0, vitC:25, vitA:50,  serving:"1 serve (120g)" },
  "veg_pulao":        { kcal:255, protein:5.5, carbs:43.0, fat:7.5, fibre:2.5, sugar:2.0, sodium:350, calcium:35,  iron:1.2, vitC:6,  vitA:20,  serving:"1 cup (180g)" },
  "mushroom_masala":  { kcal:120, protein:4.5, carbs:10.0, fat:7.5, fibre:2.0, sugar:3.0, sodium:320, calcium:10,  iron:0.8, vitC:4,  vitA:0,   serving:"1 cup (150g)" },
  "pindi_chole":      { kcal:170, protein:8.5, carbs:25.0, fat:5.0, fibre:7.0, sugar:2.0, sodium:380, calcium:65,  iron:3.2, vitC:8,  vitA:20,  serving:"1 cup (180g)" },
  "mirchi_salan":     { kcal:130, protein:3.5, carbs:10.0, fat:9.0, fibre:2.5, sugar:3.0, sodium:290, calcium:40,  iron:1.0, vitC:30, vitA:15,  serving:"1 serve (100g)" },
  "wheat_upma":       { kcal:155, protein:4.5, carbs:27.0, fat:3.5, fibre:2.5, sugar:0.5, sodium:200, calcium:20,  iron:1.5, vitC:0,  vitA:0,   serving:"1 cup (120g)" },

  // EVENING TEA SNACKS
  "snacks_generic":   { kcal:180, protein:4.0, carbs:25.0, fat:7.0, fibre:1.5, sugar:3.0, sodium:280, calcium:20,  iron:0.8, vitC:0,  vitA:0,   serving:"1 serve (varies)" },
  "veg_samosa":       { kcal:130, protein:3.0, carbs:18.0, fat:5.5, fibre:2.0, sugar:1.0, sodium:250, calcium:20,  iron:0.8, vitC:3,  vitA:5,   serving:"1 piece (60g)" },
  "bread_pakoda":     { kcal:165, protein:5.0, carbs:22.0, fat:7.0, fibre:1.5, sugar:1.0, sodium:300, calcium:40,  iron:1.2, vitC:2,  vitA:10,  serving:"1 piece (70g)" },
  "chana_chat":       { kcal:155, protein:7.5, carbs:22.0, fat:4.0, fibre:6.0, sugar:3.0, sodium:320, calcium:50,  iron:2.5, vitC:8,  vitA:15,  serving:"1 serve (100g)" },
  "veg_manchurian_snack":{ kcal:140,protein:3.5,carbs:18.0,fat:6.0, fibre:2.0, sugar:3.5, sodium:380, calcium:25,  iron:0.6, vitC:10, vitA:10,  serving:"4–5 pieces (100g)" },
  "bhel_puri":        { kcal:160, protein:4.5, carbs:28.0, fat:4.5, fibre:2.5, sugar:3.5, sodium:350, calcium:30,  iron:1.5, vitC:5,  vitA:10,  serving:"1 serve (100g)" },
  "peanut_chat":      { kcal:175, protein:8.0, carbs:14.0, fat:10.5,fibre:3.0, sugar:1.5, sodium:180, calcium:30,  iron:1.5, vitC:3,  vitA:0,   serving:"1 serve (80g)" },
  "kachori":          { kcal:195, protein:4.5, carbs:24.0, fat:9.0, fibre:2.5, sugar:1.5, sodium:280, calcium:25,  iron:1.2, vitC:0,  vitA:0,   serving:"1 piece (80g)" },
  "maggie":           { kcal:205, protein:5.5, carbs:34.0, fat:6.0, fibre:1.5, sugar:1.5, sodium:500, calcium:15,  iron:1.8, vitC:0,  vitA:0,   serving:"½ pack (45g)" },
  "onion_pakoda":     { kcal:145, protein:3.5, carbs:16.0, fat:7.5, fibre:2.0, sugar:1.5, sodium:230, calcium:30,  iron:1.0, vitC:5,  vitA:5,   serving:"4–5 pieces (80g)" },
  "vada_pav":         { kcal:250, protein:6.5, carbs:38.0, fat:8.5, fibre:3.0, sugar:2.5, sodium:420, calcium:40,  iron:1.5, vitC:5,  vitA:10,  serving:"1 piece (150g)" },
  "masala_pav":       { kcal:185, protein:5.0, carbs:28.0, fat:6.0, fibre:2.0, sugar:3.0, sodium:360, calcium:45,  iron:1.0, vitC:8,  vitA:20,  serving:"1 serve (120g)" },
};

// MANDATORY ITEMS (added to every meal)
const MANDATORY_BREAKFAST = [
  "boiled_egg","cornflakes_20g","bread_2sl","seasonal_fruit","milk_200ml","green_gram_boiled",
];

const MANDATORY_LUNCH = [
  "rice_cooked","kerala_rice","sambar","dal","chapati",
  "buttermilk_50ml","rasam","pickle","papad","cut_fruits_80g","thoran","moru_curry",
];

const MANDATORY_DINNER = [
  "rice_cooked","sambar","dal","chapati",
  "buttermilk_50ml","rasam","pickle","papad","veg_salad_100g",
];

// Day menus — item keys per day/meal
const DAY_ITEMS = {
  "Day 1": {
    breakfast: ["masala_dosa","idli_1pc","idli_1pc","vada_1pc","poha",...MANDATORY_BREAKFAST],
    lunch:     ["chicken_lunch_80g","fish_fry_75g","rajma_masala","aloo_fry","pachhadi","cut_fruits_80g",...MANDATORY_LUNCH],
    eveningTea:["snacks_generic"],
    dinner:    ["chicken_dinner_100g","gulab_jamun","green_peas_kuruma","porotta","pathiri",...MANDATORY_DINNER],
  },
  "Day 2": {
    breakfast: ["poori_1pc","poori_1pc","bhaji","vellappam_1pc","veg_stew","oothappam",...MANDATORY_BREAKFAST],
    lunch:     ["chicken_biriyani","gopi_manchurian","podi_paneer","raita",...MANDATORY_LUNCH],
    eveningTea:["snacks_generic"],
    dinner:    ["pulao","mix_veg_sabji","soya_fry","dal_tadka","gulab_jamun","puttu_kadala",...MANDATORY_DINNER],
  },
  "Day 3": {
    breakfast: ["rava_dosa","pathiri","green_peas_curry",...MANDATORY_BREAKFAST],
    lunch:     ["chicken_lunch_80g","fish_fry_75g","egg_omelette","bhindi_masala","aloo_gobi","cut_fruits_80g","kootu_curry",...MANDATORY_LUNCH],
    eveningTea:["snacks_generic"],
    dinner:    ["egg_masala","egg_bhurji","mutter_paneer","mix_veg_sabji","vellappam_1pc",...MANDATORY_DINNER],
  },
  "Day 4": {
    breakfast: ["idli_1pc","idli_1pc","vada_1pc","noolputtu","kadala_curry","aloo_paratha","curd_50ml",...MANDATORY_BREAKFAST],
    lunch:     ["chicken_lunch_80g","fish_fry_75g","egg_omelette","aloo_soybean","cut_fruits_80g","kovakka_fry",...MANDATORY_LUNCH],
    eveningTea:["snacks_generic"],
    dinner:    ["veg_fried_rice","veg_manchurian","aloo_mutter","gulab_jamun",...MANDATORY_DINNER],
  },
  "Day 5": {
    breakfast: ["paav_bhaji","vellappam_1pc","veg_stew","millet_upma",...MANDATORY_BREAKFAST],
    lunch:     ["mandi_alfahm","kadai_veg","gulab_jamun",...MANDATORY_LUNCH],
    eveningTea:["snacks_generic"],
    dinner:    ["chilly_chicken","paneer_burjee","capsicum_corn_curry","nice_pathiri",...MANDATORY_DINNER],
  },
  "Day 6": {
    breakfast: ["poori_1pc","poori_1pc","bhaji","poha_namkeen","puttu","kadala_curry",...MANDATORY_BREAKFAST],
    lunch:     ["bisibele_bath","tomato_rice","curd_rice","chapati","chana_masala","thoran","raita","gulab_jamun",...MANDATORY_LUNCH],
    eveningTea:["snacks_generic"],
    dinner:    ["ghee_rice","kadai_chicken","chole_bhature","kadai_paneer","kheer_50ml",...MANDATORY_DINNER],
  },
  "Day 7": {
    breakfast: ["aloo_paratha","mix_veg_paratha","curd_50ml","pongal","noolputtu","kadala_curry",...MANDATORY_BREAKFAST],
    lunch:     ["chicken_biriyani","egg_biriyani","veg_biriyani","paneer_butter_masala","raita",...MANDATORY_LUNCH],
    eveningTea:["snacks_generic"],
    dinner:    ["veg_pulao","chilly_gopi","thattu_dosa","veg_soup_50ml",...MANDATORY_DINNER],
  },
};

// E Mess (fixed weekly)
const E_MESS_ITEMS = {
  Monday: {
    breakfast: ["masala_dosa","poha",...MANDATORY_BREAKFAST],
    lunch:     ["tomato_rice","mix_veg_sabji","dal_tadka","kadai_paneer",...MANDATORY_LUNCH],
    eveningTea:["veg_samosa","snacks_generic"],
    dinner:    ["mix_veg_sabji","rasam","aloo_fry",...MANDATORY_DINNER],
  },
  Tuesday: {
    breakfast: ["poori_1pc","poori_1pc","bhaji","wheat_upma",...MANDATORY_BREAKFAST],
    lunch:     ["tomato_rice","soya_fry","dal_tadka","paneer_dish_50g","raita",...MANDATORY_LUNCH],
    eveningTea:["bread_pakoda","chana_chat"],
    dinner:    ["aloo_fry","bhindi_masala","dal_tadka",...MANDATORY_DINNER],
  },
  Wednesday: {
    breakfast: ["oothappam",...MANDATORY_BREAKFAST],
    lunch:     ["tomato_rice","mix_veg_sabji","aloo_gobi",...MANDATORY_LUNCH],
    eveningTea:["veg_manchurian_snack","bhel_puri"],
    dinner:    ["kadai_paneer","rasam","mix_veg_sabji",...MANDATORY_DINNER],
  },
  Thursday: {
    breakfast: ["idli_1pc","idli_1pc","aloo_paratha","curd_50ml",...MANDATORY_BREAKFAST],
    lunch:     ["veg_pulao","kadai_paneer","dal_tadka","sambar",...MANDATORY_LUNCH],
    eveningTea:["peanut_chat","snacks_generic"],
    dinner:    ["thoran","chole_bhature","curd_rice",...MANDATORY_DINNER],
  },
  Friday: {
    breakfast: ["rava_dosa","poha_namkeen",...MANDATORY_BREAKFAST],
    lunch:     ["veg_fried_rice","mix_veg_sabji","dal_tadka",...MANDATORY_LUNCH],
    eveningTea:["kachori","maggie"],
    dinner:    ["rajma_masala","mix_veg_sabji","rasam","dal_makhani",...MANDATORY_DINNER],
  },
  Saturday: {
    breakfast: ["idli_1pc","idli_1pc","vada_1pc",...MANDATORY_BREAKFAST],
    lunch:     ["tomato_rice","aloo_fry","chana_masala","dal_makhani",...MANDATORY_LUNCH],
    eveningTea:["onion_pakoda","chana_chat"],
    dinner:    ["veg_noodles","chilli_paneer","tawa_veg",...MANDATORY_DINNER],
  },
  Sunday: {
    breakfast: ["paav_bhaji","rava_upma",...MANDATORY_BREAKFAST],
    lunch:     ["veg_pulao","mushroom_masala","rasam","raita",...MANDATORY_LUNCH],
    eveningTea:["vada_pav","masala_pav"],
    dinner:    ["veg_biriyani","pindi_chole","mirchi_salan",...MANDATORY_DINNER],
  },
};

// Helper: sum nutrition for a list of item keys
export function sumNutrition(itemKeys) {
  const result = {
    kcal:0, protein:0, carbs:0, fat:0, fibre:0,
    sugar:0, sodium:0, calcium:0, iron:0, vitC:0, vitA:0,
  };
  const sources = [];
  const missing  = [];

  itemKeys.forEach(key => {
    const item = ITEMS[key];
    if (!item) { missing.push(key); return; }
    Object.keys(result).forEach(k => { result[k] += item[k]||0; });
    sources.push({ name: key.replace(/_/g," "), serving: item.serving });
  });

  // Round all values
  Object.keys(result).forEach(k => { result[k] = Math.round(result[k]); });
  return { totals: result, sources, missing };
}

// Public API: get nutrition for a rotational day/meal
export function getRotationalNutrition(dayKey, meal) {
  const items = DAY_ITEMS[dayKey]?.[meal];
  if (!items) return null;
  return sumNutrition(items);
}

// Public API: get nutrition for E mess
export function getEMessNutrition(dayName, meal) {
  const items = E_MESS_ITEMS[dayName]?.[meal];
  if (!items) return null;
  return sumNutrition(items);
}
