import React, { useCallback, useEffect, useState } from 'react'
import { Accordion, Button, Card, Col, Row, useAccordionButton } from 'react-bootstrap'
import AdditionalViewModal from './AdditionalViewModal';
import { deleteView, getViews } from '../../../virtualmodel/AdditionalViewsDataAccessor';
import { ViewTypeEnum, getViewTypeEnum } from './ViewTypeEnum';


function CustomToggle({ children, eventKey }) {
    const openOnClick = useAccordionButton(eventKey, () =>
      console.log('open custom!'),
    );
  
    return (
      <Button
        variant="dark"
        onClick={openOnClick}
      >
        {children}
      </Button>
    );
  }
  
interface editorProp {
    selectedSchema: string;
    selectedTable: string;
}

const AdditionalViewEditor = ({
    selectedSchema,
    selectedTable
}: editorProp) => {

    const [viewList, setViewList] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleClick = ()=>{setShowModal(true)};
    const handleDelete = async (id:string , isCustom: boolean)=>{
        var res = deleteView(id, isCustom);
        if(await res){
            console.log('updating list')
            getViews(setViewList, selectedTable);
        }
    }

    useEffect(()=>{
        // get data from db
         getViews(setViewList, selectedTable);
        console.log(viewList);
    },[selectedTable])
    

    if(selectedTable != '')
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
                        <div>
                            <div className='hstack gap-3'>
                                <div>{view.viewname}</div>
                                <div className="vr"></div>
                                <div>{getViewTypeEnum(view.viewtype)}</div>
                                
                                <div className='ms-auto'>
                                { view.viewtype === ViewTypeEnum.Custom && (
                                    <CustomToggle eventKey={view.viewname}>open</CustomToggle>
                                    )}
                                    <Button variant='danger' onClick={(e)=> handleDelete(`${view.id}`, view.viewtype === ViewTypeEnum.Custom)}>delete</Button>
                                </div>
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
                        custom script detail
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                )}
                    </Accordion>
            </>)
            }

        </div>
        <AdditionalViewModal show={showModal} setShow={setShowModal} tableName={selectedTable} schemaName={selectedSchema} />
    </>
  )
  else
  return(
<>
<div>select a table</div>
</>
    )
}

export default AdditionalViewEditor