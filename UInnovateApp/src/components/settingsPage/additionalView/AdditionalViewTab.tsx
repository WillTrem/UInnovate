import React, { useCallback, useState } from 'react'
import AdditionalViewEditor from './AdditionalViewEditor';
import { Col, Row, Tab } from 'react-bootstrap';
import SchemaTableSelector from '../../Schema/SchemaTableSelector';

const AdditionalViewTab = () => {

    const [table,setTable] = useState<string>('');
    const [schema,setSchema] = useState<string>('');

  return (
    <>
    <Tab.Container>
        <Tab.Content>
        <Row>
            <Col sm='3'>
                <SchemaTableSelector setTable={setTable} setSchema={setSchema}/>
            </Col>
            <Col sm='9'>
                <AdditionalViewEditor selectedSchema={schema} selectedTable={table} />
            </Col>
        </Row>
        </Tab.Content>
    </Tab.Container>
    </>
  )
}

export default AdditionalViewTab