import { formatBytes } from '../utils/helpers'
import { ColDef } from 'ag-grid-community'

export const columnDefTopSites: ColDef[] = [
    { field: 'webUrl', headerName: 'Site URL', flex: 6 },
    { field: 'displayName', headerName: 'Site Name', flex: 10 },
    {
        field: 'pageViewCount',
        headerName: 'Page Views Count',
        flex: 2,
    },
    {
        field: 'storageUsedInBytes',
        headerName: 'Storage Used',
        valueFormatter: params => {
            return params.value ? formatBytes(params.value) : ''
        },
        flex: 3,
    },
    {
        field: 'fileCount',
        headerName: 'Current Files',
        flex: 2,
    },
    {
        field: 'secureLinkForMemberCount',
        headerName: 'Engaged Users',
        flex: 2
    },
]
