import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onReset = (e) => {
    setValue('')
  }

  return {
    type,
    value,
    onReset,
    onChange
  }
}

/*
export const useAnotherHook = () => {
}
*/