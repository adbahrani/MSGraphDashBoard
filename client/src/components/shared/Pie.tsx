import { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';

interface PieProps  {
    data: Array<{label: string, value: number}>,
    fills?: string[],
}
export const Pie = ({data, fills}: PieProps) => {
  const [options, setOptions] = useState<AgChartOptions>({});

  useEffect(() => {
    setOptions({
        data,
        series: [
          {
            type: 'pie',
            fills,
            calloutLabelKey: 'label',
            angleKey: 'value',
            innerRadiusOffset: -30,
            strokeWidth: 0,
            showInLegend: false,
            highlightStyle: {
                item: {
                    fill: 'black',
                    fillOpacity: 0.1
                },
            }
          },
          
        ],

    
      })
  }, [data, fills]);

  return <AgChartsReact options={options} />;
};