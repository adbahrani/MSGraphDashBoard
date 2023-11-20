import { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'

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
            className="ag-theme-alpine"
            style={{ margin: '8px', width: 'calc(100% - 16px)', height: 'calc(100% - 16px)' }}
        >
            <AgGridReact
                ref={gridRef}
                rowData={users}
                columnDefs={columnDefs}
                getRowId={getRowId}
                onFirstDataRendered={onFirstDataRendered}
            ></AgGridReact>
        </div>
    )
}
