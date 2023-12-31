import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useMemo, useRef } from 'react'
import { TableLoader } from './shared/Loaders/TableLoader'
import { defaultColDef } from '../utils/agGridSettings'
import { Block } from './shared/Block'

export const SharePointSitesList = <T,>({
    title,
    sites,
    height,
    width,
    columnDefs,
    isLoading = false,
    handleRowClick,
}: {
    title?: string
    sites: Array<T>
    width: string
    height: string
    columnDefs: ColDef[]
    isLoading?: boolean
    handleRowClick: (site: T) => void
}) => {
    const gridRef = useRef<AgGridReact>(null)

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.id
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    const onRowClicked = useCallback(({ data }: { data: T }) => {
        handleRowClick(data)
    }, [])

    return (
        <Block title={title}>
            <div className="ag-theme-alpine" style={{ height, width, margin: '8px' }}>
                {isLoading ? (
                    <TableLoader
                        width={width}
                        height={height}
                        headers={columnDefs.map(columDef => columDef.headerName || '')}
                        rowsNum={6}
                    />
                ) : (
                    <div className="ag-theme-alpine" style={{ width: 'calc(100%)', height: 'calc(100% - 16px)' }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={sites}
                            columnDefs={columnDefs}
                            getRowId={getRowId}
                            onFirstDataRendered={onFirstDataRendered}
                            onRowClicked={onRowClicked}
                            defaultColDef={defaultColDef}
                        ></AgGridReact>
                    </div>
                )}
            </div>
        </Block>
    )
}
