import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
} from 'ag-grid-community';

interface UsersListProps  {
  users: Array<{
    userPrincipalName: string;
    jobTitle: string;
    officeLocation: string;
  }>;
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
