import { useCallback, useMemo, useRef, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { DriveOneService, OneDriveActivity } from '../services/one-drive'
import ListItemText from '@mui/material/ListItemText/ListItemText'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import { defaultColDef } from '../utils/agGridSettings'
import { formatBytes } from '../utils/helpers'
import { Counts } from '../services/teams'

interface DrivesListProps {
    drives: Array<OneDriveActivity>
}
export interface OneDriveActivityWithCount extends OneDriveActivity {
    counts: Counts
    totalCount: number
}

export const DrivesList = ({ drives }: DrivesListProps) => {
    const [selectedDrive, setSelectedDrive] = useState<OneDriveActivityWithCount | null>(null)
    const gridRef = useRef<AgGridReact>(null)
    const columnDefs: ColDef[] = [
        { field: 'siteId', hide: true },
        { field: 'siteUrl', flex: 3 },
        { field: 'ownerDisplayName', headerName: 'Owner Name' },
        {
            field: 'storageUsedInBytes',
            valueGetter: params => formatBytes(params.data.storageUsedInBytes),
            headerName: 'Storage Used',
        },
        { field: 'fileCount' },
        { field: 'activeFileCount' },
    ]

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.siteId
    }, [])

    const onRowClicked = useCallback(async ({ data }: { data: OneDriveActivity }) => {
        const counts: Counts = await DriveOneService.getDriveActivityBySiteId(data.siteId)

        const totalCount = counts.created + counts.deleted + counts.modified
        const res: OneDriveActivityWithCount = { ...data, counts, totalCount }
        setSelectedDrive(res)
    }, [])

    const formatActivities = (counts: Counts) =>
        `Created: ${counts.created}, Modified: ${counts.modified}, Deleted: ${counts.deleted}`

    return (
        <>
            <div
                className="ag-theme-alpine"
                style={{ margin: '8px', width: 'calc(100% - 16px)', height: 'calc(100% - 16px)' }}
            >
                <AgGridReact
                    ref={gridRef}
                    rowData={drives}
                    columnDefs={columnDefs}
                    getRowId={getRowId}
                    //Doesn't look like this is needed
                    //onFirstDataRendered={onFirstDataRendered}
                    onRowClicked={onRowClicked}
                    defaultColDef={defaultColDef}
                ></AgGridReact>
            </div>
            <Drawer anchor="right" open={!!selectedDrive} onClose={() => setSelectedDrive(null)}>
                <div style={{ width: '50vw', height: '100vh', padding: '32px' }}>
                    {selectedDrive ? (
                        <>
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Short URL"
                                        secondary={selectedDrive.siteUrl.substring(
                                            selectedDrive.siteUrl.lastIndexOf('/') + 1
                                        )}
                                    />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Owner Name" secondary={selectedDrive.ownerDisplayName} />
                                </ListItem>

                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText
                                        primary="Active files"
                                        secondary={`${selectedDrive.activeFileCount} / ${selectedDrive.fileCount}`}
                                    />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Activities Count" secondary={selectedDrive.totalCount} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText
                                        primary="Activities Type"
                                        secondary={formatActivities(selectedDrive.counts)}
                                    />
                                </ListItem>
                            </List>
                        </>
                    ) : null}
                </div>
            </Drawer>
        </>
    )
}
