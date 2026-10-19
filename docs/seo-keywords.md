# Pakistan thermos flask market: keyword research and implementation

Research date: **19 October 2026**. Market: Pakistan, English, Roman Urdu and Urdu discovery terms. Business: CAPRA / Salman Industries, Gujranwala. Scope: its real 600 ml–3 L stainless steel range and trade supply.

## Evidence and limitations

Live web searches reviewed the following query groups: thermos flask Pakistan price; 1/2/3 litre tea and vacuum flasks; wholesale/manufacturer Gujranwala; 500/750 ml bottles; Urdu thermos price; city/COD searches; corporate gifts and school/travel bottles. Results are observations from this session, not a Pakistan-localised rank tracker. No Google Ads Keyword Planner, Search Console, paid volume API or audited sales dataset was connected. **Monthly volume, keyword difficulty, CPC, market share and expected traffic are unknown.** Priorities below are editorial judgments based on intent, catalogue fit and the work needed to satisfy the query.

Twenty Google autocomplete seeds were also captured with `gl=pk` in `docs/research/autocomplete.json`. Some responses include foreign markets; the parameter does not prove Pakistan-only demand. Empty suggestions are preserved. The map includes 157 explicit keyword entries (50 additional observed suggestions) and 2,034 generated locality candidates.

`docs/research/keywords.csv` provides the keyword-to-URL map with intent, editorial priority, evidence group and coverage status. `docs/research/geographic-keywords.csv` supplies locality query variants. Those generated combinations are targeting candidates, not proof that each phrase has search demand. Regional locality records are not all unique cities: municipal subdivisions and cantonments remain distinct official records.

## Search observations and primary sources

| Evidence | Observation | Implication |
| --- | --- | --- |
| [PowerHouse Express thermos collection](https://powerhouseexpress.com.pk/collections/thermos-flask) | Price-led collection with brand and capacity comparisons | Own the verified CAPRA model/price comparison; do not assert market-wide cheapest or best |
| [HomeSolutionsPK thermos category](https://homesolutionspk.com/product-category/kitchenware/drinkware/thermos-in-pakistan/) | Tea/coffee, steel, glass-lined and multiple-capacity vocabulary | Help visitors choose construction and use; avoid unsupported comparisons |
| [JB Saeed thermos collection](https://www.jbsaeedstudio.com/collections/thermos-flasks) | Glass/steel and size distinctions | Match precise capacity to actual products |
| [Shoppers PK 1 litre product](https://www.shopperspk.com/product/thermos-insulated-vacuum-flask-hot-water-tea-coffee-drinks-thermos-1liter/) | Hot water, tea, coffee, price, COD and city delivery wording | Address use, price and delivery together |
| [Homegadgets category](https://homegadgets.pk/product-category/kitchenware/serveware/drinkware-in-pakistan/thermos-and-vaccum-flask/) | Pump airpots and larger dispensers alongside personal flasks | This broader segment is outside CAPRA's current catalogue |
| [CAPRA reseller listing](https://heavenofhomes.com/products/capra%C2%AE-stainless-steel-thermos-flask-1l-2l-3l-double-wall-vacuum-insulated-hot-cold-water-bottle-24-hour-heat-cold-retention-premium-tea-coffee-jug-for-home-office) | CAPRA brand plus size and material terms | CAPRA branded discovery should lead to manufacturer facts; reseller retention claims are not imported |
| [THANDAK office product](https://thandak.pk/products/passion-series-sus304-stainless-steel-vacuum-bottle-1000ml) | Office/chai use-case language including Roman Urdu | Office and chai are useful separate user decisions, without copying promotional claims |
| [CorporateGifting travel collection](https://corporategifting.pk/product-category/travel-flask/) | Corporate, travel and quantity-led procurement | A trade/gift path should collect quantity and date; competitors' services do not prove CAPRA offers printing |
| [Giftlee bottle collection](https://corporate.giftlee.pk/corporate-gifts/promotional-products/bottles/) | Promotional bottle gifting terminology | Research candidate only where CAPRA can substantiate the service |
| Owner-provided Dealer Catalogue 2026, pp. 1–11 | Real range, carton packing, gift boxes, trade number and terms | Product and trade claims use first-party evidence |

Retailer prices and stock change. This research does not reproduce them as a permanent comparison or imply a ranking order. Keyword forms are independent phrases, not copied product descriptions.

## Intent architecture and URL ownership

| Cluster | Primary owner | Supporting intent | Priority |
| --- | --- | --- | --- |
| Branded manufacturer | `/` | CAPRA flask, Salman Industries thermos, Gujranwala manufacturer | P1 |
| Broad transactional | `/shop` | buy thermos online Pakistan, vacuum flask COD | P1 |
| Capacity/use navigation | `/thermos-flasks` | choose thermos size, thermos by use | P1 |
| Category jugs | `/vacuum-jugs` | thermos jug price, steel vacuum jug | P1 |
| Category portable bottles | `/insulated-bottles` | insulated water bottle, bullet flask | P1 |
| Exact prices | `/prices` | CAPRA thermos price list, model/finish comparison | P1 |
| 1 litre / 1000 ml / 1L / 1 ltr | `/thermos-flasks/1-litre` | compare handled jugs and BM1000 at one size | P1 |
| 2 litre / 2000 ml / 2L | `/thermos-flasks/2-litre` | family chai, five jug designs | P1 |
| 3 litre / 3000 ml / 3L | `/thermos-flasks/3-litre` | guests, shared counter, SLD/SKM/YKC only | P1 |
| Tea / chai | `/thermos-flasks/tea` | serving style, cleaning milk tea, capacity | P1 |
| Coffee / kahwa | `/thermos-flasks/coffee` | SKM/RIT lids and prepared-drink serving | P2 |
| Hot and cold water | `/thermos-flasks/hot-water` | table jugs versus personal bottles | P2 |
| Office | `/thermos-flasks/office` | push-button serving, meeting capacity, office orders | P2 |
| Travel / commuting / bullet | `/thermos-flasks/travel` | cup cap, strap, portable capacities | P2 |
| School / gym / sports | `/thermos-flasks/school` | MS 600/750 ml, cap, weight and care | P2 |
| Eid / wedding / corporate gifts | `/thermos-flasks/gifts` | boxed CPR/SKM, quantity and date | P2, seasonal |
| Wholesale quotation | `/wholesale` | bulk supply, carton/dealer quote | P1 |
| Dealer resources | `/dealers` | download catalogue, order sheet, verified terms | P1 |
| National delivery | `/delivery` | city directory entry point, fees, returns | P1 |
| Regional / city discovery | `/delivery/[region]#district` | locality + thermos delivery, complete address and trade guidance | P2 |
| Informational price intent | `/blog/thermos-price-in-pakistan` | what affects price, contextual buyer advice | P2 |
| Selection and care | existing three other journal guides, `/care-guide`, `/help`, `/warranty` | selection, retention factors, cleaning, after-sales | P2 |

Exact model searches stay on the seven product URLs. Model names, SKUs, capacity and colour variants are supplied by the same product records used by the basket and ProductGroup schema. Capacity pages compare only the relevant sizes; their quick-add controls also use that size. This prevents a 3 litre landing page from adding a default 1 litre flask.

`thermos price in Pakistan` spans purchase and informational intent. Use `/prices` for the live model table and the existing blog article for explanation. Avoid creating additional generic price pages that compete with them. There is no guarantee Google chooses the intended owner for a mixed-intent query; monitor in Search Console.

## Geographic coverage

The data file `src/content/pakistan-localities.json` includes **657 populated urban locality rows** from the [PBS Census 2023 Table 2 district workbooks](https://www.pbs.gov.pk/result-excel/): Punjab 287, Sindh 236, KP 67, Balochistan 66 and Islamabad 1. Municipal suffixes MC/TC are removed for display, while subdivisions/cantonments remain. All records are retained so smaller official urban localities can be found; the number is not a count of distinct cities or delivery guarantees.

Selected destinations supplement the census list for [Gilgit-Baltistan government tourism districts](https://visitgilgitbaltistan.gov.pk/pages/our-districts) and [AJK government regional information](https://ajk.gov.pk/helplines/): 11 and 10 respectively. These supplements are **not exhaustive settlement registers**. Rural villages and recent administrative changes are not all covered. The site offers an explicit full-address enquiry path for unlisted destinations. The provenance manifest retains the source URLs, record counts and method.

Seven indexable region pages present distinct address/transport advice, searchable district links, the locality lists, product guidance and trade contacts. City/town names point to district anchors on the regional page. Search engines index the containing page, not each fragment as an independent landing page. Karachi subdivisions remain under Sindh; Rawalpindi is Punjab, separate from Islamabad.

Mass-producing one interchangeable page per locality would create little visitor value. Google's [doorway and scaled-content policies](https://developers.google.com/search/docs/essentials/spam-policies) inform this choice. Add a dedicated city page only when real city-specific value exists: a verified stockist, confirmed delivery service/terms, collection information, local case study or distinct logistics. No branches, reviews or stockists are invented.

## Urdu and Roman Urdu

Research candidates include `chai ka thermos`, `chai garam rakhne wala thermos`, `garam pani thermos`, `thermos ki qeemat`, `steel ki bottle`, `تھرموس کی قیمت`, `چائے کا تھرموس`, `گرم پانی کا تھرموس` and `سٹیل کی پانی کی بوتل`. These have unverified demand. English pages naturally use chai and kahwa where appropriate. Do not claim full Urdu coverage: no unreviewed translated landing-page network or incorrect hreflang has been added. Prioritise a human-reviewed Urdu buying guide if Search Console supports that demand.

## Broader market gaps

Do not create sales pages for unavailable products: 350/500 ml or 5 L capacities, electric flasks, LED temperature displays, pump airpots, glass refill replacements, food jars, straw tumblers, imported Stanley/Thermos/Tiger/Zojirushi products or thermosteel brands. Likewise, engraving/custom logo service, exact retention hours, lowest-price claims, wholesale discounts, dealer territories and guaranteed arrival dates need evidence. These are product/service opportunities for the owner, not features the app can manufacture with SEO copy.

## GEO implementation

Google's [AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) supports the same indexing and useful-content fundamentals as ordinary search. There is no special schema or AI text file that guarantees inclusion. The existing llms/Markdown endpoints are optional alternate access formats, not a ranking promise.

The implementation adds readable answer paragraphs, size/finish/price tables sourced through shop helpers, visible FAQs matching their JSON-LD, navigable regional lists and factual manufacturer/trade context. New routes participate in sitemap, internal links, deferred site search, Markdown rewrites and llms.txt. Important information is server rendered; discovery does not require a search interaction. Existing organization identity remains one Gujranwala factory, rather than fake LocalBusiness entities in each city.

## Validation and post-launch measurement

Run `npm run build`, `npm run check:seo`, `npm run check:browser` against a production server and `npm run audit:lighthouse`. Lighthouse checks the four standard categories with a documented 90/100/100/100 lab budget. Browser verification crawls indexable routes, checks links/anchors, mobile overflow, new Markdown routes, nonexistent routes, city search and capacity-correct basket additions. Lighthouse lab results do not establish live Core Web Vitals; the final report records the environment and scope.

After deployment, verify Search Console and Bing Webmaster Tools and submit `/sitemap.xml`. Verify the factory Business Profile and product/merchant listings using real business data. Confirm remote courier coverage and catalogue freshness operationally. These account actions were not performed here.

At 28/56/90 days review indexed pages, impressions, clicks, query/landing-page matches, region pages, city modifiers, add-to-cart and completed orders. Segment mobile/desktop and branded/non-branded terms. Use actual conversions to reorder priorities. Obtain Keyword Planner/paid volume data if budget planning requires quantitative demand; do not replace unknowns with invented numbers.
