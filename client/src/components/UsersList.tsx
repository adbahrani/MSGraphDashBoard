import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
} from 'ag-grid-community';
import { User } from '../services/users';

interface UsersListProps  {
  users: Array<User>;
}

export const UsersList = ({users}: UsersListProps) => {
  const columnDefs: ColDef[] =[
    { field: 'userPrincipalName' },
    { field: 'jobTitle' },
    { field: 'officeLocation' },
  ];
  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams) => params.data.userPrincipalName;
  }, []);
  
  return (
    <>
        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          getRowId={getRowId}
        ></AgGridReact>
    </>
  );
};
