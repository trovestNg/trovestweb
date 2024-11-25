import React from 'react'
import { user_storage_type } from '../../config'

export default function Index(props) {
    const { navigate } = props
    const adminType = localStorage.getItem(user_storage_type)
  return (
      <div>Profile Page of {adminType}</div>
  )
}
