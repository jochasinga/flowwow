import AuthCluster from './AuthCluster';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Nav = () => {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <h1 className="title">🐶 Flowwow</h1>
          </a>
          <div className="navbar-item">
            <span className="tag is-light">
              { process.env.REACT_APP_FLOW_NET }
            </span>
          </div>
          <button
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenuHero"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div id="navbarMenuHero" className="navbar-menu">
          <div className="navbar-start">
            <a href="/" className="navbar-item is-active">
              NFT
            </a>
            <a href="/" className="navbar-item">
              Flow
            </a>
            <a href="/" className="navbar-item">
              Filecoin/IPFS
            </a>
          </div>
          <div className="navbar-end">

              <div className="navbar-item">
                <AuthCluster />
              </div>
            <span className="navbar-item">
              <button className="button is-light">
                <span className="icon">
                  <FontAwesomeIcon icon={faGithub} size="1x" />
                </span>
                <span>Fork</span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;