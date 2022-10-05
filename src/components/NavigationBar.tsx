import { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function NavigationBar() {
    const [isHidden, setIsHidden] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user") === null) {
            setIsHidden(true);
        } else setIsHidden(false);
    }, [localStorage.getItem("user"), setIsHidden]);

    return (
        <Navbar expand="lg" bg="light" variant="light">
            <Navbar.Brand className="ms-3" onClick={() => nav("/")}>
                Collections
            </Navbar.Brand>
            <Nav>
                <Nav.Link>Your Site</Nav.Link>
                <Nav.Link>Admin Panel</Nav.Link>
            </Nav>
            <Nav className="ms-auto me-3">
                <Nav.Link onClick={() => nav("/signin")}>Sign in</Nav.Link>
                <Nav.Link onClick={() => nav("/signup")}>Sign up</Nav.Link>
                <Nav.Link
                    onClick={() => {
                        localStorage.clear();
                        nav("/");
                    }}
                    hidden={isHidden}
                >
                    Log out
                </Nav.Link>
            </Nav>
        </Navbar>
    );
}
