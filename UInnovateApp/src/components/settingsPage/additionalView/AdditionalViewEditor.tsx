import React, { useEffect, useState } from 'react'
import { Button } from "@mui/material";
import { Badge, Accordion, Card, useAccordionButton } from 'react-bootstrap'
import AdditionalViewModal from './AdditionalViewModal';
import { AdditionalViews, deleteView, getCustomViews, getViewsBySchema } from '../../../virtualmodel/AdditionalViewsDataAccessor';
import { ViewTypeEnum, getViewTypeEnum } from './ViewTypeEnum';
import '../../../styles/AdditionalViewEditor.css';
import { KeyboardArrowDown, KeyboardArrowUp, Delete } from '@mui/icons-material';

function CustomToggle({ children, eventKey }) {
    const [isOpen, setIsOpen] = useState<Boolean>(false);
    
    const openOnClick = useAccordionButton(eventKey, () =>
    {
        setIsOpen(!isOpen)
        console.log('open custom!')
    });
  
    return (
      <Button
        variant="contained"
        className='buttonStyle'
        onClick={openOnClick}
      >
        {/* {children} */}
        {isOpen ? (<KeyboardArrowUp />) : (<KeyboardArrowDown />)}
      </Button>
    );
  }
  
interface editorProp {
    selectedSchema: string;
    setSelectedSchema: React.Dispatch<React.SetStateAction<string>>;
}

const AdditionalViewEditor = ({
    selectedSchema,
    setSelectedSchema
}: editorProp) => {

    const [viewList, setViewList] = useState<AdditionalViews[]>([]);
    const [customViews, setCustomViews]= useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleClick = ()=>{setShowModal(true)};
    const handleDelete = async (id:string , isCustom: boolean)=>{
        const res = deleteView(id, isCustom);
        if(await res){
            const ctrl = new AbortController();
            const signal = ctrl.signal;
            console.log('updating list')
            getViewsBySchema(setViewList, selectedSchema, signal);
        }
    }
    const refreshList = ()=>{
        setSelectedSchema('');
        setTimeout( ()=> setSelectedSchema(selectedSchema), 100);
    }

    useEffect(()=>{
        if(selectedSchema){
        const ctrl = new AbortController();
        const signal = ctrl.signal;
        // get data from db
         getViewsBySchema(setViewList, selectedSchema, signal);
         getCustomViews(setCustomViews, signal)

         return ()=>{ctrl.abort()};
        }
    },[selectedSchema])
    

    if(selectedSchema != '')
  return (
    <>
        <div className='row'>
            <div className='col-md-12'>
                <Button className='buttonStyle' variant="contained" onClick={handleClick}>ADD VIEW</Button>
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
                {viewList && viewList.map( (view: AdditionalViews) =>
                <Card key={view.id}>
                    <Card.Header>
                        <div>
                            <div className='hstack gap-3'>
                                <div>{view.viewname}</div>
                                <div className="vr"></div>
                                <div>target table: {view.tablename}</div>
                                <div className="vr"></div>
                                <Badge pill bg="dark">
                                {getViewTypeEnum(view.viewtype)}
                                </Badge>
                                
                                <div className='ms-auto'>
                                { view.viewtype === ViewTypeEnum.Custom && (
                                    <CustomToggle eventKey={view.viewname}>open</CustomToggle>
                                    )}
                                    <Button variant='contained' color="error" onClick={(e)=> handleDelete(`${view.id}`, view.viewtype === ViewTypeEnum.Custom)}>
                                        <Delete />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card.Header>
                    { view.viewtype === ViewTypeEnum.Custom &&
                        (
                            <Accordion.Collapse eventKey={view.viewname}>
                                <Card.Body>
                                <h4>custom code:</h4>
                                <code>
                                    {customViews.filter(cv=>{if(cv.settingid === view.id){return cv}})[0].template}
                                </code>
                                </Card.Body>
                            </Accordion.Collapse>
                        )
                    }
                  
                </Card>
                )}
            </Accordion>
            </>)
            }

        </div>
        <AdditionalViewModal show={showModal} setShow={setShowModal} refreshList={refreshList} />
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