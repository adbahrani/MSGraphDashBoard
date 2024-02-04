import { ColDef } from 'ag-grid-community'
import { formatBytestToGB } from '../utils/helpers'

export const columnDefExchanges: ColDef[] = [
    { field: 'userPrincipalName', headerName: 'User Email Address', flex: 10, minWidth: 100 },
    { field: 'displayName', headerName: 'User Name', flex: 6, minWidth: 100 },
    {
        field: 'isDeleted',
        editable: false,
        headerName: 'Deleted',
        flex: 4,
        minWidth: 100,
    },
    {
        field: 'deletedDate',
        headerName: 'Deleted Date',
        flex: 4,
        minWidth: 100,
    },
    {
        headerName: 'Created Date',
        field: 'createdDate',
        flex: 4,
        minWidth: 100,
    },
    {
        field: 'lastActivityDate',
        headerName: 'Last Activity Date',
        flex: 4,
        minWidth: 100,
    },
    {
        headerName: 'Item Count',
        field: 'itemCount',
        flex: 4,
        minWidth: 100,
    },
    {
        field: 'storageUsedInBytes',
        headerName: 'Storage Used (GB)',
        valueFormatter: ({ value }) => formatBytestToGB(value, 3),
        flex: 4,
        minWidth: 100,
    },
    {
        field: 'hasArchive',
        editable: false,
        headerName: 'Has Archive',
        flex: 4,
        minWidth: 100,
    },
]
