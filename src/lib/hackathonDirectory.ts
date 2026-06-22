// Sourced from https://www.hopamine.xyz/hackathon-directory.html

import type { HackathonField, HackathonProject } from "../../shared/hackathonProjects";
import {
  HACKATHON_PROJECTS,
  HACKATHON_PROJECT_COUNT,
} from "../../shared/hackathonProjects";

export type { HackathonField, HackathonProject };
export { HACKATHON_PROJECTS, HACKATHON_PROJECT_COUNT };

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

export const GREEN_HACKATHON_TAG = "Green Hackathon";

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

export function getHackathonProjectByIndex(index: number): HackathonProject | null {
  return HACKATHON_PROJECTS[index] ?? null;
}

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
