import { useModal } from 'hooks/useModal'
import React from 'react'

type QuickProjectSearch = {
  modal: ReturnType<typeof useModal>
}

export const QuickProjectSearchContext =
  React.createContext<QuickProjectSearch>({
    modal: {
      visible: false,
      open: () => {
        console.error(
          'QuickProjectSearchContext.modal.open() called before being set',
        )
      },
      close: () => {
        console.error(
          'QuickProjectSearchContext.modal.close() called before being set',
        )
      },
    },
  })
