import { ColDef } from 'ag-grid-community'

export const defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    // make every column use 'text' filter by default
    filter: 'agTextColumnFilter',
    minWidth: 110,
}
