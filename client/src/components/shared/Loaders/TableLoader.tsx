import { Paper, Skeleton, Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";


export const TableLoader = ({ rowsNum, width, height, headers }: { rowsNum: number, width: string, height: string, headers: string[] }) => {
  return <TableContainer component={Paper} style={{
    width,
    height
  }}><Table>
  <TableHead>
    <TableRow>
      {headers.map((header) => <>
      <TableCell>{header}</TableCell>
      </>)}
    </TableRow>
  </TableHead>
  {[...Array(rowsNum)].map((_, index) => (
    <TableRow key={index}>
      {headers.map((_, innerIndex) => <TableCell key={innerIndex} component="th" scope="row">
        <Skeleton animation="wave" variant="text" />
      </TableCell>)}
      
    </TableRow>
  ))}
  </Table>
  </TableContainer>
};