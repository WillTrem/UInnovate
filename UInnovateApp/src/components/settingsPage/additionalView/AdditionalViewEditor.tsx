import React, { useEffect, useState } from 'react'
import { Accordion, Button, Card, Col, Row, useAccordionButton } from 'react-bootstrap'
import AdditionalViewModal from './AdditionalViewModal';
import { getViews } from '../../../virtualmodel/AdditionalViewsDataAccessor';
import { ViewTypeEnum, getViewTypeEnum } from './ViewTypeEnum';


function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log('totally custom!'),
    );
  
    return (
      <Button
        variant="dark"
        onClick={decoratedOnClick}
      >
        {children}
      </Button>
    );
  }
  
interface editorProp {
    selectedTable: string,
}
const AdditionalViewEditor = ({
    selectedTable
}: editorProp) => {

    const [viewList, setViewList] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleClick = ()=>{setShowModal(true)};
    useEffect(()=>{
        // get data from db
         getViews(setViewList, selectedTable);
        console.log(viewList);
    },[selectedTable])
    
  return (
    <>
        <div className='row'>
            <div className='col-md-12'>
                <h4>{selectedTable} Views</h4>
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
            {viewList.length > 0 &&
            (<>
                <Accordion>
                    
                {viewList.map( view =>
                <Card key={view.id}>
                    <Card.Header>
                        <div className=''>
                            <div className='hstack gap-3'>
                                <div>{view.viewname}</div>
                                <div className="vr"></div>
                                <div>{getViewTypeEnum(view.viewtype)}</div>
                            
                                { view.viewtype === ViewTypeEnum.Custom && (
                                <div className='ms-auto'>
                                    <CustomToggle eventKey={view.viewname}>open</CustomToggle>
                                </div>
                                )}
                            </div>
                        </div>
                      
                    </Card.Header>
                    { view.viewtype === ViewTypeEnum.Custom &&
                        (
                            <Accordion.Collapse eventKey={view.viewname}>
                                <Card.Body>
                                custom data
                                </Card.Body>
                            </Accordion.Collapse>
                        )
                    }
                    <Accordion.Collapse eventKey={view.viewname}>
                      <Card.Body>
                        Hello! I'm the body
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                )}
                    </Accordion>
            </>)
            }

        </div>
        <AdditionalViewModal show={showModal} setShow={setShowModal}/>

    </>
  )
}

export default AdditionalViewEditor