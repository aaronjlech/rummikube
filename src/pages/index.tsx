import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '../styles/home.module.css'
import { useEffect } from 'react'
const inter = Inter({ subsets: ['latin'] })
import { trpc } from '../utils/trpc'
import { BoardState } from '../server/routers/board-state'
import Link from 'next/link'

type BoardProps = {
  boards: {
    [key: string]: BoardState
  }
}
const AllBoardStates = ({ boards }: BoardProps) => {
  const context = trpc.useContext()

  const { mutate: deleteBoard } = trpc.removeBoardState.useMutation({
    onSuccess() {
      context.getAllBoardStates.invalidate()
    }
  })
  const onDeleteBoardClicked = (id: string) => {
    deleteBoard({
      id
    })
  }
  const boardCards = Object.keys(boards).map(id => {
    const board = boards[id]
    return (
      <div className="card w-96 bg-base-100 shadow xl" key={board.id}>
        <div className="card-body">
          <div className="card-title">
            Game Id {`${board.id}`}
          </div>
          <Link href={`game/${board.id}`} className="btn btn-success">
            Enter Game
          </Link>
          <button className="btn btn-outline btn-error" onClick={() => onDeleteBoardClicked(id)}>
            Delete Game
          </button>
        </div>
      </div>
    )
  })
  return <div className="artboard">
    {boardCards}
  </div>
}
export default function Home() {
  const boardQuery = trpc.getAllBoardStates.useQuery()
  const context = trpc.useContext()

  const { mutate: createBoard } = trpc.createBoardState.useMutation({
    onSuccess() {
      context.getAllBoardStates.invalidate()
    }
  })
  if (!boardQuery.data) {
    return <div>Loading!</div>
  }
  const { data: boardStates } = boardQuery

  const onCreateClicked = () => {
    createBoard()
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-6xl p-8">
          RummiKube
        </h1>
        <AllBoardStates boards={boardStates} />
        <button className="btn btn-primary" onClick={onCreateClicked}>
          Create new Board
        </button>
      </main>
    </>
  )
}