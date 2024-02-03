import { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-material.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { defaultColDef } from '../utils/agGridSettings'
import { Button } from '@mui/material'

interface InfluencersListProps {
    users: Array<{ userName: string; messages: number; calls: number; meetings: number }>
}

export const InfluencersList = ({ users }: InfluencersListProps) => {
    const gridRef = useRef<AgGridReact>(null)
    const columnDefs: ColDef[] = [
        { field: 'userName', filter: 'agTextColumnFilter' },
        { field: 'messages' },
        { field: 'calls' },
        { field: 'meetings' },
    ]

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.userName
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    return (
        <div
            className="ag-theme-material"
            style={{ margin: '4px', width: 'calc(100% - 8px)', height: 'calc(100% - 40px)' }}
        >
            <Button
                onClick={() => gridRef?.current?.api.exportDataAsCsv()}
                variant="contained"
                color="info"
                sx={{ m: 1 }}
                size="small"
            >
                Export To CSV
            </Button>
            <AgGridReact
                ref={gridRef}
                rowData={users}
                columnDefs={columnDefs}
                getRowId={getRowId}
                onFirstDataRendered={onFirstDataRendered}
                defaultColDef={defaultColDef}
            ></AgGridReact>
        </div>
    )
}
