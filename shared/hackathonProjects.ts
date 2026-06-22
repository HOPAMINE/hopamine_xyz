// Shared hackathon directory projects — used by the frontend and Convex seed.

export type HackathonField =
  | "Circular"
  | "Civic"
  | "Learning"
  | "Food"
  | "Coordination"
  | "DeepTech"
  | "Maps"
  | "Other";

export type HackathonProject = {
  field: HackathonField;
  title: string;
  builder: string;
  discord?: string;
  blurb: string;
  liveUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
};

export const HACKATHON_PROJECTS: HackathonProject[] = [
  {
    "field": "Circular",
    "title": "Ripe",
    "builder": "jaeger tang",
    "discord": "j__7__",
    "blurb": "Sign-up-free map: drop a pin to give away surplus garden produce; neighbor claims and pays peer-to-peer.",
    "liveUrl": "https://ripe-psi.vercel.app/",
    "demoUrl": "https://ripe-pitch.vercel.app/",
    "repoUrl": "https://github.com/jtng3/ripe"
  },
  {
    "field": "Civic",
    "title": "City Reporting",
    "builder": "Sujal Thapa",
    "discord": "joshnua.",
    "blurb": "A WAY TO EASILY REPORT CIVIC ISSUES WITH YOUR LOCAL GOVERNMENT.",
    "demoUrl": "https://youtube.com/shorts/wKW2nnGKVRE"
  },
  {
    "field": "Maps",
    "title": "Cumulus",
    "builder": "Semi Cole",
    "discord": "semicole6475",
    "blurb": "Recommends where to deploy atmospheric water-harvesting by combining environmental and community-need data.",
    "demoUrl": "https://www.loom.com/share/74b01e12385e47dda63def239eced626"
  },
  {
    "field": "Civic",
    "title": "GREENIFI",
    "builder": "Laura Riondet",
    "discord": ".shalize",
    "blurb": "Every concern leads to a 'Seed' solution or help request, building a public record of fixes plus a notice generator.",
    "liveUrl": "https://greenifi.app",
    "demoUrl": "https://www.loom.com/share/74f63ff4d1454679bb5cb9d39110f3d4"
  },
  {
    "field": "Circular",
    "title": "Myci",
    "builder": "Laura Riondet",
    "discord": ".shalize",
    "blurb": "Offline-first PWA for neighborhood mutual aid; each exchange grows a visible 'mycelium' map. No money, no ratings.",
    "liveUrl": "https://myci.app",
    "demoUrl": "https://www.loom.com/share/8f1070d8e56946d0be039b36adb8a809"
  },
  {
    "field": "Circular",
    "title": "Remake",
    "builder": "Maryam Farhan",
    "discord": "maryam_59358",
    "blurb": "Circular-economy marketplace linking waste-givers, makers, and buyers; makers claim materials and sell what they build.",
    "liveUrl": "https://italic-lurch-92243192.figma.site/",
    "demoUrl": "https://drive.google.com/file/d/1wVSqHNFPD0_J4LbugMSIbeb0vM261mNp/view?usp=sharing"
  },
  {
    "field": "Civic",
    "title": "GREENIFI (team)",
    "builder": "luca kastenbaum",
    "discord": "lucak777",
    "blurb": "Same project as Laura's GREENIFI: connects the problem, the solution, the support, and the proof in one place.",
    "liveUrl": "https://www.greenifi.app/",
    "demoUrl": "https://www.loom.com/share/a9062f06320e4c9fb7be006ed3c591ee"
  },
  {
    "field": "Circular",
    "title": "Geospatial Barter",
    "builder": "Ayaz Zaman",
    "discord": "Oldpeng",
    "blurb": "Barter / mutual-aid platform; a route planner chains pickups into one trip and shows CO2, fuel, and time saved.",
    "demoUrl": "https://www.loom.com/share/d3eb2939a89440a8bda511569672c8ff"
  },
  {
    "field": "Learning",
    "title": "Green Quest",
    "builder": "Adrian Leon",
    "discord": "adrianleon",
    "blurb": "Pick an interest, get hands-on sustainability quests; local orgs post needs that become quests for nearby learners.",
    "liveUrl": "https://solarpunkhackathon-one.vercel.app/",
    "demoUrl": "https://drive.google.com/file/d/1U4tCI8OpbKg031bBBR19I0Cp2g56PFI5/view"
  },
  {
    "field": "Food",
    "title": "Plant Species & Cultivation Guide",
    "builder": "Raghav Gaur",
    "discord": "universal2775",
    "blurb": "Identify plant species and get a cultivation guide.",
    "demoUrl": "https://drive.google.com/file/d/1ucXk3gn9Km8rQH9yFAkzesj2Qsksz4re/view?usp=sharing"
  },
  {
    "field": "Coordination",
    "title": "FORGE",
    "builder": "Farah Mohamed Farah",
    "discord": "faradumatin",
    "blurb": "Run community projects open-source style: claimable tasks, public logs, credit, forkable playbooks.",
    "liveUrl": "https://forge-eight-flame.vercel.app/",
    "demoUrl": "https://youtu.be/eXQymgGvorE"
  },
  {
    "field": "Learning",
    "title": "Anima Commune",
    "builder": "EMMA MASON",
    "discord": "e0k1",
    "blurb": "Educational social network around herbs, plants, and fungi; share and improve gardens with AI scoring."
  },
  {
    "field": "Food",
    "title": "Plant Detector / Soil Quality",
    "builder": "Liam bencomo",
    "discord": "x.enzon3",
    "blurb": "Plant detector with location-based soil quality and environmental factors, plus species and edibility.",
    "demoUrl": "https://drive.google.com/file/d/1R1oUZb5WAgfwW2FZCUnd8Y6lV-Pw_Muk/view?usp=sharing"
  },
  {
    "field": "Civic",
    "title": "Proxima Parada (Next Stop)",
    "builder": "Caroline Torres",
    "discord": "cruella04472",
    "blurb": "Pixel-art PWA game: walk your city, find real grassroots org events, RSVP in one tap. Privacy-first.",
    "demoUrl": "https://drive.google.com/file/d/19Od_C79Mr8JduVyOqIjh68qqThfCaIi8/view?usp=sharing"
  },
  {
    "field": "Learning",
    "title": "Habi",
    "builder": "Alishba Khattak",
    "discord": "Alishba",
    "blurb": "AI sustainability coach: 5 questions, 3 weekly habits with CO2/water/money impact. Built for the Global South.",
    "liveUrl": "https://habi-coach.com/",
    "demoUrl": "https://www.loom.com/share/63da767226944390aff3817d90bda72d"
  },
  {
    "field": "Other",
    "title": "Lies Make Fires",
    "builder": "Alexis B",
    "discord": "Lexfantasea",
    "blurb": "Chrome extension that surfaces verified climate sources at the top of search results to fight misinformation.",
    "liveUrl": "https://linkly.link/2kSay",
    "demoUrl": "https://www.loom.com/share/b24c7b5ca1bb48199a2ede9a85083507",
    "repoUrl": "https://github.com/glarrainv/LiesMakeFires"
  },
  {
    "field": "Food",
    "title": "Green Garden",
    "builder": "Isaiah Jackson",
    "discord": "ZAYJAMMAR!",
    "blurb": "Connects people with garden-able land to the know-how for regenerative gardens (food forests, pollinator plots).",
    "demoUrl": "https://us06web.zoom.us/clips/share/dLcXOA0gTNKTHsPWqdvKfA"
  },
  {
    "field": "Learning",
    "title": "Educational AI Experience",
    "builder": "Josue Saavedra",
    "discord": "josue1.8.9",
    "blurb": "Eco-friendly educational AI experience that deepens understanding of topics you choose.",
    "demoUrl": "https://www.loom.com/share/104b6ea20fa34c9a93b6915c0afb5ffa"
  },
  {
    "field": "Maps",
    "title": "EcoEye / EcoProof",
    "builder": "Arthur Allen",
    "discord": "7kz.pinguin",
    "blurb": "Donated old phones become a LoRa mesh detecting fire, chainsaws, and intruders on indigenous land, plus a legal proof chain.",
    "demoUrl": "https://youtu.be/gOxndoEPUJE"
  },
  {
    "field": "Food",
    "title": "Stakes (Green Recipe Swap)",
    "builder": "Basil Wright",
    "discord": "grasscrest",
    "blurb": "Paste a recipe; it scores each ingredient on 4 environmental measures and suggests greener swaps. Runs client-side.",
    "liveUrl": "https://green-recipe-swap.pages.dev/",
    "demoUrl": "https://youtu.be/6vHnh1VhpnY"
  },
  {
    "field": "Civic",
    "title": "Community Observations to Action",
    "builder": "Evan Kilgard",
    "discord": "Evan kill >:^(",
    "blurb": "Turns community observations into collective action; AI organizes input and surfaces shared priorities on a map.",
    "demoUrl": "https://www.loom.com/share/253ae087b7594d9f9d7f3fd2df6e82f1"
  },
  {
    "field": "Circular",
    "title": "LoCo",
    "builder": "Nikolay Baruh",
    "discord": "ribss.",
    "blurb": "Social app to connect your local green community: organize events and find circular-economy businesses.",
    "demoUrl": "https://www.youtube.com/watch?v=JM-VHlRzJ0I"
  },
  {
    "field": "Learning",
    "title": "Solarpunk City Sandbox Game",
    "builder": "Nyx Sardonic",
    "discord": "candlelitworkshop",
    "blurb": "3D sandbox: design cities from eco-modules that reward symbiosis; teaches solarpunk systems thinking.",
    "demoUrl": "https://canva.link/t0222ypof4566mk"
  },
  {
    "field": "Civic",
    "title": "Commons",
    "builder": "Pedro Rodrigues",
    "discord": "@Prodr",
    "blurb": "One shared map for the informal life of a city: drop a pin for anything you offer or need. No ads, no algorithm.",
    "liveUrl": "https://commons-yodait22-cmyks-projects.vercel.app",
    "demoUrl": "https://www.loom.com/share/75403ced6aca41cc9cd6113bb5ebce61"
  },
  {
    "field": "Circular",
    "title": "Heartlight (Wish Exchange Portal)",
    "builder": "Atlas Morphoenix",
    "discord": "atlasmorphoenix",
    "blurb": "Gift-economy 'Wish Exchange Portal' with an open ledger; cast wishes and fulfill aligned exchanges.",
    "liveUrl": "https://heartlight.atlasisland.co/",
    "demoUrl": "https://www.loom.com/share/246cd8e39adb4c3290f8c815486609d1",
    "repoUrl": "https://github.com/blubuttxrfly/heartlight-collective.git"
  },
  {
    "field": "Food",
    "title": "EDEN Commons",
    "builder": "Daniel Amado",
    "discord": "daniel.acl9",
    "blurb": "Living almanac: enter location and crop, get a 12-month calendar blending climate data and community knowledge.",
    "demoUrl": "https://www.youtube.com/watch?v=Q3hLeN6GExw"
  },
  {
    "field": "Coordination",
    "title": "Open Bus Stop",
    "builder": "Nathaniel Wert",
    "discord": "n89529",
    "blurb": "Prototype bus-stop display from parsed GTFS data; open-sources the electrical, CAD, and code.",
    "demoUrl": "https://youtube.com/shorts/O9DhvrFyZKQ?feature=share",
    "repoUrl": "https://github.com/N8BWert/open-bus-stop"
  },
  {
    "field": "Circular",
    "title": "ChronoShare",
    "builder": "Ayaan B",
    "discord": "jungl3master",
    "blurb": "Solarpunk time-bank: trade skills in hours, transparent ledger, plus a solidarity hours pool. 11 languages.",
    "demoUrl": "https://www.loom.com/share/4f18e9f571b44247b990502b00052f04"
  },
  {
    "field": "Learning",
    "title": "AptiPlant",
    "builder": "Samuel Ngandu",
    "discord": "mr_nooby2845",
    "blurb": "Experts map their journey into visual roadmaps; learners remix them to enter eco-innovation.",
    "liveUrl": "https://project-oktaj.vercel.app",
    "demoUrl": "https://www.youtube.com/watch?v=S6t1aXeSvr0"
  },
  {
    "field": "Learning",
    "title": "Grass Roots",
    "builder": "Ethan Barsketis",
    "discord": "etbars",
    "blurb": "Marketplace for hands-on land-based learning; AI 'Residency Studio' matches a skill to a host site and drafts a course.",
    "liveUrl": "https://grassroots.earth",
    "demoUrl": "https://drive.google.com/file/d/1rjcJhd56aFWVcyNmyRUfRhbtcGR342Um/view?usp=sharing"
  },
  {
    "field": "DeepTech",
    "title": "MutaScore",
    "builder": "Ishani Bakshi",
    "discord": "fckthjsnsjwn",
    "blurb": "AI tool ranks PETase enzyme mutations (ESM-2), narrowing millions of options to the best lab candidates.",
    "liveUrl": "https://lambent-pastelito-800a8f.netlify.app/",
    "demoUrl": "https://youtu.be/tihXpi2wXuc"
  },
  {
    "field": "Maps",
    "title": "Visible",
    "builder": "Natasha Silvestre",
    "discord": "mycarbonai",
    "blurb": "Photograph a working local eco-initiative; AI maps it and generates a how-to guide to replicate it.",
    "liveUrl": "https://canva.link/visible-io",
    "demoUrl": "https://canva.link/visible-io"
  },
  {
    "field": "Circular",
    "title": "BarangaySwap",
    "builder": "Exzekel Ablo",
    "discord": "Exzekel",
    "blurb": "Hyperlocal swap for surplus items, skills, and resources; built for low-connectivity areas. Tagalog and English.",
    "demoUrl": "https://drive.google.com/file/d/1RYz3dqQ-xujUCaAexPkds9ex1gLBqcIt/view?usp=drivesdk"
  },
  {
    "field": "Coordination",
    "title": "AI-Agent Memory as Authentication",
    "builder": "Marcellus Wijesinghe",
    "discord": "eraldatu",
    "blurb": "Concept: use an AI agent's lack of memory for verification without sensitive data, plus decentralized storage.",
    "demoUrl": "https://www.loom.com/share/a71d30af80cb4a6fa357ddd6621ec0d8"
  },
  {
    "field": "Civic",
    "title": "Chicago Air-Quality Companion",
    "builder": "Jerry B",
    "discord": "OlMackyTerrahawk",
    "blurb": "Track Chicago neighborhood air quality (AirNow plus Chicago Health Atlas) in plain language, with civic actions.",
    "demoUrl": "https://www.loom.com/share/91fc4d61406f43b2bfc2610106cf51aa"
  },
  {
    "field": "Circular",
    "title": "Karma",
    "builder": "Nykaela Burks",
    "discord": "cicirokk",
    "blurb": "Neighborhood mutual-help app: post small projects and earn karma points for showing up.",
    "demoUrl": "https://youtu.be/z7NJS_dktT8"
  },
  {
    "field": "Circular",
    "title": "Vrub (Virtual Re-Use Bin)",
    "builder": "Nai Xun",
    "discord": "ankhpercent",
    "blurb": "Material-sharing for eco-conscious creatives: share what you have, find what you need, every item free.",
    "demoUrl": "https://youtu.be/RdBhFZ-w_3E"
  },
  {
    "field": "Civic",
    "title": "Saga",
    "builder": "Test",
    "blurb": "A place for new creative communities to be created."
  },
  {
    "field": "Coordination",
    "title": "Hopamine Hackathon Staff",
    "builder": "Mawuli",
    "blurb": "The Hopamine team behind The Green Hackathon — coordination, production, and builder support."
  }
];

export const HOPAMINE_HACKATHON_STAFF_TITLE = "Hopamine Hackathon Staff";

export const HACKATHON_PROJECT_COUNT = HACKATHON_PROJECTS.length;
