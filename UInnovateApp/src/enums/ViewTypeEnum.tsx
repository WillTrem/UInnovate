export enum ViewTypeEnum {
    Default = 0,
    Calendar,
    Timeline,
    TreeView,
    Custom,
  }

  export const getViewTypeEnum = (p_type_id: number) =>{
    switch(p_type_id){
      case ViewTypeEnum.Calendar: return 'Calendar';
      case ViewTypeEnum.Timeline: return 'Timeline';
      case ViewTypeEnum.TreeView: return 'Tree View';
      case ViewTypeEnum.Custom: return 'Custom';
    }
  }