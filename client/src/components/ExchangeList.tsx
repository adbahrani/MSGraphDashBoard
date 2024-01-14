import { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { useNavigate } from 'react-router-dom'
import { TableLoader } from './shared/Loaders/TableLoader'
import { defaultColDef } from '../utils/agGridSettings'
import { MailBoxUsageDetail } from '../services/exchange'

interface ExchangeListProps {
    exchanges: Array<MailBoxUsageDetail>
    width: string
    height: string
    columnDefs: ColDef[]
    isLoading?: boolean
}

export const ExchangeList = ({ exchanges, height, width, columnDefs, isLoading = false }: ExchangeListProps) => {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.id
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    const onRowClicked = useCallback((params: { data: any }) => {
        navigate(`/group?id=${params.data.id}`)
    }, [])

    return (
        <div className="ag-theme-alpine" style={{ height, width, margin: '8px' }}>
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
                    rowData={exchanges}
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
