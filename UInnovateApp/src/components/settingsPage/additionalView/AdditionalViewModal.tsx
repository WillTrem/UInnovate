import React from 'react'
import { Modal , Button} from 'react-bootstrap'
import AddAdditionalViewForm from './AddAdditionalViewForm';

interface AdditionalViewModalProp{
    show: boolean;
    setShow: (v:boolean)=>void;
}
const AdditionalViewModal = ({show, setShow}:AdditionalViewModalProp) => {

    const handleClose = () => setShow(false);
    const handleSave = ()=>{        
        handleClose();
    }
    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add a new view</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
                <AddAdditionalViewForm saveform={handleSave}/>

            </Modal.Body>
    
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
          </Modal>
        
        </>
      );
}

export default AdditionalViewModal