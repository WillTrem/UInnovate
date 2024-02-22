import {useEffect, useState } from 'react'
import AdditionalViewEditor from './AdditionalViewEditor';
import { Col, Row, Tab } from 'react-bootstrap';
import DisplayType from '../../Schema/DisplayType';
import SchemaSelector from '../../Schema/SchemaSelector';
import { useSelector } from 'react-redux';
import vmd from '../../../virtualmodel/VMD';
import { LOGIN_BYPASS } from '../../../redux/AuthSlice';
import { RootState } from '../../../redux/Store';

const AdditionalViewTab = () => {

    const [schema, setSchema] = useState<string>('');
    const {user, schema_access} = useSelector((state: RootState) => state.auth);
    const schemas = [
    ...new Set(vmd.getApplicationSchemas()
      .map((schema) => schema.schema_name)
      .filter((schema_name) => {
        // Ensures that on LOGIN_BYPASS without being logged in, all the schemas show
        if ((LOGIN_BYPASS && user === null) || schema_access.includes(schema_name)) {
          return schema_name;
        }
      })),
    ];

    useEffect(()=>{
        setSchema(schemas[0]);
    },
    []);


    const selectCallback = (schema: string) =>{
        console.log(schema, ' from additionalView');
        setSchema(schema);
    }
    return (
        <>
        <Tab.Container >
            <Tab.Content id='AdditionalViewEditor'>
            <Row>
                <Col sm='3'>
                    {/* <SchemaTableSelector setTable={setTable} setSchema={setSchema}/> */}
                    <SchemaSelector
                        displayType={DisplayType.MuiDropDown}
                        schemas={schemas}
                        p_selectedSchema={schema}
                        setSelectedSchema={selectCallback}
                    />
                </Col>
            </Row>
            <Row>
                <AdditionalViewEditor selectedSchema={schema} setSelectedSchema={setSchema}/>
            </Row>
            </Tab.Content>
        </Tab.Container>
        </>
    )
}

export default AdditionalViewTab