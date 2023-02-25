import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import PaymentDialog from "./PaymentDialog";

function PaymentsTable() {

    const [payments, setPayments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [serverPayment,setServerPayment] = useState(null);

    const savePayment = (payment) => {
        let clientPayments = payments.filter(p => p?.id?.localeCompare(serverPayment?.id));
        localStorage.setItem('payments', JSON.stringify([...clientPayments, payment]));
        setOpenDialog(false)
    }

    useEffect(() => {
            axios.get('http://localhost:8080/payments')
                .then((response) => {
                    let localElems = localStorage.getItem('payments') || '[]';
                    setPayments([...response.data.data,...JSON.parse(localElems)]);
                    setServerPayment(response.data.data[0])
                });
        }
        , [openDialog])

    const changeSearchValue = (event) => {
        setSearchValue(event.target.value);
    }

    const filterPayment = (elem) => {
        return elem.sender["name"].toLowerCase().includes(searchValue.toLowerCase()) || elem.receiver["name"].toLowerCase().includes(searchValue.toLowerCase())
            || elem.amount.toString().includes(searchValue) || elem.currency.toLowerCase().includes(searchValue.toLowerCase())
            || elem.date.toString().includes(searchValue.toLowerCase());
    }

    return (
        <div className="App">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <TextField onChange={(event) => changeSearchValue(event)}
                           placeholder={'Search'}></TextField>
                <Button onClick={() => setOpenDialog(true)}>Create payment</Button>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sender</TableCell>
                            <TableCell align="left">Receiver</TableCell>
                            <TableCell align="left">Amount</TableCell>
                            <TableCell align="left">Currency</TableCell>
                            <TableCell align="left">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.sort((a, b) => {
                            return new Date(a) - new Date(b)
                        }).slice(0, 25).filter(elem => filterPayment(elem))
                            .map((row) => {
                                    return <TableRow
                                        key={row.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell align="left">{row.sender["name"]}</TableCell>
                                        <TableCell align="left">{row.receiver["name"]}</TableCell>
                                        <TableCell align="left">{row.amount}</TableCell>
                                        <TableCell align="left">{row.currency}</TableCell>
                                        <TableCell align="left">{row.date}</TableCell>
                                    </TableRow>
                                }
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
            <PaymentDialog open={openDialog} handleClose={() => setOpenDialog(false)}
                           savePayment={savePayment}></PaymentDialog>
        </div>
    );
}

export default PaymentsTable;
