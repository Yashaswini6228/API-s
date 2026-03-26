import './App.css';
import User from './getusers/user';
import AddUser from './adduser/AddUser';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import UpdateUser from './updateuser/Update';
import Home from './homepage/home';
import RegisterUser from './registeruser/RegisterUser';

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <User />
    },
    {
      path: "/home",
      element: <Home />
    },
    {
      path: "/add",
      element: <AddUser />
    },
    {
      path: "/update/:id",
      element: <UpdateUser />
    },
    {
      path: "/register",
      element: <RegisterUser />
    }
    
  ]);


  return (
    <div className="App">
      <RouterProvider router={route} />   
    </div>
  );
}

export default App;


