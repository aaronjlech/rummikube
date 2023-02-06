import { useRouter } from 'next/router'
import Loading from '../../components/Loading'
// import { useRouterParams } from '../../hooks/use-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { trpc } from '../../utils/trpc'
import { Player } from '../../server/routers/board-state'

const GameBoard = () => {
  return <div className="card w-96 bg-blue shadow xl" style={{ width: '500px', height: '500px' }}>
    THE GAME BOARD!!!
  </div>
}

const MainPlayerBox = ({ mainPlayer }: { mainPlayer: Player }) => {
  return (
    <div>
      <h3>{mainPlayer.nickName}</h3>
      <div className="div">
        {/* {mainPlayer.currentChips.map(c => {
          <div className="flex align-center justify-center" key={c.id}>
            <p className="text-md bold">
              {c.number}
            </p>
          </div>
        })} */}
      </div>
    </div>
  )
}

const SecondaryPlayerBox = ({ player }: { player: Player}) => {
  return (
    <div className="card w-96 bg-base-100 shadow xl">
      <h3 className="name">
        Name: {player.nickName}
      </h3>
      <div className="chip-count">
        Chip Count: {player.currentChips.length}
      </div>
      <div className="score">
        Score: {player.points}
      </div>
    </div>
  )
}


export default function Game() {
  const router = useRouter()
  const gameId = router.query.gameId as string ?? ''
  const context = trpc.useContext()
  const { mutate: startGame } = trpc.startGame.useMutation({
    onSuccess() {
      context.getBoardStateById.invalidate()
    }
  })
  const { useQuery: getBoard } = trpc.getBoardStateById
  const boardStateQuery = getBoard({
    id: gameId
  })

  const startGameOnClick = () => {
    startGame({
      id: gameId,
      playerCount: 4
    })
  }
  const { data: boardState, isLoading } = boardStateQuery
  console.log(boardState, isLoading)
  const players = boardState?.players || []
  const leftPlayer = players[1]
  const mainPlayer = players[0]
  const topPlayer = players[2]
  const rightPlayer = players[3]
  return (
    <Loading showSpinner={isLoading}>
      <div>
        <h3>
          {boardState?.id}

        </h3>
        {!boardState?.gameInProgress && <button className="btn btn-success" onClick={startGameOnClick}>
          Start Game
        </button>}
        <SecondaryPlayerBox player={topPlayer}/>
        <div className="flex">
          <SecondaryPlayerBox player={leftPlayer}/>
          <GameBoard />
          <SecondaryPlayerBox player={rightPlayer}/>
        </div>
        <MainPlayerBox mainPlayer={mainPlayer} />
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </Loading>
  )
}

