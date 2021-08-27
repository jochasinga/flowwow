import AuthCluster from './AuthCluster';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Tippy from "@tippyjs/react";
import { roundArrow } from "tippy.js";
import "tippy.js/dist/tippy.css";
import 'tippy.js/themes/light.css';

const Nav = () => {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <h1 className="title">🐶 Flowwow</h1>
          </a>
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenuHero"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div id="navbarMenuHero" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item is-active">
              NFT
            </a>
            <a className="navbar-item">
              Flow
            </a>
            <a className="navbar-item">
              Filecoin/IPFS
            </a>
          </div>
          <div className="navbar-end">
            <Tippy 
              className="floating"
              content="Log in to buy pets"
              placement="left"
              theme="light"
              showOnCreate
              inertia
            >
              <div className="navbar-item">
                <AuthCluster />
              </div>
            </Tippy>
            <span className="navbar-item">
              <a className="button is-medium is-light">
                <span className="icon">
                  <FontAwesomeIcon icon={faGithub} size="lg" />
                </span>
                <span>Fork</span>
              </a>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;