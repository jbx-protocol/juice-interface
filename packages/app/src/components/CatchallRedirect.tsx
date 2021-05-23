import { Redirect, useParams } from 'react-router'

export default function CatchallRedirect() {
  const route = useParams<{ route: string }>()['route']
  return <Redirect to={'/p/' + route} />
}
