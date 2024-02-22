import { useEffect, useState } from 'react'
import { Modal , Button, Form} from 'react-bootstrap'
import { ViewTypeEnum } from './ViewTypeEnum';
import { insertNewView } from '../../../virtualmodel/AdditionalViewsDataAccessor';
import vmd, { Table } from '../../../virtualmodel/VMD';

interface AdditionalViewModalProp{
    schemaName: string,
    show: boolean;
    setShow: (v:boolean)=>void;
    refreshList:()=>void;
}

const AdditionalViewModal = ({schemaName, show, setShow, refreshList: updateList}:AdditionalViewModalProp) => {
    const [viewName, setViewName] = useState<string>('');
    const [viewType, setViewType] = useState<number>(1);
    const [tableName, setTableName] = useState<string>('');
    const [customCode, setCustomCode] = useState<string>('');
    const [tableList, setTableList]= useState<Table[]>([]);

    useEffect(()=>{
        // Only show tables of the selected schema
        const tables = vmd.getSchema(schemaName)?.tables || [];
        setTableList(tables);
    }, [schemaName]);

    const handleClose = () => setShow(false);

    const handleSave = (e): void =>{
        e.preventDefault();
        handleClose();
        insertNewView(schemaName, tableName, viewName, viewType, customCode);
        updateList();
    }
    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add a new view</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSave}>
                    <Form.Group className="mb-3" controlId="viewName">
                        <Form.Label>view name</Form.Label>
                        <Form.Control name='viewName' type="text" onChange={(e)=>{setViewName(e.target.value)}} placeholder="Enter a view name"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="viewType">
                        <Form.Label>view type</Form.Label>
                        <Form.Select name='viewType' onChange={(e)=>setViewType(parseInt(e.target.value))}>
                            <option value={ViewTypeEnum.Calendar}>Calendar</option>
                            <option value={ViewTypeEnum.Timeline}>Timeline</option>
                            <option value={ViewTypeEnum.TreeView}>Tree View</option>
                            <option value={ViewTypeEnum.Custom}>Custom</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="viewTable">
                        <Form.Label>tables</Form.Label>
                        <Form.Select onChange={(e)=>setTableName(e.target.value)}>
                            {tableList.map((table)=>
                                <option value={table.table_name}>{table.table_name}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                    {(viewType === ViewTypeEnum.Custom) &&
                    (
                    <Form.Group className="mb-3" controlId="viewCustomCode">
                        <Form.Label>view custom code</Form.Label>
                        <textarea name="viewCustomCode" onChange={(e)=>setCustomCode(e.target.value)}>
                        </textarea>
                    </Form.Group>
                    )}
                </Form>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button  variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
          </Modal>

        </>
    );
}

export default AdditionalViewModal