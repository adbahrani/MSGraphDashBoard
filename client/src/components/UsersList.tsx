import { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-material.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { User } from '../services/users'

interface UsersListProps {
    users: Array<User>
    flex?: number
}

export const UsersList = ({ users, flex }: UsersListProps) => {
    const gridRef = useRef<AgGridReact>(null)
    const columnDefs: ColDef[] = [{ field: 'userPrincipalName' }, { field: 'jobTitle' }, { field: 'officeLocation' }]

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.userPrincipalName
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    return (
        <div className="ag-theme-material" style={{ margin: '8px', flex: flex || 1, height: '100%' }}>
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
