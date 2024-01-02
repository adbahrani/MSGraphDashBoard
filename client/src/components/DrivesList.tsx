import { useCallback, useMemo, useRef, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { OneDriveActivity } from '../services/one-drive'
import ListItemText from '@mui/material/ListItemText/ListItemText'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import { defaultColDef } from '../utils/agGridSettings'

interface DrivesListProps {
    drives: Array<OneDriveActivity>
}

export const DrivesList = ({ drives }: DrivesListProps) => {
    const [selectedDrive, setSelectedDrive] = useState<OneDriveActivity | null>(null)
    const gridRef = useRef<AgGridReact>(null)
    const columnDefs: ColDef[] = [
        { field: 'siteId', hide: true },
        { field: 'siteUrl', flex: 3 },
        { field: 'ownerDisplayName', headerName: 'Owner Name' },
        { field: 'ownerPrincipalName', headerName: 'Owner Email' },
    ]

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.siteId
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    const onRowClicked = useCallback(({ data }: { data: OneDriveActivity }) => {
        setSelectedDrive(data)
    }, [])

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
                    onFirstDataRendered={onFirstDataRendered}
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
                                    <ListItemText primary="Site ID" secondary={selectedDrive.siteId} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Owner Name" secondary={selectedDrive.ownerDisplayName} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Owner Email" secondary={selectedDrive.ownerPrincipalName} />
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
                                    <ListItemText
                                        primary="Used storage"
                                        secondary={`${(selectedDrive.storageUsedInBytes / 1024 ** 2).toFixed(2)} MB / ${
                                            selectedDrive.storageAllocatedInBytes / 1024 ** 3
                                        } GB`}
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
