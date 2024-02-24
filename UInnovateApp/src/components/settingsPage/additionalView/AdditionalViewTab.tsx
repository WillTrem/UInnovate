import AdditionalViewEditor from './AdditionalViewEditor';
import {Row, Tab } from 'react-bootstrap';

interface AdditionalViewTabProp{
    schema: string;
    setSchema: ()=>void;
}
const AdditionalViewTab = ({schema, setSchema}:AdditionalViewTabProp) => {
    return (
        <>
        <Tab.Container >
            <Tab.Content id='AdditionalViewEditor'>
            <Row>
                <AdditionalViewEditor selectedSchema={schema} setSelectedSchema={setSchema}/>
            </Row>
            </Tab.Content>
        </Tab.Container>
        </>
    )
}

export default AdditionalViewTab