import React, { useState } from 'react'
import SchemaSelector from '../../Schema/SchemaSelector'
import DisplayType from '../../Schema/DisplayType'
import AdditionalViewEditor from './AdditionalViewEditor';
import AddAdditionalViewForm from './AddAdditionalViewForm';
import AdditionalViewModal from './AdditionalViewModal';

const AdditionalViewTab = () => {
    const [schema,setSchema] = useState('');

    const selectCallBack = (val:string)=>{
        setSchema(val);
        console.log(val);
    }
  return (
    <>
    <div className='row'>
        <div className='col-sm-3'>
            <h4>Schema</h4>
            <SchemaSelector displayType ={DisplayType.StackedPills} onSelectCallback={selectCallBack} />
        </div>
        <div className='col-sm-9'>
            <AdditionalViewEditor selectedSchema={schema} />
        </div>
    </div>
    </>
  )
}

export default AdditionalViewTab