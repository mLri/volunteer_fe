import { useState, useEffect } from 'react'

/* import css */
import './Input.component.css'

function Input({ type = 'text', name = '', placeholder = '', value = '', autoComplete = "off", readOnly = false, handleOnChangeFunc, handleOnClickFunc = () => null }) {

  const [input, setInput] = useState('')

  useEffect(() => {
    setInput(value)
  }, [value])

  const handleOnChange = (e) => {
    setInput(e.target.value)
    handleOnChangeFunc(e)
  }

  const handleOnClick = (e) => {
    handleOnClickFunc(e)
  }

  return (
    <div className="input__container">
      <input
        onClick={handleOnClick}
        onChange={handleOnChange}
        value={input}
        placeholder={placeholder}
        name={name}
        className="input"
        type={type}
        autoComplete={autoComplete}
        readOnly={readOnly} />
    </div>
  )
}

export default Input
