import { useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
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

    return (
        <div className="ag-theme-alpine" style={{ margin: '8px', flex: flex || 1 }}>
            <AgGridReact ref={gridRef} rowData={users} columnDefs={columnDefs} getRowId={getRowId}></AgGridReact>
        </div>
    )
}
