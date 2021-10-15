import { useState, useEffect } from 'react'

/* import css */
import './Input.component.css'

function Input({ type = 'text', name = '', placeholder = '', value = '', onFocus = false, autoComplete = "off", readOnly = false, handleOnChangeFunc, handleOnClickFunc = () => null }) {

  const [input, setInput] = useState('')

  useEffect(() => {
    setInput(value)
    if (onFocus) document.querySelector('.input').focus()
  }, [value])

  const handleOnChange = (e) => {
    setInput(e.target.value)
    handleOnChangeFunc(e)
  }

  const handleOnClick = (e) => {
    console.log('click ...')
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
