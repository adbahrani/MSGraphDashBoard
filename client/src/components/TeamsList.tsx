import { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { Team } from '../services/teams'
import { useNavigate } from 'react-router-dom'

interface TeamsListProps {
    teams: Array<Team>
}

export const TeamsList = ({ teams }: TeamsListProps) => {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)
    const columnDefs: ColDef[] = [
        { field: 'displayName', filter: 'agTextColumnFilter' },
        { field: 'mail', filter: 'agTextColumnFilter' },
        { field: 'visibility' },
    ]

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.id
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    const onRowClicked = useCallback(({ data }: { data: Team }) => {
        navigate(`/group?id=${data.id}`)
    }, [])

    return (
        <div
            className="ag-theme-alpine"
            style={{ margin: '8px', width: 'calc(100% - 16px)', height: 'calc(100% - 16px)' }}
        >
            <AgGridReact
                ref={gridRef}
                rowData={teams}
                columnDefs={columnDefs}
                getRowId={getRowId}
                onFirstDataRendered={onFirstDataRendered}
                onRowClicked={onRowClicked}
            ></AgGridReact>
        </div>
    )
}
