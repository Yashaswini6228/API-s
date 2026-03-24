import express from 'express';

import { create,getAllUsers,getUserById,update,deleteUser} from '../controller/userController.js';

const route = express.Router();

route.post('/user', create);
route.get('/users', getAllUsers);
route.get('/getById/:id', getUserById);
route.put('/update/getById/:id', update);
route.delete('/delete/getById/:id', deleteUser);

export default route;