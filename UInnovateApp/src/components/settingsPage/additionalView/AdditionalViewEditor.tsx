import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import AdditionalViewModal from './AdditionalViewModal';

interface editorProp {
    selectedSchema: string,
}
const AdditionalViewEditor = ({
    selectedSchema
}: editorProp) => {

    const [viewList, setViewList] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleClick = ()=>{setShowModal(true)};
    useEffect(()=>{


    },[])
    
  return (
    <>
        <div className='row'>
            <div className='col-md-12'>
                <h4>{selectedSchema} Views</h4>
                <Button className='btn btn-md centered' onClick={handleClick}>add view</Button>
            </div>
        </div>
        <div className='row'>
            {viewList.length === 0 && 
            
            (<>
                <div className='col-sm'>
                    no views
                </div>
            </>)
            }

        </div>
        <AdditionalViewModal show={showModal} setShow={setShowModal}/>

    </>
  )
}

export default AdditionalViewEditor