import { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community'
import { SiteActivity } from '../services/share-point'

interface SitesListProps {
    sites: Array<SiteActivity>
}

export const SitesList = ({ sites }: SitesListProps) => {
    const gridRef = useRef<AgGridReact>(null)
    const columnDefs: ColDef[] = [
        { field: 'ownerDisplayName', filter: 'agTextColumnFilter' },
        { field: 'pageViewCount' },
        { field: 'visitedPageCount' },
    ]

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => params.data.siteId
    }, [])

    const onFirstDataRendered = useCallback(() => {
        gridRef?.current?.api.sizeColumnsToFit()
    }, [])

    return (
        <div
            className="ag-theme-alpine"
            style={{ margin: '8px', width: 'calc(100% - 16px)', height: 'calc(100% - 16px)' }}
        >
            <AgGridReact
                ref={gridRef}
                rowData={sites}
                columnDefs={columnDefs}
                getRowId={getRowId}
                onFirstDataRendered={onFirstDataRendered}
            ></AgGridReact>
        </div>
    )
}
