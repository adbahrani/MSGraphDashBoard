import { useCallback, useEffect, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'

import { defaultColDef } from '../utils/agGridSettings'

interface TeamsFilesListProps {
    FilesByTeams?: any
}

export const TeamsFilesList = ({ FilesByTeams }: TeamsFilesListProps) => {
    //const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)

    useEffect(() => {
        console.log('Log', FilesByTeams)
    }, [FilesByTeams])

    const columnDefs: ColDef[] = [
        { field: 'teamDisplayName', headerName: 'Team Name' },
        { field: 'count', headerName: 'Total', sortIndex: 0, sort: 'desc' },
        { field: 'modifyCount', headerName: 'Modified' },
        { field: 'createCount', headerName: 'Created' },
        { field: 'deleteCount', headerName: 'Deleted' },
    ]

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.id
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    // const onRowClicked = useCallback(({ data }: { data: Team }) => {
    //     navigate(`/group?id=${data.id}`)
    // }, [])

    return (
        <div className="ag-theme-alpine" style={{ width: 'calc(100%)', height: 'calc(100% - 16px)' }}>
            <AgGridReact
                ref={gridRef}
                rowData={FilesByTeams}
                columnDefs={columnDefs}
                getRowId={getRowId}
                onFirstDataRendered={onFirstDataRendered}
                // onRowClicked={onRowClicked}
                defaultColDef={defaultColDef}
            ></AgGridReact>
        </div>
    )
}
