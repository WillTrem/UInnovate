import React, { useCallback, useState } from 'react'
import AdditionalViewEditor from './AdditionalViewEditor';
import { Col, Row, Tab } from 'react-bootstrap';
import SchemaTableSelector from '../../Schema/SchemaTableSelector';
import TableSelector from '../TableSelector';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';

const AdditionalViewTab = () => {

    const [table,setTable] = useState<string>('');
    const selectedSchema = useSelector((state: RootState) => state.schema.value);

  return (
    <>
    <Tab.Container >
        <Tab.Content id='AdditionalViewEditor'>
        <Row>
            <Col sm='3'>
                {/* <SchemaTableSelector setTable={setTable} setSchema={setSchema}/> */}
                <TableSelector setTable={setTable}/>
            </Col>
            <Col sm='9' >
                <AdditionalViewEditor selectedSchema={selectedSchema} selectedTable={table} setSelectedTable={setTable}/>
            </Col>
        </Row>
        </Tab.Content>
    </Tab.Container>
    </>
  )
}

export default AdditionalViewTab