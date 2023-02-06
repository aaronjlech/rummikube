// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { v4 as uuid } from 'uuid';
import { number, z } from 'zod';
import { procedure } from '../trpc';
const colors = {
  red: '#DC2626',
  blue: '#0284C7',
  yellow: '#FACC15',
  black: '#1C1917'
}
type Kube = {
  id: string;
  color: string;
  number: number;
}
const kubes: Kube[] = [];

const chips = ['chip1', 'chip2']
for (let i = 1; i <= 13; i++) {
  (Object.keys(colors) as Array<keyof typeof colors>).forEach(c => {
    const color: string = colors[c]
    chips.forEach((chip: string) =>
      kubes.push({
        id: `${chip}-${color}-${i}`,
        color,
        number: i,
      })
    );
  })
}
const JOKER_NUMBER = 0;
const jokers: Kube[] = [
  {
    id: `chip1-${colors.red}-${JOKER_NUMBER}`,
    color: colors.red,
    number: JOKER_NUMBER,
  },
  {
    id: `chip2-${colors.red}-${JOKER_NUMBER}`,
    color: colors.black,
    number: JOKER_NUMBER,
  },
];
const getRandomIndex = () => Math.floor(Math.random() * (1 + 1));
const shuffleArray = (array: any[]) => {
  const arrCopy = array.slice(0);
  for (let index = arrCopy.length - 1; index > 0; index--) {
    const randomIndex = getRandomIndex()
    const currentItem = arrCopy[index];
    arrCopy[index] = arrCopy[randomIndex];
    arrCopy[randomIndex] = currentItem;
  }
  return arrCopy;
};

const doubleKubes = [...kubes, ...jokers];

export type Player = {
  id: string;
  nickName: string;
  currentChips: Kube[];
  points: number;
}

export class BoardState {
  id: string;
  kubes: Kube[];
  chipsPlayed: Kube[];
  kubeSets: Kube[][];
  remainingChips: number;
  players: Player[];
  turn: number;
  gameInProgress: boolean;
  constructor() {
    this.chipsPlayed = [];
    this.kubes = shuffleArray(doubleKubes);
    this.remainingChips = kubes.length;
    this.players = [];
    this.turn = 0;
    this.id = uuid();
    this.gameInProgress = false;
    console.log(this.id)
    this.kubeSets = []
  }

  public setKubeSet(kubeSet: Kube[]) {
    const isValidKubeSet = this.validateKubeSet(kubeSet)
    if (isValidKubeSet) {
      return 'Invalid moves detected'
    }

  }

  private validateRunSet(kubeSet: Kube[]) {
    let isValidRunSet = true;
    kubeSet.forEach((kube, index) => {
      const nextKubeIndex = Math.min((index + 1), kubeSet.length)
      if (index === kubeSet.length - 1) {
        return
      }
      const nextKube = kubeSet[nextKubeIndex]
      if (kube.color !== nextKube.color && kube.number !== nextKube.number) {
        isValidRunSet = false
        return
      }
    })
    return isValidRunSet
  }

  private validateGroupSet(kubeSet: Kube[]): boolean {
    if (kubeSet.length > 4 ) {
      return false
    }
    let isValidGroupSet = true
    kubeSet.forEach((kube, index) => {
      
      const nextKubeIndex = Math.min((index + 1), kubeSet.length)
      if (index === kubeSet.length - 1) {
        return
      }
      const nextKube = kubeSet[nextKubeIndex]
      if (kube.color !== nextKube.color && kube.number !== (nextKube.number - 1)) {
        isValidGroupSet = false
      }
    })
    return isValidGroupSet
  }
  private validateKubeSet(kubeSet: Kube[]): boolean {
    if (kubeSet.length < 3) {
      return false
    }

    return this.validateRunSet(kubeSet) || this.validateGroupSet(kubeSet)
  }

  public addPlayers(numberOfPlayers: number) {
    const randomNames = ['bob', 'susan', 'john', 'jimmy']
    for(let i = 1; i <= numberOfPlayers; i++) {
      const player: Player = {
        currentChips: [],
        id: uuid(),
        nickName: randomNames[i -1],
        points: 0
      }
      this.players.push(player)
    }
    console.log(this.players)
  }

  public startGame(numberOfPlayers: number) {
    if(this.gameInProgress) {
      return;
    }
    this.gameInProgress = true;
    this.addPlayers(numberOfPlayers)
  }
}

const testBoardState = new BoardState();
const boardStates: {
  [key: string]: BoardState
} = { [testBoardState.id]: testBoardState }

const getBoardStateById = (id: string) => {
  return boardStates[id]
}

const addNewBoardState = (board: BoardState) => {
  const { id } = board
  boardStates[id] = board
  return boardStates
}

const boardStateRouter = {
  getBoardStateById: procedure
  .input(z.object({
    id: z.string()
  }))
  .query(({ input }) => {
    const { id } = input
    return getBoardStateById(id)
  }),

  // Add player information etc to query on creation
  createBoardState: procedure
    .mutation(() => {
      const newBoard = new BoardState()
      const updatedBoardStates = addNewBoardState(newBoard)
      return updatedBoardStates[newBoard.id]
    }),

  getAllBoardStates: procedure
  .query(() => {
    return boardStates
  }),

  removeBoardState: procedure
  .input(z.object({
    id: z.string()
  }))
  .mutation(({ input }) => {
    const { id } = input
    delete boardStates[id]
  }),

  startGame: procedure
  .input(z.object({
    id: z.string(),
    playerCount: z.number().min(2).max(4)
  }))
  .mutation(({ input } ) => {
    const players: Player[] = []
    const { id, playerCount } = input
    const board = boardStates[id]
    board.startGame(playerCount)
    console.log(board)
    return board
  })
}

export default boardStateRouter
