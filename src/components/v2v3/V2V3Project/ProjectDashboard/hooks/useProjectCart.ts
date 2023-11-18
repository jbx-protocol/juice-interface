import { useContext } from 'react'
import { ProjectCartContext } from '../components/ProjectCartProvider/ProjectCartProvider'

export const useProjectCart = () => useContext(ProjectCartContext)
