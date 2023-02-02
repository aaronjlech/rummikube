import Loading from '../../components/Loading'
import { useRouterParams } from '../../hooks/use-router'
import { trpc } from '../../utils/trpc'
export default function Game() {
  const gameId = useRouterParams('gameId')
  const { useQuery: getBoard } = trpc.getBoardStateById
  console.log(gameId)
  if (!gameId) {
    return
  }
  console.log('here', gameId)

  const boardStateQuery = getBoard({
    id: gameId
  })
  const { data: boardState, isLoading } = boardStateQuery
  console.log(boardState, isLoading)
  return (
    <Loading showSpinner={isLoading}>
      <div>
        <h3>
          {boardState?.id}
        </h3>
      </div>
    </Loading>
  )
}