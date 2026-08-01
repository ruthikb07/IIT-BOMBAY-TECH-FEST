/**
 * CYGNUS Schedule & Timeline Data
 * Concept Demo Data for IIT Bombay Techfest Submission
 */

export const DEMO_SCHEDULE = [
  {
    day: 'DAY 01',
    phase: 'GENESIS — INITIALIZATION',
    date: 'TBD — CONCEPT SCHEDULE',
    events: [
      {
        time: '09:00 AM',
        title: 'Cygnus Keynote: Human × Machine Interface',
        speaker: 'Keynote Speaker (Concept Slot)',
        location: 'Main Auditorium — Demo Stage',
        description: 'Opening address exploring the convergence of biological cognition and synthetic intelligence.',
        isKeynote: true
      },
      {
        time: '11:30 AM',
        title: 'Autonomous Robotics Qualifiers',
        speaker: 'Competition Arena',
        location: 'Hall A — Robotics Arena',
        description: 'First round of autonomous micro-rover pathfinding and obstacle navigation trials.',
        isKeynote: false
      },
      {
        time: '02:30 PM',
        title: 'Neural Matrix Hackathon Briefing',
        speaker: 'Hackathon Mentors (Concept)',
        location: 'Innovation Hub',
        description: 'Problem statement release and environment configuration setup for participating teams.',
        isKeynote: false
      }
    ]
  },
  {
    day: 'DAY 02',
    phase: 'CYBERNETICS — CONVERGENCE',
    date: 'TBD — CONCEPT SCHEDULE',
    events: [
      {
        time: '10:00 AM',
        title: 'Post-Quantum Cryptography Symposium',
        speaker: 'Research Panel (Concept Slot)',
        location: 'Seminar Hall 2',
        description: 'Technical discussion on zero-knowledge architecture and lattice-based encryption algorithms.',
        isKeynote: true
      },
      {
        time: '01:00 PM',
        title: 'Swarm Drone Arena Trials',
        speaker: 'Flight Systems Control',
        location: 'Outdoor Dome',
        description: 'Decentralized multi-drone search-and-rescue swarms tested in GPS-denied simulation field.',
        isKeynote: false
      },
      {
        time: '04:00 PM',
        title: 'Bionic Signal Processing Lab',
        speaker: 'Bio-Cybernetics Team',
        location: 'Bio-Tech Lab 4',
        description: 'Live decoding of neural EMG/EEG signals for mechanical limb actuation.',
        isKeynote: false
      }
    ]
  },
  {
    day: 'DAY 03',
    phase: 'SINGULARITY — FINALE',
    date: 'TBD — CONCEPT SCHEDULE',
    events: [
      {
        time: '10:30 AM',
        title: 'Neural Matrix Hackathon Final Demos',
        speaker: 'Top 10 Finalist Teams',
        location: 'Main Stage',
        description: 'Live 5-minute showcase of edge-AI functional prototypes before jury panel.',
        isKeynote: true
      },
      {
        time: '03:00 PM',
        title: 'Cygnus Grand Finale & Valedictory',
        speaker: 'Techfest Organizing Committee',
        location: 'Main Amphitheatre',
        description: 'Closing ceremonies, recognition of competition winners, and Cygnus concept showcase.',
        isKeynote: true
      }
    ]
  }
];
