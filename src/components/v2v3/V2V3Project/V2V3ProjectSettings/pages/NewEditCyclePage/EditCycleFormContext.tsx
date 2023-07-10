import { FormInstance } from 'antd'
import React, { createContext, useContext } from 'react'
import { EditCycleFormFields } from './EditCycleFormFields'
import { useLoadEditCycleData } from './hooks/LoadEditCycleData'

interface EditCycleDataContextType {
  initialFormData: EditCycleFormFields | undefined
  editCycleForm: FormInstance<EditCycleFormFields> | undefined
}

const EditCycleDataContext = createContext<EditCycleDataContextType>({
  initialFormData: undefined,
  editCycleForm: undefined,
})

export const useEditCycleForm = () => useContext(EditCycleDataContext)

export const EditCycleFormProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const { initialFormData, editCycleForm } = useLoadEditCycleData()

  return (
    <EditCycleDataContext.Provider value={{ initialFormData, editCycleForm }}>
      {children}
    </EditCycleDataContext.Provider>
  )
}
