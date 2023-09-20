import { useContext } from 'react'
import { ProjectCartContext } from '../components/ProjectCartProvider'

export const useProjectCart = () => useContext(ProjectCartContext)
