import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select, Stack,
    TextField
} from "@mui/material";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {DesktopDatePicker} from "@mui/x-date-pickers";

const CURRENCIES = ['BTC', 'GBP', 'EUR', 'JPY', 'USD'];

function PaymentDialog(props) {

    const open = props.open;
    const handleClose = props.handleClose;
    const savePayment = props.savePayment;

    const [users, setUsers] = useState([]);
    const [successed, setSuccesssed] = useState(false);
    const [payment, setPayment] = useState({
        id: '1',
        date: '12/11/2022',
        sender: '',
        receiver: '',
        amount: '0',
        currency: '',
        memo: ''
    })

    console.log(payment);


    useEffect(() => {
            axios.get('http://localhost:8080/users')
                .then((response) => {
                    console.log(response.data);
                    setUsers(response.data.data);
                });
        }
        , [])


    const handleChangeCurrency = (event, field) => {
        console.log(event);
        payment[field] = event;
        payment['id'] = Math.random().toString()
        setPayment({...payment});
        checkPayment();
    }

    const checkPayment = () => {
        axios.post('http://localhost:8080/payments', payment).then((res)=>{
            setSuccesssed(true)
        }).catch(
            (response) => {
                setSuccesssed(false)
            }
        ).finally()
    }


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Payment</DialogTitle>
            <DialogContent sx={{display: 'flex', flexDirection: 'column', rowGap: '20px'}}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Sender</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Sender"
                        value={payment.sender}
                        onChange={(event) => handleChangeCurrency(event.target.value, 'sender')}
                    >
                        {users.map((user) => (
                            <MenuItem value={user}>{user["name"]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Receiver</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Receiver"
                        value={payment.receiver}
                        onChange={(event) => handleChangeCurrency(event.target.value, 'receiver')}
                    >
                        {users.map((user) => (
                            <MenuItem value={user}>{user["name"]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Currency"
                        value={payment.currency}
                        onChange={(event) => handleChangeCurrency(event.target.value, 'currency')}
                    >
                        {CURRENCIES.map((currency) => (
                            <MenuItem value={currency}>{currency}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>
                        <DesktopDatePicker
                            label="Date desktop"
                            inputFormat="MM/DD/YYYY"
                            value={payment.date}
                            onChange={(event)=> handleChangeCurrency(event.toISOString(), 'date')}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Stack>
                </LocalizationProvider>
                    <TextField value={payment.memo} onChange={(event) => handleChangeCurrency(event.target.value, 'memo')}
                    placeholder={'Memo'}></TextField>
                    <TextField value={payment.amount} onChange={(event) => handleChangeCurrency(`${event.target.value}`, 'amount')}
                    placeholder={'Amount'} type="number"></TextField>


            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={!successed} onClick={() => {
                    savePayment(payment);
                    setPayment({
                        id: '1',
                        date: '2014-08-18T21:11:54',
                        sender: '',
                        receiver: '',
                        amount: '0',
                        currency: '',
                        memo: ''
                    })
                }}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}

export default PaymentDialog;
