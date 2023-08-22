import { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { Group } from '../services/groups'
import { useNavigate } from 'react-router-dom'

interface GroupsListProps {
    groups: Array<Group>
}

export const GroupsList = ({ groups }: GroupsListProps) => {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)
    const columnDefs: ColDef[] = [{ field: 'displayName' }, { field: 'description' }]

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.id
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    const onRowClicked = useCallback((params: { data: Group }) => {
        navigate(`/group?id=${params.data.id}`)
    }, [])

    return (
        <div className="ag-theme-alpine" style={{ margin: '8px' }}>
            <AgGridReact
                ref={gridRef}
                rowData={groups}
                columnDefs={columnDefs}
                getRowId={getRowId}
                onFirstDataRendered={onFirstDataRendered}
                onRowClicked={onRowClicked}
            ></AgGridReact>
        </div>
    )
}
