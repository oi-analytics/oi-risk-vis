import { NavLink } from "react-router";

function Nav() {
  return (
    <nav className="navbar navbar-height navbar-expand navbar-light">
      <NavLink className="navbar-brand" to="/">
        <img src="/logo.png" alt="OIA" />
      </NavLink>
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <NavLink className="nav-link" to="/">
            About
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/summary">
            Summary
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/overview">
            Infrastructure networks
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/hazards">
            Hazards
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/roads">
            Roads
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/rail">
            Rail
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/energy_network">
            Electricity
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
