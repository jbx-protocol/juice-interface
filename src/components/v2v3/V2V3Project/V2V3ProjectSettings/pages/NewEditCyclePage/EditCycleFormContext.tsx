import { FormInstance } from 'antd'
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import { EditCycleFormFields } from './EditCycleFormFields'
import { useLoadEditCycleData } from './hooks/useLoadEditCycleData'

interface EditCycleDataContextType {
  initialFormData: EditCycleFormFields | undefined
  editCycleForm: FormInstance<EditCycleFormFields> | undefined
  formHasUpdated: boolean
  setFormHasUpdated: Dispatch<SetStateAction<boolean>>
}

const EditCycleDataContext = createContext<EditCycleDataContextType>({
  initialFormData: undefined,
  editCycleForm: undefined,
  formHasUpdated: false,
  setFormHasUpdated: () => null,
})

export const useEditCycleFormContext = () => useContext(EditCycleDataContext)

export const EditCycleFormProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [formHasUpdated, setFormHasUpdated] = useState<boolean>(false)

  const { initialFormData, editCycleForm } = useLoadEditCycleData()

  return (
    <EditCycleDataContext.Provider
      value={{
        initialFormData,
        editCycleForm,
        formHasUpdated,
        setFormHasUpdated,
      }}
    >
      {children}
    </EditCycleDataContext.Provider>
  )
}
