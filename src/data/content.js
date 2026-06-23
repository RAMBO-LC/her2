export const contentData = {
  notes: [
    {
      id: "n1",
      text: "the way you laugh when you're truly happy — not the polite one, the one that catches you off guard — that's my favorite sound in the world.",
      firefly_color: "#F2C94C",
      speed: "slow"
    },
    {
      id: "n2",
      text: "remember that afternoon when we talked until the sky turned that impossible shade of purple? i think that's when i knew.",
      firefly_color: "#E8A87C",
      speed: "slow"
    },
    {
      id: "n3",
      text: "you have this habit of tucking your hair behind your ear when you're concentrating. i notice every single time.",
      firefly_color: "#F4A261",
      speed: "slow"
    },
    {
      id: "n4",
      text: "the world is full of beautiful things, but none of them are you. and that makes them all a little less beautiful by comparison.",
      firefly_color: "#FFB3BA",
      speed: "slow"
    },
    {
      id: "n5",
      text: "i built this for you because some things can't be said — they have to be felt. every blade of grass, every firefly, every breath of wind. it all says what i can't.",
      firefly_color: "#C9C4E0",
      speed: "slow"
    }
  ],
  jokes: [
    {
      id: "j1",
      text: "why did the firefly break up with the lightbulb? she said he was too high-maintenance. (okay that one was bad. but i thought it. and i stand by it.)",
      firefly_color: "#A8E6CF",
      speed: "fast"
    },
    {
      id: "j2",
      text: "you're the reason i check my phone 47 times a day. and it's always worth it. (okay that wasn't a joke but it's true.)",
      firefly_color: "#D4A5FF",
      speed: "fast"
    },
    {
      id: "j3",
      text: "if you were a vegetable, you'd be a cute-cumber. (i'm so sorry. i'll show myself out. but you smiled. i saw it.)",
      firefly_color: "#FFD93D",
      speed: "fast"
    },
    {
      id: "j4",
      text: "are you made of copper and tellurium? because you're Cu-Te. (that's the last one i promise. mostly because i don't know any more element jokes.)",
      firefly_color: "#6BCB77",
      speed: "fast"
    }
  ],
  photos: [
    {
      id: "p1",
      src: "",
      date: "some day we should remember",
      caption: "the day we got lost and found something better than the destination",
      firefly_color: "#FFB3BA",
      speed: "medium"
    },
    {
      id: "p2",
      src: "",
      date: "another night, another conversation",
      caption: "talking until 3am about everything and nothing",
      firefly_color: "#A8E6CF",
      speed: "medium"
    }
  ]
}

export function getTimeOfDay() {
  const h = new Date().getHours()
  if (h >= 5 && h < 7) return 'dawn'
  if (h >= 7 && h < 10) return 'morning'
  if (h >= 10 && h < 16) return 'afternoon'
  if (h >= 16 && h < 19) return 'golden_hour'
  if (h >= 19 && h < 21) return 'magic_hour'
  return 'night'
}

export function getSkyColors(timeOfDay) {
  const states = {
    dawn:       { top: '#1a1a3e', mid: '#5c3d5e', bot: '#d4a574', fog: '#c4b0a0' },
    morning:    { top: '#8ba8c4', mid: '#b8c8d8', bot: '#e8dcc8', fog: '#d4ccc0' },
    afternoon:  { top: '#87CEEB', mid: '#c4d8e8', bot: '#f0ebe0', fog: '#e0dcd4' },
    golden_hour:{ top: '#c0846a', mid: '#e8a87c', bot: '#f4c97a', fog: '#e8d0b8' },
    magic_hour: { top: '#4a3060', mid: '#c06050', bot: '#e8a040', fog: '#c8a090' },
    night:      { top: '#0a0a1a', mid: '#1a1a3e', bot: '#2a1a2e', fog: '#1a1820' },
  }
  return states[timeOfDay] || states.afternoon
}

export function getSkyTransition(timeOfDay, minutesSinceTransition) {
  const t = Math.min(minutesSinceTransition / 40, 1)
  const smooth = t * t * (3 - 2 * t)
  return smooth
}

export const allContent = [...contentData.notes, ...contentData.jokes, ...contentData.photos]
