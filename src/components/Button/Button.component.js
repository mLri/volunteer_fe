// import './Btn.css'

function Btn({ value, handleSubmitFunc = () => null, bgc = 'gray', color = '#000000' }) {
  return (
    <div className="btn" >
      <button
        style={{ backgroundColor: bgc, color }}
        onClick={handleSubmitFunc}>
        {value}
      </button>
    </div>
  )
}

export default Btn
