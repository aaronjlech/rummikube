import { useRouter as useRouterNext } from "next/router";

const allowedParams = ['gameId'] as const
type Params = typeof allowedParams[number]

function isAllowedParam(param: Params) {
  return allowedParams.includes(param)
}
export function useRouterParams(param: Params): string {
  const router = useRouterNext()
  if(!isAllowedParam(param)) {
    throw new Error('Invalid param for router')
  }
  console.log('query param', router.query)
  const queryParam = router.query[param]
  console.log(queryParam)


  return queryParam as string
}