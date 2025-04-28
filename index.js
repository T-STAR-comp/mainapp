const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();
const db = require('./sqlite/sqlite.js');
const port = process.env.PORT_NUM || 8080;

// Require routes & controllers For client-end related requests
const generalLimiter = require('./CONTROLLERS/rateLimiter.js');

const getEventDataRoute = require('./routers/GetEventRoute.js');
const createQrCode = require('./routers/QRgenRoute.js');
const makePayment = require('./routers/PaymentRoute.js');
const adminLogin = require('./routers/adminlog.js');
const dbController = require('./Database/db_controllers/dbController.js');
const dbController2 = require('./Database/db_controllers/dbController2.js');
const dbgetevent = require('./Database/db_controllers/dbgetevent.js');
const dbUpdateUID = require('./Database/db_controllers/dbUpdateUID.js');
const dbgetlandingstate = require('./Database/db_controllers/dbgetstate1.js');
const VerifyTransID = require('./routers/transidVerify.js');

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

// Define allowed origins (filter out undefined values)
const allowedOrigins = [process.env.ORIGIN_URL, process.env.ORIGIN_URL2]
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

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(generalLimiter);
app.use(express.static(path.join(__dirname, 'dist')));

// Client-end routes
app.use('/api/createticket/ticketmalawi', createQrCode);
app.use('/api/geteventdata/ticketmalawi', getEventDataRoute);
app.use('/api/makepayment/ticketmalawi/valid', makePayment);
app.use('/api/adminLogin/ticketmalawi/verify', adminLogin);
app.use('/api/update/db/ticketmalawi/valid', dbController);
app.use('/api/update/db/ticketmalawi/valid/2', dbController2);
app.use('/api/getevent/data/db/ticketmalawi', dbgetevent);
app.use('/api/updatedb/ticketuid/ticketmalawi/valid', dbUpdateUID);
app.use('/Api/getlandingpage/state', dbgetlandingstate);
app.use('/Api/verifypayment/ticketmalawi/verify', VerifyTransID);

// Admin routes - Simplified
const adminRouter = express.Router();
adminRoutes.forEach(({ path, handler }) => {
  adminRouter.use(path, handler);
});
app.use('/Api/ticketmalawi', adminRouter);

// Serve the React build files & handle all unknown routes
app.get('/', (req, res) => {
  res.status(200).send({msg:"hello world"});
});

// Start server function with error handling
async function start() {
  try {
    if (db) {
      app.listen(port, () => console.log(`Server is live on port ${port}`));
    } else {
      console.error('Database connection failed.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();