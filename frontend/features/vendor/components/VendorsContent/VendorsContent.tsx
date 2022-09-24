import {Button, Modal} from '@mui/material';
import { DataGrid, GridColumns, GridSortItem, GridSortModel } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TextField from '@mui/material/TextField';


import FilterIcon from '../../../../icons/FilterIcon';
import styles from './VendorsContent.module.css';
import axios from 'axios';
import CreateVendor from '../CreateVendor/CreateVendor';
import { Vendor } from '../../models/vendor.interface';
import { useDebounce } from '../../../../hooks/useDebounce.hook';
import VendorActions from '../../../dashboard/VendorActions/VendorActions';


const VendorsContent = () => {
  const [pageState,setPageState] = useState<any>({
    isLoading:false,
    data:[],
    total:0,
    page:0,
    pageSize:5,


});
const [rowId,setRowId] = useState<any>(null)
const [searchQuery,setSearchQuery] = useState('')
const [queryOptions, setQueryOptions] = useState<{ sortModel:GridSortItem[] | null}>({sortModel:null});
const [open, setOpen] = useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
const {debounce} = useDebounce();
const columns:GridColumns<any> = useMemo(()=>[

  {
      field:"num",
      headerName:"numero",
      flex:1,
      editable:true
  },
  {
      field:"company_name",
      headerName:"raison sociale",
      flex:1,
      editable:true
  },
  {
      field:"nif",
      headerName:"nif",
      flex:1,
      editable:true
  },
  {
      field:"address",
      headerName:"adresse",
      flex:1,
      editable:true
  },
  {
      field:"mobile_phone_number",
      headerName:"mobile",
      flex:1,
      editable:true
  },
  {
      field:"home_phone_number",
      headerName:"fixe",
      flex:1,
      editable:true
  },
  {
    field:"actions",
    headerName:"actions",
    type:"actions",
    renderCell:(params)=>{

        return (
          <VendorActions {...{params,rowId,setRowId}}/>
        )
    }
}
],[rowId])
const handleSortModelChange = (sortModel: GridSortModel)=> {
    // Here you save the data you need from the sort model
    if(sortModel){

      setQueryOptions({ sortModel: [...sortModel] });
    }
  }



useEffect( ()=>{
    let params = '';
    if(queryOptions.sortModel){
      console.log(queryOptions,"code530")
        params+= '&orderBy='+queryOptions.sortModel[0]?.field
    }
    if(searchQuery.length > 0 ){
      params+= `&searchQuery=${searchQuery}`;
    }
    setPageState((old:any)=>({...old,isLoading:true}))
         axios.get(`http://localhost:8080/api/vendors?offset=${pageState.page}&limit=${pageState.pageSize}${params}`)
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
                experimentalFeatures={{ newEditingApi: true }}
                onCellEditStop={params=>{console.log(params,"...");setRowId(params.id)}}
                getRowId={(row)=>row.id}
                
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
        <CreateVendor/>
      </Modal>

     
    </div>
  )
}

export default VendorsContent