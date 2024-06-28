import { createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "@components/Home/Home";
import LoginForm from "@components/LoginForm/LoginForm";
import RegisterForm from "@components/RegisterForm/RegisterForm"; 
import React , { useState , useEffect } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    index : true,
    element: <HomePage />
  },
  {
    path: "login",
    element: <LoginForm />
  },
  {
    path: "register",
    element: <RegisterForm />
  }
])

// const Header = () => {
//   const [isAuthenticated, setisAuthenticated] = useState(false);

//   return (
//   <Navbar bg="light" expand="lg">
//     <Navbar.Brand href="/">Demo DevOps</Navbar.Brand>
//     <Navbar.Toggle aria-controls="basic-navbar-nav" />
//     <Navbar.Collapse id="basic-navbar-nav">
//         <Nav className="ml-auto">
//             {!isAuthenticated ? (
//                 <>
//                     <Nav.Link as={Link} to="/login">
//                         Sign In
//                     </Nav.Link>
//                     <Nav.Link as={Link} to="/register">
//                         Sign Up
//                     </Nav.Link>
//                 </>
//             ) : (
//                 <>
//                     <Nav.Link as={Link} to="/home">
//                         Home
//                     </Nav.Link>
//                     <Button
//                         variant="outline-danger"
//                         onClick={handleLogout}
//                     >
//                         Log Out
//                     </Button>
//                 </>
//             )}
//         </Nav>
//     </Navbar.Collapse>
//   </Navbar>
// )

// }

const App = () => {
  return (
  <div>
    {/* <Header /> */}
    <RouterProvider router={router}/>
  </div>
  )
}

export default App;