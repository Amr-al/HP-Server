const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./mongodb/connect');
const userRoutes = require('./routes/userRoutes');
const areaRoutes = require('./routes/areaRoutes');
const blogRoutes = require('./routes/blogRoutes');
const propertyTypeRoutes = require('./routes/propertyTypeRoutes');
const furnitureSettingRoutes = require('./routes/furnitureSettingRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const settingRoutes = require('./routes/settingRoutes');
const subAreaRoutes = require('./routes/subAreaRoutes');
const toplinkRoutes = require('./routes/toplinkRoutes');
const contactRoutes = require('./routes/contactRoutes');
const footerlinkRoutes = require('./routes/footerlinkRoutes');
const utils = require('./routes/utils.routes');
const tenant = require('./routes/tenant.routes');
const pageTitle = require('./routes/pageTitle.routes');
const favorite = require('./routes/favorite.routes');
const socialMediaRoutes = require('./routes/socialMediaRoutes');
const bindFlmngr = require('@flmngr/flmngr-server-node-express');
dotenv.config();

const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(cors());

bindFlmngr.bindFlmngr({
  app: app,
  urlFileManager: '/api/n1edfm',
  urlFiles: '/api/uploads/blogs/',
  dirFiles: './uploads/blogs',
});
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(morgan('dev'));

app.use('/api/user', userRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/area', areaRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/subarea', subAreaRoutes);
app.use('/api/setting', settingRoutes);
app.use('/api/propertyType', propertyTypeRoutes);
app.use('/api/furnitureSetting', furnitureSettingRoutes);
app.use('/api/toplink', toplinkRoutes);
app.use('/api/footerlink', footerlinkRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/utils', utils);
app.use('/api/tenant', tenant);
app.use('/api/title', pageTitle);
app.use('/api/favorite', favorite);
app.use('/api/social-media', socialMediaRoutes);

app.get('/api/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from House Point!',
  });
});
app.get('/api/', async (req, res) => {
  res.send({ message: 'Hello from House Point' });
});
// app.use("/uploads", express.static("./uploads/properties"));
app.use('/api/uploads', express.static('./uploads'));
const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8000, () =>
      console.log('Server has started on port 8000 \n http://localhost:8000')
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
