/**
 * CYGNUS Events & Competitions Matrix Data
 * Clearly marked as Demo / Concept Data for IIT Bombay Techfest Submission
 */

export const DEMO_EVENTS = [
  {
    id: 'evt-robo-01',
    title: 'Autonomous Robotics Championship',
    category: 'Robotics & Automation',
    tag: 'ROBOTICS',
    description: 'Design and deploy autonomous micro-rovers capable of navigating dynamic obstacle courses and collaborative payload placement.',
    detailedRules: [
      'Maximum team size: 4 participants',
      'Rover dimensions must not exceed 40cm x 40cm x 40cm',
      'Autonomous navigation required (no manual remote override during trials)',
      'Onboard computer vision permitted'
    ],
    status: 'Demo Event',
    prize: 'Demo Prize Pool',
    registrationAvailable: false,
    demoNotice: 'Concept Event — Fictional competition details for showcase purpose.'
  },
  {
    id: 'evt-ai-02',
    title: 'Neural Matrix Hackathon',
    category: 'Artificial Intelligence',
    tag: 'AI & ML',
    description: 'Build edge-AI applications focused on human-machine interaction, real-time computer vision, or multimodal generative agents.',
    detailedRules: [
      '36-Hour continuous hackathon challenge',
      'Open-source APIs and models allowed',
      'Final submission requires live functional prototype and architecture pitch'
    ],
    status: 'Demo Event',
    prize: 'Demo Prize Pool',
    registrationAvailable: false,
    demoNotice: 'Concept Event — Fictional competition details for showcase purpose.'
  },
  {
    id: 'evt-cyber-03',
    title: 'Quantum Cryptography & Security',
    category: 'Cyber Security',
    tag: 'CYBERSECURITY',
    description: 'Penetration testing, zero-knowledge proofs, and post-quantum cryptographic protocol verification in simulated environments.',
    detailedRules: [
      'Jeopardy-style Capture The Flag (CTF) format',
      'Ethics compliance agreement mandatory',
      'Covers Web, Binary Exploitation, Reverse Engineering, and Cryptography'
    ],
    status: 'Demo Event',
    prize: 'Demo Prize Pool',
    registrationAvailable: false,
    demoNotice: 'Concept Event — Fictional competition details for showcase purpose.'
  },
  {
    id: 'evt-aero-04',
    title: 'Swarm Drone Navigation Challenge',
    category: 'Aerospace & Drones',
    tag: 'AEROSPACE',
    description: 'Program decentralized micro-UAV swarms to execute synchronized search-and-rescue operations inside GPS-denied environments.',
    detailedRules: [
      'Swarm size: 3 to 5 micro-drones',
      'Indoor obstacle course flight area',
      'Collision avoidance algorithms scored continuously'
    ],
    status: 'Demo Event',
    prize: 'Demo Prize Pool',
    registrationAvailable: false,
    demoNotice: 'Concept Event — Fictional competition details for showcase purpose.'
  },
  {
    id: 'evt-bio-05',
    title: 'Bionic Interface & Bio-Tech Design',
    category: 'Bio-Cybernetics',
    tag: 'BIO-TECH',
    description: 'Conceptualize and prototype EMG/EEG signal decoding interfaces for prosthetic motion control or digital hardware manipulation.',
    detailedRules: [
      'Hardware or simulated signal processing track available',
      'Signal-to-noise ratio and latency evaluated live'
    ],
    status: 'Demo Event',
    prize: 'Demo Prize Pool',
    registrationAvailable: false,
    demoNotice: 'Concept Event — Fictional competition details for showcase purpose.'
  },
  {
    id: 'evt-web3-06',
    title: 'Decentralized Compute & Edge Systems',
    category: 'Web3 & Distributed Systems',
    tag: 'DISTRIBUTED',
    description: 'Construct decentralized peer-to-peer compute relay networks for micro-task distribution across edge devices.',
    detailedRules: [
      'Simulated network node environment',
      'Throughput and consensus latency benchmarks evaluated'
    ],
    status: 'Demo Event',
    prize: 'Demo Prize Pool',
    registrationAvailable: false,
    demoNotice: 'Concept Event — Fictional competition details for showcase purpose.'
  }
];

export const CATEGORIES = [
  'ALL',
  'Robotics & Automation',
  'Artificial Intelligence',
  'Cyber Security',
  'Aerospace & Drones',
  'Bio-Cybernetics',
  'Web3 & Distributed Systems'
];
