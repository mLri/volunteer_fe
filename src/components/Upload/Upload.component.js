import './Upload.component.css'

function Upload({handleOnChangeFunc}) {

  const handleOnChange = (e) => {
    handleOnChangeFunc(e)
  }
  return (
    <div>
      <input type="file" onChange={handleOnChange} />
    </div>
  )
}

export default Upload
