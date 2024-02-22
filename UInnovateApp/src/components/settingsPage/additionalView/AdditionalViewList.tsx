import { useEffect } from 'react'
import { Button } from 'react-bootstrap'


const AdditionalViewList = () => {

    useEffect(()=>{
        const ctrl = new AbortController();
        const signal = ctrl.signal;
        // get data from db
         getViews(setViewList, selectedTable, signal);
         getCustomViews(setCustomViews, signal)

         return ()=>{ctrl.abort()};
    },[selectedTable])

  return (
    <>
    <div className='row'>
            <div className='col-md-12'>
                <h4>{selectedTable} Views</h4>
                <Button className='btn btn-md centered' onClick={handleClick}>add view</Button>
            </div>
        </div>
    </>
  )
}

export default AdditionalViewList