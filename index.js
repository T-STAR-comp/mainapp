const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();
const createDBConnection = require('./Database/db_router.js');
const port = process.env.PORT || 8080;

// Define allowed origins (filter out undefined values)
const allowedOrigins = [process.env.ORIGIN_URL, process.env.ORIGIN_URL2];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // Reject request without throwing an error
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Require routes & controllers For client-end related requests
const generalLimiter = require('./CONTROLLERS/rateLimiter.js');
const captcha = require('./server/Login/captcha.js');

const getEventDataRoute = require('./routers/GetEventRoute.js');
const createQrCode = require('./routers/QRgenRoute.js');
const createType = require('./Database/Event_db_controllers/createtype.js');
const updateType = require('./Database/Event_db_controllers/updatetype.js');
const getTicketType = require('./Database/Event_db_controllers/gettype.js');
const deleteTicketType = require('./Database/Event_db_controllers/deletetype.js');
const makePayment = require('./routers/PaymentRoute.js');
const adminLogin = require('./routers/adminlog.js');
const dbController = require('./Database/Event_db_controllers/dbController.js');
const dbController2 = require('./Database/Event_db_controllers/dbController2.js');
const dbgetevent = require('./Database/Event_db_controllers/dbgetevent.js');
const dbUpdateUID = require('./Database/Event_db_controllers/dbUpdateUID.js');
const dbgetlandingstate = require('./Database/Event_db_controllers/dbgetstate1.js');
const VerifyTransID = require('./routers/transidVerify.js');
const postLog = require('./Database/Event_db_controllers/dbpostlog.js');
const getLog = require('./Database/Event_db_controllers/dbgetlog.js');
//transport
const AuthCreateUser = require('./Database/Transp_db_controllers/users/AuthCreateUser.js');
const AuthLogibTransport = require('./Database/Transp_db_controllers/users/AuthLoginUser.js');
const FetchRoutes = require('./Database/Transp_db_controllers/routes/fetchRoutes.js');
const CreateRoute = require('./Database/Transp_db_controllers/routes/CreateRoute.js');
const ChangePass = require('./Database/Transp_db_controllers/users/AuthChangePass.js');

// Require routes & controllers For Admin related requests
const adminRoutes = [
  { path: '/create/event', handler: require('./server/Database/DBcontroller.js') },
  { path: '/updateevent/details', handler: require('./server/Database/DBupdateEvent.js') },
  { path: '/get/data/event', handler: require('./server/Database/DBgetdata.js') },
  { path: '/delete/data/event', handler: require('./server/Database/DBdeleteEvent.js') },
  { path: '/update/data/status/event', handler: require('./server/Database/DBupdate.js') },
  { path: '/adminlogin/redirect', handler: require('./server/Login/redirect.js') },
  { path: '/verifymaster', handler: require('./server/Login/masterLog.js') },
  { path: '/changelandingstate', handler: require('./server/Database/landingstate.js') },
  { path: '/changemaintainancepage', handler: require('./server/Database/maintainstate.js') },
  { path: '/checkstate', handler: require('./server/Database/states.js') },
  { path: '/getuid', handler: require('./server/Database/DBgetUID.js') },
  { path: '/admin/consoledata', handler: require('./server/Database/DBgetconsole.js') },
  { path: '/admin/consoledata', handler: require('./server/Database/dbgetconsoleP.js') },
];

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(generalLimiter);
app.use('/Api/tkm/captcha', captcha);
app.use(express.static(path.join(__dirname, 'dist')));

// Client-end routes
app.use('/api/createticket/ticketmalawi', createQrCode);
app.use('/api/createtype/ticketmalawi', createType);
app.use('/api/updateticket/type/ticketmalawi', updateType);
app.use('/api/get/tickettype/ticketmalawi', getTicketType);
app.use('/api/deleteticket/type/ticketmalawi', deleteTicketType);
app.use('/api/geteventdata/ticketmalawi', getEventDataRoute);
app.use('/api/makepayment/ticketmalawi/valid', makePayment);
app.use('/api/adminLogin/ticketmalawi/verify', adminLogin);
app.use('/api/update/db/ticketmalawi/valid', dbController);
app.use('/api/update/db/ticketmalawi/valid/2', dbController2);
app.use('/api/getevent/data/db/ticketmalawi', dbgetevent);
app.use('/api/updatedb/ticketuid/ticketmalawi/valid', dbUpdateUID);
app.use('/Api/getlandingpage/state', dbgetlandingstate);
app.use('/Api/verifypayment/ticketmalawi/verify', VerifyTransID);
app.use('/api/postlog/ticketmalawi', postLog);
app.use('/api/getlog/ticketmalawi', getLog);

//transport
app.use('/api/createuser/transport', AuthCreateUser);
app.use('/api/login/user/transport', AuthLogibTransport);
app.use('/api/fetchuser/routes', FetchRoutes);
app.use('/api/user/createroute', CreateRoute);
app.use('/api/changepass/user', ChangePass);
app.use('/api/changestate/user', require('./Database/Transp_db_controllers/routes/ChangeState.js'));
app.use('/api/updateprice/user', require('./Database/Transp_db_controllers/routes/ChangePrice.js'));
app.use('/api/deleteroute/user', require('./Database/Transp_db_controllers/routes/DeleteRoute.js'));
app.use('/api/get/user/customers', require('./Database/Transp_db_controllers/data/fetchData.js'));
app.use('/api/getdates/records', require('./Database/Transp_db_controllers/data/fetchDates.js'));
app.use('/api/createcustomer/data', require('./Database/Transp_db_controllers/data/createData.js'));
app.use('/api/fetchfinancial/data', require('./Database/Transp_db_controllers/users/FetchFinancial.js'));
app.use('/api/get/user', require('./Database/Transp_db_controllers/users/GetUsers.js'));
app.use('/api/fetchticket/data', require('./Database/Transp_db_controllers/data/fetchTicket.js'));
app.use('/api/getpdf/ticket', require('./Database/Transp_db_controllers/data/download.js'));
app.use('/api/scanticket/verify', require('./Database/Transp_db_controllers/data/scandata.js'));
//payments other
app.use('/api/process/payout/banks', require('./Database/Transp_db_controllers/payments/payOutRouter.js'));
app.use('/api/process/mobilepayment/airtel/tnm', require('./Database/Transp_db_controllers/payments/mobilePayment.js'));
app.use('/api/processpayment/bank/direct', require('./Database/Transp_db_controllers/payments/bankPayment.js'));
app.use('/api/generalpayment/processing', require('./Database/Transp_db_controllers/payments/generalPayment.js'));

// Admin routes - Simplified
const adminRouter = express.Router();
adminRoutes.forEach(({ path, handler }) => {
  adminRouter.use(path, handler);
});
app.use('/Api/ticketmalawi', adminRouter);

// Serve the React build files & handle all unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server function with DB connection
async function start() {
  try {
    const db = await createDBConnection();

    if (!db) {
      console.error('Database connection failed.');
      process.exit(1);
    }

    // Make DB connection available throughout the app (optional)
    app.locals.db = db;

    app.listen(port, () => console.log(`Server is live on port ${port}`));
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();
