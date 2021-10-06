// import './Btn.css'

function Btn({ value, handleSubmitFunc = () => null }) {
  return (
    <div className="btn">
      <button onClick={handleSubmitFunc}>{value}</button>
    </div>
  )
}

export default Btn
