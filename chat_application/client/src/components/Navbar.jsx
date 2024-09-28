import { useContext } from "react";
import { Navbar, Container, Stack, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
    const {user} = useContext(AuthContext);
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            ChatApp
          </Link>
        </h2>
        <span className="text-warning">Logged in as: {user?.name}</span>
        {!user && <Nav>
            <Stack direction="horizontal" gap={3}>
                <Link to="/login" className="link-light text-decoration-none">
                Login
                </Link>
                <Link to="/register" className="link-light text-decoration-none">
                Register
                </Link>
            </Stack>
            </Nav>
        }
      </Container>
    </Navbar>
  );
};

export default NavBar;
