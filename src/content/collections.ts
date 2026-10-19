export interface Collection {
  slug: string;
  label: string;
  title: string;
  description: string;
  intro: string;
  litres?: number;
  series?: string[];
  sections: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  keywords: string[];
}

/** One page per distinct buying decision. Synonyms share a URL; unavailable sizes get no landing page. */
export const COLLECTIONS: Collection[] = [
  {
    slug: "1-litre", label: "1 litre flasks", title: "1 Litre Thermos Flask Price in Pakistan",
    description: "Compare CAPRA 1 litre thermos jugs and bullet flasks in Pakistan. See model prices, lid styles and finishes, with cash on delivery from Gujranwala.",
    intro: "A 1 litre thermos holds roughly four 250 ml cups. Choose a handled jug for pouring at a table or the slimmer BM bullet flask when you need to carry the same capacity in a bag.",
    litres: 1,
    sections: [
      { title: "One litre, two ways to use it", body: "SLD, RIT, CPR, SKM and YKC each offer a 1 litre table flask. Their handles and spouts make them useful for serving tea, coffee or water without lifting off a cup cap. The BM1000 is a personal flask with a cap that doubles as a cup. Start with where you will use it, then compare the lids and finishes." },
      { title: "Compare the exact model", body: "The table shows only 1 litre models, including the available colour finishes. A coloured jug is the C-prefix version of the same size. BM colours share one price. Select the size and colour on the product page before adding it to your basket; a larger model in the same design has a different model code." },
      { title: "When to size up", body: "Four cups is a capacity calculation using 250 ml per cup, not a promise about serving size or heat retention. If several people regularly refill their cups, compare 2 litre jugs. Leave filling space under the lid and follow the care guide instead of filling to the brim." },
    ],
    faq: [{ q: "Is 1000 ml the same as 1 litre?", a: "Yes. 1000 ml, 1L, 1 ltr and 1 litre describe the same nominal capacity." }, { q: "Which 1 litre CAPRA flask has a cup?", a: "The BM1000 bullet flask has a cap that doubles as a cup. The handled jug designs pour into a separate cup." }],
    keywords: ["1 litre thermos price in pakistan", "1 liter thermos flask", "1l vacuum flask", "1000ml thermos", "1 ltr flask"],
  },
  {
    slug: "2-litre", label: "2 litre thermos jugs", title: "2 Litre Thermos Flask Price in Pakistan",
    description: "Shop CAPRA 2 litre thermos jugs for family chai and office tables. Compare five designs, steel and colour prices, with delivery across Pakistan.",
    intro: "A 2 litre jug holds about eight 250 ml cups, making it a practical middle size for a family table or shared office. Compare all five CAPRA jug designs at the same capacity.",
    litres: 2,
    sections: [
      { title: "Choose the lid you will use every day", body: "SLD has a screw-in pour lid. RIT uses a push-button release for one-hand serving, while YKC has a flip-top with a release tab. SKM has a narrow coffee-pot spout and lever lid. CPR is an upright pot supplied in a printed gift box. Capacity alone does not tell you which will be easiest to use." },
      { title: "A family size without the largest jug", body: "Two litres gives a shared table more servings than a 1 litre flask while taking up less room than a 3 litre model. Check the handle and space on your table, and remember that a full jug carries the weight of its contents as well as the steel body. Let an adult pour hot drinks." },
      { title: "Check both finishes", body: "The comparison lists the steel model and its colour counterpart separately, so you can match the model code to your order. The insulation and nominal capacity are the same for the corresponding colour model. Choose a 3 litre SLD, SKM or YKC if eight small cups would still mean frequent refills." },
    ],
    faq: [{ q: "How many cups fit in a 2 litre flask?", a: "At 250 ml per cup, 2 litres is about eight cups before allowing for filling space. Actual servings depend on your cups." }, { q: "Which CAPRA designs come in 2 litres?", a: "SLD, RIT, CPR, SKM and YKC all have 2 litre models in steel and a colour finish." }],
    keywords: ["2 litre thermos price in pakistan", "2 liter tea flask", "2l thermos jug", "2000ml vacuum flask"],
  },
  {
    slug: "3-litre", label: "3 litre vacuum jugs", title: "3 Litre Thermos Flask Price in Pakistan",
    description: "Compare CAPRA 3 litre SLD, SKM and YKC vacuum jugs for guests, shops and shared tea tables. View exact PKR prices and order anywhere in Pakistan.",
    intro: "For guests or a shared tea counter, a 3 litre jug holds roughly twelve 250 ml cups. CAPRA offers this size in the SLD, SKM and YKC designs, with steel and colour options.",
    litres: 3,
    sections: [
      { title: "Three large-jug choices", body: "Choose SLD for the rounded classic tea-jug shape, SKM for a tall coffee-pot profile with a narrow spout, or YKC for a tall body with a release-tab lid. RIT and CPR are made in 1 and 2 litre sizes, so they do not appear in this 3 litre comparison." },
      { title: "Plan for shared serving", body: "A larger jug means fewer trips to refill when serving a group, but it also weighs more when full. Put it on a stable table and keep the handle and spout clear of the edge. Pour hot liquids carefully into separate cups and keep children away from a full hot jug." },
      { title: "Capacity is separate from retention", body: "Three litres describes how much the jug holds. It does not guarantee a set number of hours at a particular temperature. Starting temperature, fill level and how often the lid opens all affect results. Warm the jug with warm water before filling it for tea and close the lid between pours." },
    ],
    faq: [{ q: "Does CAPRA make a 3 litre push-button RIT?", a: "No. RIT is available in 1 and 2 litres. The 3 litre range is SLD, SKM and YKC." }, { q: "Is there a 5 litre CAPRA flask?", a: "The current CAPRA range tops out at 3 litres. There is no 5 litre model in this catalogue." }],
    keywords: ["3 litre thermos price in pakistan", "3 liter vacuum jug", "large tea flask", "3000ml thermos"],
  },
  {
    slug: "tea", label: "Thermos for tea & chai", title: "Thermos Flasks for Tea & Chai in Pakistan",
    description: "Find a CAPRA thermos for tea and chai: compare 1–3 litre steel jugs, pouring lids and current prices. Factory dispatch with Pakistan-wide delivery.",
    intro: "For chai at a shared table, a handled vacuum jug makes pouring easier than a personal bottle. Start with the number of cups you serve, then choose between a screw-in lid, release tab and coffee-pot spout.",
    series: ["SLD", "RIT", "YKC", "SKM"],
    sections: [
      { title: "Match the jug to your tea routine", body: "SLD is a classic rounded jug for family chai. RIT's push-button lid suits repeated cups at an office counter. YKC uses a release tab on a tall everyday jug. SKM pours from a narrower spout and works for tea as well as coffee and kahwa. Compare the 1 litre size for a few cups with 2 or 3 litres for sharing." },
      { title: "Get better results between pours", body: "Pre-warm the flask, empty that water, then fill with freshly prepared tea and close the lid. Keep the lid shut between servings instead of leaving the jug open on the table. The double-wall vacuum slows heat transfer, but results depend on fill level, starting temperature and how often you pour." },
      { title: "Clean after milk tea", body: "Empty leftover chai after use and hand wash the body and lid with mild detergent. Rinse the spout and any removable stopper parts, then dry with the lid off. Do not leave milk tea in a warm flask overnight. See the care guide for cleaning tea residue without scratching the steel." },
    ],
    faq: [{ q: "Which CAPRA thermos is suitable for chai?", a: "SLD, RIT, YKC and SKM are handled vacuum flasks for serving tea. Choose by capacity and the lid you prefer." }, { q: "Does CAPRA guarantee 24-hour hot tea?", a: "No fixed retention-hour guarantee is stated for this range. Temperature depends on use, fill level and the starting temperature." }],
    keywords: ["thermos for tea pakistan", "chai thermos", "tea flask price pakistan", "chai garam rakhne wala thermos"],
  },
  {
    slug: "coffee", label: "Coffee & kahwa flasks", title: "Coffee & Kahwa Thermos Flasks in Pakistan",
    description: "Compare CAPRA coffee and kahwa flasks for breakfast tables and meetings. Shop SKM coffee pots and RIT serving flasks with current Pakistan prices.",
    intro: "For coffee or kahwa served in separate cups, compare the SKM coffee-pot shape with the RIT push-button flask. Both use double-wall vacuum steel; the main choice is how you prefer to pour.",
    series: ["SKM", "RIT"],
    sections: [
      { title: "Coffee pot or push-button flask?", body: "SKM has a slim coffee-pot shape, a narrow spout and a steel flip lid with a press lever. It comes in 1, 2 and 3 litres. RIT has a push-button lid for one-hand serving and comes in 1 or 2 litres. Use the comparison to check each model rather than choosing by the shape alone." },
      { title: "For breakfast and meetings", body: "Choose the smaller size when only a few people share a pot, and size up when several cups are poured in succession. Keep coffee and kahwa in separate clean flasks if you want to avoid carrying aromas between drinks. Rinse and dry the lid as well as the body after every use." },
      { title: "A serving flask stores a prepared drink", body: "These are insulated serving vessels, not kettles or coffee brewers. Prepare the drink separately and transfer it carefully. Do not heat the flask on a stove or place it in a microwave. Close the lid between pours and follow the care instructions for washing the spout and lid mechanism." },
    ],
    faq: [{ q: "Can the SKM coffee pot hold tea or kahwa?", a: "Yes. SKM is for prepared hot and cold drinks, including coffee, tea, kahwa and water." }, { q: "Is this an electric coffee pot?", a: "No. These vacuum flasks store prepared drinks; they do not heat or brew them." }],
    keywords: ["coffee flask pakistan", "kahwa thermos", "coffee pot thermos", "vacuum coffee jug"],
  },
  {
    slug: "hot-water", label: "Hot & cold water flasks", title: "Hot & Cold Water Flasks in Pakistan",
    description: "Shop CAPRA hot and cold water flasks: steel jugs for the table and portable insulated bottles. Compare sizes and prices with delivery in Pakistan.",
    intro: "Use a table jug for shared water or a screw-cap bottle for carrying your own. CAPRA's double-wall vacuum insulation slows temperature change for both hot water and cold drinks.",
    sections: [
      { title: "Choose for carrying or pouring", body: "A handled jug stays on a table and pours into separate cups. A sports bottle is easier to carry using its strap, while a BM bullet flask has a cup cap for travel. The range runs from personal 600 ml bottles to 3 litre jugs. Match the shape to the job before comparing capacity." },
      { title: "Prepare the flask for the drink", body: "For hot water, pre-warm the inside and close the lid promptly after filling. For cold water, chill the flask with cold water first. Do not put the flask in the freezer. Vacuum insulation helps maintain the temperature you start with; it does not boil water, sterilise liquids or actively refrigerate them." },
      { title: "Handle hot water carefully", body: "A cool outer wall does not tell you whether the contents are safe to drink. Open the lid slowly and pour away from your body. For school or independent child use, choose cool water and check that the child can manage the cap and weight. Keep very hot drinks under adult control." },
    ],
    faq: [{ q: "Does a thermos heat cold water?", a: "No. Vacuum insulation slows temperature change; a thermos has no heating element." }, { q: "Can the same flask be used for hot and cold water?", a: "Yes. Clean it between uses and pre-condition with warm or cold water according to the drink." }],
    keywords: ["hot water flask pakistan", "hot and cold thermos", "cold water thermos bottle", "garam pani thermos"],
  },
  {
    slug: "office", label: "Office serving flasks", title: "Office Thermos Flasks & Tea Jugs in Pakistan",
    description: "Compare CAPRA office tea flasks and meeting-room coffee jugs. Choose push-button, narrow-spout or large-capacity designs with factory prices in PKR.",
    intro: "For an office tea counter, choose a lid that is easy to use repeatedly and enough capacity for the group. RIT, SKM and SLD cover push-button serving, coffee-pot pouring and the classic shared tea jug.",
    series: ["RIT", "SKM", "SLD"],
    sections: [
      { title: "Match serving style to the counter", body: "RIT opens with a press of the tab while you hold the handle. SKM's narrower spout suits smaller coffee cups at a breakfast or meeting table. SLD is a rounded everyday jug. Compare how easy the lid is to wash as well as how it pours; several people will often share the same flask." },
      { title: "Size for the team", body: "At 250 ml per cup, 1 litre gives about four cups, 2 litres eight and 3 litres twelve, before allowing filling space. Smaller tea cups give more servings. RIT stops at 2 litres; SLD and SKM include 3 litre options. Separate jugs for tea and plain hot water can help when colleagues prefer different drinks." },
      { title: "Buying for several rooms", body: "For a multi-room office order, write down the model code, finish and quantity for each location. Send the list and required date to the wholesale team for stock and delivery confirmation. A gift or staff order can use boxed pots and jugs; custom branding is only available if the team explicitly confirms it." },
    ],
    faq: [{ q: "Which flask supports one-hand pouring?", a: "The RIT uses a push-button release tab for one-hand serving while holding the handle." }, { q: "Can an office buy several flasks together?", a: "Yes. Send models, quantities, city and required date through the wholesale enquiry page for a confirmed quote." }],
    keywords: ["office thermos pakistan", "tea flask for office", "meeting room coffee flask", "office tea jug"],
  },
  {
    slug: "travel", label: "Travel & bullet flasks", title: "Travel Thermos & Bullet Flasks in Pakistan",
    description: "Compare CAPRA BM bullet flasks and MS sports bottles for travel. See cup caps, carry straps, capacities and current prices, with Pakistan delivery.",
    intro: "A portable flask should fit the way you carry it. BM has a slim bullet shape and cup cap; MS adds a grip sleeve and carry strap for school, sports and everyday travel.",
    series: ["BM", "MS"],
    sections: [
      { title: "Cup cap or carry strap?", body: "The BM bullet flask is available in 600 ml and 1 litre, with an outer cap that doubles as a cup. The MS sports bottle comes in 600 and 750 ml with a fabric strap. Measure the space in your bag or car door rather than assuming any bottle will fit a particular cup holder." },
      { title: "Capacity changes the carrying weight", body: "A litre of water adds about a kilogram before the flask's own weight. A smaller bottle may be easier for a short commute or a child to carry, while the 1 litre BM gives more water for a longer outing. Consider where you can refill instead of choosing the largest size automatically." },
      { title: "Check the closure before packing", body: "Keep the stopper and seals clean, close the cap properly and check for drips before placing a filled flask in a bag. Carry upright when possible, especially with hot drinks. No flask should be treated as indestructible; dents, drops and damage to the lid or vacuum can affect its performance." },
    ],
    faq: [{ q: "Which travel flask comes with a cup?", a: "The BM bullet flask has an outer cup cap and an inner stopper." }, { q: "Does CAPRA sell a 500 ml bottle?", a: "The current personal bottle range starts at 600 ml. MS also comes in 750 ml and BM in 1 litre." }],
    keywords: ["travel thermos pakistan", "bullet flask price pakistan", "thermos bottle for travel", "600ml vacuum flask"],
  },
  {
    slug: "school", label: "School & sports bottles", title: "Steel School & Sports Bottles in Pakistan",
    description: "Shop CAPRA MS stainless steel school and sports bottles in 600 ml and 750 ml. Compare prices, grip sleeves and carry straps with Pakistan delivery.",
    intro: "The MS sports bottle combines double-wall stainless steel with a grip sleeve and carry strap. Choose 600 or 750 ml for cool water at school, the gym or the cricket ground.",
    series: ["MS"],
    sections: [
      { title: "Choose the size a child can carry", body: "The 750 ml bottle holds 150 ml more water than the 600 ml model, with extra weight when full. Check the child's ability to hold the bottle, open the screw cap and use the strap. Measure the bag's bottle pocket and consider opportunities to refill during the day." },
      { title: "Daily washing matters", body: "Empty the bottle after school or training, wash with mild detergent and rinse the cap carefully. Leave it open to dry. For independent child use, fill with cool drinking water rather than very hot tea. A stainless steel body resists shattering, but the lid and seals still need care after drops." },
      { title: "Colours and group orders", body: "MS bottles have the same price across their listed colours. Colour preferences are confirmed before dispatch because cartons arrive mixed. Schools, sports clubs and retailers can ask about 36-piece carton terms; share the size mix and delivery city. Do not assume printing or custom logos are included." },
    ],
    faq: [{ q: "What sizes are available for the MS sports bottle?", a: "MS-600 holds 600 ml and MS-750 holds 750 ml. Both have a carry strap and grip sleeve." }, { q: "Can I choose a bottle colour?", a: "You can request a listed colour. The team confirms availability before dispatch because bottles are packed in mixed-colour cartons." }],
    keywords: ["steel water bottle for school pakistan", "sports bottle price pakistan", "750ml water bottle", "600ml school bottle"],
  },
  {
    slug: "gifts", label: "Boxed thermos gifts", title: "Thermos Gifts for Eid, Weddings & Offices",
    description: "Choose boxed CAPRA thermos gifts for Eid, weddings and offices in Pakistan. Compare CPR vacuum pots and SKM coffee flasks; enquire about bulk orders.",
    intro: "A useful thermos gift starts with how the recipient will use it. CPR is an upright pot in a printed CAPRA gift box; SKM is a serving flask for coffee, tea and breakfast tables.",
    series: ["CPR", "SKM"],
    sections: [
      { title: "A boxed pot for the home", body: "CPR comes in 1 and 2 litres, with brushed steel and red finishes. Its upright shape suits a smaller table, and the printed box makes it straightforward to give as a household gift. Compare SKM if the recipient prefers a narrow-spout coffee-pot design or needs the larger 3 litre size." },
      { title: "Plan event quantities early", body: "For wedding, Eid or office gifting, send a model code, preferred finish, quantity and required arrival date to the trade team. Ask them to confirm stock, packaging and transport before you commit to recipients. The catalogue shows factory list prices; dealer terms depend on the order and are quoted separately." },
      { title: "Check packaging and personalisation", body: "A printed CAPRA box is branded product packaging, not a promise of custom printing, engraving or individual gift wrapping. If you need any of those services, describe the requirement in your enquiry and wait for confirmation. The standard warranty covers manufacturing faults; include the order reference when handing gifts to recipients." },
    ],
    faq: [{ q: "Which CAPRA pot includes a gift box?", a: "The CPR vacuum pot is supplied in a printed CAPRA gift box, as stated in the 2026 dealer catalogue." }, { q: "Are custom logos included?", a: "Custom printing, engraving and individual wrapping are not included as standard. Ask the team to confirm any special requirement before ordering." }],
    keywords: ["thermos gift pakistan", "eid thermos gifts", "wedding thermos gift", "corporate flask gifts pakistan"],
  },
];
export const collectionPath = (slug: string) => `/thermos-flasks/${slug}`;
