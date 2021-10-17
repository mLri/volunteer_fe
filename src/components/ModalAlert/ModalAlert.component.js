import './ModalAlert.component.css'

import { VscError } from 'react-icons/vsc'
import { MdDone } from 'react-icons/md'

function ModalAlert({ type = 'error', message, handleCloseModalFn }) {
  return (
    <div className="modal__alert__container">
      <div className="modal__alert__content">
        {
          type === 'error' &&
          <>
            <div onClick={handleCloseModalFn} className="modal__alert__clear">

              <VscError color="red" size="4em" />

            </div>
            <div className="modal__alert__head">
              <h2>Oops...</h2>
            </div>
          </>
        }

        {
          type === 'success' &&
          <>
            <div onClick={handleCloseModalFn} className="modal__alert__clear">
              <MdDone color="green" size="4em" />
            </div>
            <div className="modal__alert__head">
              <h2>Congrats</h2>
            </div>
          </>

        }
        <div className="modal__alert__body">
          {message}
        </div>
        <div className="modal__alert__foot">

        </div>
      </div>
    </div>
  )
}

export default ModalAlert
