import { Accordion, AccordionDetails, AccordionSummary, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import styles from './DirectionContent.module.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/system';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import { Direction } from '../../models/direction.interface';
function createData(
    title: string,
    abriviation: string,
    users: number,
   
  ) {
    return { title,abriviation,users };
  }
  
  const rows = [
    createData("dpartement1","dtq",200),
    createData("dpartement1","dtq",200),
    createData("dpartement1","dtq",200),
 
  ];
const DirectionContent = () => {
  const [directions,setDirections] = useState<Direction[]>([]);
  useEffect(()=>{
    const abortController = new AbortController()
    axios.get("http://localhost:8080/api/directions?offset=0&limit=10",{
        signal:abortController.signal
    })
    .then(res=>{
        setDirections(res?.data)
    })
    .catch(err=>{
        console.log(err);
    })

    return ()=>{
        abortController.abort();
    }
  },[])
  return (
    <div className={styles.container}>
        <div className={styles.wrapperBox}>
            {
                directions.map((direction,index)=>{
                    return (
                        <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <div className={styles.accordingContainer}>
                            <Typography>{direction?.title}</Typography>
                            <div className={styles.actionButtons}>
                                <Button onClick={(e)=>e.stopPropagation()}>
                                    <ModeEditIcon/>
                                </Button>
                                <Button onClick={(e)=>e.stopPropagation()}>
                                    <DeleteIcon />
                                </Button>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack>
                                
                                <Stack direction="row" className={styles.departementsTitleWrapper}>
                                    <Typography>Departements</Typography>
                                    <Button><AddCircleIcon/></Button>
                                </Stack>
                                <TableContainer sx={{overflowY:"scroll"}}>
                                    <Table  aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell align="left">titre</TableCell>
                                            <TableCell align="left">Mnemonique</TableCell>
                                            <TableCell align="left">utilisateurs</TableCell>
                                            <TableCell align="center">details</TableCell>
                                            <TableCell align="center">delete</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {direction?.departements?.map((row,index) => (
                                            <TableRow
                                            key={index}
                                            >
                                         
                                            <TableCell align="left">{row.title}</TableCell>
                                            <TableCell align="left">{row.abriviation}</TableCell>
                                            <TableCell align="left">{row.users}</TableCell>
                                            <TableCell align="center"><Button>Details</Button></TableCell>
                                            <TableCell align="center"><Button><DeleteIcon/></Button></TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                    </TableContainer>
                           </Stack>
                        </AccordionDetails>
                      </Accordion>
                    )
                })
            }
      
     
        </div>
    </div>
  )
}

export default DirectionContent