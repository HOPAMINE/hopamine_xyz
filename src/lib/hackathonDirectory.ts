// Sourced from https://www.hopamine.xyz/hackathon-directory.html

export const HACKATHON_FIELDS = {
  Circular: "Sharing & Circular",
  Civic: "Civic & Community",
  Learning: "Learning & Skills",
  Food: "Food & Gardening",
  Coordination: "Coordination & Infra",
  DeepTech: "Deep Tech & Energy",
  Maps: "Maps & Sensing",
  Other: "Other",
} as const;

export type HackathonField = keyof typeof HACKATHON_FIELDS;

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

export type HackathonIdea = {
  field: HackathonField;
  title: string;
  builder: string;
  discord?: string;
  blurb: string;
  seekingTeammates: boolean;
};

export const HACKATHON_SPOTLIGHT_TITLES = [
  "Ripe",
  "Commons",
  "FORGE",
  "Myci",
  "Cumulus",
  "MutaScore",
  "Grass Roots",
  "Stakes (Green Recipe Swap)"
] as const;

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
  }
];

export const HACKATHON_IDEAS: HackathonIdea[] = [
  {
    "field": "Civic",
    "title": "Local Volunteer Matching",
    "builder": "Caroline Torres",
    "discord": "cruella04472",
    "blurb": "Swipe on nearby orgs, events, and people to volunteer with. Proximity plus one-tap yes, Tinder to get involved.",
    "seekingTeammates": false
  },
  {
    "field": "Learning",
    "title": "Building Design Sandbox",
    "builder": "Nyx Sardonic",
    "discord": "candlelitworkshop",
    "blurb": "A game-like 3D tool to design buildings, intuitive for everyone. Figma meets Toco World.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "Mending-Shrine (offline repair)",
    "builder": "Jeffrey Krapf",
    "discord": "Jev2741",
    "blurb": "Offline, zero-hardware repair assistant that walks you through fixes and refuses to hallucinate advice.",
    "seekingTeammates": false
  },
  {
    "field": "Civic",
    "title": "Local Gov Meeting Tracker",
    "builder": "Stephen Hnilica",
    "discord": "stephehnilica",
    "blurb": "Scrapes and archives local government agendas; alerts on fossil fuel, data center, or solar initiatives.",
    "seekingTeammates": false
  },
  {
    "field": "Civic",
    "title": "Chicago Air-Quality Tool",
    "builder": "Jerry B",
    "discord": "OlMackyTerrahawk",
    "blurb": "Maps neighborhood pollution plus safe-air refuges and emergency plans for high-risk residents.",
    "seekingTeammates": false
  },
  {
    "field": "Food",
    "title": "Plant/Herb AI ID",
    "builder": "Emma Mason",
    "discord": "E01k",
    "blurb": "Snap a plant to learn its identity and history; share findings with the community.",
    "seekingTeammates": false
  },
  {
    "field": "Coordination",
    "title": "Trust & Reputation System",
    "builder": "Marcellus Wijesinghe",
    "discord": "eraldatu",
    "blurb": "Personal/group organization that tracks contribution and builds reputation while respecting privacy.",
    "seekingTeammates": false
  },
  {
    "field": "Coordination",
    "title": "Project Merging",
    "builder": "Ryan Markwart",
    "blurb": "Connect builders and idea-owners so duplicate projects collaborate instead of compete.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "Re-Use Material App",
    "builder": "Nai Xun",
    "discord": "Ankhpercent",
    "blurb": "Catalogue used items and electronics to share; social credits plus decentralized e-waste disposal.",
    "seekingTeammates": false
  },
  {
    "field": "Food",
    "title": "SeedBurst",
    "builder": "Aratrika Das",
    "discord": "fourstars__",
    "blurb": "Shake-to-plant seed products plus a QR refill model. Rewilding as easy as seasoning food.",
    "seekingTeammates": false
  },
  {
    "field": "Coordination",
    "title": "Off-Grid Text Networks",
    "builder": "Mariah Gardner",
    "discord": "marlesdickins",
    "blurb": "Web app plus IKEA-style build guides to set up off-grid community text networks.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "AR Clothing Repair",
    "builder": "Jonathan Herrera",
    "discord": "dumbowumbo",
    "blurb": "AR plus AI to fix, alter, and repurpose clothes and cut overconsumption.",
    "seekingTeammates": false
  },
  {
    "field": "Civic",
    "title": "Tainha AI (civic phonebooth)",
    "builder": "Guilherme Mazetto",
    "discord": "guilherme_mazetto",
    "blurb": "A public AI phonebooth for neighborhood feedback plus local history and culture.",
    "seekingTeammates": false
  },
  {
    "field": "Maps",
    "title": "Sustainable Community Hub Map",
    "builder": "Nikolay Baruh",
    "discord": "ribss.",
    "blurb": "A map and community center to find events, circular businesses, farmers, and like minds locally.",
    "seekingTeammates": false
  },
  {
    "field": "Learning",
    "title": "Teacher-in-Residence",
    "builder": "Rowdy Klein",
    "discord": "Gohabitat.earth",
    "blurb": "Connect host landscapes to traveling teachers; students learn hands-on, real-world skills.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "Ripe (neighbor produce)",
    "builder": "jaeger tang",
    "discord": "j__7__",
    "blurb": "Map of backyard surplus; one-tap claim and pay, no cut taken. Saturates one block at a time.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "Contribution Ledger",
    "builder": "Isidoros Manolas",
    "discord": "iz2i.",
    "blurb": "Neighborhood exchange with real-cost, non-transferable, decaying credits to curb overproduction.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "BarangaySwap",
    "builder": "Exzekel Ablo",
    "discord": "Exzekel",
    "blurb": "Hyperlocal swap of surplus items and skills, built for low-connectivity neighborhoods.",
    "seekingTeammates": false
  },
  {
    "field": "Civic",
    "title": "Community Care Webapp",
    "builder": "Nykaela Burks",
    "discord": "cicirokk",
    "blurb": "Discover local projects, share skills, volunteer, and build trust through community work.",
    "seekingTeammates": false
  },
  {
    "field": "Maps",
    "title": "Visible",
    "builder": "Natasha Silvestre",
    "discord": "mycarbonai",
    "blurb": "Photo a positive eco-action; AI maps it. A live map of what is already working locally.",
    "seekingTeammates": false
  },
  {
    "field": "Learning",
    "title": "AptiPlant",
    "builder": "Samuel Ngandu",
    "discord": "mr_nooby2845",
    "blurb": "roadmap.sh for the planet: AI routes a custom skills roadmap for climate builders.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "iGotchu",
    "builder": "Oscar Sharp",
    "discord": "Oscartocin",
    "blurb": "AI need/offer matching for community mutual aid.",
    "seekingTeammates": false
  },
  {
    "field": "Civic",
    "title": "Rooted",
    "builder": "Connor Clapson",
    "discord": "ConnorClutchClapson",
    "blurb": "Communities report, discuss, and vote on local issues; AI turns input into actionable insight.",
    "seekingTeammates": false
  },
  {
    "field": "Coordination",
    "title": "FORGE",
    "builder": "Farah Mohamed Farah",
    "discord": "faradumatin",
    "blurb": "Build real-world projects like open source: claimable tasks, public logs, credit, forkable playbooks.",
    "seekingTeammates": false
  },
  {
    "field": "DeepTech",
    "title": "PETase Enzyme Optimizer",
    "builder": "Ishani Bakshi",
    "discord": "fckthjsnsjwn",
    "blurb": "ML model ranks enzyme mutations that degrade plastic faster, skipping months of wet-lab.",
    "seekingTeammates": false
  },
  {
    "field": "DeepTech",
    "title": "Cumulus (atmospheric water)",
    "builder": "Semi Cole",
    "discord": "semicole6475",
    "blurb": "Data platform that sites atmospheric water-harvesting where need and viability are highest.",
    "seekingTeammates": false
  },
  {
    "field": "Food",
    "title": "EDEN Commons",
    "builder": "Daniel Amado",
    "discord": "daniel.acl9",
    "blurb": "A living agri-almanac from regional and ancestral knowledge; AI organizes, people own it.",
    "seekingTeammates": false
  },
  {
    "field": "Food",
    "title": "Growing Green",
    "builder": "Isaiah Jackson",
    "discord": "ZAYJAMMAR!",
    "blurb": "Analyzes your land, climate, and soil to recommend native plants and links local nurseries.",
    "seekingTeammates": false
  },
  {
    "field": "Learning",
    "title": "SolarPunk Farm (game)",
    "builder": "Ethan Barsketis",
    "discord": "Etbars",
    "blurb": "Cozy AI farming game teaching real permaculture and homesteading with voice NPCs.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "Urban Waste to Maker Materials",
    "builder": "Maryam Farhan",
    "discord": "maryam_59358",
    "blurb": "Log waste; a hub sorts it; makers claim materials and post back what they built.",
    "seekingTeammates": false
  },
  {
    "field": "DeepTech",
    "title": "Green Gauge",
    "builder": "Paulette Meso",
    "discord": "dicha_.",
    "blurb": "Energy-intensity benchmarking for SMEs with ranked, payback-aware fixes.",
    "seekingTeammates": false
  },
  {
    "field": "Learning",
    "title": "Habi",
    "builder": "Alishba Khattak",
    "discord": "Alishba",
    "blurb": "Local AI sustainability companion with weekly challenges and a shared community impact board.",
    "seekingTeammates": false
  },
  {
    "field": "Civic",
    "title": "GREENIFI",
    "builder": "luca kastenbaum",
    "discord": "lucak777",
    "blurb": "Turn concern into action via Red Cases (Land/Air/Water) plus sign-on statements to officials.",
    "seekingTeammates": true
  },
  {
    "field": "Other",
    "title": "Misinformation Source-Checker",
    "builder": "Alexis B",
    "discord": "Absolutemenace420",
    "blurb": "Chrome add-on surfacing 3 verified local sources (academic/gov/private) on eco searches.",
    "seekingTeammates": false
  },
  {
    "field": "Food",
    "title": "Eco Recipe Alternatives",
    "builder": "Basil Wright",
    "discord": "Grasscrest",
    "blurb": "Parses recipes and suggests lower-impact ingredient swaps with water and land comparisons.",
    "seekingTeammates": false
  },
  {
    "field": "Food",
    "title": "Plant Edibility Scanner",
    "builder": "Raghav Gaur",
    "discord": "universal2775",
    "blurb": "Scan a plant to check edibility and learn how to cultivate it in your local conditions.",
    "seekingTeammates": false
  },
  {
    "field": "Civic",
    "title": "NYC Citizen-Concern Map",
    "builder": "Sujal Thapa",
    "discord": "joshnua.",
    "blurb": "Geolocated citizen concern reporting with a direct, AI-assisted channel to city workers.",
    "seekingTeammates": false
  },
  {
    "field": "Coordination",
    "title": "Bus-Stop Displays (LoRa)",
    "builder": "Nathaniel Wert",
    "discord": "N89529",
    "blurb": "Cheap low-power displays plus Raspberry Pi towers relaying bus times over LoRa radio.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "Neighborhood Barter",
    "builder": "Frost Zaman",
    "discord": "Oldpeng",
    "blurb": "Proximity barter map with route optimization and trust scores; shows fuel, CO2, and time saved.",
    "seekingTeammates": false
  },
  {
    "field": "Learning",
    "title": "Mission-Based Learning",
    "builder": "Adrian Leon",
    "discord": "adrianleon",
    "blurb": "Turn any interest into sustainable real-world missions feeding a shared atlas.",
    "seekingTeammates": false
  },
  {
    "field": "Maps",
    "title": "Sound of the Earth",
    "builder": "Aisha Nama",
    "discord": "A_nama",
    "blurb": "Crowdsourced audio map scoring biophony vs noise into a live Earth Health map.",
    "seekingTeammates": false
  },
  {
    "field": "Maps",
    "title": "Citizen Climate-Data for Planning",
    "builder": "Olivier poupier",
    "discord": "astiktelette",
    "blurb": "Crowd and open data on local temps and canopy to help planners make neighborhoods walkable.",
    "seekingTeammates": false
  },
  {
    "field": "Food",
    "title": "Food-Yield Maximizer",
    "builder": "Thomas Wright",
    "discord": "Pennyfasha_04528",
    "blurb": "Three inputs (size, date, location) returns the max food a space can grow plus a succession plan.",
    "seekingTeammates": false
  },
  {
    "field": "Other",
    "title": "Genuine-Connection CRM",
    "builder": "Katrina Anastasia",
    "discord": "katrina.anastasia",
    "blurb": "A no-followers CRM to actually stay connected with people you meet. Idea-owner needs a tech builder.",
    "seekingTeammates": true
  },
  {
    "field": "DeepTech",
    "title": "Plastic-Eating Mushrooms",
    "builder": "Parinita Haldar",
    "discord": "perry979797",
    "blurb": "A replicable local system to clean, shred, and fungally decompose community plastic waste. Needs a prototyping team.",
    "seekingTeammates": true
  },
  {
    "field": "Civic",
    "title": "FieldSignal AI",
    "builder": "Trishna Redd",
    "discord": "nt80p",
    "blurb": "Turns responder photos and voice into structured incident reports during disasters.",
    "seekingTeammates": false
  },
  {
    "field": "DeepTech",
    "title": "Pollution-Data Infrastructure",
    "builder": "Stephen Yaroch",
    "discord": "Bigsteve420",
    "blurb": "Automates env compliance docs and mines them into a predictive pollution dataset. Needs a schema/insights builder.",
    "seekingTeammates": true
  },
  {
    "field": "Coordination",
    "title": "Decentralized Research Platform",
    "builder": "Clement Castellon",
    "discord": "clemspace",
    "blurb": "Adapting a peer-reviewed decentralized research method for the Hopamine community.",
    "seekingTeammates": false
  },
  {
    "field": "Learning",
    "title": "SolarPunk Guide App",
    "builder": "Nando Manz",
    "discord": "nandomango1",
    "blurb": "A green-AI guide to living solarpunk values: knowledge, checklists, habits, news, kids mode. Visionary, needs coders.",
    "seekingTeammates": true
  },
  {
    "field": "Circular",
    "title": "ChronoShare (timebank)",
    "builder": "Ayaan B",
    "discord": "jungl3master",
    "blurb": "Peer-to-peer timebanking; one hour helped equals one hour owed. Non-extractive mutual aid.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "Commons",
    "builder": "Pedro Rodrigues",
    "discord": "@Prodr",
    "blurb": "Tap plus, drop a pin, leave a note. Makes the informal sharing city visible. No data harvesting.",
    "seekingTeammates": false
  },
  {
    "field": "Circular",
    "title": "Wish Portal / Heartlight",
    "builder": "Atlas Morphoenix",
    "discord": "atlasmorphoenix",
    "blurb": "Gift-economy coordination: cast a wish, get matched with nearby skills, tools, space, or funding.",
    "seekingTeammates": false
  },
  {
    "field": "Learning",
    "title": "GreenHabits AI",
    "builder": "Alishba Khattak",
    "discord": "Alishba",
    "blurb": "AI coach focused on behavior change: weekly green challenges plus measurable impact.",
    "seekingTeammates": false
  }
];
