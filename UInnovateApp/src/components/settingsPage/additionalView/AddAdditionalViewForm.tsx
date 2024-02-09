import { FormEvent, useState } from 'react'
import { Form } from 'react-bootstrap'
import vmd from '../../../virtualmodel/VMD';
import { ViewTypeEnum } from './ViewTypeEnum';

const AddAdditionalViewForm = () => {
    const schemas = [
        ...new Set(vmd.getSchemas().map((schema) => schema.schema_name)),
      ];
      
    // const [formData, setFormData] = useState({});

    const handleSubmit = (event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        // save to db
    };

    
    const handleInputChange = (e): void =>{
        const { name, value } = e.target;
        console.log(name, value);
    }

  return (
    <>
    <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="viewName">
            <Form.Label>view name</Form.Label>
            <Form.Control name='viewName' type="text" placeholder="Enter a view name" onChange={handleInputChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="targetTable">
            <Form.Label>target table</Form.Label>
            <Form.Select onChange={handleInputChange}>
                {
                    schemas.map((schema)=>
                        (
                            <option key={schema} value={schema}>{schema}</option>
                        )
                    )
                }
            </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="viewType">
            <Form.Label>view type</Form.Label>
            <Form.Select onSelect={handleInputChange}>
                <option value={ViewTypeEnum.Calendar}>Calendar</option>
                <option value={ViewTypeEnum.Timeline}>Timeline</option>
                <option value={ViewTypeEnum.TreeView}>Tree View</option>
                <option value={ViewTypeEnum.Custom}>Custom</option>
            </Form.Select>
        </Form.Group>
    </Form>
    </>
    
  )
}

export default AddAdditionalViewForm