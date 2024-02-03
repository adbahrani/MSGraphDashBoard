import { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-material.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { Group } from '../services/groups'
import { useNavigate } from 'react-router-dom'
import { TableLoader } from './shared/Loaders/TableLoader'
import { defaultColDef } from '../utils/agGridSettings'

interface GroupsListProps {
    groups: Array<Group>
    width: string
    height: string
    columnDefs: ColDef[]
    isLoading?: boolean
}

export const GroupsList = ({ groups, height, width, columnDefs, isLoading = false }: GroupsListProps) => {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)

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
        <div className="ag-theme-material" style={{ height, width, margin: '8px' }}>
            {isLoading ? (
                <TableLoader
                    width={width}
                    height={height}
                    headers={columnDefs.map(columDef => columDef.headerName || '')}
                    rowsNum={6}
                />
            ) : (
                <AgGridReact
                    ref={gridRef}
                    rowData={groups}
                    columnDefs={columnDefs}
                    getRowId={getRowId}
                    onFirstDataRendered={onFirstDataRendered}
                    onRowClicked={onRowClicked}
                    defaultColDef={defaultColDef}
                ></AgGridReact>
            )}
        </div>
    )
}
