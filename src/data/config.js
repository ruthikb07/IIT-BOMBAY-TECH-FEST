/**
 * CYGNUS System Configuration
 * IIT BOMBAY TECHFEST — COMPETITION SUBMISSION CONCEPT
 */

export const APP_CONFIG = {
  title: 'CYGNUS',
  subtitle: 'HUMAN × MACHINE',
  tagline: 'THE NEXT EVOLUTION OF INTERACTION.',
  context: 'IIT Bombay Techfest Submission Concept',
  version: '1.0.0-phase1',

  // Configurable Countdown Date
  // Set to null or a valid date string. If null, displays 'EVENT DATE — TO BE ANNOUNCED'
  eventDate: '2026-12-26T09:00:00+05:30', 
  eventDateFallbackText: 'EVENT DATE — TO BE ANNOUNCED',

  // Render Quality Profiles
  qualityProfiles: {
    HIGH: {
      name: 'HIGH',
      maxPixelRatio: 2,
      particleCount: 2400,
      enableBloom: true,
      wireframeSegments: 48,
      neuralConnections: 120,
    },
    MEDIUM: {
      name: 'MEDIUM',
      maxPixelRatio: 1.5,
      particleCount: 1200,
      enableBloom: false,
      wireframeSegments: 32,
      neuralConnections: 60,
    },
    LOW: {
      name: 'LOW',
      maxPixelRatio: 1.0,
      particleCount: 500,
      enableBloom: false,
      wireframeSegments: 20,
      neuralConnections: 30,
    }
  },

  // Audio Settings
  audio: {
    defaultMuted: true,
    volume: 0.15
  },

  // Demo disclaimer banner text
  disclaimer: {
    isDemo: true,
    text: 'CONCEPT SUBMISSION FOR IIT BOMBAY TECHFEST — ALL EVENT DATA & SCHEDULES ARE DEMO PLACEHOLDERS'
  }
};
