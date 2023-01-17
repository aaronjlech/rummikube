// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuid } from 'uuid'

const colors = [
  '#DC2626', // red
  '#0284C7', // blue
  '#FACC15', // yellow
  '#1C1917' // black
];
interface Kube {
  id: string,
  color: string,
  number: number
}
const kubes: Kube[] = []

for (let i = 1; i <= 13; i++) {
  colors.forEach(color => {
    ['chip1', 'chip2'].forEach(chip => kubes.push({
      id: `${chip}-${color}-${i}`,
      color,
      number: i
    }))
  })
}
const jokers = [
  {
    color: 'red',
    number: 0
  },
  {
    color: 'black',
    number: 0
  }
]

const shuffleArray = (array: any[]) => {
  const arrCopy = array.slice(0)
  for (let index = arrCopy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (1 + 1));
    const currentItem = arrCopy[index]
    arrCopy[index] = arrCopy[randomIndex]
    arrCopy[randomIndex] = currentItem
  }
  return arrCopy
}

const doubleKubes = [...kubes, ...kubes, ...jokers]

interface Player {
  id: string
  nickName: string
  currentChips: Kube[]
  points: number
}
class BoardState {
  id: string
  kubes: Kube[]
  chipsPlayed: Kube[]
  remainingChips: number
  players: Player[]
  turn: number
  constructor() {
    this.chipsPlayed = []
    this.kubes = shuffleArray(doubleKubes)
    this.remainingChips = kubes.length
    this.players = []
    this.turn = 0
    this.id = uuid()
  }
}

const boardState = new BoardState()
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoardState>
) {
  res.status(200).json(boardState)
}
