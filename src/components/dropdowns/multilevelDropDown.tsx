import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

function MultiLevelDropdownMenu() {
  return (
    <Navbar className='d-flex flex-column' bg="light" expand="sm">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="p-0 m-0">
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#">Action</NavDropdown.Item>
            <NavDropdown.Item href="#">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown title="Submenu" id="basic-nav-dropdown-submenu">
              <NavDropdown.Item href="#">Submenu action</NavDropdown.Item>
              <NavDropdown.Item href="#">Another submenu action</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown title="Sub-submenu" id="basic-nav-dropdown-sub-submenu">
                <NavDropdown.Item href="#">Sub-submenu action</NavDropdown.Item>
                <NavDropdown.Item href="#">Another sub-submenu action</NavDropdown.Item>
              </NavDropdown>
            </NavDropdown>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MultiLevelDropdownMenu;
