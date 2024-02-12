export enum ViewTypeEnum {
    Calendar = 1,
    Timeline,
    TreeView,
    Custom,
  }

  export const getViewTypeEnum = (p_type_id: number) =>{
    switch(p_type_id){
      case ViewTypeEnum.Calendar: return 'Calendar';break;
      case ViewTypeEnum.Timeline: return 'Timeline';break;
      case ViewTypeEnum.TreeView: return 'Tree View';break;
      case ViewTypeEnum.Custom: return 'Custom';break;
    }
  }