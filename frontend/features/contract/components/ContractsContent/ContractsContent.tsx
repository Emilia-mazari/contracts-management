import {Button, Modal} from '@mui/material';
import { DataGrid, GridColumns, GridSortItem, GridSortModel } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import styles from './ContractsContent.module.css';
import axios from 'axios';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FilterIcon from '../../../../icons/FilterIcon';
import CreateContract from '../CreateContract/CreateContract';
import { useDebounce } from '../../../../hooks/useDebounce.hook';
import Link from 'next/link';


const columns:GridColumns<any> = [
    // {
    //     field:"id",
    //     headerName:"id",
    //     flex:1,
        
    // },
    {
        field:"number",
        headerName:"numero",
        flex:1
    },
    {
        field:"object",
        headerName:"objet",
        flex:1
    },
    {
        field:"amount",
        headerName:"montant",
        flex:1
    },
    {
        field:"expiration_date",
        headerName:"expiration",
        flex:1
    },
    {
        field:"signature_date",
        headerName:"signature",
        flex:1
    },
    {
        field:"status",
        headerName:"status",
        flex:1
    },
    {
        field:"actions",
        headerName:"Details",
        type:"actions",
        renderCell:(params)=>{

            return (
             <Button><Link href={`/contracts/${params.id}`}>Details</Link></Button>
            )
        }
    }
];
const ContractsContent = () => {
    const [pageState,setPageState] = useState<any>({
        isLoading:false,
        data:[],
        total:0,
        page:0,
        pageSize:5,


    });
    const [searchQuery,setSearchQuery] = useState('');
    const {debounce} = useDebounce();
    const [queryOptions, setQueryOptions] = useState<{ sortModel:GridSortItem[] | null}>({sortModel:null});
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSortModelChange = (sortModel: GridSortModel)=> {
        // Here you save the data you need from the sort model
        setQueryOptions({ sortModel: [...sortModel] });
      }
 
    useEffect( ()=>{
        let params = '';
        if(queryOptions.sortModel){
            params+= '&orderBy='+queryOptions.sortModel[0].field
        }
        if(searchQuery.length > 0 ){
            params+= `&searchQuery=${searchQuery}`;
          }
        setPageState((old:any)=>({...old,isLoading:true}))
             axios.get(`http://localhost:8080/api/agreements?offset=${pageState.page}&limit=${pageState.pageSize}${params}&agreementType=contract`)
            .then((res:any)=>{
                const {data:d} = res;
                console.log(1,d)
                setPageState((old:any)=>({...old,data:d?.data,total:d?.total,isLoading:false}))
            })
            .catch(err=>{
                console.error(err);
            })
       
    },[pageState?.page,pageState?.pageSize,queryOptions.sortModel,searchQuery])
 
    const handleSearch = (e:any)=>{
        const {value} = e.target;
        debounce(()=>setSearchQuery(value),1000)
      }
    return (
        <div className={styles.container}>
            <div className={styles.wrapperBox}>
                <div className={styles.searchContainer}>
                    <Button 
                        startIcon ={<FilterIcon/>}  
                        size='small' 
                        color='secondary' 
                        variant="contained" 
                        className={styles.advancedButton}>Avancée</Button>
                  
              
                    <TextField 
                        placeholder='mot clé...' color='secondary' 
                        size='small' 
                        fullWidth type='search' 
                        onChange={handleSearch}
                       InputProps={{
    
                                    // startAdornment:obj
                                    
                                    
                                    className: styles.input,
    
                                    }}
                    />
                    
                </div>
                <div className={styles.tableContainer}>
                <DataGrid
                    autoHeight
                    rows={pageState.data}
                    rowCount={pageState.total}
                    loading={pageState.isLoading}
                    rowsPerPageOptions={[5,10,20]}
                    pagination
                    page={pageState.page}
                    pageSize={pageState.pageSize}
                    paginationMode="server"
                    onPageChange={(newPage: number) => setPageState((old:any)=>({...old,page:newPage}))}
                    onPageSizeChange={(newPageSize: number) => setPageState((old:any)=>({...old,pageSize:newPageSize}))}
                    columns={columns}
                    disableColumnFilter
                    disableColumnMenu 
                    onSortModelChange={handleSortModelChange}
                    
                />
                </div>
                <Button onClick={handleOpen} className={styles.UserFormButton}>
                    <PersonAddIcon/>
                </Button>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
          >
            <CreateContract handleClose={handleClose}/>
          </Modal>
    
         
        </div>
      )
}

export default ContractsContent