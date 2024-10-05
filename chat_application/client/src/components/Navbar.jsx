import { useContext } from "react";
import { Navbar, Container, Stack, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notifications from "./Notification";

const NavBar = () => {
    const {user, logoutUser} = useContext(AuthContext);
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            ChatApp
          </Link>
        </h2>
        {user && <span className="text-warning">Logged in as: {user?.name}</span>}
        <Nav>
            <Stack direction="horizontal" gap={3}>
                {
                    !user? (
                        <>
                            <Link to="/login" className="link-light text-decoration-none">
                                Login
                            </Link>
                            <Link to="/register" className="link-light text-decoration-none">
                                Register
                            </Link>
                        </>
                    ): (
                        <>
                        <Notifications />
                        <Link to="/login" onClick={logoutUser} className="link-light text-decoration-none">
                            Logout
                        </Link>
                        </>
                    )
                }
                
            </Stack>
        </Nav>
    
        
      </Container>
    </Navbar>
  );
};

export default NavBar;
