import { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { StoreState, useStoreDispatch } from "../store/Store";

import Forms from "./Forms/SignForms";
import { showSignForm } from "../store/features/forms/SignFormsSlice";
import {
	deleteloginUser,
	getUserData,
} from "../store/features/oneUser/LoginUserSlice";

export default function NavigationBar() {
	const [isHidden, setIsHidden] = useState(true);
	const nav = useNavigate();

	const storeDispatch = useStoreDispatch();
	const dispatch = useDispatch();

	const user = useSelector(
		(state: StoreState) => state.LoginUserReducer.loginUser
	);

	const sessUser = sessionStorage.getItem("user");

	useEffect(() => {
		if (sessUser === null) {
			setIsHidden(true);
		} else {
			setIsHidden(false);
			storeDispatch(getUserData(sessUser));
		}
	}, [user.userName]);

	return (
		<Navbar expand="sm" bg="light" variant="light" className="ms-1">
			<Nav
				onSelect={(selectedKey) =>
					selectedKey &&
					nav(selectedKey, {
						state: { name: sessUser },
					})
				}
			>
				<Nav.Link eventKey={`/`}>
					<Navbar.Brand>Collections</Navbar.Brand>
				</Nav.Link>
				<Nav.Link eventKey={`/${sessUser}`} hidden={isHidden}>
					Your Site
				</Nav.Link>
				<Nav.Link
					eventKey={`/${sessUser}/admin`}
					hidden={user ? !user.isAdmin : false}
				>
					Admin Panel
				</Nav.Link>
			</Nav>

			<Nav
				className="ms-auto me-1"
				onSelect={(selectedKey) => selectedKey && nav(selectedKey)}
			>
				{sessUser && (
					<Navbar.Text>
						Hi <strong>{user.userName}</strong>
					</Navbar.Text>
				)}
				<Nav.Item>
					<Nav.Link
						onClick={() => dispatch(showSignForm("signin"))}
						hidden={!isHidden}
					>
						Sign in
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						onClick={() => dispatch(showSignForm("signup"))}
						hidden={!isHidden}
					>
						Sign up
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						eventKey="/"
						onClick={() => {
							sessionStorage.clear();
							storeDispatch(deleteloginUser());
						}}
						hidden={isHidden}
					>
						Log out
					</Nav.Link>
				</Nav.Item>
			</Nav>
			<Forms />
		</Navbar>
	);
}
