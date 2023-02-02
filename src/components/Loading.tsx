import { PropsWithChildren } from 'react'

type Props = {
  showSpinner: boolean
}
export default function Loading({ children, showSpinner }: PropsWithChildren<Props>) {
  if (showSpinner) {
    return <progress className="progress w-56"></progress>
  }
  return (
  <>
    {children}
  </>
  )
}