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

export const columnDefSiteAudience: ColDef[] = [
    { field: 'name', headerName: 'Name/Email', flex: 6 },
    { field: 'department', headerName: 'Department', flex: 2 },
    {
        field: 'country',
        headerName: 'Country',
        flex: 2,
    },
    {
        field: 'city',
        headerName: 'City',
        flex: 3,
    }
]

export const columnDefSelectedSitePages: ColDef[] = [
    { field: 'webUrl', headerName: 'Page URL', flex: 6 },
    { field: 'name', headerName: 'Page Name', flex: 2 },
    {
        field: 'views',
        headerName: 'Views',
        flex: 2,
    },
    {
        field: 'unique',
        headerName: 'Unique Viewers',
        flex: 3,
    }
]
