import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import React, { createContext, useMemo, useReducer } from 'react'
import { ProjectCartAction, projectCartReducer } from './projectCartReducer'

export type ProjectCartCurrencyAmount = {
  amount: number
  currency: V2V3CurrencyOption
}

type ProjectCartContextType = {
  dispatch: React.Dispatch<ProjectCartAction>
  payAmount: ProjectCartCurrencyAmount | undefined
  visible: boolean
  expanded: boolean
  userIsReceivingTokens: boolean
}

export const ProjectCartContext = createContext<ProjectCartContextType>({
  dispatch: () => {
    console.error('dispatch was called before it was initialized')
  },
  payAmount: undefined,
  visible: false,
  expanded: false,
  userIsReceivingTokens: false,
})

export const ProjectCartProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [state, dispatch] = useReducer(projectCartReducer, {
    payAmount: undefined,
    expanded: false,
    userIsReceivingTokens: true,
  })

  const visible = useMemo(
    () => (state?.payAmount?.amount ?? 0) > 0,
    [state?.payAmount?.amount],
  )

  const value = {
    dispatch,
    ...state,
    visible,
  }

  return (
    <ProjectCartContext.Provider value={value}>
      {children}
    </ProjectCartContext.Provider>
  )
}
