import localities from "./pakistan-localities.json";

/** Census locality names are a discovery directory, not a list of branches or courier guarantees. */
export const REGIONS = localities;
export const localityAnchor = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const regionPath = (slug: string) => `/delivery/${slug}`;
export const localityPath = (region: string, district: string) => `${regionPath(region)}#${localityAnchor(district)}`;

export const REGION_ADVICE: Record<string, { intro: string; address: string; trade: string; note: string }> = {
  punjab: {
    intro: "Order CAPRA thermos flasks for delivery across Punjab from the factory in Gujranwala. Compare table jugs for family chai, push-button flasks for office counters and smaller bottles for daily travel before choosing a size.",
    address: "Include your district and tehsil as well as the city, street and house or shop number. Where several towns share a name, a nearby landmark and postcode help us confirm the correct destination.",
    trade: "Crockery shops can compare five jug designs in 1, 2 and 3 litre sizes. RIT and CPR stop at 2 litres; SLD, SKM and YKC include a 3 litre model. Tell the trade team which sizes sell in your shop before requesting a carton quote.",
    note: "Factory dispatch is from Gujranwala. A Punjab address does not imply same-day delivery or collection without arrangement; contact the team if you want to collect an order.",
  },
  sindh: {
    intro: "Shop stainless steel thermos flasks and insulated bottles for delivery to Sindh, including Karachi, Hyderabad, Sukkur and the towns in the directory below. Choose a pouring jug for shared drinks or a personal bottle for water on the move.",
    address: "For Karachi, include the area, block, building and floor. Elsewhere, include the taluka and district alongside your town. A reachable mobile number helps the courier locate homes and market shops.",
    trade: "Retailers can request mixed-colour MS sports bottle cartons or BM bullet flasks, and boxed jugs for the crockery shelf. Share your city, model mix and number of cartons so the team can quote cargo or courier arrangements.",
    note: "Karachi's census entries include municipal subdivisions and cantonments. These are address references, not separate CAPRA outlets. Delivery availability is checked for your complete address.",
  },
  "khyber-pakhtunkhwa": {
    intro: "Buy CAPRA vacuum flasks for delivery in Khyber Pakhtunkhwa, from Peshawar and Mardan to Abbottabad, Swat and other listed destinations. Compare portable bullet flasks with handled jugs for serving tea at home or work.",
    address: "Give the town, tehsil, district and nearest landmark. For valley or outlying addresses, tell us the nearest courier-accessible town so the team can check the delivery arrangement before dispatch.",
    trade: "For office counters, compare RIT's push-button lid with the larger SLD and YKC jugs. Shops stocking travel drinkware can request the MS and BM bottle carton terms separately from boxed jug quantities.",
    note: "Road access and the final courier route can affect remote deliveries. Ask about a required arrival date before ordering; the usual national delivery estimate is not a date guarantee.",
  },
  balochistan: {
    intro: "Compare CAPRA thermos jugs and bottles for delivery to Balochistan, including Quetta, Khuzdar, Gwadar and other towns. All orders are packed at the Gujranwala factory; choose by capacity, lid style and how you plan to carry or serve drinks.",
    address: "Provide the district, town, complete street or bazaar address and an active mobile number. For addresses outside a main town, contact us with the nearest cargo or courier point before placing a time-sensitive order.",
    trade: "Ask the trade team to confirm the practical cargo or courier option for your destination. Include carton quantities and jug model codes; trade freight and commercial terms are confirmed with the quote.",
    note: "A locality appearing in this directory does not promise doorstep courier coverage. Outlying routes and delivery dates require confirmation for the actual address.",
  },
  islamabad: {
    intro: "Order CAPRA vacuum jugs, tea flasks and insulated bottles for Islamabad. A personal bottle suits a commute, a 1 litre flask serves a small desk group and a 2 or 3 litre jug reduces refills for a shared meeting table.",
    address: "Include the sector or housing society, street, house or office number and building floor. For offices, add a recipient phone number and reception instructions. Rawalpindi addresses belong in the Punjab directory.",
    trade: "Office buyers can compare the RIT push-button flask with the SKM coffee pot. For corporate gifts, specify the model, quantity and required date; the factory confirms packaging and stock before accepting the schedule.",
    note: "Orders ship from Gujranwala rather than an Islamabad branch. Contact the team before promising an event or meeting date to your recipients.",
  },
  "gilgit-baltistan": {
    intro: "Explore CAPRA flasks for Gilgit-Baltistan, including Gilgit and Skardu. A BM bullet flask includes a cup cap for personal travel; handled vacuum jugs suit a table where several people share tea or hot water.",
    address: "Send the town or village, district, nearest accessible courier point and mobile number. Confirm the route before ordering for a remote valley, hotel or guesthouse, particularly when arrival timing matters.",
    trade: "Guesthouses and retailers can request boxed jug quantities and bottle cartons from the trade team. Provide the destination and travel or event date so transport, stock and the order size can be checked together.",
    note: "The destinations below are a selected regional guide, not an exhaustive settlement register. Mountain road conditions and courier access can extend the usual national estimate.",
  },
  "azad-kashmir": {
    intro: "Choose CAPRA thermos flasks for Azad Kashmir, including Muzaffarabad, Mirpur and the district destinations below. Compare stainless steel table jugs for guests with smaller screw-cap bottles for individual use.",
    address: "Include the district, tehsil, village or town and nearest landmark. For hillside or outlying addresses, ask us to confirm the nearest reachable courier destination before you place a time-sensitive order.",
    trade: "Crockery retailers and guesthouse buyers can request a mix of boxed jugs or personal bottle cartons. Send your model codes, quantities and destination to obtain confirmed dealer terms and transport arrangements.",
    note: "This is a selected destination list. Unlisted villages may still be reachable; contact the team with the full address. Delivery and cash collection depend on the confirmed courier route.",
  },
};
